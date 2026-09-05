import React from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import TrustBar from "../components/TrustBar.jsx";
import ItemCard from "../components/ItemCard.jsx";
import { useCatalog } from "../context/CatalogContext.jsx";

export default function Home() {
  const { products } = useCatalog();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <HeroBanner onShop={() => scrollTo("products")} />
      <TrustBar />

      {/* الصفحة الرئيسية بتعرض المنتجات المفردة بس، العروض بتظهر جوه صفحة المنتج */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8">
          <h2 className="font-display text-2xl text-brand-primaryDark sm:text-3xl">
            منتجاتنا
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            اختاري منتجك المفضل حسب احتياج بيتك
          </p>
        </div>

        <div className="grid justify-center gap-4 sm:gap-6 [grid-template-columns:repeat(auto-fit,minmax(210px,260px))] sm:[grid-template-columns:repeat(auto-fit,minmax(220px,320px))]">
          {products.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
