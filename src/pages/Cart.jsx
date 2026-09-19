import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

export default function Cart() {
  const { cart, setQty, removeFromCart } = useCart();
  const { getItemById } = useCatalog();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ ...line, item: getItemById(line.id) }))
    .filter((line) => line.item)
    // السعر الفعلي للسطر: لو العميلة اختارت عرض معين (زي 2+1) بيبقى ليه
    // سعر مختلف عن سعر القطعة العادي، فبنستخدمه لو موجود، وإلا بنستخدم سعر المنتج العادي.
    .map((line) => ({ ...line, unitPrice: line.unitPrice ?? line.item.price }));

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-[#C7D9BB]" />
        <h1 className="font-display mb-2 text-2xl text-brand-primaryDark">
          عربة التسوق فارغة
        </h1>
        <p className="mb-6 text-sm text-brand-muted">
          لم تضيفي أي منتجات حتى الآن، تصفحي منتجاتنا وابدئي التسوق.
        </p>
        <Link
          to="/"
          className="rounded-full bg-brand-primaryDark px-6 py-3 font-medium text-white hover:bg-brand-primaryDarker"
        >
          تصفحي المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display mb-8 text-2xl text-brand-primaryDark sm:text-3xl">
        عربة التسوق
      </h1>

      <div className="grid gap-8 sm:grid-cols-3">
        <div className="space-y-4 sm:col-span-2">
          {lines.map((line) => (
            <div
              key={`${line.id}-${line.optionLabel ?? 'base'}`}
              className="flex items-center gap-4 rounded-xl border border-brand-border bg-brand-surface p-3"
            >
              <Link to={`/product/${line.id}`} className="shrink-0">
                <ProductImage
                  src={line.item.images?.[0]}
                  alt={line.item.name}
                  className="h-20 w-20 rounded-lg bg-white"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${line.id}`}
                  className="block w-full truncate text-right text-sm font-semibold text-brand-text hover:text-brand-primary"
                >
                  {line.item.name}
                </Link>
                {line.optionLabel && (
                  <p className="mt-0.5 text-xs font-medium text-brand-primary">
                    {line.optionLabel}
                  </p>
                )}
                <p className="mt-1 text-xs text-brand-muted">
                  {formatPrice(line.unitPrice)}
                  {line.piecesPerUnit > 1 && ' للعرض'}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-full border border-brand-border">
                    <button
                      onClick={() =>
                        setQty(
                          line.id,
                          Math.max(1, line.qty - 1),
                          line.optionLabel,
                        )
                      }
                      className="p-1.5 text-brand-primaryDark"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      onClick={() =>
                        setQty(line.id, line.qty + 1, line.optionLabel)
                      }
                      className="p-1.5 text-brand-primaryDark"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {line.piecesPerUnit > 1 && (
                    <span className="text-xs text-brand-muted">
                      = {line.piecesPerUnit * line.qty} قطعة
                    </span>
                  )}

                  <button
                    onClick={() => removeFromCart(line.id, line.optionLabel)}
                    className="text-brand-danger hover:opacity-80"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="shrink-0 font-semibold text-brand-primaryDark">
                {formatPrice(line.unitPrice * line.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="sticky top-24 h-fit rounded-xl border border-brand-border bg-brand-surface p-5">
          <h2 className="mb-4 font-semibold text-brand-text">ملخص الطلب</h2>

          <div className="my-4 border-t border-brand-border" />

          <div className="mb-5 flex justify-between font-bold text-brand-primaryDark">
            <span>الإجمالي</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker"
          >
            إتمام الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
