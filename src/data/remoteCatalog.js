import Papa from 'papaparse';

// رابط الشيت بعد "Publish to web" كـ CSV (خطوات الإعداد الكاملة في
// README.md تحت قسم "ربط بيانات المنتجات بجوجل شيت"). الرابط ده للقراءة
// بس — محدش يقدر يعدّل بيانات المنتجات من خلاله حتى لو عرفه، لأن التعديل
// الفعلي بيحصل جوه جوجل شيت نفسه وبيحتاج تسجيل دخول بحساب له صلاحية تعديل
// على الشيت. الرابط ده منفصل تمامًا عن أي عملية كتابة.
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUyLFi5RjP1h9UffnE93J4au-k0uq58CESwyJ6IjZ-6yGBbkPA4LljcqY9KdXv1xVJDyo7IVVFtdrR/pub?output=csv';

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
  if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith('PASTE_')) {
    return new Map();
  }

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
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
    return overridesById;
  } catch (err) {
    console.warn(
      'تعذّر تحميل بيانات المنتجات من جوجل شيت، هيتم استخدام النسخة المحلية:',
      err,
    );
    return new Map();
  }
}
