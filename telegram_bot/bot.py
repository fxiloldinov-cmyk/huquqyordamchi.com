"""
Huquq Kutubxonasi — O'zbekiston Qonunchiligi va AI Yurist Telegram Boti
Muallif: Sizning loyihangiz
"""

import os
import re
import html
import logging
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup
from telegram.constants import ChatAction, ParseMode
from telegram.error import BadRequest
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters,
)

# Muhit o'zgaruvchilarini yuklash (.env fayldan)
load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)
# httpx so'rov loglarida bot tokeni URL ichida chiqmasligi uchun
logging.getLogger("httpx").setLevel(logging.WARNING)

TELEGRAM_LIMIT = 4000  # Telegram limiti 4096 belgi; zaxira bilan
MAX_QUESTION_CHARS = 4000

SYSTEM_INSTRUCTION = (
    "Siz O'zbekiston Respublikasi qonunchiligi bo'yicha ehtiyotkor AI axborot yordamchisiz. "
    "O'zbek tilida sodda va amaliy javob bering. Tekshirilmagan modda raqami, muddat, jarima "
    "yoki URLni o'ylab topmang. Rasmiy qonun matni bilan https://lex.uz orqali tekshirishni "
    "eslating. Yetarli ma'lumot bo'lmasa, aniqlashtiruvchi savol bering. "
    "Murakkab yoki yuqori xavfli holatda malakali yuristga murojaat qilishni tavsiya qiling. "
    "Javob 3000 belgidan oshmasin."
)

VERIFY_NOTE = "\n\n_⚠️ Umumiy ma'lumot. Modda, muddat va raqamlarni lex.uz da tekshiring._"

_gemini_client = None


def get_gemini_client():
    """Gemini klientini bir marta yaratib, qayta ishlatadi."""
    global _gemini_client
    if _gemini_client is None:
        from google import genai
        _gemini_client = genai.Client(api_key=GEMINI_KEY)
    return _gemini_client


def markdown_to_telegram_html(text: str) -> str:
    """AI javobidagi oddiy Markdownni Telegram HTML formatiga xavfsiz o'giradi."""
    text = html.escape(text, quote=False)
    # [matn](https://...) havolalar
    text = re.sub(
        r"\[([^\]]+)\]\((https?://[^\s)]+)\)",
        lambda m: f'<a href="{m.group(2).replace(chr(34), "%22")}">{m.group(1)}</a>',
        text,
    )
    # Sarlavhalar -> qalin qator
    text = re.sub(r"^#{1,6}\s+(.+)$", r"<b>\1</b>", text, flags=re.M)
    # **qalin** va __qalin__
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text, flags=re.S)
    text = re.sub(r"__(.+?)__", r"<b>\1</b>", text, flags=re.S)
    # Ro'yxat belgilari: "* " yoki "- " -> "• "
    text = re.sub(r"^(\s*)[*-]\s+", r"\1• ", text, flags=re.M)
    # *kursiv*
    text = re.sub(r"(?<![*\w])\*(?!\s)([^*\n]+?)\*(?!\w)", r"<i>\1</i>", text)
    # `kod`
    text = re.sub(r"`([^`\n]+)`", r"<code>\1</code>", text)
    return text


def split_message(text: str, limit: int = TELEGRAM_LIMIT) -> list[str]:
    """Uzun matnni paragraf/qator chegarasida Telegram limitiga mos bo'laklarga ajratadi."""
    parts = []
    while len(text) > limit:
        cut = text.rfind("\n\n", 0, limit)
        if cut < limit // 2:
            cut = text.rfind("\n", 0, limit)
        if cut < limit // 2:
            cut = text.rfind(" ", 0, limit)
        if cut <= 0:
            cut = limit
        parts.append(text[:cut].rstrip())
        text = text[cut:].lstrip()
    if text:
        parts.append(text)
    return parts


