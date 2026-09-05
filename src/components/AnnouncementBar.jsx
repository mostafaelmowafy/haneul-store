import React, { useEffect, useState } from "react";

const MESSAGES = [
  "شحن مجاني لجميع الطلبات داخل مصر",
  "ضمان استرجاع خلال 14 يوم دون أسئلة",
  "منتجات أصلية 100% من كوريا",
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
