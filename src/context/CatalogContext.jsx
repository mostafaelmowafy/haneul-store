import React, { createContext, useContext, useEffect, useState } from 'react';
import { PRODUCTS, BUNDLES } from '../data/catalog.js';
import {
  fetchCatalogOverrides,
  getCachedCatalogOverrides,
} from '../data/remoteCatalog.js';

const CatalogContext = createContext(null);

function withType(items, type) {
  return items.map((item) => ({ ...item, type }));
}

// بتدمج تعديلات جوجل شيت (لو موجودة) فوق البيانات المحلية. الحقول
// البسيطة (الاسم، الفئة، الوصف) بتتحط على المنتج مباشرة. أما price/
// oldPrice و priceOffer/oldPriceOffer فبقت بتتطبّق على العنصر المناسب
// جوه مصفوفة options (الاختيار العادي، واختيار العرض زي "2+1")، عشان
// السعر يفضل متزامن بين كروت المنتجات وصفحة المنتج في مكان واحد بس.
function applyOverrides(items, overridesById) {
  if (overridesById.size === 0) return items;

  return items.map((item) => {
    const override = overridesById.get(item.id);
    if (!override) return item;

    const { priceOffer, oldPriceOffer, ...scalarOverrides } = override;
    const updated = { ...item, ...scalarOverrides };

    if (Array.isArray(item.options) && item.options.length > 0) {
      updated.options = item.options.map((option) => {
        if (!option.isBundle) {
          return {
            ...option,
            price: scalarOverrides.price ?? option.price,
            oldPrice:
              scalarOverrides.oldPrice !== undefined
                ? scalarOverrides.oldPrice
                : option.oldPrice,
          };
        }
        if (priceOffer !== undefined || oldPriceOffer !== undefined) {
          return {
            ...option,
            price: priceOffer ?? option.price,
            oldPrice:
              oldPriceOffer !== undefined ? oldPriceOffer : option.oldPrice,
          };
        }
        return option;
      });
    }

    return updated;
  });
}

export function CatalogProvider({ children }) {
  // بنبدأ بالبيانات المحلية، لكن بنطبّق عليها فورًا (من غير ما نستنى
  // رد الشبكة) آخر نسخة متخزّنة محليًا من تعديلات الشيت من زيارة سابقة
  // — بكده لو فتحتِ الموقع تاني على نفس الجهاز، السعر الصح بيظهر على
  // طول من غير "ومضة" بالسعر القديم قبل ما يوصل رد جوجل.
  const [products, setProducts] = useState(() =>
    applyOverrides(withType(PRODUCTS, 'product'), getCachedCatalogOverrides()),
  );
  const [bundles, setBundles] = useState(() =>
    applyOverrides(withType(BUNDLES, 'bundle'), getCachedCatalogOverrides()),
  );

  useEffect(() => {
    let alive = true;
    fetchCatalogOverrides().then((overridesById) => {
      if (!alive || overridesById.size === 0) return;
      setProducts((prev) => applyOverrides(prev, overridesById));
      setBundles((prev) => applyOverrides(prev, overridesById));
    });
    return () => {
      alive = false;
    };
  }, []);

  const allItems = [...products, ...bundles];
  const getItemById = (id) => allItems.find((item) => item.id === id);

  return (
    <CatalogContext.Provider value={{ products, bundles, allItems, getItemById }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog لازم يُستخدم داخل CatalogProvider');
  return ctx;
}
