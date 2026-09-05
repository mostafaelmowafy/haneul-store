import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import ProductImage from "../components/ProductImage.jsx";
import { formatPrice, GOVERNORATES } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useCatalog } from "../context/CatalogContext.jsx";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 60;

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  apartment: "",
  city: "",
  governorate: GOVERNORATES[0],
  notes: "",
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { getItemById } = useCatalog();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ ...line, item: getItemById(line.id) }))
    .filter((line) => line.item);

  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const [form, setForm] = useState(EMPTY_FORM);
  const [placed, setPlaced] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const requiredOk =
    form.firstName && form.lastName && form.phone && form.address && form.city;

  const handlePlaceOrder = () => {
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
          <Check className="h-8 w-8 text-brand-primaryDark" />
        </div>
        <h1 className="font-display mb-2 text-2xl text-brand-primaryDark">
          تم استلام طلبك بنجاح
        </h1>
        <p className="text-sm text-brand-muted">
          سيتواصل معكِ فريقنا لتأكيد التفاصيل قبل الشحن.
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="mb-4 text-brand-muted">عربة التسوق فارغة، لا يوجد طلب لإتمامه.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-brand-primaryDark px-6 py-3 font-medium text-white hover:bg-brand-primaryDarker"
        >
          تصفحي المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <button
        onClick={() => navigate("/cart")}
        className="mb-6 flex items-center gap-1 text-sm text-brand-primary hover:underline"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع للعربة
      </button>

      <h1 className="font-display mb-8 text-2xl text-brand-primaryDark sm:text-3xl">
        إتمام الدفع
      </h1>

      <div className="grid gap-8 sm:grid-cols-5">
        {/* ملخص سريع */}
        <div className="order-2 sm:order-1 sm:col-span-2">
          <div className="sticky top-24 rounded-xl border border-brand-border bg-brand-surface p-5">
            <h2 className="mb-4 font-semibold text-brand-text">ملخص الطلب</h2>

            <div className="max-h-64 space-y-3 overflow-auto pr-1">
              {lines.map((line) => (
                <div key={line.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <ProductImage
                      src={line.item.images?.[0]}
                      alt={line.item.name}
                      className="h-12 w-12 rounded-lg bg-white"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primaryDark text-[10px] text-white">
                      {line.qty}
                    </span>
                  </div>
                  <p className="flex-1 truncate text-xs text-[#4A4A42]">{line.item.name}</p>
                  <p className="shrink-0 text-xs font-semibold text-brand-primaryDark">
                    {formatPrice(line.item.price * line.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-brand-border" />

            <div className="space-y-2 text-sm text-[#4A4A42]">
              <div className="flex justify-between">
                <span>الإجمالي الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="my-4 border-t border-brand-border" />

            <div className="flex justify-between font-bold text-brand-primaryDark">
              <span>الإجمالي</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* الفورم */}
        <div className="order-1 sm:order-2 sm:col-span-3">
          <div className="space-y-5 rounded-xl border border-brand-border bg-brand-surface p-5 sm:p-6">
            <div>
              <h2 className="mb-3 font-semibold text-brand-text">بيانات التواصل</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="رقم الهاتف"
                  value={form.phone}
                  onChange={setField("phone")}
                />
                <input
                  className="input"
                  placeholder="البريد الإلكتروني (اختياري)"
                  value={form.email}
                  onChange={setField("email")}
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-semibold text-brand-text">عنوان الشحن</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="الاسم الأول"
                  value={form.firstName}
                  onChange={setField("firstName")}
                />
                <input
                  className="input"
                  placeholder="اسم العائلة"
                  value={form.lastName}
                  onChange={setField("lastName")}
                />
                <input
                  className="input sm:col-span-2"
                  placeholder="العنوان"
                  value={form.address}
                  onChange={setField("address")}
                />
                <input
                  className="input sm:col-span-2"
                  placeholder="شقة، دور، إلخ (اختياري)"
                  value={form.apartment}
                  onChange={setField("apartment")}
                />
                <input
                  className="input"
                  placeholder="المدينة"
                  value={form.city}
                  onChange={setField("city")}
                />
                <select className="input" value={form.governorate} onChange={setField("governorate")}>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <textarea
                  className="input h-20 resize-none sm:col-span-2"
                  placeholder="ملاحظات على الطلب (اختياري)"
                  value={form.notes}
                  onChange={setField("notes")}
                />
              </div>
            </div>

            <button
              disabled={!requiredOk}
              onClick={handlePlaceOrder}
              className="w-full rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker disabled:cursor-not-allowed disabled:opacity-40"
            >
              تأكيد الطلب — {formatPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
