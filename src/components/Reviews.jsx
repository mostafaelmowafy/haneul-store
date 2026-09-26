import React, { useState } from 'react';
import { X } from 'lucide-react';
import ProductImage from './ProductImage.jsx';

// آراء العملاء بتتعرض كصور (سكرين شوت من واتساب/انستجرام إلخ)، مش كنص.
// كل عنصر في reviews هو مسار صورة، زي:
// reviews: ["/images/product-1-review-1.webp", "/images/product-1-review-2.webp"]
export default function Reviews({ reviews = [] }) {
  const [openImage, setOpenImage] = useState(null);

  return (
    <div className="mt-16">
      <h2 className="font-display mb-6 text-center text-xl text-brand-primaryDark">
        آراء العملاء
      </h2>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-border bg-brand-light/60 p-5 text-center text-sm text-brand-muted">
          لسه مفيش تقييمات على المنتج ده. كوني أول واحدة تجرّبي وتقيّمي 🌿
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {reviews.map((src, i) => (
            <button
              key={i}
              onClick={() => setOpenImage(src)}
              className="overflow-hidden rounded-xl border border-brand-border transition-shadow hover:shadow-md"
            >
              <ProductImage
                src={src}
                alt={`رأي عميلة رقم ${i + 1}`}
                className="aspect-[3/4] w-full bg-white"
              />
            </button>
          ))}
        </div>
      )}

      {openImage && (
        <div
          onClick={() => setOpenImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <button
            onClick={() => setOpenImage(null)}
            className="absolute left-4 top-4 text-white/80 hover:text-white"
            aria-label="إغلاق"
          >
            <X className="h-7 w-7" />
          </button>
          <img
            src={openImage}
            alt="رأي عميلة"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
