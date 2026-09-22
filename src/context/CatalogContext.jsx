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

// بتدمج تعديلات جوجل شيت (لو موجودة) فوق البيانات المحلية بالاسم/السعر/
// الوصف بس، وبتسيب الصور والـ includes زي ما هي (دايمًا من catalog.js).
function applyOverrides(items, overridesById) {
  if (overridesById.size === 0) return items;
  return items.map((item) =>
    overridesById.has(item.id) ? { ...item, ...overridesById.get(item.id) } : item,
  );
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
