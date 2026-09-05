import React, { createContext, useContext } from "react";
import { PRODUCTS, BUNDLES } from "../data/catalog.js";

const CatalogContext = createContext(null);

function withType(items, type) {
  return items.map((item) => ({ ...item, type }));
}

export function CatalogProvider({ children }) {
  const products = withType(PRODUCTS, "product");
  const bundles = withType(BUNDLES, "bundle");
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
  if (!ctx) throw new Error("useCatalog لازم يُستخدم داخل CatalogProvider");
  return ctx;
}
