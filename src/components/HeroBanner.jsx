import React, { useEffect, useState } from "react";

const SLIDES = [
  {
    title: "نظافة منزلك أسهل من أي وقت",
    sub: "منتجات تنظيف فعّالة لكل ركن في بيتك، بنتيجة واضحة من أول استخدام",
    cta: "تسوّقي الآن",
    tint: "from-[#C7D9BB] via-[#A9C79A] to-[#6E9B7C]",
  },
  {
    title: "إزالة الدهون بقوة في دقائق",
    sub: "تركيبة قوية تذيب أصعب الدهون من المواقد والشفاطات بسهولة",
    cta: "شوفي المنتج",
    tint: "from-[#B9CDA6] via-[#8FB79B] to-[#3E6B4E]",
  },
  {
    title: "شحن مجاني لكل الطلبات داخل مصر",
    sub: "اطلبي الآن ووصل لباب بيتك دون أي مصاريف إضافية",
    cta: "ابدئي التسوق",
    tint: "from-[#D6C79A] via-[#B7C9A0] to-[#5C8E6C]",
  },
];

// ارتفاع ثابت للبانر بكل شرائحه، عشان محتوى الصفحة تحته ميتحركش وهو بيتقلب
const BANNER_HEIGHT = "h-[380px] sm:h-[480px]";

export default function HeroBanner({ onShop }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${BANNER_HEIGHT} ${slide.tint} transition-colors duration-700`}
      >
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="font-display mx-auto max-w-2xl text-3xl leading-tight text-[#22381F] sm:text-5xl">
            {slide.title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-brand-primaryDark sm:text-lg">
            {slide.sub}
          </p>
          <button
            onClick={onShop}
            className="mt-8 rounded-full bg-brand-primaryDark px-8 py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker"
          >
            {slide.cta}
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`الشريحة ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-brand-primaryDark" : "w-1.5 bg-brand-primaryDark/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
