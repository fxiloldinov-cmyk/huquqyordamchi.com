// =====================================================================
// AQLLI QIDIRUV va KAZUS USTAXONASI
// app.js dan keyin yuklanadi ($, md, escapeHtml, norm, SITUATIONS, CODES,
// openSituation, show, lexUrl global funksiyalaridan foydalanadi).
// =====================================================================

// ---- Tekshirilgan moddalar indeksi ------------------------------------------
// Har bir modda raqami va nomi lex.uz dagi rasmiy mundarija bo'yicha tekshirilgan (2026-10-29).
// "approx: true" — modda raqami tasdiqlangan, nomi qisqartirib berilgan.
// kw — oddiy tildagi kalit so'zlar (qidiruv uchun).
const LAW_DOCS = {
  mk:   { name: "Mehnat kodeksi", id: "6257288" },
  ok:   { name: "Oila kodeksi", id: "104720" },
  fk2:  { name: "Fuqarolik kodeksi (2-qism)", id: "180552" },
  jk:   { name: "Jinoyat kodeksi", id: "111453" },
  mjtk: { name: "Ma'muriy javobgarlik to'g'risidagi kodeks", id: "97664" },
  ist:  { name: "Iste'molchilarning huquqlarini himoya qilish to'g'risidagi Qonun", id: "-4704" },
};

