// Aqlli qidiruv: foydalanuvchi vaziyatni bir necha gap bilan yozadi,
// AI tegishli qonun hujjatlari va moddalarni topadi (Google Search orqali, lex.uz manbalariga tayanib).
import {
  guardJsonPost, jsonError, jsonResponse, geminiConfig, callGemini,
  providerError, extractCandidate, dedupeSources, lexLinkFor,
} from "../shared/common.mjs";

export const config = {
  path: "/api/search",
  rateLimit: { windowLimit: 8, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

const MAX_QUERY = 2000;
const MAX_RESULTS = 8;

const PROMPT = `Siz O'zbekiston Respublikasi qonunchiligi bo'yicha huquqiy qidiruv yordamchisiz.
Foydalanuvchi o'z vaziyatini oddiy tilda bir necha gap bilan yozadi. Vazifangiz — shu vaziyatga
bevosita taalluqli AMALDAGI qonun hujjatlari va ularning aniq moddalarini topish.

Qoidalar:
- Google qidiruvidan foydalaning va imkon qadar lex.uz (rasmiy milliy qonunchilik bazasi) manbalariga tayaning.
- Faqat amalda bo'lgan hujjatlarni ko'rsating. Mehnat munosabatlari uchun 2022-yil 28-oktyabrdagi (2023-yil 30-apreldan amalda) Mehnat kodeksidan foydalaning.
- Modda raqamini faqat ishonchingiz komil bo'lsa yozing. Ishonch past bo'lsa "ishonch": "past" deb belgilang.
- Modda nomini rasmiy nomiga yaqin qilib o'zbek (lotin) tilida yozing.
- Har bir natija uchun nima sababdan aynan shu modda tegishli ekanini 1–2 gapda tushuntiring.
- Eng muhimlari birinchi bo'lsin, ko'pi bilan ${MAX_RESULTS} ta natija.
- Vaziyatni to'g'ri baholash uchun muhim ma'lumot yetishmasa, "aniqlashtirish" maydoniga bitta savol yozing.

Javobni FAQAT quyidagi JSON ko'rinishida qaytaring, boshqa matnsiz:
{
  "xulosa": "vaziyatning qisqa huquqiy tavsifi (2–3 gap)",
  "natijalar": [
    {"hujjat": "hujjatning to'liq nomi", "modda": "162", "modda_nomi": "...", "nima_uchun": "...", "ishonch": "yuqori|o'rta|past"}
  ],
  "aniqlashtirish": "savol yoki null"
}`;

function parseJson(text) {
  const cleaned = String(text || "").replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
}

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function normalizeResult(raw, sources) {
  const lexSources = sources.filter((s) => /lex\.uz/i.test(s.title + " " + s.uri));
  const results = (Array.isArray(raw?.natijalar) ? raw.natijalar : [])
    .slice(0, MAX_RESULTS)
    .map((r) => {
      const hujjat = clip(r?.hujjat, 200);
      const modda = clip(String(r?.modda ?? ""), 20).replace(/[^0-9\-–]/g, "").replace("–", "-");
      const ishonch = ["yuqori", "o'rta", "past"].includes(r?.ishonch) ? r.ishonch : "past";
      const link = lexLinkFor(hujjat);
      return {
        hujjat,
        modda: modda || null,
        moddaNomi: clip(r?.modda_nomi, 300),
        nimaUchun: clip(r?.nima_uchun, 600),
        ishonch,
        url: link.url,
        hujjatTasdiqlangan: link.verifiedDoc,
      };
    })
    .filter((r) => r.hujjat);
  const aniq = clip(raw?.aniqlashtirish, 400);
  return {
    xulosa: clip(raw?.xulosa, 1200),
    natijalar: results,
    aniqlashtirish: aniq && aniq.toLowerCase() !== "null" ? aniq : null,
    manbalar: sources.slice(0, 10),
    lexManbaBor: lexSources.length > 0,
  };
}

export default async (req, context) => {
  const { body, error } = await guardJsonPost(req, context, { scope: "search", perMinute: 8, perHour: 60 });
  if (error) return error;

  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (query.length < 10) return jsonError("Vaziyatni kamida bitta to'liq gap bilan yozing.", 400);
  if (query.length > MAX_QUERY) return jsonError(`Matn juda uzun (maksimal ${MAX_QUERY} belgi).`, 400);

  const { apiKey, model } = geminiConfig();
  if (!apiKey) return jsonError("AI qidiruv sozlanmagan. Serverda GEMINI_API_KEY kiritilishi kerak.", 503);

  const request = (withSearch) => callGemini({
    apiKey, model,
    body: {
      system_instruction: { parts: [{ text: PROMPT }] },
      contents: [{ role: "user", parts: [{ text: `Vaziyat:\n${query}` }] }],
      ...(withSearch ? { tools: [{ google_search: {} }] } : {}),
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
    },
  });

  try {
    let grounded = true;
    let upstream = await request(true);
    // Agar model yoki tarif Google Search vositasini qo'llamasa, vositasiz qayta urinamiz.
    if (upstream.status === 400) {
      grounded = false;
      upstream = await request(false);
    }
    if (!upstream.ok) return providerError(upstream.status);

    const { text, sources } = extractCandidate(await upstream.json());
    const parsed = parseJson(text);
    if (!parsed) return jsonError("AI javobini o'qib bo'lmadi. Vaziyatni boshqacha so'zlar bilan yozib ko'ring.", 502);

    const result = normalizeResult(parsed, dedupeSources(sources));
    return jsonResponse({ ...result, googleQidiruv: grounded });
  } catch (e) {
    console.error("Search backend error:", e?.message || "unknown");
    return jsonError("Server bilan bog'lanishda xatolik yuz berdi.", 502);
  }
};
