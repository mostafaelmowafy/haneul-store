import React, { createContext, useContext, useEffect, useState } from 'react';
import { PRODUCTS, BUNDLES } from '../data/catalog.js';
import { fetchCatalogOverrides } from '../data/remoteCatalog.js';

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
  // بنبدأ بالبيانات المحلية على طول عشان الموقع يفتح فورًا من غير أي
  // فترة تحميل، وبعدين لو الشيت مظبوط هنحدّث الأسعار/الأوصاف فوقها.
  const [products, setProducts] = useState(() => withType(PRODUCTS, 'product'));
  const [bundles, setBundles] = useState(() => withType(BUNDLES, 'bundle'));

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
