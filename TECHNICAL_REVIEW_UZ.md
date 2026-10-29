# Uzbekistan Law Library — birinchi texnik ko'rik

## Arxiv tarkibi
- `public/index.html`, `public/styles.css`, `public/app.js`: statik frontend (v5 dan boshlab `public/` ichida).
- `netlify/functions/chat.mjs`: Netlify AI backend (v5 da `.js` → `.mjs`, ildizdagi eski `chat.js` nusxasi olib tashlandi).
- `telegram_bot/`: Telegram bot.

## Ushbu ko'rikda qilingan o'zgarishlar
1. Backenddagi eskirgan `gemini-1.5-flash` nomi sozlanadigan `GEMINI_MODEL` bilan almashtirildi; standart qiymat `gemini-2.5-flash`.
2. API kaliti faqat server muhitidan olinadi; kalit yo'q bo'lsa, soxta AI javobi qaytarilmaydi.
3. So'rov JSON, xabarlar soni, rol va uzunlik tekshiruvlari qo'shildi.
4. Provider xatosining ichki matni foydalanuvchiga oshkor qilinmaydi.
5. Huquqiy prompt tekshirilmagan modda va havolalarni uydirmaslikni alohida belgilaydi.
6. `.env.example` yaratildi; haqiqiy maxfiy kalitlar bu faylga kiritilmagan.

## Hali bajarilishi kerak
- `app.js` ichidagi lokal API kaliti bilan to'g'ridan-to'g'ri Gemini chaqirish imkoniyatini production versiyada o'chirish yoki faqat developer rejimida qoldirish.
- Telegram botdagi `gemini-1.5-flash` va `google-generativeai` SDK qismini amaldagi `google-genai` SDKga ko'chirish va alohida sinash.
- Hayotiy vaziyatlar katalogidagi huquqiy da'volarni amaldagi rasmiy qonun matni bilan modda-modda tekshirish.
- Lex.uz hujjatlarini olish/yangilash usulini rasmiy foydalanish shartlariga mos tanlash; avtomatik qirib olishni ruxsat va texnik imkoniyat tekshirilmasdan yoqmaslik.
- RAG qidiruv, manba ko'rsatish, qonun tahrirlari tarixi va kuchga kirish sanalarini qo'shish.
- Login, maxfiylik siyosati, rate limiting, loglarni tozalash va zaxira nusxalashni ishlab chiqish.
- Hujjat generatori uchun andozalarni yurist bilan tekshirish.
- Unit/integration testlar va deploydan oldingi xavfsizlik tekshiruvini o'tkazish.

## Deploy uchun kerak
Netlify Environment Variables:
- `GEMINI_API_KEY`: Google AI Studio API kaliti.
- `GEMINI_MODEL`: provayderda mavjud model identifikatori.

API kalitini frontend, `.env.example`, README yoki ochiq repozitoriyga joylashtirmang.

## Muhim cheklov
Bu paket — birinchi texnik tuzatish va ko'rik, to'liq tayyor yoki huquqiy jihatdan tasdiqlangan mahsulot emas. Qonun moddalarini va tayyor huquqiy javoblarni amaldagi rasmiy manbalar bilan tekshirish alohida bosqich bo'lib qoladi.

## Ikkinchi tuzatish (frontend va Telegram)
- Frontenddan Gemini API'ga bevosita murojaat qilish yo'li olib tashlandi.
- `localStorage` ichida foydalanuvchi API kalitini saqlash va sozlash oynasidagi kalit kiritish olib tashlandi.
- Frontenddagi AI chat faqat `/api/chat` backend endpointidan foydalanadi.
- AI sozlamalari oynasi administratorning server muhitini sozlashi kerakligini tushuntiradi.
- Telegram botning eski `google-generativeai` SDK chaqiruvi `google-genai` SDK uslubiga ko'chirildi; model `GEMINI_MODEL` orqali sozlanadi.
- API kaliti yo'q bo'lsa bot taxminiy huquqiy maslahat qaytarmaydi.

## Sinov holati
- JavaScript sintaksis tekshiruvi va Python bytecode compile tekshiruvi bajarilishi kerak.
- Haqiqiy Gemini API, Netlify deploy, Telegram polling, huquqiy manbalar va foydalanuvchi oqimi uchun jonli integratsion testlar hali talab qilinadi.

