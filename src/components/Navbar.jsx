import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const NAV_LINKS = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المنتجات', to: '/#products' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="text-brand-primaryDark sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="فتح القائمة"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-brand-primary" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl text-brand-primaryDark">
              La <span className="text-brand-primary">Cucina</span>
            </span>
            <span className="mt-0.5 text-[10px] tracking-wide text-brand-muted">
              by aml badr
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-bold text-amber-500 transition-colors hover:text-brand-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden text-brand-primaryDark hover:text-brand-primary sm:flex"
            aria-label="بحث"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={openDrawer}
            className="relative text-brand-primaryDark hover:text-brand-primary"
            aria-label="عربة التسوق"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-danger text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 px-4 pb-4 sm:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              onClick={() => setOpen(false)}
              className="border-b border-brand-border py-2 text-right text-sm font-bold text-brand-primaryDark"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
