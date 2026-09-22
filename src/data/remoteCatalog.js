import Papa from 'papaparse';

const CACHE_KEY = 'la-cucina-catalog-overrides-v1';

// بنسيب آخر نسخة معروفة من تعديلات الشيت متخزّنة محليًا في المتصفح
// (مش في الشيت نفسه)، عشان أول ما الموقع يفتح يعرض السعر الصح على طول
// من غير "ومضة" بالسعر القديم لحد ما الطلب لجوجل يرجع. بعد كده بنطلب
// من جوجل في الخلفية عادي عشان نتأكد إن مفيش تحديث أحدث.
function loadCachedOverrides() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return new Map();
    return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    return new Map();
  }
}

function saveCachedOverrides(overridesById) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(Object.fromEntries(overridesById)),
    );
  } catch {
    // لو التخزين مش متاح (وضع تصفح خاص مثلًا)، نتجاهل الخطأ بهدوء
  }
}

// بترجع فورًا آخر نسخة متخزّنة محليًا (لعرضها من غير أي تأخير)، من غير
// ما تستنى رد الشبكة.
export function getCachedCatalogOverrides() {
  return loadCachedOverrides();
}

// بدل رابط "Publish to web" (اللي بيحفظ نسخة/snapshot بتتجدد كل شوية
// دقايق من عند جوجل نفسها، وده اللي كان بيسبب "تنقّل" السعر بين القديم
// والجديد)، بنستخدم هنا endpoint بيقرا من الشيت اللايف مباشرة (gviz/tq)
// من غير أي خطوة "Publish" أو أي نسخة وسيطة مخزّنة — يعني بيرجّع قيم
// الخلايا الحالية فعليًا كل مرة، مش نسخة قديمة.
//
// خطوات الإعداد الكاملة في README.md تحت قسم "ربط بيانات المنتجات
// بجوجل شيت". الرابط ده للقراءة بس — محدش يقدر يعدّل بيانات المنتجات
// من خلاله حتى لو عرفه، لأن التعديل الفعلي بيحصل جوه جوجل شيت نفسه
// وبيحتاج تسجيل دخول بحساب له صلاحية تعديل على الشيت.
const SHEET_ID = '1-gAztJ87nmoRZyVSZK402aFFykTMnKj2GPOwVAI1-nw'; // من رابط الشيت بتاعك
const SHEET_TAB_NAME = 'Sheet1'; // اسم التاب اللي فيه البيانات

function buildSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB_NAME)}`;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/[^\d.]/g, '');
  if (cleaned === '') return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

// بتاخد صف من الشيت وبترجع بس الحقول اللي فعلاً مكتوبة فيه (سطر فاضي في
// أي عمود = "متغيّرش، سيبي القيمة المحلية زي ما هي")، عشان العميلة تقدر
// تعدّل السعر بس من غير ما تحتاج تملى كل الأعمدة تاني.
function extractOverrides(row) {
  const overrides = {};

  if (row.name && row.name.trim()) overrides.name = row.name.trim();
  if (row.category && row.category.trim())
    overrides.category = row.category.trim();

  const price = toNumberOrNull(row.price);
  if (price !== null) overrides.price = price;

  if (
    row.oldPrice !== undefined &&
    row.oldPrice !== null &&
    row.oldPrice.trim() !== ''
  ) {
    overrides.oldPrice = toNumberOrNull(row.oldPrice);
  }

  const priceOffer = toNumberOrNull(row.priceOffer);
  if (priceOffer !== null) overrides.priceOffer = priceOffer;

  if (
    row.oldPriceOffer !== undefined &&
    row.oldPriceOffer !== null &&
    row.oldPriceOffer.trim() !== ''
  ) {
    overrides.oldPriceOffer = toNumberOrNull(row.oldPriceOffer);
  }

  if (row.description && row.description.trim()) {
    // بنسمح بعلامة "|" جوه الخلية عشان تتحول لأسطر جديدة، لأن جوجل شيت
    // بيصعّب كتابة أسطر متعددة جوه خلية واحدة أحيانًا.
    overrides.description = row.description.replace(/\s*\|\s*/g, '\n');
  }

  return overrides;
}

// بيرجع Map من id → overrides، أو Map فاضية لو مفيش رابط شيت متظبط لسه أو
// حصل أي خطأ في الاتصال — الموقع في الحالة دي بيفضل شغال بالبيانات
// المحلية اللي في catalog.js من غير ما يوقف أو يبين فيه مشكلة للعميلة.
export async function fetchCatalogOverrides() {
  if (!SHEET_ID || SHEET_ID.startsWith('PASTE_')) {
    return new Map();
  }

  try {
    // باراميتر إضافي بالوقت الحالي عشان نتجنب أي تخزين مؤقت جانبي
    // (زي كاش المتصفح أو أي بروكسي بينك وبين جوجل) — الـ endpoint نفسه
    // لايف أصلًا فمش المفروض يحتاجها، لكنها إضافة أمان بسيطة.
    const url = `${buildSheetUrl()}&cb=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`تعذّر تحميل الشيت: ${res.status}`);

    const csvText = await res.text();
    const { data: rows } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const overridesById = new Map();
    for (const row of rows) {
      const id = (row.id || '').trim();
      if (!id) continue;
      overridesById.set(id, extractOverrides(row));
    }
    saveCachedOverrides(overridesById);
    return overridesById;
  } catch (err) {
    console.warn(
      'تعذّر تحميل بيانات المنتجات من جوجل شيت، هيتم استخدام النسخة المحلية:',
      err,
    );
    return new Map();
  }
}
