import React from 'react';
import { Truck, ShieldCheck, Leaf, Headphones } from 'lucide-react';

const FEATURES = [
  { icon: Truck, label: 'شحن مجاني', sub: 'لكل الطلبات داخل مصر' },
  { icon: ShieldCheck, label: 'ضمان استرجاع', sub: 'خلال 14 يوم' },
  { icon: Leaf, label: 'منتجات أصلية', sub: '100% من كوريا' },
  { icon: Headphones, label: 'خدمة عملاء', sub: 'متاحة طوال اليوم' },
];

export default function TrustBar() {
  return (
    <div className="border-y border-brand-border bg-brand-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-around gap-x-10 gap-y-4 px-6 py-6">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <f.icon className="h-6 w-6 shrink-0 text-brand-primary" />
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-text">{f.label}</p>
              <p className="text-xs text-brand-muted">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
