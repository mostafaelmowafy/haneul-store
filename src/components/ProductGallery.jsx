import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "./ProductImage.jsx";

export default function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const list = images && images.length > 0 ? images : [null];
  const touchStartX = useRef(null);
  const thumbRefs = useRef([]);

  useEffect(() => {
    setActive(0);
  }, [images]);

  // كل ما الصورة النشطة تتغيّر، نمرّر شريط الصور المصغّرة عشانها تبان في النص
  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const goNext = () => setActive((a) => (a + 1) % list.length);
  const goPrev = () => setActive((a) => (a - 1 + list.length) % list.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;

    if (deltaX > SWIPE_THRESHOLD) goPrev(); // سحب لليمين -> الصورة السابقة
    else if (deltaX < -SWIPE_THRESHOLD) goNext(); // سحب لليسار -> الصورة التالية

    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-brand-border bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* كل صورة متحطوطة فوق التانية بالظبط، وبس بتتحرك يمين/شمال حسب المسافة
            بينها وبين الصورة النشطة، فالقديمة "بتخرج" والجديدة "بتخش" وراها */}
        {list.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${(i - active) * 100}%)` }}
          >
            <ProductImage src={src} alt={`${alt} - صورة ${i + 1}`} className="h-full w-full" />
          </div>
        ))}

        {list.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="الصورة السابقة"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-primaryDark shadow-md transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="الصورة التالية"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-primaryDark shadow-md transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              ref={(el) => (thumbRefs.current[i] = el)}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-brand-primary" : "border-brand-border"
              }`}
            >
              <ProductImage src={src} alt={`${alt} - صورة ${i + 1}`} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
