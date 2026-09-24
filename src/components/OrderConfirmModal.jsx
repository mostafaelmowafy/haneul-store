import React from 'react';
import { X } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import { formatPrice } from '../data/products.js';

export default function OrderConfirmModal({
  lines,
  total,
  form,
  submitting,
  onConfirm,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-brand-surface p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-primaryDark">
            ملخص الطلب
          </h2>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex items-center gap-3">
              <ProductImage
                src={line.image}
                alt={line.name}
                className="h-14 w-14 shrink-0 rounded-lg bg-white"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-text">
                  {line.name}
                </p>
                {line.optionLabel && (
                  <p className="text-xs font-medium text-brand-primary">
                    {line.optionLabel}
                  </p>
                )}
                <p className="text-xs text-brand-muted">الكمية: {line.qty}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-brand-primaryDark">
                {formatPrice(line.price * line.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="my-4 border-t border-brand-border" />

        <div className="mb-4 flex justify-between font-bold text-brand-primaryDark">
          <span>الإجمالي</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="mb-5 space-y-1 rounded-xl bg-brand-light p-3 text-sm text-brand-text">
          <p>
            <span className="text-brand-muted">الاسم: </span>
            {form.fullName}
          </p>
          <p dir="ltr" className="text-right">
            <span className="text-brand-muted">الهاتف: </span>
            {form.phone}
          </p>
          <p>
            <span className="text-brand-muted">المحافظة: </span>
            {form.governorate}
          </p>
          <p>
            <span className="text-brand-muted">العنوان: </span>
            {form.address}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="w-full rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full py-2 text-sm font-medium text-brand-muted hover:text-brand-text"
          >
            رجوع وتعديل البيانات
          </button>
        </div>
      </div>
    </div>
  );
}
