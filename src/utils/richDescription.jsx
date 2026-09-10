import React from "react";

// Matches things like: "473 بدل 900 ج" أو "237 بدل 300 ج" أو "297 ج بدل 400 ج"
// وبيتقبل الغلطة الإملائية الشائعة "يدل" بدل "بدل" كمان.
const OFFER_PRICE_REGEX = /(\d[\d,]*)\s*(?:ج)?\s*(?:بدل|يدل)\s*(\d[\d,]*)\s*ج/;

function renderLine(line, key) {
  const match = line.match(OFFER_PRICE_REGEX);

  if (!match) {
    return line ? (
      <p key={key} className="leading-relaxed text-[#4A4A42]">
        {line}
      </p>
    ) : (
      <div key={key} className="h-2" />
    );
  }

  const [fullMatch, newPrice, oldPrice] = match;
  const before = line.slice(0, match.index).trim();
  const after = line.slice(match.index + fullMatch.length).trim();

  // الباچ بيظهر بس لو السطر ده عرض/باقة (2+1، عرض خاص، اشتري..)
  // مش لما يكون مجرد سعر العبوة الواحدة العادي
  const isBundleOffer = /(2\s*\+\s*1|عرض|اشتر)/.test(before);

  return (
    <div
      key={key}
      className="my-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
    >
      {before && <span className="text-sm text-[#4A4A42]">{before}</span>}
      <span className="text-lg font-extrabold text-brand-primaryDark">
        {newPrice} ج.م
      </span>
      <span className="text-sm text-brand-muted line-through opacity-60">
        {oldPrice} ج.م
      </span>
      {isBundleOffer && (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
          🔥 الأكثر طلبًا
        </span>
      )}
      {after && <span className="text-sm text-[#4A4A42]">{after}</span>}
    </div>
  );
}

export default function RichDescription({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  return <div className="space-y-1">{lines.map((line, i) => renderLine(line, i))}</div>;
}
