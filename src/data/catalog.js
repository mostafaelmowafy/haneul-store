// كل المنتجات والعروض في الموقع بتتحطّ هنا. عشان تضيفي منتج أو عرض جديد،
// انسخي أي عنصر موجود وغيّري بياناته — هيظهر على الموقع تلقائيًا من غير
// أي تعديل تاني في باقي الكود.
//
// - كل عنصر في PRODUCTS بيظهر في الصفحة الرئيسية.
// - كل عنصر في BUNDLES بيظهر كـ"عرض" تحت وصف أي منتج في صفحة المنتج.
// - أول صورة في "images" هي الصورة الرئيسية، وباقي الصور بتظهر كصور
//   مصغّرة قابلة للنقر في صفحة المنتج.
// - الصور متخزنة في public/images/ وبنشير لها بمسار زي "/images/x.webp"،
//   أو ممكن تحطي رابط صورة مستضافة أونلاين يبدأ بـ http أو https.

export const PRODUCTS = [
  {
    id: 'grease-remover',
    name: 'مزيل الدهون القوي',
    category: 'المطبخ',
    price: 279,
    oldPrice: 390,
    description: `قوة تنظيف تساعدك على إزالة الدهون المتراكمة بسهولة.
⸻
🔥 ليه هتحبه؟
✓ إزالة الدهون والأوساخ
✓ مناسب للمطبخ والبوتجاز والشفاط
✓ سهل وسريع الاستخدام
✓ رائحة ليمون منعشة
✓ 500 مل
⸻
طريقة الاستخدام:
رش → اتركه قليلًا → امسح
⸻
العرض:
سعر العبوة 279 بدل 390 والشحن مجاني 
اشتري 2 + 1 مجاناً بـ سعر 579 والشحن مجاناً 
🚚 الشحن مجاني
💵 الدفع عند الاستلام
⸻`,
    images: ['/images/grease-remover-1.webp', '/images/grease-remover-2.webp'],
  },
  {
    id: 'multi-towel',
    name: 'فوطة التنظيف متعددة الاستخدامات',
    category: 'أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description:
      'فوطة تنظيف ناعمة وقوية تمتص السوائل بقوة ولا تترك وبر، مناسبة لكل أسطح المنزل من المطبخ للسيارة. العبوة تحتوي على 20 قطعة قابلة لإعادة الاستخدام.',
    images: ['/images/multi-towel-1.webp'],
  },
  {
    id: 'product-3',
    name: 'وايبس ازالة الدهون الكوري',
    category: ' المطبخ',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p3.webp'],
  },
  {
    id: 'product-4',
    name: 'معجون تلميع و تنظيف و ازلة الصدأ الكوري',
    category: ' المطبخ',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p4.webp'],
  },
  {
    id: 'product-5',
    name: 'وايبس تنظيف الأحذية الكوري',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p5.webp'],
  },
  {
    id: 'product-6',
    name: 'وايبس تنظيف البقع الصعبة من الملابس',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p6.webp'],
  },
  {
    id: 'product-7',
    name: 'أكياس حفظ الطعام الذكي',
    category: 'أدوات تنظيم',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p7.webp'],
  },
  {
    id: 'product-8',
    name: 'كبسولات الغسيل الذكية 5in1',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p8.webp'],
  },
  {
    id: 'product-9',
    name: 'كبسولات تنظيف و تعقيم الغسالة',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p9.webp'],
  },
  {
    id: 'product-10',
    name: 'حقين تعطير و تعقيم التواليت الذكية',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p10.webp'],
  },
  {
    id: 'product-11',
    name: 'أقراص تعقيم و تنظيف قاعدة الحمام',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p11.webp'],
  },
  {
    id: 'product-12',
    name: 'ليفة أزالة الأوساخ و الحبر',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p12.webp'],
  },
  // {
  //   id: 'product-13',
  //   name: 'فوطة التنظيف متعددة الاستخدامات',
  //   category: ' أدوات التنظيف',
  //   price: 89,
  //   oldPrice: null,
  //   description: ``,
  //   images: ['/images/p13.webp'],
  // },
  {
    id: 'product-14',
    name: 'فوم تلميع و تنظيف الزجاج',
    category: ' أدوات التنظيف',
    price: 89,
    oldPrice: null,
    description: ``,
    images: ['/images/p14.webp'],
  },
];

export const BUNDLES = [
  {
    id: 'kitchen-offer',
    name: 'عرض المطبخ النظيف',
    category: 'عرض',
    price: 399,
    oldPrice: 550,
    description:
      'كل ما يحتاجه مطبخك لتنظيف شامل: منظف دهون، مناديل مطبخ، فوطة تنظيف متعددة الاستخدامات، وكيس تخزين عملي.',
    images: ['/images/kitchen-offer-1.webp'],
  },
  {
    id: 'bathroom-offer',
    name: 'عرض الحمام النظيف',
    category: 'عرض',
    price: 349,
    oldPrice: 480,
    description:
      'مجموعة متكاملة لتنظيف الحمام: أقراص تنظيف المرحاض، منظف جل، مكعبات تنظيف الغسالة، وحبيبات معطرة للغسيل.',
    images: ['/images/bathroom-offer-1.webp'],
  },
  {
    id: 'full-house-offer',
    name: 'عرض البيت المتكامل النظيف',
    category: 'عرض',
    price: 899,
    oldPrice: 1250,
    description:
      'كل ما يحتاجه منزلك من المطبخ للحمام والسيارة والأثاث في عرض واحد متكامل، بأفضل توفير ممكن.',
    images: ['/images/full-house-offer-1.webp'],
  },
];
