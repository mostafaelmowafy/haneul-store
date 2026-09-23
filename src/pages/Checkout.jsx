import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import ShippingForm from '../components/ShippingForm.jsx';
import { formatPrice } from '../data/products.js';
import {
  EMPTY_SHIPPING_FORM,
  convertArabicNumsToEnglish,
  validateShippingForm,
  submitOrderToSheet,
} from '../data/orderSubmission.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { getItemById } = useCatalog();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ ...line, item: getItemById(line.id) }))
    .filter((line) => line.item)
    .map((line) => ({ ...line, unitPrice: line.unitPrice ?? line.item.price }));

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  const [form, setForm] = useState(EMPTY_SHIPPING_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === 'phone' || key === 'altPhone')
      value = convertArabicNumsToEnglish(value);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    const newErrors = validateShippingForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const orderLines = lines.map((line) => ({
      id: line.item.id,
      name: line.item.name,
      optionLabel: line.optionLabel || null,
      piecesPerUnit: line.piecesPerUnit || 1,
      image: line.item.images?.[0] || null,
      qty: line.qty,
      price: line.unitPrice,
      oldPrice: line.item.oldPrice || null,
    }));

    await submitOrderToSheet({ form, lines: orderLines, total });

    setSubmitting(false);
    clearCart();
    navigate('/order-success', { state: { lines: orderLines, total, form } });
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
              <ShippingForm form={form} errors={errors} setField={setField} />
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