const ARTICLE_INDEX = [
  ["mk", "9", "Ushbu Kodeksda nazarda tutilgan muddatlarni hisoblash", "muddat hisoblash kun oy"],
  ["mk", "21", "Xodimning huquqlari", "xodim huquq ishchi"],
  ["mk", "22", "Xodimning majburiyatlari", "xodim majburiyat ishchi"],
  ["mk", "24", "Ish beruvchining huquqlari", "ish beruvchi rahbar direktor huquq"],
  ["mk", "25", "Ish beruvchining majburiyatlari", "ish beruvchi rahbar direktor majburiyat"],
  ["mk", "94", "Ishga joylashish huquqi", "ishga kirish joylashish ish topish"],
  ["mk", "98", "Xodimlarni ommaviy ravishda ishdan bo'shatish chog'idagi kafolatlar", "ommaviy bo'shatish qisqartirish shtat"],
  ["mk", "161", "Mehnat shartnomasini xodimning tashabbusiga ko'ra bekor qilish", "o'z xohishi bilan bo'shash ariza ketish ishdan ketmoqchi"],
  ["mk", "162", "Mehnat shartnomasini ish beruvchining tashabbusiga ko'ra bekor qilish", "ishdan bo'shatish haydash bo'shatdi bo'shatmoqchi qisqartirish"],
  ["mk", "172", "Mehnat shartnomasi bekor qilinganda xodim bilan hisob-kitob qilish", "hisob-kitob oxirgi maosh kompensatsiya ta'til puli bo'shaganda"],
  ["mk", "174", "Mehnat shartnomasini qonunga xilof ravishda bekor qilishning huquqiy oqibatlari", "noqonuniy bo'shatish ishga tiklash majburiy progul sud"],
  ["mk", "253", "Ish haqini to'lash muddatlari", "maosh ish haqi oylik to'lanmayapti kechikish berilmayapti"],
  ["mk", "254", "Mehnat shartnomasi bekor qilinganda hisob-kitob qilish muddatlari", "hisob-kitob muddati oxirgi kun maosh bo'shaganda"],
  ["mk", "334", "Ish haqi va boshqa to'lovlarni kechiktirganlik uchun ish beruvchining moddiy javobgarligi", "maosh kechikish kompensatsiya foiz javobgarlik berilmayapti", true],
  ["ok", "96", "Ota-onaning voyaga yetmagan bolalariga ta'minot berish majburiyati", "aliment bola ta'minot ota ona ajrashish"],
  ["ok", "98", "Ota-onaning voyaga yetmagan bolalariga aliment to'lash tartibi", "aliment to'lash tartibi"],
  ["ok", "99", "Ota-onaning voyaga yetmagan bolalariga to'laydigan aliment miqdori", "aliment miqdori qancha chorak foiz bola"],
  ["ok", "102", "Ota-onadan bolalarga undiriladigan aliment miqdorini aniqlash tartibi", "aliment qat'iy summa miqdor aniqlash"],
  ["ok", "103", "Bolalarning ta'minoti uchun qilinadigan qo'shimcha xarajatlar", "davolanish qo'shimcha xarajat bola kasal"],
  ["ok", "104", "Aliment undirishda hisobga olinadigan daromadlar", "daromad aliment hisob"],
  ["ok", "105", "Aliment miqdorini kamaytirish", "aliment kamaytirish"],
  ["ok", "112", "Nizo sudda hal etilgunga qadar aliment undirish", "aliment sud jarayoni vaqtincha"],
  ["ok", "114", "Aliment undirish to'g'risidagi sud qarorini ijro etish", "aliment ijro mib to'lamayapti"],
  ["ok", "116", "Aliment to'lashdan bosh tortganlik uchun javobgarlik", "aliment to'lamayapti bosh tortish qarz javobgarlik"],
  ["fk2", "600", "Uy-joyni ijaraga berish shartnomasi", "ijara kvartira uy ijarachi uy egasi"],
  ["fk2", "616", "Uy-joyni ijaraga berish shartnomasini bekor qilishning oqibatlari", "ijara bekor chiqarib yuborish depozit ko'chirish"],
  ["fk2", "1112", "Vorislik to'g'risidagi umumiy qoidalar", "meros vorislik vafot"],
  ["fk2", "1136", "Qonun bo'yicha birinchi navbatdagi vorislar", "meros birinchi navbat farzand turmush o'rtoq ota ona aka uka"],
  ["fk2", "1145", "Merosni egallash (umumiy qoidalar)", "merosni qabul qilish egallash notarius olti oy", true],
  ["fk2", "1146", "Meros huquqi to'g'risidagi guvohnoma", "meros guvohnoma notarius", true],
  ["jk", "168", "Firibgarlik", "aldash firibgarlik pul aldab olish karta"],
  ["jk", "169", "O'g'rilik", "o'g'irlik o'g'irlash yashirin talon"],
  ["jk", "278-2", "Kompyuter axborotidan qonunga xilof (ruxsatsiz) foydalanish", "kiber karta xakerlik akkaunt buzish"],
  ["jk", "278-7", "Telekommunikatsiya tarmog'idan qonunga xilof (ruxsatsiz) foydalanish", "telefon raqam tarmoq kiber"],
  ["mjtk", "17-1", "Maxsus avtomatlashtirilgan foto va video qayd etish vositalari qayd etgan yo'l harakati qoidalari buzilishi uchun javobgarlik", "radar kamera jarima tezlik yhxbb yo'l harakati", true],
  ["mjtk", "332-1", "Jarimani imtiyozli (50% yoki 70%) to'lash", "jarima chegirma 50 foiz 70 foiz to'lash", true],
  ["ist", "4", "Iste'molchilar huquqlarini sud orqali himoya qilish", "iste'molchi sud himoya", true],
  ["ist", "13", "Iste'molchiga nuqsonli tovar sotilganda uning huquqlari", "sifatsiz brak buzilgan tovar pulni qaytarish telefon do'kon"],
  ["ist", "14", "Nuqsonli tovarni almashtirib berish tartibi", "almashtirish 7 kun 20 kun sifatsiz"],
  ["ist", "15", "Tovar nuqsonlarini bepul bartaraf etish tartibi", "ta'mirlash kafolat bepul tuzatish"],
  ["ist", "18", "Iste'molchining maqbul sifatli tovarni almashtirib olish huquqi", "qaytarish almashtirish 10 kun yoqmadi o'lcham"],
  ["ist", "19", "Bajarilgan ish yoki xizmatdagi nuqsonlar", "xizmat ish sifatsiz usta", true],
].map(([doc, art, title, kw, approx]) => ({ doc, art, title, kw, approx: !!approx }));

// Oddiy so'zlarni huquqiy atamalarga bog'lovchi sinonimlar
const SYNONYMS = {
  maosh: "ish haqi", oylik: "ish haqi", zarplata: "ish haqi",
  haydadi: "bo'shatish", haydash: "bo'shatish", ishdan: "bo'shatish",
  ajrashish: "aliment", ajrashdik: "aliment", bolam: "bola", bolalarim: "bola",
  kvartira: "ijara", ijarachi: "ijara", uy: "uy-joy",
  vafot: "meros", otam: "meros", onam: "meros",
  telefon: "tovar", "do'kon": "tovar", sotuvchi: "tovar", buzildi: "nuqsonli",
  radar: "jarima", kamera: "jarima", gai: "jarima",
  aldadi: "firibgarlik", aldab: "firibgarlik", karta: "kiber",
};

