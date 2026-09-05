import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// كل ما نتنقل لصفحة جديدة، نبدأ من فوق بدل ما نفضل في نفس مكان السكرول القديم
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
