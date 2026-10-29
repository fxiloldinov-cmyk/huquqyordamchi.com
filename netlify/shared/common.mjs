// Barcha /api funksiyalari uchun umumiy yordamchilar.
// Bu papka netlify/functions dan tashqarida, shuning uchun Netlify uni alohida funksiya deb hisoblamaydi.

export const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export function jsonError(message, status) {
  return jsonResponse({ error: message }, status);
}

// ---- Origin tekshiruvi -------------------------------------------------------
export function isAllowedOrigin(req) {
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

// ---- Zaxira rate limit (bitta funksiya nusxasi ichida) ------------------------
const buckets = new Map();
export function isRateLimited(key, perMinute = 10, perHour = 60) {
  const now = Date.now();
  const list = (buckets.get(key) || []).filter((t) => now - t < 3600_000);
  const lastMinute = list.filter((t) => now - t < 60_000).length;
  if (lastMinute >= perMinute || list.length >= perHour) {
    buckets.set(key, list);
    return true;
  }
  list.push(now);
  buckets.set(key, list);
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (!times.length || now - times[times.length - 1] > 3600_000) buckets.delete(k);
    }
  }
  return false;
}

export function clientIp(req, context) {
  return context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
}

// Umumiy kirish tekshiruvi: metod, origin, limit, JSON. Xato bo'lsa Response qaytaradi.
export async function guardJsonPost(req, context, { scope, perMinute, perHour }) {
  if (req.method !== "POST") {
    return { error: new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } }) };
  }
  if (!isAllowedOrigin(req)) return { error: jsonError("Ruxsat etilmagan manba.", 403) };
  if (isRateLimited(`${scope}:${clientIp(req, context)}`, perMinute, perHour)) {
    return { error: jsonError("Juda ko'p so'rov yuborildi. Bir daqiqadan keyin qayta urinib ko'ring.", 429) };
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return { error: jsonError("So'rov JSON formatida bo'lishi kerak.", 415) };
  }
  try {
    return { body: await req.json() };
  } catch {
    return { error: jsonError("So'rov JSON formatida bo'lishi kerak.", 400) };
  }
}

// ---- Gemini -----------------------------------------------------------------
export function geminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  return { apiKey, model };
}