function stems(text) {
  return norm(text)
    .split(/[^a-zа-яёўқғҳ'0-9-]+/i)
    .filter((w) => w.length >= 3)
    .map((w) => (w.length > 6 ? w.slice(0, 5) : w));
}

function expandQuery(text) {
  const words = norm(text).split(/[^a-z'0-9-]+/);
  const extra = words.map((w) => SYNONYMS[w]).filter(Boolean).join(" ");
  return `${text} ${extra}`;
}

function localArticleSearch(query, limit = 6) {
  const qs = [...new Set(stems(expandQuery(query)))];
  if (!qs.length) return [];
  return ARTICLE_INDEX
    .map((a) => {
      const hay = norm(`${a.title} ${a.kw} ${LAW_DOCS[a.doc].name}`);
      const score = qs.reduce((n, s) => n + (hay.includes(s) ? 1 : 0), 0);
      return { ...a, score };
    })
    .filter((a) => a.score >= 2 || (qs.length <= 2 && a.score >= 1))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function localSituationSearch(query, limit = 3) {
  const qs = [...new Set(stems(expandQuery(query)))];
  return SITUATIONS
    .map((s) => ({ s, score: qs.reduce((n, t) => n + (norm(`${s.title} ${s.desc} ${s.tag} ${s.intro}`).includes(t) ? 1 : 0), 0) }))
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}

// AI natijasi tekshirilgan indeksda bormi?
function findVerified(hujjat, modda) {
  if (!modda) return null;
  const h = norm(hujjat);
  return ARTICLE_INDEX.find((a) => a.art === modda && h.includes(norm(LAW_DOCS[a.doc].name).split(" ")[0]));
}

const docUrl = (docKey) => `https://lex.uz/docs/${LAW_DOCS[docKey].id}`;

// ---- Aqlli qidiruv UI -------------------------------------------------------
const smartForm = $("#smart-search");
const smartQuery = $("#smart-query");
const smartResults = $("#smart-results");
const smartBtn = $("#smart-btn");
let smartBusy = false;

smartQuery?.addEventListener("input", () => {
  $("#smart-count").textContent = `${smartQuery.value.length} / 2000`;
});

$("#smart-examples")?.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  smartQuery.value = e.target.textContent;
  smartQuery.dispatchEvent(new Event("input"));
  smartForm.requestSubmit();
});

function renderLocalBlock(query, exclude = new Set()) {
  const arts = localArticleSearch(query).filter((a) => !exclude.has(`${a.doc}:${a.art}`));
  const sits = localSituationSearch(query);
  let html = "";
  if (arts.length) {
    html += `<div class="smart-block">
      <h4>${exclude.size ? "Bog'liq boshqa moddalar (sayt bazasidan)" : "Tekshirilgan moddalar (sayt bazasidan)"}</h4>
      <ul class="article-list">${arts.map((a) => `
        <li class="article-item">
          <div class="article-top">
            <span class="article-badge">${escapeHtml(a.art)}-modda</span>
            <span class="article-doc">${escapeHtml(LAW_DOCS[a.doc].name)}</span>
            <span class="chip ok">✓ lex.uz bilan tekshirilgan</span>
          </div>
          <div class="article-title">${escapeHtml(a.title)}</div>
          <a class="article-link" href="${docUrl(a.doc)}" target="_blank" rel="noopener">Hujjatni lex.uz da ochish ↗</a>
        </li>`).join("")}</ul>
    </div>`;
  }
  if (sits.length) {
    html += `<div class="smart-block">
      <h4>Saytdagi qo'llanmalar</h4>
      <div class="smart-sits">${sits.map((s) => `<button type="button" class="smart-sit" data-open-sit="${escapeHtml(s.id)}">${escapeHtml(s.title)} →</button>`).join("")}</div>
    </div>`;
  }
  return html;
}

function confidenceChip(level) {
  if (level === "yuqori") return `<span class="chip ok">Ishonch: yuqori</span>`;
  if (level === "o'rta") return `<span class="chip mid">Ishonch: o'rta</span>`;
  return `<span class="chip low">Ishonch: past — tekshiring</span>`;
}

function renderAiBlock(data) {
  const items = data.natijalar.map((r) => {
    const verified = findVerified(r.hujjat, r.modda);
    return `<li class="article-item">
      <div class="article-top">
        ${r.modda ? `<span class="article-badge">${escapeHtml(r.modda)}-modda</span>` : ""}
        <span class="article-doc">${escapeHtml(r.hujjat)}</span>
        ${verified ? `<span class="chip ok">✓ Sayt bazasida tasdiqlangan</span>` : confidenceChip(r.ishonch)}
      </div>
      ${r.moddaNomi ? `<div class="article-title">${escapeHtml(verified ? verified.title : r.moddaNomi)}</div>` : ""}
      ${r.nimaUchun ? `<p class="article-why">${escapeHtml(r.nimaUchun)}</p>` : ""}
      <a class="article-link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${r.hujjatTasdiqlangan ? "Hujjatni lex.uz da ochish ↗" : "lex.uz da qidirish ↗"}</a>
    </li>`;
  }).join("");
  const sources = data.manbalar?.length
    ? `<details class="smart-sources"><summary>AI foydalangan manbalar (${data.manbalar.length})</summary><ul>${data.manbalar.map((s) =>
        `<li><a href="${escapeHtml(s.uri)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a></li>`).join("")}</ul></details>`
    : "";
  return `<div class="smart-block ai">
    <h4>AI tahlili ${data.lexManbaBor ? `<span class="chip ok">lex.uz manbalariga tayangan</span>` : `<span class="chip mid">Moddalarni lex.uz da tekshiring</span>`}</h4>
    ${data.xulosa ? `<p class="smart-summary">${escapeHtml(data.xulosa)}</p>` : ""}
    ${items ? `<ul class="article-list">${items}</ul>` : `<p class="smart-muted">AI aniq modda topmadi. Vaziyatni batafsilroq yozib ko'ring.</p>`}
    ${data.aniqlashtirish ? `<p class="smart-clarify"><b>Aniqroq javob uchun:</b> ${escapeHtml(data.aniqlashtirish)}</p>` : ""}
    ${sources}
  </div>`;
}

smartForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = smartQuery.value.trim().slice(0, 2000);
  if (smartBusy || query.length < 10) {
    if (query.length < 10) {
      smartResults.hidden = false;
      smartResults.innerHTML = `<p class="smart-muted">Vaziyatni kamida bitta to'liq gap bilan yozing.</p>`;
    }
    return;
  }
  smartBusy = true;
  smartBtn.disabled = true;
  smartBtn.textContent = "Qidirilmoqda...";
  const local = renderLocalBlock(query);
  smartResults.hidden = false;
  smartResults.innerHTML = local + `<div class="smart-block ai loading"><h4>AI tahlili</h4><p class="smart-muted">Qonunchilik bazasidan tegishli moddalar qidirilmoqda...</p></div>`;

  let aiHtml;
  const shown = new Set();
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok || !data) throw new Error(data?.error || `Server xatosi (${res.status})`);
    aiHtml = renderAiBlock(data);
    data.natijalar.forEach((r) => { const v = findVerified(r.hujjat, r.modda); if (v) shown.add(`${v.doc}:${v.art}`); });
  } catch (err) {
    aiHtml = `<div class="smart-block ai"><h4>AI tahlili</h4><p class="smart-muted">⚠️ ${escapeHtml(err.message || "AI qidiruv ishlamadi.")}</p>
      ${local ? "" : `<p class="smart-muted">Sayt bazasida ham mos modda topilmadi. Vaziyatni boshqa so'zlar bilan yozib ko'ring.</p>`}</div>`;
  } finally {
    smartBusy = false;
    smartBtn.disabled = false;
    smartBtn.textContent = "Qonun va moddalarni topish";
  }
  smartResults.innerHTML = aiHtml + renderLocalBlock(query, shown)
    + `<p class="smart-disclaimer">Natijalar umumiy ma'lumot. Amaldagi tahrirni lex.uz da tekshiring; muhim ishda yuristga murojaat qiling.</p>`;
});

