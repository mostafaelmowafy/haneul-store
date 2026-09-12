import React, { useEffect, useState } from "react";

const MESSAGES = [
  <>
    <span className="font-bold text-amber-300">شحن مجاني</span> لجميع الطلبات
    داخل مصر
  </>,
  <>ضمان استرجاع خلال 14 يوم دون أسئلة</>,
  <>
    منتجات <span className="font-bold text-amber-300">أصلية 100%</span> من{" "}
    <span className="font-bold text-amber-300">كوريا</span>
  </>,
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-primaryDark px-4 py-2 text-center text-xs tracking-wide text-white sm:text-sm">
      {MESSAGES[index]}
    </div>
  );
}
