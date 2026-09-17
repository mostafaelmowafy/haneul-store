import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-10 bg-brand-primaryDark text-[#EFEADA]">
      <div className="mx-auto grid max-w-6xl gap-x-48 px-6 py-10 text-sm sm:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            <span className="font-display text-xl">La Cucina</span>
          </div>
          <p className="leading-relaxed text-[#C7D6BE]">
            منتجات تنظيف منزلية بروح كورية أصيلة، لبيت أنقى برائحة تدوم.
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold">روابط سريعة</p>
          <ul className="space-y-2 text-[#C7D6BE]">
            <li>المنتجات</li>
            <li>الباندلات والعروض</li>
            <li>سياسة الاسترجاع</li>
          </ul>
        </div>

        {/* <div>
          <p className="mb-3 font-semibold">تواصلي معنا</p>
          <p className="text-[#C7D6BE]">hello@lacucina.com</p>
          <p className="text-[#C7D6BE]">٠١٠٠ ١٢٣ ٤٥٦٧</p>
        </div> */}
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-[#9FB79A]">
        © 2026 La Cucina — by aml badr — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