smartResults?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-open-sit]");
  if (b) openSituation(b.dataset.openSit);
});

// ---- Kazus ustaxonasi --------------------------------------------------------
const kazusForm = $("#kazus-form");
const kazusText = $("#kazus-text");
const kazusOut = $("#kazus-output");
const kazusBtn = $("#kazus-btn");
const kazusCopy = $("#kazus-copy");
const namunaSelect = $("#kazus-namuna");
const formatArea = $("#kazus-format");
let kazusBusy = false;
let kazusAnswer = "";
let namunalar = [];

kazusText?.addEventListener("input", () => {
  $("#kazus-count").textContent = `${kazusText.value.length} / 6000`;
});

function currentMode() {
  return document.querySelector('input[name="kazus-mode"]:checked')?.value || "standart";
}

function syncModeUi() {
  const mode = currentMode();
  formatArea.hidden = mode !== "ozim";
  namunaSelect.hidden = mode !== "namuna" || !namunalar.length;
  if (mode === "namuna") filterNamunaByFan();
}

function filterNamunaByFan() {
  const fan = $("#kazus-fan").value;
  const list = namunalar.filter((n) => n.fan === fan);
  const use = list.length ? list : namunalar;
  const other = !list.length;
  namunaSelect.innerHTML = use.map((n) =>
    `<option value="${escapeHtml(n.id)}">${other ? "(" + escapeHtml(n.fanNomi) + ") " : ""}${escapeHtml(n.title)}</option>`).join("");
}

