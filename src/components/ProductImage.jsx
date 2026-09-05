import React, { useState } from "react";

export default function ProductImage({ src, alt, className = "" }) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-light text-xs text-brand-muted ${className}`}
      >
        لا توجد صورة
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
