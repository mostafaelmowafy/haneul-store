import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CatalogProvider } from "./context/CatalogContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AnnouncementBar from "./components/AnnouncementBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

export default function App() {
  const location = useLocation();

  return (
    <CatalogProvider>
      <CartProvider>
        <div dir="rtl" className="min-h-screen bg-brand-bg text-brand-text">
          <ScrollToTop />
          <AnnouncementBar />
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail key={location.pathname} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>

          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </CatalogProvider>
  );
}