// Tanlangan fan bo'yicha tasdiqlangan namuna bo'lsa, uni avtomatik tanlaymiz.
function autoPickMode() {
  const fan = $("#kazus-fan").value;
  const has = namunalar.some((n) => n.fan === fan);
  if (has) $("#mode-namuna").checked = true;
  else if (currentMode() === "namuna") $("#mode-standart").checked = true;
  syncModeUi();
}

document.querySelectorAll('input[name="kazus-mode"]').forEach((r) => r.addEventListener("change", syncModeUi));
$("#kazus-fan")?.addEventListener("change", autoPickMode);

async function loadNamunalar() {
  const status = $("#namuna-status");
  const radio = $("#mode-namuna");
  try {
    const res = await fetch("/api/kazus", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    namunalar = Array.isArray(data.namunalar) ? data.namunalar : [];
  } catch {
    namunalar = [];
  }
  if (namunalar.length) {
    const fans = [...new Set(namunalar.map((n) => n.fanNomi))].join(", ");
    status.textContent = `${namunalar.length} ta tasdiqlangan namuna (${fans})`;
    radio.disabled = false;
  } else {
    status.textContent = "Namunalar hali qo'shilmagan";
    radio.disabled = true;
  }
  autoPickMode();
}

kazusForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (kazusBusy) return;
  const kazus = kazusText.value.trim();
  const mode = currentMode();
  const format = formatArea.value.trim();
  const showError = (msg) => { kazusOut.innerHTML = `<p class="kazus-error">⚠️ ${escapeHtml(msg)}</p>`; };
  if (kazus.length < 40) return showError("Kazus shartini to'liq yozing (kamida 40 belgi).");
  if (mode === "ozim" && format.length < 20) return showError("O'zingiz xohlagan javob shaklini kiriting.");

  kazusBusy = true;
  kazusBtn.disabled = true;
  kazusBtn.textContent = "Yechilmoqda...";
  kazusCopy.disabled = true;
  kazusAnswer = "";
  kazusOut.innerHTML = `<p class="kazus-empty">Kazus tahlil qilinmoqda...</p>`;

  try {
    const res = await fetch("/api/kazus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kazus, mode, fan: $("#kazus-fan").value,
        namunaId: mode === "namuna" ? namunaSelect.value : undefined,
        format: mode === "ozim" ? format : undefined,
      }),
    });
    if (!res.ok || !res.body) {
      let detail = "";
      try { detail = (await res.json()).error || ""; } catch {}
      throw new Error(detail || `Server xatosi (${res.status})`);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      kazusAnswer += dec.decode(value, { stream: true });
      kazusOut.innerHTML = md(kazusAnswer);
    }
    kazusAnswer += dec.decode();
    if (!kazusAnswer.trim()) throw new Error("AI bo'sh javob qaytardi.");
    kazusOut.innerHTML = md(kazusAnswer);
    kazusCopy.disabled = false;
  } catch (err) {
    showError(err.message || "Yechim olinmadi. Birozdan keyin qayta urinib ko'ring.");
  } finally {
    kazusBusy = false;
    kazusBtn.disabled = false;
    kazusBtn.textContent = "Kazusni yechish";
  }
});

kazusCopy?.addEventListener("click", () => {
  navigator.clipboard.writeText(kazusAnswer).then(() => {
    kazusCopy.textContent = "✅ Nusxa olindi";
  }).catch(() => {
    kazusCopy.textContent = "⚠️ Nusxa olinmadi";
  }).finally(() => setTimeout(() => { kazusCopy.textContent = "📋 Nusxa olish"; }, 2000));
});

loadNamunalar();
