import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Truck, Phone } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice } from '../data/products.js';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  // لو حد دخل على الصفحة دي مباشرة من غير ما يعمل طلب فعلي
  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="mb-4 text-brand-muted">مفيش طلب لعرضه هنا.</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-brand-primaryDark px-6 py-3 font-medium text-white hover:bg-brand-primaryDarker"
        >
          تصفحي المنتجات
        </button>
      </div>
    );
  }

  const { lines, shipping, total, form } = order;
  const heroImage = lines[0]?.image;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
            <CheckCircle2 className="h-9 w-9 text-brand-primaryDark" />
          </div>
          {heroImage && (
            <div className="absolute -bottom-1.5 -left-1.5 h-8 w-8 overflow-hidden rounded-full border-2 border-brand-bg bg-white shadow-sm">
              <ProductImage
                src={heroImage}
                alt="صورة الطلب"
                className="h-full w-full"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        <h1 className="font-display mb-2 text-2xl text-brand-primaryDark sm:text-3xl">
          تم تأكيد طلبك بنجاح
        </h1>
        <p className="text-sm text-brand-muted">
          يا {form?.fullName || 'عميلتنا العزيزة'}، وصلنا طلبك وجاري تجهيزه.
        </p>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
        <h2 className="mb-4 font-semibold text-brand-text">ملخص الطلب</h2>

        <div className="space-y-4">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <ProductImage
                  src={line.image}
                  alt={line.name}
                  className="h-16 w-16 rounded-xl bg-white"
                />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-surface bg-brand-primaryDark text-xs font-bold leading-none text-white">
                  {line.qty}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <p className="text-sm font-medium leading-snug text-brand-text">
                  {line.name}
                </p>
                <div className="shrink-0 text-left">
                  {line.oldPrice && (
                    <p className="text-xs text-brand-muted line-through">
                      {formatPrice(line.oldPrice * line.qty)}
                    </p>
                  )}
                  <p className="text-sm font-bold text-brand-primaryDark">
                    {formatPrice(line.price * line.qty)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="my-4 border-t border-brand-border" />

        <div className="space-y-2 text-sm text-[#4A4A42]">
          <div className="flex justify-between">
            <span>الشحن</span>
            <span>مجاني</span>
          </div>
        </div>

        <div className="my-4 border-t border-brand-border" />

        <div className="flex justify-between text-lg font-bold text-brand-primaryDark">
          <span>إجمالي الطلب</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-brand-border bg-brand-light/50 p-5 text-center">
        <div className="flex items-center justify-center gap-2 text-brand-primaryDark">
          <Truck className="h-5 w-5" />
          <p className="font-medium">
            شكرًا لطلب حضرتك، سيتم توصيل الطلب ليكِ خلال من يوم إلى 5 أيام.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-[#4A4A42]">
          <Phone className="h-4 w-4 shrink-0" />
          <p>نرد على أي أرقام غريبة لأنه هيكون رقم مندوب التوصيل ❤️</p>
        </div>

        <p className="text-sm text-[#4A4A42]">
          نتمنى لكِ تجربة ممتعة، وهنستنى رأي حضرتك في المنتجات بعد الاستخدام ❤️
        </p>
      </div>

      <Link
        to="/"
        className="mt-6 block w-full rounded-full bg-brand-primaryDark py-3 text-center font-medium text-white transition-colors hover:bg-brand-primaryDarker"
      >
        الرجوع للصفحة الرئيسية
      </Link>
    </div>
  );
}
