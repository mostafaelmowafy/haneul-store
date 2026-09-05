# هانيول هوم | Haneul Store

متجر إلكتروني مبني بـ React.js + Vite + Tailwind CSS، بأربع صفحات منفصلة.

```
src/
├── pages/
│   ├── Home.jsx           # الصفحة الرئيسية — بتعرض "المنتجات" بس
│   ├── ProductDetail.jsx  # صفحة وصف المنتج (/product/:id) — وتحتها "العروض"
│   ├── Cart.jsx           # صفحة عربة التسوق (/cart)
│   └── Checkout.jsx       # صفحة الدفع (/checkout)
├── components/            # مكونات مشتركة (Navbar, Footer, ItemCard, ProductGallery...)
├── context/
│   ├── CatalogContext.jsx # بيوزّع المنتجات والعروض على كل الصفحات
│   └── CartContext.jsx    # حالة السلة (Context API + useReducer)
├── data/
│   ├── catalog.js         # كل المنتجات والعروض — الملف الوحيد اللي تعدّليه لإضافة/تغيير حاجة
│   └── products.js        # ثوابت عامة بس (المحافظات، تنسيق السعر)
└── App.jsx
```

## إضافة أو تعديل منتج / عرض

الملف الوحيد اللي محتاجة تفتحيه هو **`src/data/catalog.js`**:

```js
export const PRODUCTS = [
  {
    id: "grease-remover",
    name: "مزيل الدهون القوي",
    category: "المطبخ",
    price: 149,
    oldPrice: null,
    description: "وصف المنتج هنا...",
    images: ["/images/grease-remover-1.webp", "/images/grease-remover-2.webp"],
  },
  // ...أضيفي عنصر جديد هنا بنفس الشكل
];

export const BUNDLES = [
  {
    id: "kitchen-offer",
    name: "عرض المطبخ النظيف",
    category: "عرض",
    price: 399,
    oldPrice: 550,
    description: "وصف العرض هنا...",
    images: ["/images/kitchen-offer-1.webp"],
  },
  // ...أضيفي عرض جديد هنا بنفس الشكل
];
```

- كل عنصر جوه `PRODUCTS` بيظهر في **الصفحة الرئيسية**.
- كل عنصر جوه `BUNDLES` بيظهر كـ"عرض" تحت وصف أي منتج في **صفحة المنتج**.
- **أول صورة في `images`** هي الصورة الرئيسية اللي بتظهر في الكارت وأعلى
  المعرض؛ باقي الصور بتظهر كصور مصغّرة قابلة للنقر في صفحة المنتج.
- لإضافة منتج أو عرض جديد: انسخي أي عنصر موجود جوه نفس المصفوفة، غيّري
  بياناته، واحفظي الملف — هيظهر على الموقع تلقائيًا من غير أي تعديل في
  باقي الكود.

### الصور

الصور متخزنة جوه المشروع في `public/images/` وبنشير لها بمسار نسبي زي
`/images/grease-remover-1.webp`. لإضافة صورة منتج جديد:
- ارفعيها في `public/images/`، أو
- استخدمي رابط صورة مستضافة على الإنترنت مباشرة في حقل `images` (لازم
  يبدأ بـ `http` أو `https`).

## التشغيل محليًا

```bash
npm install
npm run dev
```

سيعمل الموقع على `http://localhost:5173`.

## البناء للإنتاج

```bash
npm run build
```

## تخصيص الألوان

كل ألوان الهوية موجودة في مكان واحد: `tailwind.config.js` →
`theme.extend.colors.brand`.
