// O'ZBEKISTON HUQUQIY BAZASI VA HAYOTIY VAZIYATLAR
const SITUATIONS = [
  { 
    id: "ish", icon: "briefcase", title: "Ishdan noqonuniy bo'shatish", desc: "Asossiz bo'shatish, hisob-kitob va kompensatsiya olish", tag: "Mehnat kodeksi",
    intro: "Ish beruvchi xodimni faqat Mehnat kodeksida aniq belgilangan asoslar bo'yicha va qat'iy tartibda ishdan bo'shatishga haqli. Noqonuniy bo'shatilgan taqdirda ishga tiklanish va majburiy bekor yurilgan vaqt uchun ish haqi undirish mumkin.",
    steps: [
      ["Buyruq nusxasini oling", "Ishdan bo'shatish haqidagi buyruq va uning asosini yozma ravishda talab qilib oling."],
      ["Yakuniy hisob-kitobni tekshiring", "Oxirgi ish kuni barcha ish haqi, foydalanilmagan mehnat ta'tillari uchun kompensatsiya to'liq berilishi shart."],
      ["Davlat mehnat inspeksiyasiga yozing", "Yashash yoki ish joyingizdagi Kambag'allikni qisqartirish va bandlik vazirligi huzuridagi Mehnat inspeksiyasiga shikoyat qiling."],
      ["Sudga da'vo bilan chiqing", "Ishga tiklash to'g'risidagi da'vo bilan fuqarolik sudiga bo'shatish buyrug'ining nusxasi berilgan kundan boshlab 1 oy ichida murojaat qilinadi (boshqa mehnat nizolari — 3 oy). Xodim mehnat nizosi bo'yicha sud xarajatlarini to'lamaydi. Uzrli sabab bilan o'tkazib yuborilgan muddatni sud tiklashi mumkin."]
    ],
    laws: ["O'zbekiston Respublikasining Mehnat kodeksi (162-modda — ish beruvchi tashabbusi bilan bekor qilish; 172-modda — hisob-kitob; 174-modda — qonunga xilof bekor qilish oqibatlari)", "O'zbekiston Respublikasi Fuqarolik protsessual kodeksi"],
    qs: ["Meni ogohlantirishsiz ishdan bo'shatishdi, bu qonuniymi?", "Bo'shatilganda ish beruvchi qanday to'lovlarni to'lashi shart?", "Ishga tiklash uchun sudga qanday ariza yoziladi?"]
  },
  { 
    id: "ish_haqi", icon: "cash", title: "Maosh va ta'til puli kechikishi", desc: "Kechiktirilgan ish haqi, jarimalar va foizli kompensatsiya", tag: "Mehnat kodeksi",
    intro: "Mehnat kodeksining 253-moddasi ish haqini to'lash muddatlarini, 334-moddasi esa ish haqini kechiktirganlik uchun ish beruvchining moddiy javobgarligini belgilaydi. Kompensatsiya miqdori va hisoblash tartibini amaldagi matndan tekshiring.",
    steps: [
      ["Ish beruvchiga yozma ariza bering", "Maosh kechikkani haqida yozma ariza yozing va nusxasini o'zingizda muhr bilan saqlang."],
      ["Mehnat inspeksiyasi va prokuraturaga murojaat", "Natija bo'lmasa, Davlat mehnat inspeksiyasiga (ishonch telefoni: +998 71 200-06-00) yoki prokuraturaga murojaat qiling."],
      ["Sud buyrug'i oling", "Hisoblangan, ammo to'lanmagan ish haqi bo'yicha fuqarolik sudiga 'sud buyrug'i' chiqarish uchun ariza bering (oddiy da'vodan ancha tez hal bo'ladi)."]
    ],
    laws: ["Mehnat kodeksi (253-modda — ish haqini to'lash muddatlari; 334-modda — kechiktirganlik uchun javobgarlik)", "Fuqarolik protsessual kodeksi (sud buyrug'i tartibi)"],
    qs: ["Maosh 2 oy kechiksa qayerga shikoyat qilaman?", "Ish beruvchidan kechiktirilgan foizni qanday talab qilsa bo'ladi?"]
  },
  { 
    id: "oila", icon: "users", title: "Ajrashish va aliment", desc: "Nikohdan ajralish tartibi, bolalar taqdiri va aliment miqdori", tag: "Oila kodeksi",
    intro: "Oila kodeksiga asosan aliment miqdori: 1 bola uchun daromadning 1/4 qismi, 2 bola uchun 1/3 qismi, 3 va undan ko'p bola uchun 1/2 qismini tashkil qiladi. Bir bola uchun aliment mehnatga haq to'lash eng kam miqdorining 26,5 foizidan kam bo'lmasligi kerak (2026-yil 1-sentabrdan — oyiga 360 400 so'm). Aliment da'vosi bo'yicha davlat boji to'lanmaydi.",
    steps: [
      ["FHDYo yoki sudga ariza", "Voyaga yetmagan bolalar yoki mulkiy nizo bo'lsa — Fuqarolik ishlari bo'yicha sud orqali, o'zaro rozilik bo'lsa — FHDYo orqali ajralinadi."],
      ["Aliment undirish arizasi", "Alimentni ajrashish jarayonida yoki undan mustaqil ravishda darhol sud buyrug'i tartibida undirish mumkin."],
      ["MIB orqali ijro", "Sud qarori chiqqach, ijro varaqasi Majburiy ijro byurosiga (MIB) topshiriladi va to'lov nazoratga olinadi."]
    ],
    laws: ["O'zbekiston Respublikasi Oila kodeksi (96-modda — ta'minot berish majburiyati; 99-modda — aliment miqdori; 105-modda — miqdorni kamaytirish)", "Sud hujjatlari va boshqa organlar hujjatlarini ijro etish to'g'risida Qonun"],
    qs: ["Aliment qanday hisoblanadi va eng kam miqdori qancha?", "Turmush o'rtog'im aliment to'lamasa qanday jazo bor?", "Ajrashganda uy va mol-mulk qanday bo'linadi?"]
  },
  { 
    id: "jarima", icon: "car", title: "YHXBB ma'muriy jarimalari", desc: "Radar, kamera va nohaq jarimaga shikoyat qilish", tag: "Ma'muriy javobgarlik",
    intro: "Foto va video qayd etish vositalari aniqlagan qoidabuzarliklar uchun javobgarlik MJtK 17-1-moddasida belgilangan. Ma'muriy huquqbuzarlik bo'yicha qaror ustidan 10 kun ichida (2024-yildan; avval 20 kun edi) yuqori turuvchi organga yoki sudga shikoyat qilish mumkin.",
    steps: [
      ["Qaror va fotosuratni tekshiring", "My.gov.uz yoki YHXBB ilovasi orqali fotosurat va vaqtni aniq tekshirib oling."],
      ["10 kunlik muddatni o'tkazmang", "Qaror nusxasi olingan kundan boshlab 10 kun ichida shikoyat berish muddati bor."],
      ["Shikoyat yoki chegirmali to'lovni tanlang", "Qaror noto'g'ri bo'lsa — shikoyat bering (my.gov.uz orqali ham mumkin). Qoidabuzarlik haqiqatda bo'lsa — MJtK 332-1-moddasiga ko'ra qarorni olgan kundan 15 kun ichida jarimaning 50 foizini yoki 30 kun ichida 70 foizini to'lab, qolganidan ozod bo'lish mumkin. Diqqat: qaror ustidan shikoyat qilinsa, bu chegirma qo'llanmaydi."]
    ],
    laws: ["Ma'muriy javobgarlik to'g'risidagi kodeks (17-1-modda — foto/video qayd etilgan qoidabuzarliklar; 332-1-modda — jarimani imtiyozli to'lash)", "O'RQ-884-son Qonun (25.12.2023) — shikoyat muddati 10 kunga qisqartirilgan"],
    qs: ["Radar jarimasiga qanday e'tiroz bildirsa bo'ladi?", "Jarimalarni 50 foiz chegirma bilan to'lash tartibi qanday?", "Mening mashinam emas, boshqa odam haydagan bo'lsa nima qilaman?"]
  },
  { 
    id: "meros", icon: "doc", title: "Meros va vasiyatnoma", desc: "Meros qabul qilish, 6 oylik muddat va qonuniy navbat", tag: "Fuqarolik kodeksi",
    intro: "Meros fuqaro vafot etgan kundan ochiladi. Merosni qabul qilish muddati — meros ochilgan kundan e'tiboran 6 oy. Agar ushbu muddat o'tkazib yuborilsa, uni faqat sud orqali tiklashga to'g'ri keladi.",
    steps: [
      ["Notariusga ariza bering", "Meros qoldiruvchi oxirgi yashagan joydagi notarial idoraga murojaat qiling."],
      ["6 oylik muddatga qat'iy e'tibor bering", "Aynan 6 oy ichida merosni qabul qilish haqida ariza berish shart."],
      ["Qarindoshlik va mulk hujjatlarini taqdim eting", "FHDYo guvohnomalari va marhumning mulkiga tegishli kadastr, texpasport kabilar yig'iladi."],
      ["Meros guvohnomasini oling", "6 oy o'tgach, notarius rasmiy 'Merosga bo'lgan huquq to'g'risida guvohnoma' beradi."]
    ],
    laws: ["Fuqarolik kodeksi, 2-qism (V bo'lim — vorislik huquqi, 1112-moddadan; 1136-modda — birinchi navbatdagi vorislar; 69-bob — merosni egallash, 1145-moddadan; 1146-modda — meros huquqi guvohnomasi)", "Notariat to'g'risida Qonun"],
    qs: ["Meros olish uchun 6 oylik muddat o'tib ketsa nima bo'ladi?", "Vasiyatnoma bo'lmasa qonun bo'yicha kimlar birinchi navbatda merosxo'r hisoblanadi?", "Merosdan voz kechish mumkinmi?"]
  },
  { 
    id: "istemol", icon: "cart", title: "Sifatsiz tovar va xizmat", desc: "Tovarni qaytarish, almashtirish va pulni qaytarib olish", tag: "Iste'molchilar huquqlari",
    intro: "Iste'molchi maqbul sifatli nooziq-ovqat tovarini sotib olgan kundan boshlab 10 kun ichida almashtirishga, bir xil tovar bo'lmasa pulni qaytarishga haqli (tovar ishlatilmagan, qadog'i va tovar ko'rinishi saqlangan bo'lishi kerak — 18-modda). Nuqsonli tovar uchun almashtirish, bepul ta'mirlash, narxni kamaytirish yoki shartnomani bekor qilib pulni qaytarishni talab qilish mumkin (13-modda).",
    steps: [
      ["Chek yoki to'lov tasdig'ini oling", "Kvitansiya, bank ilovasi kvitansiyasi yoki guvohlar dalil bo'ladi."],
      ["Sotuvchiga yozma da'vo (pretenziya) bering", "Talabingizni 2 nusxada yozing, bitta nusxasiga qabul qilib olganlik haqida imzo qo'ydiring."],
      ["Raqobat qo'mitasiga murojaat qiling", "Sotuvchi rad etsa, Raqobatni rivojlantirish va iste'molchilar huquqlarini himoya qilish qo'mitasiga (tel.: 1159) murojaat qiling."],
      ["Sudga ariza bering", "Sudga murojaat qilish huquqi qonunning 4-moddasida kafolatlangan. Davlat boji imtiyozlarini da'vo berishdan oldin aniqlang."]
    ],
    laws: ["\"Iste'molchilarning huquqlarini himoya qilish to'g'risida\"gi Qonun, 26.04.1996, 221-I (13-modda — nuqsonli tovar; 14-modda — almashtirish muddati; 15-modda — bepul ta'mirlash; 18-modda — maqbul sifatli tovarni almashtirish)"],
    qs: ["Kiyinish yoki telefonni 10 kun ichida qaytarib berish mumkinmi?", "Cheki yo'q tovarni qaytarsa bo'ladimi?", "Kafolat muddati davomida ta'mirlanmasa nima qilish kerak?"]
  },
  { 
    id: "uy", icon: "home", title: "Turar joy ijarasi va mulk", desc: "Ijara shartnomasi, depozitni qaytarish va ijarachi huquqlari", tag: "Fuqarolik kodeksi",
    intro: "Jismoniy shaxslar o'rtasidagi ko'chmas mulk ijara shartnomasi soliq organlarida (ijara.soliq.uz) hisobga qo'yilishi kerak (PQ-3741, 25.05.2018). Uy-joy ijarasi Fuqarolik kodeksining 35-bobida (600–616-moddalar) tartibga solinadi; yozma shartnoma va topshirish dalolatnomasi nizoda asosiy dalil bo'ladi.",
    steps: [
      ["Rasmiy shartnoma tuzing", "ijara.soliq.uz portali orqali shartnomani ro'yxatdan o'tkazing."],
      ["Dalolatnoma (Akt) imzolang", "Uyga kirishda mavjud jihozlar va kamchiliklarni akt orqali rasmiylashtiring va rasmga oling."],
      ["To'lovlarni bank orqali qiling", "Naqd bermasdan, kartadan kartaga o'tkazib, izohida 'falon oy ijarasi' deb yozib boring."]
    ],
    laws: ["Fuqarolik kodeksi, 2-qism, 35-bob (600–616-moddalar — uy-joyni ijaraga berish)", "Uy-joy kodeksi", "Prezidentning PQ-3741-son qarori (25.05.2018)"],
    qs: ["Uy egasi depozitni qaytarmayapti, nima qilsam bo'ladi?", "Shartnomasiz yashaganda qanday xavf bor?", "Ijarachini to'satdan chiqarib yuborish mumkinmi?"]
  },
  { 
    id: "kredit", icon: "credit", title: "Bank kreditlari va foizlar", desc: "Muddati o'tgan qarz, garov mulki va bank nizolari", tag: "Bank qonunchiligi",
    intro: "Bank qarzdorlikni undirishda qonun doirasidan chiqa olmaydi. Qisman to'lovda avval muddati o'tgan asosiy qarz va foiz, keyin joriy foiz va qarz, so'ngra neustoyka uziladi (O'RQ-914). Moliyaviy qiyinchilikda bankdan to'lov grafigini qayta ko'rib chiqishni (restrukturizatsiya) so'rash mumkin.",
    steps: [
      ["Shartnoma shartlarini o'rganing", "Foiz, penya va jarima miqdorlarini diqqat bilan o'qing. Sud kredit qarzini undirish to'g'risida qaror chiqargach, undirilgan summaga foiz va neustoyka hisoblash to'xtatiladi (FK, O'RQ-914, 27.02.2024)."],
      ["Bankka yozma ariza bering", "Muammoli holat haqida ma'lum qilib, kredit to'lov grafigini uzaytirishni (kredit ta'tili) so'rang."],
      ["Markaziy bankka murojaat qiling", "Bank huquqlaringizni buzsa, Markaziy bankning iste'molchilar huquqlarini himoya qilish xizmatiga shikoyat bering."]
    ],
    laws: ["\"Banklar va bank faoliyati to'g'risida\"gi Qonun", "Fuqarolik kodeksi (garov, qarz va kredit shartnomalari)", "O'RQ-914-son Qonun (27.02.2024)"],
    qs: ["Kreditni to'lay olmasam garovdagi uyimni tortib olishadimi?", "Kredit bo'yicha penya qancha bo'lishi mumkin?", "Kafillikdan voz kechish mumkinmi?"]
  },
  { 
    id: "biznes", icon: "building", title: "Biznes ochish: YaTT yoki MChJ", desc: "Ro'yxatdan o'tish, soliq rejimini tanlash va qonuniy faoliyat", tag: "Tadbirkorlik",
    intro: "Yakka tartibdagi tadbirkor (YaTT) sifatida ro'yxatdan o'tish yoki MChJ ta'sis etish onlayn (my.gov.uz / birdarcha) amalga oshirilishi mumkin. Faoliyat turiga qarab to'g'ri soliq rejimini tanlash biznes xavfsizligining garovidir.",
    steps: [
      ["Tashkiliy-huquqiy shaklni tanlang", "Bitta o'zingiz xizmat ko'rsatsangiz — YaTT, sheriklar bilan katta loyiha qilsangiz — MChJ."],
      ["Onlayn ro'yxatdan o'ting", "Birdarcha (my.gov.uz) orqali ariza topshiring va davlat ro'yxatidan o'tganlik guvohnomasini oling."],
      ["Soliq rejimini belgilang", "Aylanmadan olinadigan soliq yoki umumiy soliq tizimini tanlang (stavka va muddatlarni Soliq kodeksidan yoki soliq.uz dan tekshiring)."]
    ],
    laws: ["O'zbekiston Respublikasi Soliq kodeksi", "\"Tadbirkorlik faoliyati erkinligining kafolatlari to'g'risida\"gi Qonun"],
    qs: ["YaTT va MChJ ning farqi nima?", "O'zini o'zi band qilgan shaxslar qanday soliq to'laydi?", "Biznes hisob raqamini qanday ochiladi?"]
  },
  { 
    id: "talim", icon: "school", title: "Ta'lim krediti va kontrakt", desc: "Talabalar uchun imtiyozli ta'lim krediti va talabalik huquqlari", tag: "Ta'lim huquqi",
    intro: "Kunduzgi ta'limda o'qiydigan xotin-qizlar, kambag'al oilalar reyestridagi a'lochi talabalar (GPA 3.5+) va ayrim boshqa toifalar uchun ta'lim krediti foizlari Ta'lim kreditlarini moliyalashtirish jamg'armasi hisobidan to'liq qoplanadi — talaba uchun 0%. Shartlar har yili o'zgarishi mumkin.",
    steps: [
      ["OTM bilan shartnoma oling", "To'lov-kontrakt shartnomasini ta'lim muassasasidan oling."],
      ["Bankka ariza bering", "Ta'lim krediti beruvchi bankka murojaat qiling; amaldagi ariza tartibini bank yoki my.gov.uz orqali aniqlang."],
      ["Kafillik va hujjatlar", "Pasport, kontrakt va oila daromadi to'g'risidagi ma'lumotlarni ilova qiling."]
    ],
    laws: ["Vazirlar Mahkamasining ta'lim kreditlarini ajratish tartibi to'g'risidagi Qarorlari"],
    qs: ["Qizlar uchun foizsiz ta'lim krediti qanday olinadi?", "Kontrakt to'lovini bo'lib to'lash mumkinmi?", "Akademik ta'tildan qaytish qoidalari qanday?"]
  },
  { 
    id: "pasport", icon: "shield", title: "Pasport, propiska va xorij", desc: "ID-karta olish, erkin propiska va xorijga chiqish pasporti", tag: "Davlat xizmatlari",
    intro: "Xorijga chiqish biometrik pasporti 25 yoshdan oshganlarga 10 yilga, 1–25 yoshdagilarga 5 yilga, 1 yoshgacha bolalarga 2 yilga beriladi. Davlat boji: 16 yoshdan — 1 BHM, 16 yoshgacha — BHMning 80 foizi.",
    steps: [
      ["Davlat xizmatlari markaziga boring", "Yoki my.gov.uz orqali navbatga yoziling."],
      ["Davlat bojini to'lang", "16 yoshdan katta — 1 BHM, 16 yoshgacha — 0,8 BHM; portal orqali arizada chegirma bor."],
      ["Pasportni qabul qilib oling", "Pasport ariza va to'lovdan keyin 10 ish kuni ichida tayyorlanadi (portal orqali — biometrik ma'lumot topshirilgan kundan)."]
    ],
    laws: ["\"O'zbekiston Respublikasida fuqarolarni ro'yxatga olish tartibi to'g'risida\"gi Qonun"],
    qs: ["Toshkentdan uy olmasdan ham doimiy propiskaga o'tsa bo'ladimi?", "Qizil pasport yo'qolsa nima qilish kerak?"]
  },
  { 
    id: "kiber", icon: "lock", title: "Kiberfiribgarlik va karta o'g'irligi", desc: "Bank kartasidan noqonuniy pul yechilganda nima qilish kerak?", tag: "Jinoyat qonunchiligi",
    intro: "Bank kartasidan ruxsatsiz pul yechib olinganda, zudlik bilan kartani bloklash va 102 raqamiga yoki ichki ishlar organlariga xabar berish kerak — kechiksangiz pul tezda chet elga o'tkazib yuborilishi mumkin. Shubhali havolalarga (fishing) kirmaslik eng asosiy xavfsizlik chorasidir.",
    steps: [
      ["Kartani darhol bloklang", "Bank mobil ilovasi orqali yoki bank call-markaziga qo'ng'iroq qilib bloklang."],
      ["Pul o'tkazmasi chekini saqlang", "Qaysi hisobga yoki kartaga pul o'tganini aniqlab, PDF chekini yuklab oling."],
      ["Kiberxavfsizlik bo'limiga ariza bering", "Yashash joyingizdagi IIBga yoki elektron shaklda ariza yuboring."]
    ],
    laws: ["O'zbekiston Respublikasi Jinoyat kodeksi (168-modda — firibgarlik, 169-modda — o'g'rilik, 278-2-modda — kompyuter axborotidan ruxsatsiz foydalanish)"],
    qs: ["Karta raqamimni aytib pulimni oldirib qo'ydim, qaytarsa bo'ladimi?", "Bank kiberhujum vaqtida pulni qaytarishga majburmi?"]
  }
];

