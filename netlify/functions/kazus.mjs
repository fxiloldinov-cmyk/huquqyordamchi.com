// Kazus ustaxonasi: talaba kazus yuboradi, AI uni o'qituvchi tasdiqlagan namuna shaklida,
// talabaning o'z shaklida yoki standart tuzilmada yechadi.
//   GET  /api/kazus  -> namunalar ro'yxati (faqat nomlari)
//   POST /api/kazus  -> yechim (matn oqimi)
import {
  guardJsonPost, jsonError, jsonResponse, geminiConfig, callGemini,
  providerError, pipeGeminiStream, isAllowedOrigin,
} from "../shared/common.mjs";
import { KAZUS_NAMUNALAR, STANDART_FORMAT, FANLAR } from "../shared/kazus-namunalar.mjs";

export const config = {
  path: "/api/kazus",
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

const MAX_KAZUS = 6000;
const MAX_FORMAT = 6000;

const SYSTEM = `Siz O'zbekiston Respublikasi huquqi bo'yicha universitet o'qituvchisi darajasidagi o'quv yordamchisiz.
Talaba yuborgan kazusni (huquqiy masalani) yechasiz.

Qat'iy qoidalar:
- Javobni o'zbek tilida (lotin yozuvida), akademik uslubda yozing.
- Berilgan JAVOB SHAKLIGA aniq amal qiling: bo'limlar tartibi, sarlavhalar, raqamlash, uslub va chuqurlik namunadagidek bo'lsin.
- Faqat amaldagi qonun hujjatlariga tayaning. Mehnat munosabatlari uchun 2022-yil 28-oktyabrdagi (2023-yil 30-apreldan amalda) Mehnat kodeksini, Konstitutsiya uchun 2023-yilgi tahririni qo'llang.
- Google qidiruvidan foydalaning va normalarni imkon qadar lex.uz bo'yicha tekshiring.
- Modda raqami, qism yoki band aniq ekaniga ishonchingiz komil bo'lmasa, uni uydirmang: "[lex.uz da tekshirilsin]" deb belgilang.
- Sud amaliyoti va Plenum qarorlarini faqat aniq ma'lum bo'lsa keltiring, aks holda umuman keltirmang.
- Kazus shartida bo'lmagan faktlarni o'ylab topmang; kerak bo'lsa "agar ... bo'lsa" deb muqobil variantlarni ko'rib chiqing.
- Namunadagi kazusning mazmunini ko'chirmang — faqat uning shakli va uslubidan foydalaning.
- Namunadagi raqamlar (masalan, bazaviy hisoblash miqdori, eng kam ish haqi) eskirgan bo'lishi mumkin: amaldagi qiymatni qo'llang yoki "[amaldagi miqdorni tekshiring]" deb belgilang.
- Topshiriqda nazariy savollar bo'lsa, ularga ham namunadagi kabi alohida javob bering.
- Iqtiboslar uchun [1], [2] ko'rinishidagi izohlardan foydalanish mumkin; izohlar va "Foydalanilgan adabiyotlar" ro'yxatini javob oxirida bering.
- Adabiyotlar ro'yxatiga faqat haqiqatan mavjud ekaniga ishonchingiz komil bo'lgan manbalarni yozing. Darslik yoki sharh muallifi, yili, nashriyotini aniq bilmasangiz, ularni yozmang — faqat normativ-huquqiy hujjatlarni keltiring.`;

function sanitize(s, n) {
  return typeof s === "string" ? s.replace(/\r\n/g, "\n").trim().slice(0, n) : "";
}

function listResponse() {
  return jsonResponse({
    namunalar: KAZUS_NAMUNALAR.map((n) => ({
      id: n.id, title: n.title, fan: n.fan, fanNomi: FANLAR[n.fan] || n.fan, muallif: n.muallif || null,
    })),
    fanlar: FANLAR,
  });
}

export default async (req, context) => {
  if (req.method === "GET") {
    if (req.headers.get("origin") && !isAllowedOrigin(req)) return jsonError("Ruxsat etilmagan manba.", 403);
    return listResponse();
  }

  const { body, error } = await guardJsonPost(req, context, { scope: "kazus", perMinute: 5, perHour: 30 });
  if (error) return error;

  const kazus = sanitize(body?.kazus, MAX_KAZUS + 1);
  if (kazus.length < 40) return jsonError("Kazus shartini to'liq yozing (kamida 40 belgi).", 400);
  if (kazus.length > MAX_KAZUS) return jsonError(`Kazus juda uzun (maksimal ${MAX_KAZUS} belgi).`, 400);

  const fan = FANLAR[body?.fan] ? body.fan : "boshqa";
  const mode = ["namuna", "ozim", "standart"].includes(body?.mode) ? body.mode : "standart";

  let formatBlock;
  let fewShot = [];
  if (mode === "ozim") {
    const format = sanitize(body?.format, MAX_FORMAT + 1);
    if (format.length < 20) return jsonError("O'zingiz xohlagan javob shaklini (namunasini) kiriting.", 400);
    if (format.length > MAX_FORMAT) return jsonError(`Javob shakli juda uzun (maksimal ${MAX_FORMAT} belgi).`, 400);
    formatBlock = `JAVOB SHAKLI (talaba bergan namuna — tuzilishi va uslubiga aynan amal qiling):\n"""\n${format}\n"""`;
  } else if (mode === "namuna") {
    const sample = KAZUS_NAMUNALAR.find((n) => n.id === body?.namunaId)
      || KAZUS_NAMUNALAR.find((n) => n.fan === fan);
    if (!sample) return jsonError("Tanlangan namuna topilmadi. Standart tuzilmani tanlang.", 400);
    formatBlock = "JAVOB SHAKLI: quyidagi o'qituvchi tasdiqlagan namunaviy yechimning tuzilishi, bo'limlari, uslubi va chuqurligiga aynan amal qiling.";
    fewShot = [
      { role: "user", parts: [{ text: `Namunaviy kazus:\n${sample.kazus}` }] },
      { role: "model", parts: [{ text: sample.javob }] },
    ];
  } else {
    formatBlock = `JAVOB SHAKLI (standart tuzilma):\n${STANDART_FORMAT}`;
  }

  const { apiKey, model } = geminiConfig();
  if (!apiKey) return jsonError("AI xizmati sozlanmagan. Serverda GEMINI_API_KEY kiritilishi kerak.", 503);

  const contents = [
    ...fewShot,
    { role: "user", parts: [{ text: `Fan: ${FANLAR[fan]}\n\n${formatBlock}\n\nYechilishi kerak bo'lgan kazus:\n"""\n${kazus}\n"""` }] },
  ];

  const request = (withSearch) => callGemini({
    apiKey, model, stream: true,
    body: {
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents,
      ...(withSearch ? { tools: [{ google_search: {} }] } : {}),
      generationConfig: { temperature: 0.2, maxOutputTokens: 12000 },
    },
  });

  try {
    let upstream = await request(true);
    if (upstream.status === 400) upstream = await request(false);
    if (!upstream.ok) return await providerError(upstream);
    if (!upstream.body) return jsonError("AI xizmatidan javob oqimi kelmadi.", 502);

    return pipeGeminiStream(upstream, {
      onEnd: (sources) => {
        const lines = sources.slice(0, 8).map((s) => `- [${s.title.replace(/[\[\]]/g, "")}](${s.uri})`);
        const src = lines.length ? `\n\n**Tekshirilgan manbalar:**\n${lines.join("\n")}` : "";
        return `${src}\n\n*O'quv maqsadidagi AI yechim. Moddalarni lex.uz da tekshiring va o'qituvchingiz talablariga moslang.*`;
      },
    });
  } catch (e) {
    console.error("Kazus backend error:", e?.message || "unknown");
    return jsonError("Server bilan bog'lanishda xatolik yuz berdi.", 502);
  }
};
