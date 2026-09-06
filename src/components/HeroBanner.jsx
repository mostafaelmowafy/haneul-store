import React from 'react';

// بانر حقيقي بتصميم جاهز مع تأثير الفريم المضبب للأطراف الفارغة
export default function HeroBanner({ onShop }) {
  // كود الصور المشترك لمنع التكرار
  const BannerImages = () => (
    <>
      <source media="(min-width: 640px)" srcSet="/images/banner-desktop.webp" />
      <img
        src="/images/banner-mobile.webp"
        alt="La Cucina — منتجات كورية لبيت أنظف"
      />
    </>
  );

  return (
    <button
      onClick={onShop}
      className="block w-full relative overflow-hidden bg-black/5"
    >
      {/* 1. الخلفية المموهة (تظهر فقط في المساحات الفارغة) */}
      <div className="absolute inset-0 select-none pointer-events-none scale-105 blur-2xl brightness-90 opacity-60">
        <picture className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
          <BannerImages />
        </picture>
      </div>

      {/* 2. طبقة تغبيش إضافية ناعمة لدمج الأطراف */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

      {/* 3. البانر الأصلي في المقدمة بحجمه الطبيعي */}
      <div className="relative z-10 w-full flex justify-center">
        <picture className="w-full">
          <source
            media="(min-width: 640px)"
            srcSet="/images/banner-desktop.webp"
          />
          <img
            src="/images/banner-mobile.webp"
            alt="La Cucina — منتجات كورية لبيت أنظف"
            className="max-h-[73vh] w-full object-contain object-top"
          />
        </picture>
      </div>
    </button>
  );
}
