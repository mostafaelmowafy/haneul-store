import React, { useState, useMemo } from 'react';
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
import ShippingForm from '../components/ShippingForm.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import Reviews from '../components/Reviews.jsx';
import { formatPrice } from '../data/products.js';
import RichDescription from '../utils/richDescription.jsx';
import {
  EMPTY_SHIPPING_FORM,
  convertArabicNumsToEnglish,
  validateShippingForm,
  submitOrderToSheet,
} from '../data/orderSubmission.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, bundles } = useCatalog();
  const { addToCart } = useCart();

  const item = getItemById(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // بيانات فورم "اشتري الآن" المباشر تحت اختيار العرض
  const [buyForm, setBuyForm] = useState(EMPTY_SHIPPING_FORM);
  const [buyErrors, setBuyErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // اختيارات السعر بقت بيانات جاهزة في catalog.js (item.options) بدل
  // ما تتقرا من نص الوصف — آخر اختيار (غالبًا العرض الأكبر) بيبقى
  // مختار افتراضيًا لو موجود.
  const options = item?.options ?? [];
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    options.length > 1 ? options.length - 1 : 0,
  );
  const selectedOption = options[selectedOptionIndex] || null;

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

  // العروض اللي المفروض تظهر تحت المنتج ده تحديدًا، حسب item.relatedOfferIds
  // في catalog.js (لو مش متحدد، بترجع مصفوفة فاضية ومفيش سكشن هيظهر خالص)
  const offers = (item.relatedOfferIds ?? [])
    .map((offerId) => bundles.find((b) => b.id === offerId))
    .filter(Boolean);

  const galleryImages = useMemo(() => {
    if (item.type === 'bundle' && item.includes?.length) {
      return [
        ...item.images,
        ...item.includes
          .map((productId) => getItemById(productId)?.images?.[0])
          .filter(Boolean),
      ];
    }
    return item.images;
  }, [item.id]);

  // لو فيه اختيار عرض متحدد (زي 2+1)، الـ +/- بتتحكم في "عدد مرات" اختيار
  // العرض ده نفسه (مش عدد القطع)، وبنبعت سعر العرض كامل كـ unitPrice، مع
  // piecesPerUnit عشان السلة تقدر تعرض "= X قطعة" لو حبينا نوضحها للعميلة.
  const effectiveQty = qty;
  const effectiveUnitPrice = selectedOption ? selectedOption.price : undefined;
  const piecesPerUnit = selectedOption ? selectedOption.qty : 1;

  const handleAdd = () => {
    addToCart(item.id, effectiveQty, {
      unitPrice: effectiveUnitPrice,
      optionLabel: selectedOption?.label,
      piecesPerUnit,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // بيانات "السطر" الحالي (المنتج + الاختيار + الكمية المختارة فوق) —
  // ده اللي بيتبعت لما تشتري مباشرة من الفورم اللي تحت، منفصل تمامًا عن
  // أي حاجة تانية في عربة التسوق، عشان يكون واضح ومحدّد إنه المنتج ده بس.
  const currentLine = {
    id: item.id,
    name: item.name,
    optionLabel: selectedOption?.label || null,
    piecesPerUnit,
    image: item.images?.[0] || null,
    qty: effectiveQty,
    price: effectiveUnitPrice ?? item.price,
    oldPrice:
      (selectedOption ? selectedOption.oldPrice : item.oldPrice) || null,
  };
  const currentTotal = currentLine.price * currentLine.qty;

  const setBuyField = (key) => (e) => {
    let value = e.target.value;
    if (key === 'phone' || key === 'altPhone')
      value = convertArabicNumsToEnglish(value);
    setBuyForm((f) => ({ ...f, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    const newErrors = validateShippingForm(buyForm);
    if (Object.keys(newErrors).length > 0) {
      setBuyErrors(newErrors);
      return;
    }
    setBuyErrors({});
    setSubmitting(true);
    await submitOrderToSheet({
      form: buyForm,
      lines: [currentLine],
      total: currentTotal,
    });
    setSubmitting(false);
    navigate('/order-success', {
      state: { lines: [currentLine], total: currentTotal, form: buyForm },
    });
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
        <div className="mx-auto w-full max-w-sm sm:sticky sm:top-24 sm:max-w-none sm:self-start">
          <ProductGallery images={galleryImages} alt={item.name} />
        </div>

        <div>
          <h1 className="font-display mb-3 text-2xl text-brand-text sm:text-3xl">
            {item.name}
          </h1>

          <div className="mb-5 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand-primaryDark">
              {formatPrice(selectedOption ? selectedOption.price : item.price)}
            </span>
            {(selectedOption ? selectedOption.oldPrice : item.oldPrice) && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(
                  selectedOption ? selectedOption.oldPrice : item.oldPrice,
                )}
              </span>
            )}
            {selectedOption && selectedOption.qty > 1 && (
              <span className="text-xs text-brand-muted">
                ({selectedOption.qty} قطع لكل عرض)
              </span>
            )}
          </div>

          {options.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-brand-text">
                اختاري العرض المناسب:
              </p>
              <div className="space-y-2">
                {options.map((option, index) => {
                  const isSelected = index === selectedOptionIndex;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedOptionIndex(index)}
                      className={`flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-3 py-2.5 text-right transition-colors ${
                        isSelected
                          ? 'border-brand-primary bg-brand-light'
                          : 'border-amber-200 bg-amber-50 hover:border-brand-primary/50'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? 'border-brand-primary'
                            : 'border-brand-muted'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-brand-primary" />
                        )}
                      </span>
                      <span className="text-sm text-[#4A4A42]">
                        {option.label}
                      </span>
                      <span className="text-base font-extrabold text-brand-primaryDark">
                        {option.price} ج.م
                      </span>
                      <span className="text-xs text-brand-muted line-through opacity-60">
                        {option.oldPrice} ج.م
                      </span>
                      {option.isBundle && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          🔥 الأكثر طلبًا
                        </span>
                      )}
                      {option.note && (
                        <span className="text-sm font-bold text-emerald-600">
                          {option.note}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-4">
            {selectedOption && selectedOption.qty > 1 && (
              <p className="mb-1.5 text-xs text-brand-muted">
                الكمية = عدد مرات هذا العرض
              </p>
            )}
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

          {/* اشتري الآن مباشرة: فورم شحن مصغّر + ملخص، عشان اللي عايزة
              تطلب المنتج ده لوحده من غير ما تمر بالسلة وصفحة الدفع */}
          <div className="my-8 rounded-2xl border border-brand-border bg-brand-surface p-5 sm:p-6">
            <h2 className="font-display mb-1 text-lg text-brand-primaryDark">
              اشتري الآن مباشرة
            </h2>
            <p className="mb-4 text-xs text-brand-muted">
              املي بياناتك وهنأكّد معاكِ الطلب على طول
            </p>

            <div className="mb-4 flex items-center gap-3 rounded-xl bg-brand-light p-3">
              <img
                src={currentLine.image}
                alt={currentLine.name}
                className="h-12 w-12 shrink-0 rounded-lg bg-white object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-text">
                  {currentLine.name}
                </p>
                {currentLine.optionLabel && (
                  <p className="text-xs font-medium text-brand-primary">
                    {currentLine.optionLabel}
                  </p>
                )}
                <p className="text-xs text-brand-muted">
                  الكمية: {currentLine.qty}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-brand-primaryDark">
                {formatPrice(currentTotal)}
              </p>
            </div>

            <ShippingForm
              form={buyForm}
              errors={buyErrors}
              setField={setBuyField}
            />

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-brand-primaryDark py-3 font-medium text-white transition-colors hover:bg-brand-primaryDarker disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'جاري إرسال الطلب...'
                : `إتمام الشراء — ${formatPrice(currentTotal)}`}
            </button>
          </div>

          {/* <div className="mb-6 mt-4">
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-primary py-3 font-medium text-brand-primaryDark transition-colors hover:bg-brand-light"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> تمت الإضافة
                </>
              ) : (
                'أضف للسلة'
              )}
            </button>
          </div> */}

          <div className="mb-6">
            <RichDescription text={item.description} />
          </div>

          <div className="flex items-center gap-6 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-brand-primary" /> شحن مجاني
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-primary" /> ضمان
              استرجاع خلال 14 يوم
            </span>
            <span className=" ">
              جرّب المنتج بنفسك، وإذا لم يكن مناسبًا لك يمكنك طلب الاسترجاع خلال
              14 يومًا وفقًا لسياسة الاسترجاع
            </span>
          </div>
        </div>
      </div>

      <BeforeAfter beforeAfter={item.beforeAfter} />

      {/* العروض بتظهر هنا حسب item.relatedOfferIds في src/data/catalog.js */}
      {offers.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display mb-6 text-center text-xl text-brand-primaryDark">
            عروض قد تعجبك
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
              >
                <ItemCard item={offer} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Reviews reviews={item.reviews} />
    </div>
  );
}