async def send_ai_answer(update: Update, answer: str):
    """Javobni HTML bilan yuboradi; formatlash xatosi bo'lsa oddiy matn bilan qayta yuboradi."""
    for chunk in split_message(answer):
        try:
            await update.message.reply_text(
                markdown_to_telegram_html(chunk),
                parse_mode=ParseMode.HTML,
                disable_web_page_preview=True,
            )
        except BadRequest as e:
            logger.warning("HTML formatlash xatosi, oddiy matnda yuborilmoqda: %s", e)
            await update.message.reply_text(chunk, disable_web_page_preview=True)

# HAYOTIY VAZIYATLAR BAZASI
SITUATIONS = {
  "ish": {
    "title": "💼 Ishdan noqonuniy bo'shatish",
    "text": (
      "💼 *ISHDAN NOQONUNIY BO'SHATISH*\n\n"
      "Ish beruvchi xodimni faqat Mehnat kodeksida ko'rsatilgan asoslar bo'yicha bo'shata oladi.\n\n"
      "📌 *Qadam-baqadam yo'l-yo'riq:*\n"
      "1️⃣ *Buyruq nusxasini oling:* Ishdan bo'shatish buyrug'i va moddasini yozma talab qiling.\n"
      "2️⃣ *Hisob-kitobni tekshiring:* Oxirgi ish kuni maosh va foydalanilmagan ta'til uchun kompensatsiya to'liq berilishi shart.\n"
      "3️⃣ *Mehnat inspeksiyasiga murojaat:* Davlat mehnat inspeksiyasiga shikoyat qiling (ishonch telefoni: +998 71 200-06-00).\n"
      "4️⃣ *Sudga da'vo bering:* Ishga tiklash bo'yicha fuqarolik sudiga buyruq nusxasi berilgan kundan 1 oy ichida murojaat qiling. Xodim sud xarajatlarini to'lamaydi.\n\n"
      "📖 *Asos:* Mehnat kodeksi 162-modda (ish beruvchi tashabbusi bilan bekor qilish), 172-modda (hisob-kitob), 174-modda (qonunga xilof bekor qilish oqibatlari)."
    )
  },
  "ish_haqi": {
    "title": "💵 Ish haqi berilmayapti",
    "text": (
      "💵 *ISH HAQI VA TA'TIL PULI KECHIKKANDA*\n\n"
      "Mehnat kodeksining 253-moddasi ish haqini to'lash muddatlarini belgilaydi.\n\n"
      "📌 *Sizning huquqlaringiz:*\n"
      "• Ish haqini kechiktirganlik uchun ish beruvchi moddiy javobgar bo'ladi (MK 334-modda).\n"
      "• Hisoblangan, lekin to'lanmagan ish haqi bo'yicha sudga 'sud buyrug'i' berish haqida ariza berish mumkin — bu odatda oddiy da'vodan tezroq."
    )
  },
  "oila": {
    "title": "👨‍👩‍👧 Ajrashish va aliment",
    "text": (
      "👨‍👩‍👧 *AJRASHISH VA ALIMENT MIQDORI*\n\n"
      "📌 *Aliment miqdori (Oila kodeksi 99-modda; majburiyat — 96-modda):*\n"
      "• 1 nafar bola uchun — daromadning 1/4 qismi;\n"
      "• 2 nafar bola uchun — 1/3 qismi;\n"
      "• 3 va undan ortiq bola uchun — 1/2 qismi.\n"
      "• Bir bola uchun eng kami — eng kam ish haqining 26,5% (2026-yil 1-sentabrdan 360 400 so'm).\n\n"
      "📌 *Qayerga boriladi?*\n"
      "Bolalar bor bo'lsa yoki mulkiy nizo bo'lsa — Fuqarolik ishlari bo'yicha sudga ariza beriladi. Aliment ajrashishdan oldin ham darhol undirilishi mumkin."
    )
  },
  "jarima": {
    "title": "🚔 Radar va YHXBB jarimalari",
    "text": (
      "🚔 *YHXBB JARIMALARIGA SHIKOYAT*\n\n"
      "📌 *Muhim qoidalar:*\n"
      "• Ma'muriy jarima qarori ustidan shikoyat muddati — 10 kun (2024-yildan).\n"
      "• Qoidabuzarlik haqiqatda bo'lsa: 15 kun ichida jarimaning 50%, 30 kun ichida 70% to'lansa, qolganidan ozod qilinadi (MJtK 332-1-modda). Shikoyat qilinsa, chegirma qo'llanmaydi.\n"
      "• Mashinani boshqa shaxs boshqargan yoki kamera xato qilgan bo'lsa, dalillar bilan shikoyat qiling."
    )
  },
  "meros": {
    "title": "📜 Meros va vasiyat",
    "text": (
      "📜 *MEROSNI QABUL QILISH TARTIBI*\n\n"
      "📌 *Qat'iy muddat:* Meros ochilgan (vafot etgan) kundan e'tiboran 6 oy ichida notariusga ariza berish shart!\n"
      "Meros huquqi guvohnomasi odatda 6 oy o'tgach beriladi. Muddat o'tib ketsa, uni sud orqali tiklashga to'g'ri keladi.\n\n"
      "📌 *Navbat:* 1-navbatda — farzandlar, turmush o'rtoq va ota-ona teng ulushda meros oladilar (FK 1136-modda)."
    )
  },
  "istemol": {
    "title": "🛒 Sifatsiz tovar va qaytarish",
    "text": (
      "🛒 *ISTE'MOLCHILAR HUQUQLARI*\n\n"
      "📌 *Asosiy huquqlar:*\n"
      "• Maqbul sifatli nooziq-ovqat tovarini 10 kun ichida almashtirish, bir xili bo'lmasa pulni qaytarish mumkin (qonunning 18-moddasi; tovar ishlatilmagan, qadog'i saqlangan bo'lishi kerak).\n"
      "• Nuqsonli tovar uchun almashtirish, bepul ta'mirlash, narxni kamaytirish yoki pulni qaytarishni talab qilish mumkin (13-modda).\n"
      "• Xaridni shu sotuvchidan qilinganini isbotlashingiz kerak (chek, bank to'lovi).\n"
      "📞 Raqobat qo'mitasi: 1159."
    )
  },
  "uy": {
    "title": "🏠 Uy ijarasi va shartnoma",
    "text": (
      "🏠 *TURAR JOY IJARASI*\n\n"
      "• Jismoniy shaxslar o'rtasidagi ijara shartnomasi ijara.soliq.uz orqali ro'yxatga olinishi kerak (PQ-3741).\n"
      "• Yozma shartnoma bo'lsa, uy egasi ijarachini muddatidan oldin asossiz chiqarib yubora olmaydi.\n"
      "• Uyga kirishda jihozlar va kamchiliklar dalolatnoma (akt) qilinishi depozitni to'liq qaytarib olishga yordam beradi."
    )
  },
  "kredit": {
    "title": "💳 Bank kreditlari va garov",
    "text": (
      "💳 *BANK KREDITLARI VA QARZDORLIK*\n\n"
      "• Moliyaviy qiyinchilik bo'lganda, bankka rasmiy ariza berib grafikni uzaytirishni (kredit ta'tili) so'rang.\n"
      "• Sud kredit qarzini undirish haqida qaror chiqargach, undirilgan summaga foiz va neustoyka hisoblanmaydi (O'RQ-914, 2024).\n"
      "• Garovdagi yagona uy-joy faqat sudning qonuniy qarori asosida undirilishi mumkin."
    )
  }
}

