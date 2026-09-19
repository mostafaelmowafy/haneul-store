import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'haneul-store-cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, qty, unitPrice, optionLabel, piecesPerUnit } = action.payload;
      // بنلاقي سطر بنفس المنتج وبنفس الاختيار (نفس optionLabel) لو موجود،
      // عشان لو العميلة ضافت "عبوة واحدة" و"عرض 2+1" لنفس المنتج، يبقوا
      // سطرين منفصلين في السلة مش سطر واحد بسعر غلط.
      // بنقارن بالـ optionLabel مش بالـ unitPrice، لأن unitPrice ممكن يكون
      // undefined وقت الإضافة وبعدين يتحسب له سعر افتراضي وقت العرض بس
      // (مش في الداتا نفسها)، فمقارنته كانت بتفشل وتمنع تحديث/حذف السطر.
      const existing = state.find(
        (line) => line.id === id && line.optionLabel === optionLabel,
      );
      if (existing) {
        return state.map((line) =>
          line === existing ? { ...line, qty: line.qty + qty } : line,
        );
      }
      return [...state, { id, qty, unitPrice, optionLabel, piecesPerUnit }];
    }
    case 'SET_QTY': {
      const { id, qty, optionLabel } = action.payload;
      return state.map((line) =>
        line.id === id && line.optionLabel === optionLabel
          ? { ...line, qty }
          : line,
      );
    }
    case 'REMOVE':
      return state.filter(
        (line) =>
          !(
            line.id === action.payload.id &&
            line.optionLabel === action.payload.optionLabel
          ),
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

// بنقرأ السلة المحفوظة من localStorage أول ما الموقع يفتح، عشان لو المستخدم
// قفل المتصفح ورجع تاني يلاقي سلته زي ما سابها.
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    undefined,
    loadCartFromStorage,
  );

  // حالة الـ Quick Cart (السلة المنبثقة من الجانب لما تتضاف حاجة)
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);

  // كل ما السلة تتغيّر، بنحفظها في localStorage عشان تفضل موجودة بعد أي
  // تنقل بين الصفحات أو حتى بعد قفل المتصفح ورجوع المستخدم تاني.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // لو التخزين مش متاح (وضع تصفح خاص مثلًا)، نتجاهل الخطأ بهدوء
    }
  }, [cart]);

  const addToCart = (id, qty = 1, options = {}) => {
    const { unitPrice, optionLabel, piecesPerUnit } = options;
    dispatch({
      type: 'ADD',
      payload: { id, qty, unitPrice, optionLabel, piecesPerUnit },
    });
    setLastAddedId(id);
    setDrawerOpen(true);
  };
  const setQty = (id, qty, optionLabel) =>
    dispatch({ type: 'SET_QTY', payload: { id, qty, optionLabel } });
  const removeFromCart = (id, optionLabel) =>
    dispatch({ type: 'REMOVE', payload: { id, optionLabel } });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const openDrawer = () => setDrawerOpen(true);
  // لما نقفل السلة المنبثقة، بنشيل "آخر منتج اتضاف" عشان لو المستخدم فتحها
  // تاني من أيقونة العربة العادية، مايشوفش رسالة "تمت الإضافة" قديمة
  const closeDrawer = () => {
    setDrawerOpen(false);
    setLastAddedId(null);
  };

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        setQty,
        removeFromCart,
        clearCart,
        cartCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        lastAddedId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart لازم يُستخدم داخل CartProvider');
  return ctx;
}
