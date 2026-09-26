import React from 'react';
import ProductImage from './ProductImage.jsx';

// بيظهر بس لو المنتج معاه صورتين "قبل" و"بعد" في catalog.js (الحقل
// beforeAfter). لو مش موجود، المكوّن بيرجّع null ومش بيتعرض خالص.
export default function BeforeAfter({ beforeAfter }) {
  console.log('BeforeAfter component rendered with beforeAfter:', beforeAfter);
  if (!beforeAfter) return null;

  return (
    <div className="mt-16">
      <h2 className="font-display mb-6 text-center text-xl text-brand-primaryDark">
        قبل وبعد الاستخدام
      </h2>
      <div className="">
        <div className="overflow-hidden rounded-2xl border border-brand-border">
          <div className="bg-brand-primaryDark px-4 py-1.5 text-center text-sm font-semibold text-white">
            قبل وبعد
          </div>
          <ProductImage
            src={beforeAfter}
            alt="قبل وبعد الاستخدام"
            className="aspect-square w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
