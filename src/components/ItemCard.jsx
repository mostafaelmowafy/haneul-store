import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductImage from "./ProductImage.jsx";
import { formatPrice } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

export default function ItemCard({ item }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { addToCart, closeDrawer } = useCart();

  const discount = item.oldPrice
    ? Math.round(100 - (item.price / item.oldPrice) * 100)
    : null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/10">
      <div className="relative">
        <button onClick={() => navigate(`/product/${item.id}`)} className="block w-full">
          <ProductImage src={item.images?.[0]} alt={item.name} className="aspect-square w-full bg-white" />
        </button>

        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-danger px-2 py-1 text-xs font-bold text-white">
            {`-${discount}%`}
          </span>
        )}

        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 transition-transform hover:scale-105"
          aria-label="أضف للمفضلة"
        >
          <Heart
            className={`h-4 w-4 ${
              liked ? "fill-brand-danger text-brand-danger" : "text-brand-primaryDark"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[11px] font-medium text-brand-accent">{item.category}</p>

        <button
          onClick={() => navigate(`/product/${item.id}`)}
          className="mb-1 block text-right text-sm font-semibold leading-snug text-brand-text hover:text-brand-primary"
        >
          {item.name}
        </button>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-primaryDark">{formatPrice(item.price)}</span>
            {item.oldPrice && (
              <span className="text-xs text-brand-muted line-through">
                {formatPrice(item.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-bold text-emerald-600">شحن مجاني</p>
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => addToCart(item.id, 1)}
            className="flex-1 whitespace-nowrap rounded-xl border border-brand-primary py-2.5 text-xs font-medium text-brand-primaryDark transition-colors hover:bg-brand-light sm:text-sm"
          >
            أضف للسلة
          </button>
          <button
            onClick={() => {
              addToCart(item.id, 1);
              closeDrawer();
              navigate("/checkout");
            }}
            className="flex-1 whitespace-nowrap rounded-xl bg-brand-primary py-2.5 text-xs font-medium text-white transition-colors hover:bg-brand-primaryDark sm:text-sm"
          >
            اشتري الآن
          </button>
        </div>
      </div>
    </div>
  );
}
