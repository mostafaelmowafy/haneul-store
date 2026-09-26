import React from 'react';

// وصف المنتج بقى نص عادي بالكامل (الأسعار بقت في مصفوفة options منفصلة
// في catalog.js)، فالمكوّن ده بقى بسيط: بيعرض كل سطر كفقرة، والسطر
// الفاضي بيتحول لمسافة بين الفقرات.
function renderLine(line, key) {
  return line ? (
    <p key={key} className="leading-relaxed text-[#4A4A42]">
      {line}
    </p>
  ) : (
    <div key={key} className="h-2" />
  );
}

export default function RichDescription({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return <div className="space-y-1">{lines.map((line, i) => renderLine(line, i))}</div>;
}