# KODEKSLAR BAZASI
# (nomi, tavsif, lex.uz hujjat ID) — ID'lar lex.uz da tekshirilgan (2026-10-29)
CODES = [
  ("Konstitutsiya", "Davlatning bosh qonuni", "6445145"),
  ("Mehnat kodeksi", "Ishga qabul, maosh, bo'shatish", "6257288"),
  ("Oila kodeksi", "Nikoh, ajrashish, aliment", "104720"),
  ("Fuqarolik kodeksi (1-qism)", "Mulk, majburiyatlar, shartnomalar", "111181"),
  ("Fuqarolik kodeksi (2-qism)", "Ijara, kredit, meros", "180552"),
  ("Ma'muriy javobgarlik kodeksi", "Jarimalar va qoidabuzarliklar", "97664"),
  ("Jinoyat kodeksi", "Jinoiy javobgarlik va jazolar", "111453"),
  ("Soliq kodeksi", "Soliqlar va imtiyozlar", "4674902"),
  ("Uy-joy kodeksi", "Ko'chmas mulk va uy-joy huquqi", "106134")
]

# ASOSIY MENYU TUGMALARI
def main_menu_keyboard():
    return ReplyKeyboardMarkup(
        [
            ["💼 Hayotiy vaziyatlar", "📜 Kodekslar"],
            ["📝 Hujjat shablonlari", "🤖 AI Yuristga savol berish"],
            ["ℹ️ Bot haqida va yordam"]
        ],
        resize_keyboard=True
    )

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.effective_user.first_name or "Foydalanuvchi"
    text = (
        f"Assalomu alaykum, {user_name}! 👋\n\n"
        "Men — *«Huquq Kutubxonasi»* AI huquqiy axborot yordamchisiman.\n\n"
        "🏛 *Sizga qanday yordam bera olaman?*\n"
        "• Hayotiy muammolar (ish, jarima, aliment, meros) bo'yicha qadam-baqadam qo'llanma beraman.\n"
        "• O'zbekiston qonunlari va kodekslarini sodda tushuntiraman.\n"
        "• Ariza va shartnoma namunalari haqida ma'lumot beraman.\n"
        "• Savollaringizga AI (sun'iy intellekt) orqali umumiy ma'lumot beraman.\n\n"
        "Quyidagi bo'limlardan birini tanlang:"
    )
    await update.message.reply_text(text, parse_mode="Markdown", reply_markup=main_menu_keyboard())

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "ℹ️ *BOTDAN FOYDALANISH:* \n\n"
        "1. Tugmalar orqali eng ko'p uchraydigan hayotiy vaziyatlar bo'yicha tayyor javoblarni oling.\n"
        "2. Istalgan huquqiy savolingizni to'g'ridan-to'g'ri xabar sifatida yozing — AI yordamchi sizga javob qaytaradi!\n\n"
        "⚠️ *Muhim eslatma:* AI javoblari ma'lumot xarakteriga ega va rasmiy advokatlik maslahati o'rnini bosmaydi. Qonunlarning so'nggi tahriri bilan [lex.uz](https://lex.uz) saytida tanishishingiz mumkin."
    )
    await update.message.reply_text(text, parse_mode="Markdown", disable_web_page_preview=True)

