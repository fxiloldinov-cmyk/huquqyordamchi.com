import { providerError } from "../shared/common.mjs";

// Netlify serverless function (v2, ESM): /api/chat
// API kaliti faqat server muhitida saqlanishi kerak: GEMINI_API_KEY.
// Modelni Netlify Environment Variables orqali GEMINI_MODEL bilan o'zgartirish mumkin.
// Qo'shimcha: ALLOWED_ORIGINS — vergul bilan ajratilgan ruxsat etilgan domenlar
// (masalan: https://uzbekistan-law-library.netlify.app). Bo'sh bo'lsa, faqat saytning o'z domeni.

export const config = {
  path: "/api/chat",
  // Netlify platformasi darajasidagi limit: bitta IP uchun 1 daqiqada 10 ta so'rov.
  rateLimit: {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8000;
const MAX_TOTAL_CHARS = 30000;

// Zaxira limit (bitta funksiya nusxasi ichida): IP bo'yicha 1 daqiqada 10 ta, 1 soatda 60 ta.
const hits = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 3600_000);
  const lastMinute = list.filter((t) => now - t < 60_000).length;
  if (lastMinute >= 10 || list.length >= 60) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.length || now - times[times.length - 1] > 3600_000) hits.delete(key);
    }
  }
  return false;
}

function isAllowedOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return false; // brauzer POST so'rovida Origin doim yuboriladi
  let originHost;
  try { originHost = new URL(origin).host; } catch { return false; }
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (allowed.length) return allowed.includes(origin);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || new URL(req.url).host;
  return originHost === host;
}

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: JSON_HEADERS,
  });
}

const SYSTEM_PROMPTS = {
  citizen: `Siz O'zbekiston Respublikasi qonunchiligi bo'yicha ehtiyotkor huquqiy axborot yordamchisisiz.
Foydalanuvchiga o'zbek tilida sodda, xolis va amaliy javob bering.
Muhim qoidalar:
- Tekshirilmagan modda raqami, qonun nomi, muddat, jarima yoki telefon raqamini o'ylab topmang.
- Sizga qonun matni yoki ishonchli manba berilmagan bo'lsa, aniq norma amalda ekanini tasdiqlamang; Lex.uz orqali tekshirish kerakligini ayting.
- Iloji bo'lsa hujjat nomi, modda va rasmiy manba havolasini ko'rsating. Haqiqiy URLni bilmasangiz, URLni uydirmang; https://lex.uz ni ko'rsating.
- Holatga bog'liq muhim tafsilotlar yetishmasa, aniqlashtiruvchi savol bering.
- Javobni umumiy huquqiy axborot sifatida taqdim eting; murakkab yoki yuqori xavfli vaziyatda malakali yuristga murojaat qilishni tavsiya qiling.
- Shaxsiy ma'lumotlarni keraksiz ravishda so'ramang.`,
  student: `Siz O'zbekiston Respublikasi qonunchiligi bo'yicha huquqshunos talabalar uchun o'quv yordamchisiz.
Normaning tuzilishi, huquqiy tushunchalar va kazus tahlilini izchil tushuntiring.
Tekshirilmagan modda, sud amaliyoti yoki manbani uydirmang. Amaldagi qonun matni uchun https://lex.uz orqali tekshirish zarurligini ayting.
O'quv tahlili bilan rasmiy yuridik xulosani farqlang.`,
};

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!isAllowedOrigin(req)) {
    return jsonError("Ruxsat etilmagan manba.", 403);
  }

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (isRateLimited(ip)) {
    return jsonError("Juda ko'p so'rov yuborildi. Bir daqiqadan keyin qayta urinib ko'ring.", 429);
  }

  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return jsonError("So'rov JSON formatida bo'lishi kerak.", 415);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("So'rov JSON formatida bo'lishi kerak.", 400);
  }

  const { messages, mode } = body ?? {};
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return jsonError(`messages 1–${MAX_MESSAGES} ta xabar ro'yxati bo'lishi kerak.`, 400);
  }

  const normalized = [];
  let totalChars = 0;
  for (const item of messages) {
    if (!item || !["user", "assistant"].includes(item.role) ||
        typeof item.content !== "string" || !item.content.trim() ||
        item.content.length > MAX_MESSAGE_CHARS) {
      return jsonError(`Xabar formati noto'g'ri yoki xabar juda uzun (maksimal ${MAX_MESSAGE_CHARS} belgi).`, 400);
    }
    totalChars += item.content.length;
    if (totalChars > MAX_TOTAL_CHARS) {
      return jsonError("Suhbat juda uzun. Yangi suhbat boshlang.", 400);
    }
    normalized.push({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content.trim() }],
    });
  }

  // Gemini suhbatida birinchi xabar user bo'lishi va rollar almashib borishi kerak.
  while (normalized.length && normalized[0].role !== "user") normalized.shift();
  if (!normalized.length) return jsonError("Suhbat foydalanuvchi xabaridan boshlanishi kerak.", 400);
  for (let i = normalized.length - 1; i > 0; i--) {
    if (normalized[i].role === normalized[i - 1].role) {
      return jsonError("Xabarlar user va assistant rollari bilan navbatma-navbat kelishi kerak.", 400);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return jsonError("AI xizmati sozlanmagan. Serverda GEMINI_API_KEY muhit o'zgaruvchisini kiriting.", 503);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const systemPrompt = mode === "student" ? SYSTEM_PROMPTS.student : SYSTEM_PROMPTS.citizen;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      // Kalit URL ichida emas, headerda yuboriladi (loglarga tushmasligi uchun).
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: normalized,
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
      }),
    });

    if (!upstream.ok) return await providerError(upstream);
    if (!upstream.body) return jsonError("AI xizmatidan javob oqimi kelmadi.", 502);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    (async () => {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.candidates?.[0]?.content?.parts
                ?.map((part) => part.text || "")
                .join("");
              if (chunk) await writer.write(encoder.encode(chunk));
            } catch {
              // SSE ichidagi bo'linib kelgan yoki JSON bo'lmagan qatorni e'tiborsiz qoldiramiz.
            }
          }
        }
      } catch (error) {
        console.error("Gemini stream error:", error?.message || "unknown");
        try { await writer.write(encoder.encode("\n\n⚠️ Javob uzilib qoldi. Iltimos, qayta so'rang.")); } catch {}
      } finally {
        try { await writer.close(); } catch {}
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat backend error:", error?.message || "unknown");
    return jsonError("Server bilan bog'lanishda xatolik yuz berdi.", 502);
  }
};
