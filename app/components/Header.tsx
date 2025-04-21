// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Schulbox Logo" className="h-12" />
        </Link>

        {/* Suche + Icons */}
        <div className="flex items-center gap-4 flex-1 justify-end md:justify-center relative">
          {/* Suche mit Lupe */}
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-4 text-gray-600">
            <Link to="/login" title="Einloggen">
              <span role="img" aria-label="Login" className="text-xl">👤</span>
            </Link>
            <Link to="/cart" title="Warenkorb">
              <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
            </Link>
          </div>

          {/* Hamburger Menü Icon */}
          <button
            className="md:hidden text-3xl text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menü */}
      <Transition
        show={menuOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="translate-x-full opacity-0 scale-95"
        enterTo="translate-x-0 opacity-100 scale-100"
        leave="transition ease-in duration-200 transform"
        leaveFrom="translate-x-0 opacity-100 scale-100"
        leaveTo="translate-x-full opacity-0 scale-95"
      >
        <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 space-y-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-xl text-gray-600"
            aria-label="Menü schließen"
          >
            ✕
          </button>

          <nav className="flex flex-col text-gray-800 font-medium text-base mt-10 space-y-3">
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">
              Webshop
            </Link>
            <Link to="/schulboxen" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">
              Schulboxen
            </Link>
            <Link to="/ueber-uns" onClick={() => setMenuOpen(false)} className="hover:text-blue-600 transition">
              Über uns
            </Link>
          </nav>

          <div className="border-t pt-4 space-y-3">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700">
              👤 Einloggen
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700">
              🛒 Warenkorb
            </Link>
          </div>

          {/* Suche auch mobil */}
          <div className="relative mt-6">
            <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Transition>
    </header>
  );
}