## Uchinchi bosqich (rasmiy qonun qidiruvi)
- Kodekslar bo'limiga Lex.uz rasmiy qidiruviga olib boradigan qidiruv shakli qo'shildi.
- Qidiruv foydalanuvchi kiritgan so'rovni URL-encode qilib, faqat `https://lex.uz` domenidagi qidiruvga yuboradi.
- Bu integratsiya Lex.uz API yoki jonli qonun bazasini saytda indekslash emas; foydalanuvchi rasmiy saytga o'tadi.
- Mobil ekranda qidiruv maydoni va tugma vertikal joylashadi.


## V4 — sayt ichidagi qidiruv prototipi
- Kodekslar bo‘limidagi tashqi qidiruv ichki katalog qidiruvi bilan almashtirildi.
- Qidiruv mavjud kodekslar katalogi va hayotiy vaziyatlar ro‘yxatida ishlaydi; natija bosilganda tegishli bo‘limga o‘tadi.
- To‘liq rasmiy qonunchilik bazasi hali ulanmaganligi interfeysda ochiq ko‘rsatilgan. Bu versiya Lex.uz’dagi barcha hujjatlarni qamrab olmaydi.
- Keyingi bosqich: ruxsat etilgan rasmiy ma’lumot manbasini aniqlash, hujjatlar bazasini tuzish, amaldagi tahrir va kuchga kirish sanasini saqlash, so‘ng AI javoblarini manbalarga bog‘lash.


## V5 — texnik ko'rikdagi kamchiliklarni tuzatish (2026-10-29)

### Xavfsizlik va deploy
- `netlify.toml`: `publish = "."` → `publish = "public"`. Endi `telegram_bot/` (va undagi `.env`), `server.ps1`, hujjatlar internetga chiqmaydi.
- `.gitignore` qo'shildi (`.env`, `__pycache__`, `.netlify`). Arxivdan `__pycache__` va ortiqcha `chat.js` olib tashlandi.
- `package.json` (`"type": "module"`) qo'shildi, funksiya `chat.mjs` deb nomlandi.
- Xavfsizlik headerlari qo'shildi (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- `server.ps1`: qattiq yozilgan yo'l o'rniga `$PSScriptRoot\public`; `..\` orqali papkadan chiqish taqiqlandi.

### Backend (`/api/chat`)
- Netlify platformasi darajasida rate limit (`config.rateLimit`: IP bo'yicha 10 so'rov/daqiqa) va zaxira ichki limit (10/daqiqa, 60/soat).
- Origin tekshiruvi: faqat saytning o'z domeni yoki `ALLOWED_ORIGINS` dagi domenlar.
- `Content-Type: application/json` majburiy; suhbatning umumiy hajmi 30 000 belgi bilan cheklandi.
- API kaliti URL o'rniga `x-goog-api-key` headerida yuboriladi (loglarga tushmaydi).
- Oqim uzilib qolsa, foydalanuvchiga "Javob uzilib qoldi" xabari qo'shiladi.

### Frontend
- 10 ta savoldan keyin chat to'xtab qolishi tuzatildi: serverga faqat oxirgi 20 ta xabar yuboriladi.
- Qidiruvdagi vaziyat natijasi bosilganda endi o'sha vaziyat sahifasi ochiladi.
- Qidiruv va filtrda apostroflar (' ‘ ’ ʻ ʼ `) bir xil hisoblanadi.
- Chat Markdown'i `[matn](https://...)` havolalarini ko'rsatadi; xato xabarlarida ikki marta ekranlash tuzatildi.
- "Chop etish / PDF" endi faqat hujjat matnini chop etadi.
- Kodekslar uchun lex.uz qidiruvi o'rniga to'g'ridan-to'g'ri hujjat havolalari (ID'lar lex.uz da tekshirildi).
- Eski "⚙️ API" tugmasi olib tashlandi; kiritish maydonlariga 4000 belgi limiti qo'yildi.
- Chalg'ituvchi iboralar ("2026 Yangi tahrir", "rasmiy andoza", "aniq qonun moddalari bilan javob beramiz") yumshatildi.
- Har bir vaziyat sahifasida "yurist tomonidan tasdiqlanmagan, lex.uz da tekshiring" ogohlantirishi.
- Hujjat namunalarida "so'm" so'zi ikki marta chiqishi tuzatildi.

