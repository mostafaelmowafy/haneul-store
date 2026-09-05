import React, { useState } from "react";
import ProductImage from "./ProductImage.jsx";

export default function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0);
  const list = images && images.length > 0 ? images : [null];

  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-2xl border border-brand-border bg-white">
        <ProductImage src={list[active]} alt={alt} className="aspect-square w-full" />
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
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