# VAZIYATLARNI CHIQARISH
async def show_situations(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = []
    keys = list(SITUATIONS.keys())
    for i in range(0, len(keys), 2):
        row = [InlineKeyboardButton(SITUATIONS[keys[i]]["title"], callback_data=f"sit_{keys[i]}")]
        if i + 1 < len(keys):
            row.append(InlineKeyboardButton(SITUATIONS[keys[i+1]]["title"], callback_data=f"sit_{keys[i+1]}"))
        keyboard.append(row)

    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "📌 *Quyidagi hayotiy vaziyatlardan birini tanlang:*",
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

# KODEKSLARNI CHIQARISH
async def show_codes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = "📜 *O'ZBEKISTON RESPUBLIKASI ASOSIY KODEKSLARI:*\n\n"
    for title, desc, doc_id in CODES:
        link = f"https://lex.uz/docs/{doc_id}"
        text += f"🔹 *{title}* — {desc}\n[Rasmiy matnini o'qish (lex.uz)]({link})\n\n"
    
    await update.message.reply_text(text, parse_mode="Markdown", disable_web_page_preview=True)

# HUJJATLAR SHABLONLARI
async def show_docs(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "📝 *TAYYOR HUQUQIY HUJJATLAR VA ARIZALAR:*\n\n"
        "Saytimizda quyidagi namunalarni onlayn to'ldirib, chop etish yoki yuklab olish mumkin (rasmiy andoza emas):\n"
        "1. Ish haqini undirish to'g'risida ariza\n"
        "2. Sifatsiz tovar uchun da'vo xati (pretenziya)\n"
        "3. Turar joy ijara shartnomasi\n"
        "4. Aliment undirish to'g'risida sud buyrug'i arizasi\n"
        "5. O'z xohishi bilan bo'shash arizasi\n\n"
        "🌐 To'liq generator veb-saytda mavjud!"
    )
    await update.message.reply_text(text, parse_mode="Markdown")

# CALLBACK HANDLER (Tugmalar bosilganda)
async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data.startswith("sit_"):
        key = query.data.replace("sit_", "")
        data = SITUATIONS.get(key)
        if data:
            await query.message.reply_text(data["text"] + VERIFY_NOTE, parse_mode="Markdown")

# AI BILAN SAVOL-JAVOB (GEMINI INTEGRATSIYASI)
async def handle_user_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return
    user_text = update.message.text.strip()

    if user_text == "💼 Hayotiy vaziyatlar":
        await show_situations(update, context)
        return
    elif user_text == "📜 Kodekslar":
        await show_codes(update, context)
        return
    elif user_text == "📝 Hujjat shablonlari":
        await show_docs(update, context)
        return
    elif user_text == "🤖 AI Yuristga savol berish":
        await update.message.reply_text("Savolingizni yozing, masalan: *«Meni dam olish kuni ishlatishdi, qo'shimcha haq to'lanadimi?»*", parse_mode="Markdown")
        return
    elif user_text == "ℹ️ Bot haqida va yordam":
        await help_command(update, context)
        return

    # Foydalanuvchi huquqiy savol yozsa:
    if len(user_text) > MAX_QUESTION_CHARS:
        await update.message.reply_text(
            f"Savol juda uzun. Iltimos, {MAX_QUESTION_CHARS} belgidan qisqaroq yozing."
        )
        return

    if not GEMINI_KEY:
        await update.message.reply_text(
            "⚠️ AI xizmati hozir sozlanmagan. Bu savolga umumiy yoki taxminiy huquqiy javob bermayman.\n\n"
            "Qonunlarning amaldagi tahririni https://lex.uz orqali tekshiring.",
            disable_web_page_preview=True,
        )
        return

    wait_msg = await update.message.reply_text("🔍 Savolingiz tahlil qilinmoqda, iltimos kuting...")
    await update.message.chat.send_action(ChatAction.TYPING)

    try:
        from google.genai import types
        client = get_gemini_client()
        # Asinxron chaqiruv: bitta javob kutilayotganda bot boshqa foydalanuvchilarga ham javob beradi.
        response = await client.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_text,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.2,
                max_output_tokens=1800,
            ),
        )
        answer = (response.text or "").strip() or "AI javobi bo'sh qaytdi. Iltimos, savolni boshqacha yozib ko'ring."
    except Exception as e:
        logger.error("Gemini API xatosi: %s", type(e).__name__)
        answer = (
            "⚠️ Sun'iy intellekt javob berishda texnik xatolik yuz berdi. Birozdan keyin qayta urinib ko'ring.\n\n"
            "Qonunlarning rasmiy matni: https://lex.uz"
        )

    try:
        await wait_msg.delete()
    except Exception:
        pass
    await send_ai_answer(update, answer)


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE):
    """Kutilmagan xatolarni loglaydi va foydalanuvchiga xabar beradi."""
    logger.error("Kutilmagan xatolik: %s", context.error, exc_info=context.error)
    if isinstance(update, Update) and update.effective_message:
        try:
            await update.effective_message.reply_text("⚠️ Texnik xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        except Exception:
            pass


def main():
    if not BOT_TOKEN:
        print("\n❌ XATOLIK: TELEGRAM_BOT_TOKEN topilmadi!")
        print("Iltimos, .env faylini oching va @BotFather dan olingan tokenni kiriting.\n")
        return

    print("🚀 «Huquq Kutubxonasi» Telegram boti ishga tushmoqda...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CallbackQueryHandler(callback_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_user_message))
    app.add_error_handler(error_handler)

    app.run_polling()

if __name__ == "__main__":
    main()
