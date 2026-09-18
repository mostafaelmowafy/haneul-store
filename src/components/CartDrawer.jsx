import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import { formatPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    lastAddedId,
    setQty,
    removeFromCart,
  } = useCart();
  const { getItemById } = useCatalog();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ ...line, item: getItemById(line.id) }))
    .filter((line) => line.item);

  const lastAdded = lastAddedId ? getItemById(lastAddedId) : null;
  const total = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const cartCount = lines.reduce((sum, l) => sum + l.qty, 0);

  const goTo = (path) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <>
      {/* الخلفية المعتمة */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* اللوحة المنبثقة */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-brand-surface shadow-2xl transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-border p-4">
          <h2 className="font-display text-lg text-brand-primaryDark">
            عربة التسوق
          </h2>
          <button
            onClick={closeDrawer}
            className="text-brand-muted hover:text-brand-text"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lastAdded && (
          <div className="flex items-center gap-3 border-b border-brand-border bg-brand-light/60 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primaryDark text-white">
              <Check className="h-4 w-4" />
            </span>
            <p className="text-sm text-brand-text">
              تمت إضافة <span className="font-semibold">{lastAdded.name}</span>{' '}
              إلى سلتك
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-3 h-10 w-10 text-[#C7D9BB]" />
              <p className="text-sm text-brand-muted">عربة التسوق فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.id} className="flex items-center gap-3">
                  <ProductImage
                    src={line.item.images?.[0]}
                    alt={line.item.name}
                    className="h-16 w-16 shrink-0 rounded-lg bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-text">
                      {line.item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-muted">
                      {formatPrice(line.item.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-brand-border">
                        <button
                          onClick={() =>
                            setQty(line.id, Math.max(1, line.qty - 1))
                          }
                          className="px-2 py-0.5 text-brand-primaryDark"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => setQty(line.id, line.qty + 1)}
                          className="px-2 py-0.5 text-brand-primaryDark"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(line.id)}
                        className="text-xs text-brand-danger hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-brand-primaryDark">
                    {formatPrice(line.item.price * line.qty)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-brand-border p-4">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-brand-muted">
                الإجمالي ({cartCount} {cartCount === 1 ? 'قطعة' : 'قطع'})
              </span>
              <span className="font-bold text-brand-primaryDark">
                {formatPrice(total)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => goTo('/checkout')}
                className="w-full rounded-full bg-brand-primaryDark py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primaryDarker"
              >
                إتمام الطلب
              </button>
              <button
                onClick={() => goTo('/cart')}
                className="w-full rounded-full border border-brand-border py-3 text-sm font-medium text-brand-text transition-colors hover:bg-brand-light"
              >
                عرض السلة كاملة
              </button>
              <button
                onClick={closeDrawer}
                className="w-full py-2 text-sm font-medium text-brand-primary hover:underline"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
