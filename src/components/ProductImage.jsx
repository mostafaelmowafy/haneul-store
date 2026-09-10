import React, { useState, useEffect } from 'react';

export default function ProductImage({ src, alt, className = '' }) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

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
      className={`object-fill ${className}`}
      loading="lazy"
    />
  );
}