// SVG ICONS (CLEAN MINIMALIST OUTLINE)
function getSvgIcon(type) {
  const icons = {
    briefcase: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    cash: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
    users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    car: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="9" rx="2"/><path d="M5 11l2-6h10l2 6"/><circle cx="7" cy="16" r="1.5"/><circle cx="17" cy="16" r="1.5"/></svg>`,
    doc: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    cart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    credit: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    building: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    school: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    lock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  };
  return icons[type] || icons.doc;
}

// [qisqartma, nomi, tavsif, lex.uz hujjat ID] — ID'lar lex.uz da tekshirilgan (2026-10-29; FK 2-qism qo‘shildi).
const CODES = [
  ["K", "Konstitutsiya", "Davlatning bosh qonuni: inson qadri, huquq va erkinliklar.", "6445145"],
  ["MK", "Mehnat kodeksi", "Ishga qabul, maosh, mehnat ta'tili, bo'shatish va xodim kafolatlari.", "6257288"],
  ["OK", "Oila kodeksi", "Nikoh, ajrashish, aliment, bolalar tarbiyasi va ota-onalik huquqi.", "104720"],
  ["FK", "Fuqarolik kodeksi (1-qism)", "Umumiy qoidalar, mulk huquqi, majburiyatlar va shartnomalar.", "111181"],
  ["FK-2", "Fuqarolik kodeksi (2-qism)", "Oldi-sotdi, ijara, uy-joy ijarasi, kredit va vorislik (meros).", "180552"],
  ["MJ", "Ma'muriy javobgarlik kodeksi", "Yo'l harakati, jarimalar va ma'muriy huquqbuzarliklar.", "97664"],
  ["JK", "Jinoyat kodeksi", "Jinoiy javobgarlik, jazolar va jinoyat turlari.", "111453"],
  ["SK", "Soliq kodeksi", "Jismoniy va yuridik shaxslar soliqlari, imtiyozlar va hisobotlar.", "4674902"],
  ["UK", "Uy-joy kodeksi", "Ko'chmas mulk, xonadondan foydalanish va kommunal munosabatlar.", "106134"],
  ["FPK", "Fuqarolik protsessual kodeksi", "Sudga da'vo berish, dalillar, sud majlislari va qarorlar.", "3517334"],
  ["IPK", "Iqtisodiy protsessual kodeksi", "Tadbirkorlar va korxonalar o'rtasidagi iqtisodiy nizolar.", "3523891"]
];
const lexUrl = (id, title) => id ? `https://lex.uz/docs/${id}` : `https://lex.uz/search/all?searchtitle=${encodeURIComponent(title)}`;

// TAYYOR HUJJAT SHABLONLARI (DOC BUILDER)
const DOC_TEMPLATES = {
  ish_haqi: {
    title: "To'lanmagan ish haqini talab qilish arizasi",
    desc: "Mehnat kodeksining 253 va 334-moddalari asosida hisoblangan maosh va kompensatsiya talabi.",
    fields: [
      { id: "employer", label: "Ish beruvchi tashkilot nomi", placeholder: "«Falonchi MChJ» rahbari A.B.ga", type: "text" },
      { id: "applicant", label: "Sizning F.I.O.", placeholder: "Karimov Sherzod Aliyevich", type: "text" },
      { id: "position", label: "Lavozimingiz", placeholder: "Bosh buxgalter / Dasturchi / Haydovchi", type: "text" },
      { id: "amount", label: "Qarzdorlik summasi (so'm)", placeholder: "8 500 000", type: "text" },
      { id: "period", label: "Qaysi oylar uchun maosh", placeholder: "2026-yil avgust va sentyabr oylari uchun", type: "text" }
    ],
    generate: (data) => `
KIMGA: ${data.employer || "[Ish beruvchi korxona rahbari]"}
KIMDAN: ${data.applicant || "[Xodimning F.I.O.]"}
Lavozimi: ${data.position || "[Lavozim]"}
Aloqa telefoni: +998 (__) ___-__-__

                                ARIZA
                   (To'lanmagan ish haqini to'lash to'g'risida)

Men, ${data.applicant || "[F.I.O.]"}, ${data.employer || "[Tashkilot]"} da ${data.position || "[Lavozim]"} lavozimida mehnat faoliyatini yuritib kelmoqdaman.

O'zbekiston Respublikasi Mehnat kodeksining 253-moddasiga muvofiq, ish beruvchi xodimga belgilangan muddatlarda ish haqini to'liq to'lashi shart.
Biroq, bugungi kunga qadar menga ${data.period || "[Tegishli davr]"} uchun jami ${data.amount || "[Summa]"} so'm miqdoridagi ish haqi to'lab berilmadi.

Shuningdek, Mehnat kodeksining 334-moddasiga ko'ra, ish beruvchi ish haqini to'lashni kechiktirganlik uchun moddiy javobgar bo'ladi.

Yuqoridagilardan kelib chiqib, SIZDAN:
1. Menga tegishli bo'lgan ${data.amount || "[Summa]"} so'm miqdoridagi ish haqini to'liq to'lab berishingizni;
2. Kechiktirilgan har bir kun uchun qonunda belgilangan foiz (kompensatsiya) miqdorini hisoblab to'lashingizni so'rayman.

Ushbu talab 3 (uch) ish kuni ichida ixtiyoriy ravishda bajarilmagan taqdirda, Davlat mehnat inspeksiyasi, Prokuratura organlariga hamda Fuqarolik ishlari bo'yicha sudga sud buyrug'i chiqarish to'g'risida ariza bilan murojaat qilishimni ma'lum qilaman.

Imzo: _______________ (${data.applicant || "Xodim"})
Sana: ${new Date().toISOString().slice(0, 10)}
`
  },

  istemol_da_vo: {
    title: "Sifatsiz tovar uchun pulni qaytarish talabnomasi (Pretenziya)",
    desc: "Iste'molchilar huquqlarini himoya qilish to'g'risidagi qonunning 13-14 moddalari asosida.",
    fields: [
      { id: "store", label: "Do'kon yoki sotuvchi nomi", placeholder: "«TexnoMart» do'koni ma'muriyatiga", type: "text" },
      { id: "buyer", label: "Iste'molchi F.I.O.", placeholder: "Rustamov Jasur Anvarovich", type: "text" },
      { id: "product", label: "Tovarning nomi va modeli", placeholder: "Samsung Galaxy smartfoni", type: "text" },
      { id: "buy_date", label: "Xarid qilingan sana", placeholder: "12.10.2026", type: "text" },
      { id: "defect", label: "Tovardagi nosozlik / kamchilik", placeholder: "Ekran to'satdan o'chib qolmoqda, zaryad olmayapti", type: "text" },
      { id: "price", label: "To'langan summa (so'm)", placeholder: "3 800 000", type: "text" }
    ],
    generate: (data) => `
KIMGA: ${data.store || "[Do'kon / Sotuvchi nomi]"}
ISTE'MOLCHI: ${data.buyer || "[Xaridorning F.I.O.]"}
Telefon raqam: +998 (__) ___-__-__

                        TALABNOMA (PRETENZIYA)
             (Sifatsiz tovar uchun to'langan pulni qaytarish haqida)

Men, ${data.buyer || "[Xaridor]"}, ${data.buy_date || "[Sana]"} kuni Sizning savdo do'koningizdan ${data.price || "[Summa]"} so'm evaziga ${data.product || "[Tovar nomi]"} tovarini xarid qilgan edim.

Tovar foydalanish jarayonida quyidagi jiddiy nuqsonlar aniqlandi:
${data.defect || "[Nosozlik tafsiloti]"}.

O'zbekiston Respublikasi «Iste'molchilarning huquqlarini himoya qilish to'g'risida»gi Qonunining 13-moddasiga binoan, nuqsonli tovar sotilgan iste'molchi shartnomani bekor qilib, to'langan pulni qaytarishni va zararni qoplashni talab qilishga haqli.
Talabimni qonunda belgilangan muddatlarda (almashtirish uchun — 14-moddaga ko'ra 7 kun) ko'rib chiqishingizni so'rayman.

Yuqoridagilardan kelib chiqib:
1. Sifat talablariga javob bermaydigan ${data.product || "[Tovar]"} ni qabul qilib olishingizni;
2. Mazkur tovar uchun to'langan ${data.price || "[Summa]"} so'm pul mablag'ini menga to'liq qaytarishingizni talab qilaman.

Imzo: _______________ (${data.buyer || "Iste'molchi"})
Sana: ${new Date().toISOString().slice(0, 10)}
`
  },

  ijara_shartnoma: {
    title: "Turar joy ijara shartnomasi (Namuna)",
    desc: "Fuqarolik kodeksining 600-moddasi (uy-joyni ijaraga berish shartnomasi) asosidagi namuna. ijara.soliq.uz da ro'yxatdan o'tkazish kerak.",
    fields: [
      { id: "landlord", label: "Uy egasi F.I.O. (Ijaraga beruvchi)", placeholder: "Sobirov Otabek Akramovich", type: "text" },
      { id: "tenant", label: "Ijaraga oluvchi F.I.O.", placeholder: "Nazarov Bekzod Ikromovich", type: "text" },
      { id: "address", label: "Ijara xonadonining manzili", placeholder: "Toshkent shahri, Chilonzor tumani, 9-mavze", type: "text" },
      { id: "rent", label: "Oylik ijara narxi (so'm)", placeholder: "4 000 000", type: "text" },
      { id: "deposit", label: "Garov (Depozit) summasi (so'm)", placeholder: "2 000 000", type: "text" }
    ],
    generate: (data) => `
                 TURAR JOYNI IJARAGA BERISH SHARTNOMASI

Toshkent shahri                                  «____» __________ 2026-yil

Bir tomondan fuqaro ${data.landlord || "[Uy egasining F.I.O.]"} (keyingi o'rinlarda «Ijaraga beruvchi»), ikkinchi tomondan fuqaro ${data.tenant || "[Ijaraga oluvchining F.I.O.]"} (keyingi o'rinlarda «Ijarachi») quyidagilar haqida mazkur shartnomani tuzdilar:

1. SHARTNOMA PREDMETI
1.1. Ijaraga beruvchi o'ziga mulk huquqi asosida tegishli bo'lgan quyidagi manzildagi turar joyni vaqtincha yashash uchun topshiradi:
Manzil: ${data.address || "[Xonadon manzili]"}.

2. TO'LOVLAR VA HISOB-KITOBLAR
2.1. Mazkur shartnoma bo'yicha oylik ijara haqi ${data.rent || "[Oylik ijara summasi]"} so'mni tashkil etadi.
2.2. Ijarachi tomonidan garov (depozit) sifatida ${data.deposit || "[Depozit summasi]"} so'm to'landi. Ushbu summa shartnoma tugagach xonadonga ziyon yetkazilmagan taqdirda to'liq qaytariladi.

TOMONLARNING IMZOLARI:
IJARAGA BERUVCHI: _______________ (${data.landlord || "Uy egasi"})
IJARACHI:         _______________ (${data.tenant || "Ijarachi"})
`
  },

  aliment_sud: {
    title: "Aliment undirish to'g'risida sudga ariza (Sud buyrug'i)",
    desc: "Oila kodeksining 96 va 99-moddalari asosida sud buyrug'i berish haqida ariza namunasi. Aliment da'vosi davlat bojidan ozod.",
    fields: [
      { id: "court", label: "Fuqarolik sudi nomi", placeholder: "Fuqarolik ishlari bo'yicha tumanlararo sudiga", type: "text" },
      { id: "claimant", label: "Da'vogar (Ona/Ota) F.I.O.", placeholder: "Aliyeva Nargiza Valijonovna", type: "text" },
      { id: "debtor", label: "Javobgar (Qarzdor) F.I.O.", placeholder: "Aliyev Rustam Qosimovich", type: "text" },
      { id: "child_name", label: "Farzand(lar) ismi va tug'ilgan yili", placeholder: "Aliyev Temur Rustam o'g'li, 2020-yil 15-may", type: "text" }
    ],
    generate: (data) => `
KIMGA: ${data.court || "[Fuqarolik ishlari bo'yicha sudga]"}
UNDIRUVCHI: ${data.claimant || "[Undiruvchining F.I.O.]"}
QARZDOR: ${data.debtor || "[Qarzdor ota/onaning F.I.O.]"}

                               ARIZA
       (Voyaga yetmagan bola ta'minoti uchun aliment undirish 
                to'g'risida sud buyrug'i berish haqida)

Men va qarzdor ${data.debtor || "[Qarzdor]"} o'rtamizda tuzilgan nikohdan birgalikdagi farzandimiz ${data.child_name || "[Farzandning F.I.O.]"} tug'ilgan.
Bola to'liq mening qaramog'imda. Qarzdor bola ta'minoti uchun moddiy yordam ko'rsatishdan bosh tortib kelmoqda.

O'zbekiston Respublikasi Oila kodeksining 96 va 99-moddalariga muvofiq, Sudingizdan:
Qarzdor ${data.debtor || "[Qarzdor]"} dan voyaga yetmagan farzandimiz ta'minoti uchun har oyda uning barcha turdagi daromadlarining 1/4 qismi miqdorida aliment undirish to'g'risida SUD BUYRUG'I chiqarishingizni so'rayman.

Imzo: _______________ (${data.claimant || "Ariza beruvchi"})
Sana: ${new Date().toISOString().slice(0, 10)}
`
  },

  mehnat_boshash: {
    title: "O'z xohishi bilan ishdan bo'shash to'g'risida ariza",
    desc: "Mehnat kodeksining 161-moddasiga muvofiq (xodimning tashabbusi bilan) mehnat shartnomasini bekor qilish.",
    fields: [
      { id: "director", label: "Tashkilot rahbari lavozimi va F.I.O.", placeholder: "«Korxona nomi» Bosh direktoriga", type: "text" },
      { id: "employee", label: "Xodimning F.I.O.", placeholder: "Sodiqov Dilshod Farxodovich", type: "text" },
      { id: "dept", label: "Bo'lim va lavozimingiz", placeholder: "Moliya bo'limi mutaxassisi", type: "text" },
      { id: "last_day", label: "Oxirgi ish kuningiz", placeholder: "2026-yil 15-noyabr", type: "text" }
    ],
    generate: (data) => `
KIMGA: ${data.director || "[Tashkilot rahbari lavozimi va F.I.O.]"}
KIMDAN: ${data.dept || "[Bo'lim va lavozim]"}
        ${data.employee || "[Xodimning F.I.O.]"}

                                ARIZA
        (Mehnat shartnomasini xodimning tashabbusiga ko'ra bekor qilish haqida)

O'zbekiston Respublikasi Mehnat kodeksining 161-moddasiga muvofiq, men bilan tuzilgan mehnat shartnomasini o'z xohishimga ko'ra ${data.last_day || "[Oxirgi ish kuni]"} kunidan boshlab bekor qilishingizni so'rayman.

Imzo: _______________ (${data.employee || "Xodim"})
Sana: ${new Date().toISOString().slice(0, 10)}
`
  }
};

const $ = (s) => document.querySelector(s);
let mode = "citizen";
let history = [];
let busy = false;
let currentDoc = "ish_haqi";

// VIEW SWITCHER
function show(view) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  const target = $("#view-" + view);
  if (target) target.classList.add("active");
  document.body.classList.toggle("chat-open", view === "chat");
  window.scrollTo(0, 0);
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-view]");
  if (!a) return;
  e.preventDefault();
  show(a.dataset.view);
  if (a.dataset.scroll) {
    const el = document.getElementById(a.dataset.scroll);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
});

