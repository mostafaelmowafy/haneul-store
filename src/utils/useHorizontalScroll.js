import { useRef } from 'react';

// هوك بسيط بيدّي مرجع (ref) للحاوية اللي بنعمل فيها سكرول أفقي، ودالة
// بتحرّك السكرول بمقدار عرض عنصر واحد لليمين أو الشمال — مستخدم في
// كاروسيل آراء العملاء وكاروسيل "عروض قد تعجبك" في صفحة المنتج.
export function useHorizontalScroll() {
  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.offsetWidth ?? 200;
    el.scrollBy({ left: direction * (cardWidth + 12), behavior: 'smooth' });
  };

  return { scrollerRef, scrollByCard };
}
