import { GOVERNORATES } from './products.js';

// رابط تطبيق الويب بتاع Google Apps Script اللي بيوصل بيانات الفورم بجوجل شيت.
// لازم تحطي هنا اللينك اللي هيظهرلك بعد عملية الـ Deploy (اتبعي التعليمات في ملف
// google-sheet-setup.md اللي جوه المشروع). من غيره الفورم هيشتغل عادي بس البيانات
// مش هتتبعت للشيت. نفس الرابط ده مستخدم في صفحة الدفع وفورم "اشتري الآن" في صفحة
// المنتج، عشان كل الطلبات تتسجل في نفس المكان.
export const GOOGLE_SHEET_WEBAPP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

export const EMPTY_SHIPPING_FORM = {
  fullName: '',
  phone: '',
  altPhone: '',
  governorate: GOVERNORATES[0],
  address: '',
  notes: '',
};

export const convertArabicNumsToEnglish = (str) =>
  str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const PHONE_REGEX =
  /^(?:(?:010|011|015)[0-9]{8}|(?:0127|0128|0120|0121|0122)[0-9]{7})$/;

export function validateShippingForm(form) {
  const newErrors = {};

  const phone = convertArabicNumsToEnglish((form.phone || '').trim());
  const altPhone = convertArabicNumsToEnglish((form.altPhone || '').trim());
  const fullName = (form.fullName || '').trim();

  if (!fullName) newErrors.fullName = 'يجب إدخال الاسم بالكامل';

  if (!phone) {
    newErrors.phone = 'يجب إدخال رقم الهاتف';
  } else if (!PHONE_REGEX.test(phone)) {
    newErrors.phone =
      '❌ من فضلك أدخلي رقم هاتف صحيح يبدأ بـ 010 - 011 - 015 - 0127 - 0128 - 0120 - 0121 - 0122 ويتكون من 11 رقم';
  }

  if (altPhone && !PHONE_REGEX.test(altPhone)) {
    newErrors.altPhone = '❌ الرقم البديل غير صحيح، تأكدي إنه مكوّن من 11 رقم';
  }

  if (!(form.address || '').trim())
    newErrors.address = 'يجب إدخال العنوان بالتفصيل';
  if (!(form.governorate || '').trim())
    newErrors.governorate = 'يجب إدخال المحافظة';

  return newErrors;
}

// بتحول أسطر الطلب (سواء من السلة أو من فورم "اشتري الآن" في صفحة منتج
// واحد) لنص واحد مقروء يترسل مع باقي بيانات الفورم لجوجل شيت.
function formatProductsLine(lines) {
  return lines
    .map((l) => {
      const piecesNote =
        l.piecesPerUnit > 1 ? ` = ${l.piecesPerUnit * l.qty} قطعة` : '';
      return `${l.name}${l.optionLabel ? ` (${l.optionLabel})` : ''} (الكمية: ${l.qty}${piecesNote} - السعر: ${l.price} ج.م)`;
    })
    .join(' | ');
}

// بتبعت بيانات الطلب لجوجل شيت (لو الرابط متظبط). مستخدمين no-cors لأن
// Google Apps Script مش بيرجّع CORS headers، فمينفعش نقرأ الرد، بس البيانات
// بتوصل وبتتسجل في الشيت عادي. lines لازم تكون مصفوفة عناصر بالشكل:
// { name, optionLabel, piecesPerUnit, qty, price }
export async function submitOrderToSheet({ form, lines, total }) {
  if (
    !GOOGLE_SHEET_WEBAPP_URL ||
    GOOGLE_SHEET_WEBAPP_URL.startsWith('PASTE_')
  ) {
    return;
  }

  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        altPhone: form.altPhone || 'لا يوجد',
        governorate: form.governorate,
        address: form.address,
        notes: form.notes || 'لا يوجد',
        products: formatProductsLine(lines),
        total,
      }),
    });
  } catch (err) {
    // حتى لو فشل الاتصال بجوجل شيت، الطلب برضه بيتسجل عندك في الموقع
    // وميتوقفش عن العميلة — بس تقدري تراجعي هنا لو حابة تتعاملي مع الخطأ بشكل تاني.
    console.error('تعذّر إرسال بيانات الطلب لجوجل شيت:', err);
  }
}