export function geminiUrl(model, stream) {
  const method = stream ? "streamGenerateContent?alt=sse" : "generateContent";
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:${method}`;
}

export async function callGemini({ apiKey, model, body, stream = false }) {
  return fetch(geminiUrl(model, stream), {
    method: "POST",
    // Kalit URL ichida emas, headerda yuboriladi (loglarga tushmasligi uchun).
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(body),
  });
}

// Gemini xatosini foydalanuvchiga tushunarli, lekin xavfsiz ko'rinishda qaytaradi.
// Kalit yoki ichki ma'lumot qaytarilmaydi — faqat HTTP kodi va Google'ning xato turi (masalan, API_KEY_INVALID).
export async function providerError(upstream) {
  const status = typeof upstream === "number" ? upstream : upstream.status;
  let reason = "";
  let googleStatus = "";
  if (typeof upstream !== "number") {
    try {
      const data = await upstream.json();
      googleStatus = String(data?.error?.status || "").replace(/[^A-Z_]/g, "").slice(0, 40);
      const details = Array.isArray(data?.error?.details) ? data.error.details : [];
      reason = String(details.map((d) => d?.reason).find(Boolean) || "").replace(/[^A-Z_]/g, "").slice(0, 40);
      console.error("Gemini provider error:", status, googleStatus, reason, String(data?.error?.message || "").slice(0, 300));
    } catch {
      console.error("Gemini provider error:", status);
    }
  } else {
    console.error("Gemini provider error:", status);
  }
  const code = [status, reason || googleStatus].filter(Boolean).join(" ");
  let message;
  if (status === 429) {
    message = "AI so'rovlar limiti vaqtincha tugadi. Birozdan keyin qayta urinib ko'ring.";
  } else if (reason === "API_KEY_INVALID" || (status === 400 && /API_KEY/.test(reason))) {
    message = "AI kaliti noto'g'ri. Netlify'dagi GEMINI_API_KEY qiymatini Google AI Studio'dagi kalit bilan tekshiring.";
  } else if (status === 403 || googleStatus === "PERMISSION_DENIED") {
    message = "AI kalitiga ruxsat yo'q: Google AI Studio'da Gemini API yoqilmagan yoki kalit cheklangan.";
  } else if (status === 404) {
    message = "AI modeli topilmadi. Netlify'dagi GEMINI_MODEL qiymatini tekshiring (masalan, gemini-2.5-flash).";
  } else {
    message = "AI xizmatida vaqtinchalik xatolik. Birozdan keyin qayta urinib ko'ring.";
  }
  return jsonError(`${message} (kod: ${code})`, status === 429 ? 429 : 502);
}

// Javobdan matn va Google Search manbalarini (grounding) ajratib oladi.
export function extractCandidate(parsed) {
  const cand = parsed?.candidates?.[0];
  const text = cand?.content?.parts?.map((p) => p.text || "").join("") || "";
  const sources = (cand?.groundingMetadata?.groundingChunks || [])
    .map((c) => c.web)
    .filter((w) => w && w.uri)
    .map((w) => ({ title: String(w.title || w.uri).slice(0, 200), uri: w.uri }));
  return { text, sources, finishReason: cand?.finishReason };
}

export function dedupeSources(list) {
  const seen = new Set();
  return list.filter((s) => {
    const key = s.title + "|" + s.uri;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// SSE oqimini o'qib, matn bo'laklarini yozadi; oxirida manbalarni qaytaradi.
export function pipeGeminiStream(upstream, { onEnd } = {}) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  (async () => {
    let buffer = "";
    let sources = [];
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
            const { text, sources: s } = extractCandidate(JSON.parse(data));
            if (s.length) sources = sources.concat(s);
            if (text) await writer.write(encoder.encode(text));
          } catch {
            // bo'linib kelgan yoki JSON bo'lmagan qatorni e'tiborsiz qoldiramiz
          }
        }
      }
      if (onEnd) {
        const tail = onEnd(dedupeSources(sources));
        if (tail) await writer.write(encoder.encode(tail));
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
}

// lex.uz dagi asosiy kodekslar (ID'lar lex.uz da tekshirilgan, 2026-10-29).
export const LEX_CODES = [
  { key: "konstitutsiya", name: "O'zbekiston Respublikasi Konstitutsiyasi", id: "6445145", match: ["konstitutsiya"] },
  { key: "mehnat", name: "Mehnat kodeksi", id: "6257288", match: ["mehnat kodeks"] },
  { key: "oila", name: "Oila kodeksi", id: "104720", match: ["oila kodeks"] },
  { key: "fk1", name: "Fuqarolik kodeksi (1-qism)", id: "111181", match: ["fuqarolik kodeksi (1", "fuqarolik kodeksi 1"] },
  { key: "fk2", name: "Fuqarolik kodeksi (2-qism)", id: "180552", match: ["fuqarolik kodeksi (2", "fuqarolik kodeksi 2"] },
  { key: "mjtk", name: "Ma'muriy javobgarlik to'g'risidagi kodeks", id: "97664", match: ["ma'muriy javobgarlik", "mjtk"] },
  { key: "jk", name: "Jinoyat kodeksi", id: "111453", match: ["jinoyat kodeks"] },
  { key: "soliq", name: "Soliq kodeksi", id: "4674902", match: ["soliq kodeks"] },
  { key: "uyjoy", name: "Uy-joy kodeksi", id: "106134", match: ["uy-joy kodeks", "uy joy kodeks"] },
  { key: "fpk", name: "Fuqarolik protsessual kodeksi", id: "3517334", match: ["fuqarolik protsessual"] },
  { key: "ipk", name: "Iqtisodiy protsessual kodeksi", id: "3523891", match: ["iqtisodiy protsessual"] },
  { key: "istemol", name: "Iste'molchilarning huquqlarini himoya qilish to'g'risidagi Qonun", id: "-4704", match: ["iste'molchi"] },
];

export function lexLinkFor(lawName) {
  const n = String(lawName || "").toLowerCase().replace(/[‘’ʻʼ`]/g, "'");
  const hit = LEX_CODES.find((c) => c.match.some((m) => n.includes(m)));
  if (hit) return { url: `https://lex.uz/docs/${hit.id}`, verifiedDoc: true };
  return { url: `https://lex.uz/search/all?searchtitle=${encodeURIComponent(String(lawName || "").slice(0, 120))}`, verifiedDoc: false };
}
