# Huquq Kutubxonasi — O'zbekiston qonunlari va AI yordamchi (v5)

[uzbekistan-law-library.netlify.app](https://uzbekistan-law-library.netlify.app) saytining manba kodlari.

> Sayt umumiy huquqiy ma'lumot beradi va advokat maslahati o'rnini bosmaydi. Matnlardagi modda, muddat va raqamlar yurist tomonidan to'liq tekshirilmagan — `TECHNICAL_REVIEW_UZ.md` ga qarang.

---

## 📁 Loyiha tarkibi

```
public/                    ← faqat shu papka internetga joylanadi
  index.html               sahifa tuzilmasi
  styles.css               dizayn
  app.js                   vaziyatlar, kodekslar, hujjat namunalari, AI chat
  features.js              aqlli qidiruv va kazus ustaxonasi
netlify/functions/
  chat.mjs                 /api/chat   — AI konsultant
  search.mjs               /api/search — aqlli qidiruv (gap bo'yicha qonun va moddalar)
  kazus.mjs                /api/kazus  — kazus ustaxonasi
netlify/shared/
  common.mjs               umumiy kod: Origin, rate limit, Gemini, lex.uz havolalari
  kazus-namunalar.mjs      ← o'qituvchilar tasdiqlagan namunaviy yechimlar shu yerga qo'shiladi
telegram_bot/              ← Telegram bot (alohida ishga tushiriladi, deploy qilinmaydi)
netlify.toml               ← publish = "public"
package.json               ← "type": "module"
server.ps1                 ← faqat statik ko'rinish uchun lokal server (Windows)
.env.example               ← muhit o'zgaruvchilari namunasi (haqiqiy kalitsiz)
```

---

## 🚀 Ishga tushirish

### 1. Faqat statik ko'rinish
`public/index.html` ni brauzerda oching yoki Windows'da `server.ps1` ni ishga tushiring. AI chat bu rejimda ishlamaydi.

### 2. AI chat bilan lokal sinov
```bash
npm install -g netlify-cli
netlify dev
```
`.env` faylida `GEMINI_API_KEY` bo'lishi kerak (`.env.example` dan nusxa oling).

### 3. Netlify'ga deploy
1. Papkani GitHub repozitoriyga yuklang (`.env` fayllar `.gitignore` orqali chiqarib tashlangan).
2. Netlify'ga ulang — sozlamalar `netlify.toml` dan olinadi.
3. Netlify → Site configuration → Environment variables:
   - `GEMINI_API_KEY` — Google AI Studio kaliti (majburiy)
   - `GEMINI_MODEL` — ixtiyoriy, standart `gemini-2.5-flash`
   - `ALLOWED_ORIGINS` — ixtiyoriy, masalan `https://uzbekistan-law-library.netlify.app` (bo'sh bo'lsa, faqat saytning o'z domeni)

### 4. Google tomonda qo'shimcha himoya (tavsiya)
Google AI Studio / Cloud Console'da API kalitiga oylik byudjet va kvota limitini qo'ying.


## 🔎 Aqlli qidiruv
Foydalanuvchi vaziyatni bir necha gap bilan yozadi. Natija ikki qismdan iborat:
1. **Sayt bazasidagi tekshirilgan moddalar** — `public/features.js` dagi `ARTICLE_INDEX` (lex.uz mundarijasi bo'yicha tekshirilgan). AI ishlamasa ham chiqadi.
2. **AI tahlili** — Gemini Google qidiruvi (grounding) orqali lex.uz manbalariga tayanib hujjat va moddalarni topadi. Sayt bazasidagi modda bilan mos kelsa "tasdiqlangan" belgisi, aks holda ishonch darajasi ko'rsatiladi.

`ARTICLE_INDEX` ga yangi modda qo'shish: `["mk", "163", "Modda nomi", "kalit so'zlar"]`.

## 🎓 Kazus ustaxonasi
Talaba kazus shartini kiritadi va javob shaklini tanlaydi:
- **O'qituvchi namunasi** — `netlify/shared/kazus-namunalar.mjs` dagi tasdiqlangan yechimlar. Talaba faqat nomini ko'radi, to'liq matn serverda qoladi.
- **O'z shaklim** — talaba o'zi xohlagan tuzilmani yoki namunaviy javobni qo'yadi.
- **Standart tuzilma** — fabula → masala → normalar → tahlil → xulosa.

Namuna qo'shish uchun `kazus-namunalar.mjs` faylidagi izohli misolga qarang va qayta deploy qiling.

## 💰 Xarajat haqida
Aqlli qidiruv va kazus Google Search grounding'dan foydalanadi. Google'ning bepul limiti tugagach bu so'rovlar alohida haq olinadi — Google AI Studio'da byudjet limitini albatta qo'ying.