### Telegram bot
- AI javoblari Telegram HTML formatiga xavfsiz o'giriladi; formatlash xatosida oddiy matn bilan qayta yuboriladi.
- 4096 belgidan uzun javoblar bir nechta xabarga bo'linadi.
- Gemini chaqiruvi asinxron (`client.aio`) — bitta foydalanuvchi boshqalarni kutdirmaydi; klient bir marta yaratiladi.
- Umumiy xato ishlovchisi (`error_handler`) qo'shildi; `httpx` loglarida bot tokeni chiqmaydi.
- `/start` dagi `**` (legacy Markdown'da buziladigan) belgilar tuzatildi; "rasmiy bot" iborasi olib tashlandi.
- Kodekslar havolalari to'g'ridan-to'g'ri lex.uz hujjatlariga.

### Tekshirilgan va tuzatilgan modda raqamlari (lex.uz, Mehnat kodeksi 28.10.2022, Oila kodeksi)
- Ish beruvchi tashabbusi bilan bekor qilish — MK 162-modda (oldin 161/171/400 deb yozilgan edi).
- Xodim tashabbusi bilan bekor qilish — MK 161-modda (ariza namunasida 160 deb yozilgan edi).
- Ish haqini kechiktirganlik uchun javobgarlik — MK 334-modda (oldin 333 deb yozilgan edi).
- Ish haqini to'lash muddatlari — MK 253-modda (to'g'ri edi).
- Hisob-kitob — MK 172-modda; qonunga xilof bekor qilish oqibatlari — MK 174-modda.
- Aliment: ta'minot majburiyati — Oila kodeksi 96-modda, miqdori — 99-modda (sayt va bot bir xil qilindi).

### Hali ham yurist tekshiruvi kerak (kod bilan hal qilib bo'lmaydi)
- Muddatlar: ishga tiklash uchun 1 oy, meros uchun 6 oy, YHXBB shikoyati uchun 10 kun, 50% chegirma uchun 15 kun.
- MJtK 17-1, 314, 315, 332-moddalar; Iste'molchilar huquqlari qonuni 13, 14, 18-moddalar; FK meros (1112–1157) va ijara (600–614) moddalari.
- Telefon raqamlari: 1142, 1159, 1008, 102/1102.
- Aliment eng kam miqdori (26.5%), ta'lim krediti shartlari, pasport muddatlari va boshqa raqamlar.
- Hujjat namunalarining matni.
Bularning hammasi sayt va botda "tekshiring" ogohlantirishi bilan ko'rsatiladi.

### Sinov holati (v5)
- `node --check` (frontend, backend) va `py_compile` (bot) — o'tdi.
- Playwright: backend funksiyasi soxta Gemini javobi bilan ishga tushirildi — 12 ta ketma-ket savol, qidiruv natijasi, apostrof, havola ko'rsatish, Origin rad etish, rate limit — o'tdi.
- Haqiqiy Gemini API, Netlify deploy (`config.rateLimit` platformada ishlashi) va Telegram polling jonli sinovi hali o'tkazilmagan.


## V6 — huquqiy faktlarni manbalar bo'yicha tekshirish (2026-10-29)

Tekshiruv lex.uz (rasmiy matn va mundarija), gov.uz/advice.uz (davlat portali) va ishonchli OAV (kun.uz, norma.uz) orqali bajarildi. Bu yurist xulosasi emas.

| Da'vo | Natija | Manba | Saytdagi o'zgarish |
|---|---|---|---|
| Ishga tiklash — 1 oy | ✅ Buyruq nusxasi berilgan kundan 1 oy; boshqa nizolar 3 oy; xodim sud xarajatlarini to'lamaydi | advice.uz/oz/document/2250 | Aniqlashtirildi |
| Mehnat inspeksiyasi "1142" | ❌ Rasmiy sahifada +998 71 200-06-00 | gov.uz/oz/bv/activity_page/inspectorate | Almashtirildi |
| Aliment 1/4, 1/3, 1/2 — OK 99-modda | ✅ 99-modda "aliment miqdori" | lex.uz/docs/104720 | — |
| Aliment eng kami 26,5% | ✅ 2026-09-01 dan 360 400 so'm; da'vo davlat bojidan ozod | kun.uz 2026-10-12, buxgalter.uz | Summa qo'shildi |
| YHXBB shikoyati "17-1-modda, 10 kun" | ⚠️ 10 kun to'g'ri (2024-yildan, O'RQ-884), lekin 17-1 — javobgarlik moddasi, shikoyat emas | norma.uz, lex.uz/docs/97664 | Tuzatildi |
| 50% chegirma 15 kun | ✅ MJtK 332-1: 15 kunda 50%, 30 kunda 70%; shikoyat qilinsa qo'llanmaydi | kun.uz 2026-03-10 | 70% va cheklov qo'shildi |
| Meros 6 oy | ✅ Guvohnoma 6 oydan keyin; FK 2-qism 1136 (1-navbat), 1145+ (egallash), 1146 | gov.uz/oz/advice/58/document/1064, lex.uz/docs/180552 | Moddalar aniqlashtirildi |
| FK ijara 600–614 | ⚠️ Aslida 35-bob, 600–616 | lex.uz/docs/180552 | Tuzatildi |
| Iste'molchi 13, 14, 18-moddalar; 10 kun | ✅ 13 — nuqsonli tovar, 14 — almashtirish (7/20 kun), 18 — maqbul sifatli tovar 10 kun | lex.uz/acts/-4704 | Matn aniqlashtirildi |
| Pretenziyada "14-modda — pulni 7 kunda qaytarish" | ❌ 14-modda almashtirish haqida | lex.uz/acts/-4704 | Tuzatildi |
| "Iste'molchilar davlat boji to'lamaydi" | ❓ Tasdiqlanmadi | — | Olib tashlandi |
| Raqobat qo'mitasi 1159 | ✅ | gov.uz/oz/advice/74/document/2150 | — |
| Adliya 1008 | ✅ | gov.uz/oz/adliya/pages/ishonch-telefoni-reglamenti | — |
| Kiberfiribgarlik "102 yoki 1102" | ⚠️ 102 tasdiqlandi, 1102 topilmadi | spot.uz 2026-10-12 | 1102 olib tashlandi |
| JK 168 firibgarlik, 169 o'g'rilik | ✅ (+278-2 qo'shildi) | lex.uz/docs/111453 | — |
| Ijara ijara.soliq.uz da ro'yxat | ✅ PQ-3741 (25.05.2018) | buxgalter.uz | Asos qo'shildi |
| "Penya asosiy qarzdan oshmaydi" | ❓ Tasdiqlanmadi | — | O'RQ-914 (2024) qoidasi bilan almashtirildi |
| Xotin-qizlar ta'lim krediti "14%" | ⚠️ Stavka MB stavkasiga bog'liq; faqat kunduzgi ta'lim; foizni jamg'arma qoplaydi | oliygoh.uz | Aniqlashtirildi; tasdiqlanmagan portal olib tashlandi |
| Pasport "10 yil" | ⚠️ 25+ yosh — 10 yil, 1–25 — 5 yil, <1 — 2 yil; 10 ish kuni; 1 BHM | advice.uz/oz/document/2563 | Tuzatildi |
| "Propiska cheklovlari bekor" | ❓ Tasdiqlanmadi | — | Olib tashlandi |
| YaTT "15 daqiqa", soliq "4%, 10 kun" | ❓ Tasdiqlanmadi | — | Yumshatildi |
| Kodekslar havolalari | ✅ 11 ta hujjat ID (FK 2-qism qo'shildi) | lex.uz | — |

### Qolgan ochiq masalalar
- Hujjat namunalarining to'liq matnini amaliyotchi yurist ko'rib chiqishi kerak.
- Ma'lumotlar 2026-10-29 holatiga; qonunlar o'zgarganda yangilab turish kerak (masalan, eng kam ish haqi o'zgarsa aliment summasi).
- Netlify deploy, `GEMINI_API_KEY` va Google byudjet limitini sayt egasi o'z akkauntida sozlashi kerak.


## V7 — aqlli qidiruv va kazus ustaxonasi (2026-10-29)
- `/api/search`: vaziyat matni (10–2000 belgi) → Gemini + Google Search grounding → JSON (hujjat, modda, nom, sabab, ishonch). Javob server tomonida tekshiriladi: maydonlar uzunligi cheklanadi, modda raqami tozalanadi, havola faqat lex.uz ga quriladi. Grounding qo'llanmasa (400), vositasiz qayta so'rov.
- Frontend: AI natijalari sayt bazasidagi 42 ta tekshirilgan modda bilan solishtiriladi ("tasdiqlangan" / ishonch belgisi). AI ishlamasa ham lokal natijalar chiqadi.
- `/api/kazus`: GET — namunalar ro'yxati (faqat nomlar); POST — yechim oqimi. Rejimlar: namuna (few-shot, o'qituvchi yechimi), o'z shakli, standart. Oxirida grounding manbalari va o'quv maqsadi haqida eslatma qo'shiladi.
- Limitlar: qidiruv 8/daqiqa, kazus 5/daqiqa va 30/soat (IP bo'yicha), Netlify `rateLimit` + zaxira ichki limit.
- Umumiy kod `netlify/shared/common.mjs` ga ko'chirildi; `node_bundler = "esbuild"`.
- Cheklov: lex.uz moddalar matnini to'g'ridan-to'g'ri o'qish imkoni yo'q (sahifa matni dinamik yuklanadi, avtomatik yuklab olish ruxsati aniqlanmagan), shuning uchun AI natijalari "lex.uz da tekshiring" belgisi bilan beriladi.
- Sinov: soxta Gemini javoblari bilan Playwright — qidiruv (AI + lokal, takrorlanmaslik), kazus (o'z shakli, oqim, manbalar), mobil kenglik — o'tdi. Haqiqiy Gemini bilan jonli sinov deploydan keyin.
- Kutilmoqda: o'qituvchilar tasdiqlagan kazus namunalari (`kazus-namunalar.mjs`).

## V8 — birinchi o'qituvchi namunasi (2026-10-29)
- `kazus-namunalar.mjs` ga "Fuqarolik ON 1" namunasi qo'shildi (kazus + 2 ta nazariy savol, ~14 500 belgilik yechim). Fan "Fuqarolik huquqi" tanlanganda bu namuna avtomatik tanlanadi.
- Prompt to'ldirildi: nazariy savollarga ham javob berish, [1] izohlar va adabiyotlar ro'yxati, mavjudligi aniq bo'lmagan darsliklarni yozmaslik, namunadagi eskirgan raqamlarni (masalan, BHM) amaldagisi bilan almashtirish.
- Namuna sifati bo'yicha eslatma: namunada BHM 300 000 so'm deb yozilgan — bu eskirgan qiymat; AI'ga amaldagi qiymatni ishlatish buyurilgan.
- `maxOutputTokens`: chat 4096, qidiruv 4096, kazus 12000 (Gemini 2.5 "thinking" tokenlari ham shu limitga kiradi).
- Netlify'dagi mavjud `API_KEY` o'zgaruvchisi zaxira sifatida o'qiladi: `GEMINI_API_KEY || API_KEY`.
- AI xato xabarlari aniqroq: HTTP kodi va Google xato turi ko'rsatiladi (masalan, "kod: 400 API_KEY_INVALID"); kalit va ichki matn qaytarilmaydi. To'liq sabab Netlify function loglarida.


## V9 — yangi dizayn va lex.uz yangiliklari (2026-10-29)
- Dizayn qayta ishlandi (lexora.uz kabi tinch, premium uslub): serifli sarlavhalar (Newsreader), Onest asosiy shrift, to'q yashil aksent, kunduzgi va tungi rejim (tizim sozlamasi + almashtirish tugmasi).
- Tuzilma: tepada bitta qidiruv konsoli ("Moddalarni topish" / "AI'dan so'rash"), raqamlar qatori, imkoniyatlar tablari, vaziyatlar ro'yxati, lex.uz yangiliklari, hujjat namunalari, kodekslar, talabalar bandi, FAQ, to'liq footer.
- Uchta alohida qidiruv maydoni bittaga birlashtirildi; tushunarsiz kodeks qisqartmalari va emoji tugmalar olib tashlandi; mobil menyu qo'shildi.
- `/api/news`: lex.uz/rss ni o'qib JSON qaytaradi, Netlify CDN'da 6 soat (+24 soat stale) keshlanadi; xato bo'lsa frontend `data/news.json` (129 ta hujjat, 2026-10-28 holati) ni ko'rsatadi. Faqat lex.uz havolalari qabul qilinadi.
- Sinov: Playwright — kompyuter va telefon kengligi, kunduzgi/tungi rejim, yangiliklar filtri va "Yana ko'rsatish", tablar, aqlli qidiruv va kazus oqimi; gorizontal scroll yo'q, konsol xatolari yo'q.
