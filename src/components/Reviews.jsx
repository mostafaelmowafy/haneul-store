import React, { useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductImage from './ProductImage.jsx';

// آراء العملاء بتتعرض كصور (سكرين شوت من واتساب/انستجرام إلخ)، مش كنص.
// كل عنصر في reviews هو مسار صورة، زي:
// reviews: ["/images/product-1-review-1.webp", "/images/product-1-review-2.webp"]
export default function Reviews({ reviews = [] }) {
  const [openImage, setOpenImage] = useState(null);
  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.offsetWidth ?? 200;
    el.scrollBy({ left: direction * (cardWidth + 12), behavior: 'smooth' });
  };

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
        <div className="relative">
          {/* الأسهم بتتحكم في السكرول الأفقي — يمين وشمال بدل النزول تحت */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={() => scrollByCard(-1)}
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-brand-border bg-white p-1.5 shadow-md hover:bg-brand-light sm:flex"
                aria-label="السابق"
              >
                <ChevronRight className="h-5 w-5 text-brand-primaryDark" />
              </button>
              <button
                onClick={() => scrollByCard(1)}
                className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-brand-border bg-white p-1.5 shadow-md hover:bg-brand-light sm:flex"
                aria-label="التالي"
              >
                <ChevronLeft className="h-5 w-5 text-brand-primaryDark" />
              </button>
            </>
          )}

          <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((src, i) => (
              <button
                key={i}
                onClick={() => setOpenImage(src)}
                className="w-40 shrink-0 overflow-hidden rounded-xl border border-brand-border transition-shadow hover:shadow-md sm:w-48"
              >
                <ProductImage
                  src={src}
                  alt={`رأي عميلة رقم ${i + 1}`}
                  className="aspect-[3/4] w-full bg-white"
                />
              </button>
            ))}
          </div>
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
