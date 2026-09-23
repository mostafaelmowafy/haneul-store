import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice, GOVERNORATES } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

// رابط تطبيق الويب بتاع Google Apps Script اللي بيوصل بيانات الفورم بجوجل شيت.
// لازم تحطي هنا اللينك اللي هيظهرلك بعد عملية الـ Deploy (اتبعي التعليمات في ملف
// google-sheet-setup.md اللي جوه المشروع). من غيره الفورم هيشتغل عادي بس البيانات
// مش هتتبعت للشيت.
const GOOGLE_SHEET_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwDznRJ_HBNCLxJZxRMsfACp7tA63XylR7__h1EocwAvoyldQDawOfu6O2PyduiwNx0xg/exec';

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  altPhone: '',
  governorate: GOVERNORATES[0],
  address: '',
  notes: '',
};

const convertArabicNumsToEnglish = (str) =>
  str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const PHONE_REGEX =
  /^(?:(?:010|011|015)[0-9]{8}|(?:0127|0128|0120|0121|0122)[0-9]{7})$/;

const validateForm = (form) => {
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
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { getItemById } = useCatalog();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ ...line, item: getItemById(line.id) }))
    .filter((line) => line.item)
    .map((line) => ({ ...line, unitPrice: line.unitPrice ?? line.item.price }));

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === 'phone' || key === 'altPhone')
      value = convertArabicNumsToEnglish(value);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const orderSnapshot = {
      lines: lines.map((line) => ({
        id: line.item.id,
        name: line.item.name,
        optionLabel: line.optionLabel || null,
        piecesPerUnit: line.piecesPerUnit || 1,
        image: line.item.images?.[0] || null,
        qty: line.qty,
        price: line.unitPrice,
        oldPrice: line.item.oldPrice || null,
      })),
      total,
      form,
    };

    // بعت بيانات الطلب لجوجل شيت (لو الرابط متظبط). مستخدمين no-cors لأن
    // Google Apps Script مش بيرجّع CORS headers، فمينفعش نقرأ الرد، بس البيانات
    // بتوصل وبتتسجل في الشيت عادي.
    if (
      GOOGLE_SHEET_WEBAPP_URL &&
      !GOOGLE_SHEET_WEBAPP_URL.startsWith('PASTE_')
    ) {
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
            products: lines
              .map((l) => {
                const piecesNote =
                  l.piecesPerUnit > 1
                    ? ` = ${l.piecesPerUnit * l.qty} قطعة`
                    : '';
                return `${l.item.name}${l.optionLabel ? ` (${l.optionLabel})` : ''} (الكمية: ${l.qty}${piecesNote} - السعر: ${l.unitPrice} ج.م)`;
              })
              .join(' | '),
            total,
          }),
        });
      } catch (err) {
        // حتى لو فشل الاتصال بجوجل شيت، الطلب برضه بيتسجل عندك في الموقع
        // وميتوقفش عن العميلة — بس تقدري تراجعي هنا لو حابة تتعاملي مع الخطأ بشكل تاني.
        console.error('تعذّر إرسال بيانات الطلب لجوجل شيت:', err);
      }
    }

    setSubmitting(false);
    clearCart();
    navigate('/order-success', { state: orderSnapshot });
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="mb-4 text-brand-muted">
          عربة التسوق فارغة، لا يوجد طلب لإتمامه.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-brand-primaryDark px-6 py-3 font-medium text-white hover:bg-brand-primaryDarker"
        >
          تصفحي المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <button
        onClick={() => navigate('/cart')}
        className="mb-6 flex items-center gap-1 text-sm text-brand-primary hover:underline"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع للعربة
      </button>

      <h1 className="font-display mb-8 text-2xl text-brand-primaryDark sm:text-3xl">
        إتمام الدفع
      </h1>

      <div className="grid gap-8 sm:grid-cols-5">
        {/* ملخص سريع */}
        <div className="order-2 sm:order-1 sm:col-span-2">
          <div className="sticky top-24 rounded-xl border border-brand-border bg-brand-surface p-5">
            <h2 className="mb-4 font-semibold text-brand-text">ملخص الطلب</h2>

            <div className="max-h-72 space-y-4 overflow-y-auto overflow-x-visible px-1 pt-2">
              {lines.map((line) => (
                <div
                  key={`${line.id}-${line.optionLabel ?? 'base'}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative shrink-0">
                    <ProductImage
                      src={line.item.images?.[0]}
                      alt={line.item.name}
                      className="h-16 w-16 rounded-xl bg-white"
                    />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-surface bg-brand-primaryDark text-xs font-bold leading-none text-white">
                      {line.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-snug text-brand-text">
                        {line.item.name}
                      </p>
                      {line.optionLabel && (
                        <p className="text-xs font-medium text-brand-primary">
                          {line.optionLabel}
                          {line.piecesPerUnit > 1 &&
                            ` (${line.piecesPerUnit * line.qty} قطعة)`}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-sm font-bold text-brand-primaryDark">
                        {formatPrice(line.unitPrice * line.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-brand-border" />

            <div className="flex justify-between font-bold text-brand-primaryDark">
              <span>الإجمالي</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* الفورم */}
        <div className="order-1 sm:order-2 sm:col-span-3">
          <div className="space-y-5 rounded-xl border border-brand-border bg-brand-surface p-5 sm:p-6">
            <div>
              <h2 className="mb-3 font-semibold text-brand-text">
                بيانات الشحن
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    className="input w-full"
                    placeholder="الاسم بالكامل"
                    value={form.fullName}
                    onChange={setField('fullName')}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    className="input w-full"
                    placeholder="رقم التليفون"
                    value={form.phone}
                    onChange={setField('phone')}
                    maxLength={11}
                    dir="ltr"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <input
                    className="input w-full"
                    placeholder="رقم بديل (اختياري)"
                    value={form.altPhone}
                    onChange={setField('altPhone')}
                    maxLength={11}
                    dir="ltr"
                  />
                  {errors.altPhone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.altPhone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <select
                    className="input w-full"
                    value={form.governorate}
                    onChange={setField('governorate')}
                  >
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.governorate}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <textarea
                    className="input h-24 w-full resize-none"
                    placeholder="العنوان بالتفصيل"
                    value={form.address}
                    onChange={setField('address')}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <textarea
                  className="input h-20 resize-none sm:col-span-2"
                  placeholder="ملاحظات إضافية تحبي تقوليها (اختياري)"
                  value={form.notes}
                  onChange={setField('notes')}
                />
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'جاري إرسال الطلب...'
                : `تأكيد الطلب — ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