// RENDER SITUATIONS WITH CLEAN ICONS
// O'zbek apostroflarining barcha shakllarini (' ‘ ’ ʻ ʼ `) bittaga keltiradi.
function norm(value) {
  return String(value).toLocaleLowerCase("uz").replace(/[‘’ʻʼ`´]/g, "'").replace(/\s+/g, " ").trim();
}

function renderSituations(filter = "") {
  const f = norm(filter);
  const list = SITUATIONS.filter(s => norm(`${s.title} ${s.desc} ${s.tag}`).includes(f));
  
  if (list.length === 0) {
    $("#situations").innerHTML = `<p class="empty-note">Bunday vaziyat topilmadi. Yuqoridagi aqlli qidiruvga vaziyatingizni yozib ko'ring.</p>`;
    return;
  }

  $("#situations").innerHTML = list.map((s) => `
    <button type="button" class="sit-card" data-sit="${s.id}">
      <span class="sit-icon-wrap" aria-hidden="true">${getSvgIcon(s.icon)}</span>
      <span class="sit-body">
        <span class="sit-tag">${escapeHtml(s.tag)}</span>
        <span class="sit-title">${escapeHtml(s.title)}</span>
        <span class="sit-desc">${escapeHtml(s.desc)}</span>
      </span>
      <span class="sit-arrow" aria-hidden="true">→</span>
    </button>
  `).join("");
}

// SEARCH FILTER EVENT
$("#sit-search").addEventListener("input", (e) => {
  renderSituations(e.target.value.trim());
});

// RENDER CODES
$("#codes").innerHTML = CODES.map(([n, t, d, id]) => `
  <article class="code-card">
    <div class="code-info">
      <h3>${escapeHtml(t)}</h3>
      <p>${escapeHtml(d)}</p>
    </div>
    <div class="code-links">
      <a href="${lexUrl(id, t)}" target="_blank" rel="noopener">Rasmiy matn <span aria-hidden="true">↗</span></a>
      <button type="button" data-ask="${escapeHtml(t)} haqida oddiy tilda tushuntirib bering: u nimalarni tartibga soladi va oddiy fuqaro uchun eng muhim 3 ta qoidasi qaysi?">AI tahlili</button>
    </div>
  </article>
`).join("");

// SITUATION DETAIL VIEW
function openSituation(id) {
  const s = SITUATIONS.find((x) => x.id === id);
  if (!s) return;
  $("#situation-detail").innerHTML = `
    <div class="detail-header">
      <div class="sit-icon-wrap lg">${getSvgIcon(s.icon)}</div>
      <h1>${s.title}</h1>
    </div>
    <p class="detail-intro">${s.intro}</p>
    <div class="verify-note">⚠️ Bu umumiy ma'lumot, yurist tomonidan tasdiqlanmagan. Modda raqamlari, muddatlar, summalar va telefon raqamlarini <a href="https://lex.uz" target="_blank" rel="noopener">lex.uz</a> dagi amaldagi tahrir bilan tekshiring.</div>
    <ul class="steps-list">${s.steps.map(([b, t]) => `<li><b>${b}</b><p>${t}</p></li>`).join("")}</ul>
    <div class="laws-card">
      <h4>Asosiy qonunchilik hujjatlari:</h4>
      <ul>${s.laws.map((l) => `<li>${l}</li>`).join("")}</ul>
    </div>
    <div class="ask-banner">
      <h3>AI huquqshunosdan qo'shimcha so'rang</h3>
      <div class="chips left">${s.qs.map((q) => `<button type="button" data-ask="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}</div>
    </div>`;
  show("situation");
}

$("#situations").addEventListener("click", (e) => {
  const c = e.target.closest("[data-sit]");
  if (c) openSituation(c.dataset.sit);
});

// DOCUMENT GENERATOR
function renderDocForm(docKey) {
  currentDoc = docKey;
  const doc = DOC_TEMPLATES[docKey];
  if (!doc) return;

  const form = $("#doc-form");
  form.innerHTML = doc.fields.map(f => `
    <div class="form-group">
      <label for="field_${f.id}">${f.label}</label>
      <input type="${f.type}" id="field_${f.id}" name="${f.id}" placeholder="${f.placeholder}" autocomplete="off" />
    </div>
  `).join("");

  document.querySelectorAll(".doc-tab-btn").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.doc === docKey);
  });

  updateDocPreview();

  form.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateDocPreview);
  });
}

function getFormData() {
  const form = $("#doc-form");
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = value.trim(); });
  return data;
}

function updateDocPreview() {
  const doc = DOC_TEMPLATES[currentDoc];
  if (!doc) return;
  const data = getFormData();
  const text = doc.generate(data);
  $("#doc-paper").textContent = text;
  const note = $("#doc-desc");
  if (note) note.textContent = doc.desc;
}

$("#doc-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".doc-tab-btn");
  if (tab) renderDocForm(tab.dataset.doc);
});

$("#btn-copy-doc").addEventListener("click", () => {
  const text = $("#doc-paper").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = $("#btn-copy-doc");
    btn.textContent = "Nusxa olindi";
    setTimeout(() => { btn.textContent = "Nusxa olish"; }, 2000);
  }).catch(() => alertCopyFail());
});

function alertCopyFail() {
  const btn = $("#btn-copy-doc");
  btn.textContent = "Nusxa olinmadi";
  setTimeout(() => { btn.textContent = "Nusxa olish"; }, 2000);
}

$("#btn-download-doc").addEventListener("click", () => {
  const text = $("#doc-paper").textContent;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${currentDoc}_ariza.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

// Faqat hujjat matnini chop etish (butun sahifani emas)
$("#btn-print-doc").addEventListener("click", () => {
  const text = $("#doc-paper").textContent;
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.append(frame);
  const d = frame.contentDocument;
  d.open();
  d.write(`<!doctype html><html lang="uz"><head><meta charset="utf-8"><title>${escapeHtml(DOC_TEMPLATES[currentDoc]?.title || "Hujjat")}</title>
<style>@page{margin:18mm}body{margin:0;font:12pt/1.6 Georgia,"Times New Roman",serif;color:#000}pre{white-space:pre-wrap;font:inherit;margin:0}</style>
</head><body><pre>${escapeHtml(text)}</pre></body></html>`);
  d.close();
  frame.contentWindow.focus();
  frame.contentWindow.print();
  setTimeout(() => frame.remove(), 1000);
});

// CLICKS & CHIPS
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ask]");
  if (b) ask(b.dataset.ask);
  const m = e.target.closest("[data-mode-start]");
  if (m) { setMode(m.dataset.modeStart); show("chat"); }
});

$("#hero-chips").addEventListener("click", (e) => { if (e.target.tagName === "BUTTON") ask(e.target.textContent); });
$("#hero-ask").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#hero-input").value.trim(); if (v) { $("#hero-input").value = ""; ask(v); } });

function setMode(m) {
  mode = m;
  document.querySelectorAll("#mode-toggle button").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
  $("#mode-note").textContent = m === "student" ? "Chuqur huquqiy tahlil: normaning tuzilishi, dispozitsiya va sud amaliyoti." : "Sodda tilda, amaliy qadamlar bilan javob.";
}
$("#mode-toggle").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setMode(b.dataset.mode); });

// SETTINGS MODAL
// API kaliti brauzerda saqlanmaydi. U faqat serverdagi GEMINI_API_KEY muhit o'zgaruvchisida bo'lishi kerak.
const modalSettings = $("#modal-settings");

function refreshApiStatus() {
  $("#api-model-name").textContent = "Server orqali";
}

$("#btn-config-api").addEventListener("click", () => modalSettings.classList.remove("hidden"));
modalSettings.addEventListener("click", (e) => {
  if (e.target === modalSettings) modalSettings.classList.add("hidden");
});
$("#btn-close-settings")?.addEventListener("click", () => modalSettings.classList.add("hidden"));

// NEW CHAT
$("#new-chat").addEventListener("click", () => {
  if (busy) return;
  history = [];
  $("#messages").innerHTML = "";
  $("#messages").append(emptyEl);
});
const emptyEl = $("#chat-empty");

// MARKDOWN PARSER
function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function md(src) {
  const lines = esc(src).split("\n");
  let out = "", list = null;
  const inline = (t) => t
    // [matn](https://...) — faqat http/https havolalar (matn allaqachon ekranlangan)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<i>$2</i>");
  const close = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const l of lines) {
    let m;
    if ((m = l.match(/^#{1,6}\s+(.*)/))) { close(); out += `<h3>${inline(m[1])}</h3>`; }
    else if ((m = l.match(/^\s*[-*]\s+(.*)/))) { if (list !== "ul") { close(); out += "<ul>"; list = "ul"; } out += `<li>${inline(m[1])}</li>`; }
    else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== "ol") { close(); out += "<ol>"; list = "ol"; } out += `<li>${inline(m[1])}</li>`; }
    else if (l.trim() === "") close();
    else { close(); out += `<p>${inline(l)}</p>`; }
  }
  close();
  return out;
}

function addMsg(role, text) {
  emptyEl.remove();
  const d = document.createElement("div");
  d.className = "bubble " + role;
  if (role === "user") d.textContent = text; else d.innerHTML = md(text);
  $("#messages").append(d);
  $("#messages").scrollTop = $("#messages").scrollHeight;
  return d;
}

// Backend 20 tadan ko'p xabar qabul qilmaydi: oxirgi xabarlarni yuboramiz (birinchisi user bo'lishi shart).
const MAX_HISTORY = 20;
const MAX_INPUT_CHARS = 4000;
const MAX_TOTAL_CHARS = 28000;
function historyForRequest() {
  let list = history.slice(-MAX_HISTORY);
  while (list.length && (list[0].role !== "user" ||
         list.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS)) {
    list = list.slice(1);
  }
  return list;
}

// ASK FUNCTION — barcha AI so'rovlari server backend orqali yuboriladi.
async function ask(text) {
  show("chat");
  text = String(text || "").trim().slice(0, MAX_INPUT_CHARS);
  if (busy || !text) return;
  busy = true;
  $("#send-btn").disabled = true;
  history.push({ role: "user", content: text });
  addMsg("user", text);
  const bubble = addMsg("assistant", "");
  bubble.textContent = "Javob tayyorlanmoqda...";
  let answer = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: historyForRequest(), mode })
    });

    if (!res.ok || !res.body) {
      let detail = "";
      try {
        const data = await res.json();
        detail = data.error || "";
      } catch {}
      throw new Error(detail || `AI server xatosi (${res.status})`);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      answer += dec.decode(value, { stream: true });
      bubble.innerHTML = md(answer);
      $("#messages").scrollTop = $("#messages").scrollHeight;
    }
    answer += dec.decode();
    if (!answer.trim()) throw new Error("AI bo'sh javob qaytardi.");
    history.push({ role: "assistant", content: answer });
  } catch (err) {
    const safeMessage = err instanceof Error ? err.message : "Noma'lum xatolik";
    bubble.innerHTML = md(
      "⚠️ **AI javobini olishda xatolik yuz berdi.**\n\n" +
      safeMessage +
      "\n\nBirozdan keyin qayta urinib ko'ring. " +
      "Huquqiy normaning amaldagi tahririni [Lex.uz](https://lex.uz) orqali tekshiring."
    );
    history.pop();
  } finally {
    busy = false;
    $("#send-btn").disabled = false;
  }
}

$("#composer").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#chat-input").value.trim();
  $("#chat-input").value = "";
  ask(v);
});
$("#chat-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#composer").requestSubmit(); }
});

// INITIALIZE
renderSituations();
renderDocForm("ish_haqi");
refreshApiStatus();


function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
