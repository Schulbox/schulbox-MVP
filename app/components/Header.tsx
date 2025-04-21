// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Schulbox Logo" className="h-12" />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-700 font-medium ml-8">
          <Link to="/shop" className="hover:text-blue-600">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600">Über uns</Link>
        </nav>

        {/* Suche + Icons */}
        <div className="flex items-center gap-4 flex-1 justify-end md:justify-end">
          {/* Suchleiste */}
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Icons */}
          <Link to="/cart" title="Warenkorb">
            <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
          </Link>

          {/* Hamburger Button */}
          <button
            className="ml-2 text-2xl md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            ☰
          </button>
        </div>

        {/* Mobile Slide-In Menü */}
        <Transition
          show={menuOpen}
          enter="transition duration-300 transform"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transition duration-200 transform"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
        >
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 px-6 py-6 flex flex-col space-y-4 md:hidden items-end text-right">
            <button
              className="self-end text-2xl mb-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Menü schließen"
            >
              ✕
            </button>

            <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Webshop</Link>
            <Link to="/schulboxen" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Schulboxen</Link>
            <Link to="/ueber-uns" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Über uns</Link>

            <hr className="w-full" />

            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700">
              <span role="img" aria-label="Login">👤</span> Einloggen
            </Link>
          </div>
        </Transition>
      </div>
    </header>
  );
}
