import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  Check,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import ProductGallery from '../components/ProductGallery.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { formatPrice } from '../data/products.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, bundles } = useCatalog();
  const { addToCart, closeDrawer } = useCart();

  const item = getItemById(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="mb-4 text-brand-muted">المنتج غير موجود.</p>
        <Link to="/" className="text-brand-primary hover:underline">
          الرجوع للرئيسية
        </Link>
      </div>
    );
  }

  // العروض المتاحة (بتظهر تحت وصف أي منتج، ما عدا العرض اللي أنتِ واقفة فيه أصلًا)
  const offers = bundles.filter((b) => b.id !== item.id);

  const handleAdd = () => {
    addToCart(item.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(item.id, qty);
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-brand-primary hover:underline"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع
      </button>

      <div className="grid items-start gap-10 sm:grid-cols-2">
        <div className="sm:sticky sm:top-24 sm:self-start">
          <ProductGallery images={item.images} alt={item.name} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-brand-accent">
            {item.category}
          </p>
          <h1 className="font-display mb-3 text-2xl text-brand-text sm:text-3xl">
            {item.name}
          </h1>

          <div className="mb-5 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand-primaryDark">
              {formatPrice(item.price)}
            </span>
            {item.oldPrice && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(item.oldPrice)}
              </span>
            )}
          </div>

          <p className="mb-6 leading-relaxed text-[#4A4A42] whitespace-pre-line ">
            {item.description}
          </p>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-brand-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-brand-primaryDark"
                aria-label="تقليل الكمية"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-2.5 text-brand-primaryDark"
                aria-label="زيادة الكمية"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> تمت الإضافة
                </>
              ) : (
                'أضف للسلة'
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full border border-brand-primaryDark py-3 font-medium text-brand-primaryDark transition-colors hover:bg-brand-light"
            >
              اشتري الآن
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-brand-primary" /> شحن مجاني
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-primary" /> استرجاع
              خلال 14 يوم
            </span>
          </div>
        </div>
      </div>

      {/* العروض بتظهر هنا بعد وصف المنتج مباشرة، وبتتزود تلقائيًا من src/data/catalog.js */}
      {offers.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display mb-6 text-center text-xl text-brand-primaryDark">
            عروض قد تعجبك
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {offers.map((offer) => (
              <ItemCard key={offer.id} item={offer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
