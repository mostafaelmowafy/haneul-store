import React from 'react';
import ProductImage from './ProductImage.jsx';

// بيظهر بس لو المنتج معاه صورتين "قبل" و"بعد" في catalog.js (الحقل
// beforeAfter). لو مش موجود، المكوّن بيرجّع null ومش بيتعرض خالص.
export default function BeforeAfter({ beforeAfter }) {
  if (!beforeAfter?.before || !beforeAfter?.after) return null;

  return (
    <div className="mt-16">
      <h2 className="font-display mb-6 text-center text-xl text-brand-primaryDark">
        قبل وبعد
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-brand-border">
          <div className="bg-brand-primaryDark px-4 py-1.5 text-center text-sm font-semibold text-white">
            قبل
          </div>
          <ProductImage
            src={beforeAfter.before}
            alt="قبل الاستخدام"
            className="aspect-square w-full bg-white"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-brand-border">
          <div className="bg-brand-primary px-4 py-1.5 text-center text-sm font-semibold text-white">
            بعد
          </div>
          <ProductImage
            src={beforeAfter.after}
            alt="بعد الاستخدام"
            className="aspect-square w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
