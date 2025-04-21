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

        {/* Suchleiste mobil */}
        <div className="flex-1 md:hidden px-4">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Desktop-Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-sm text-gray-700 font-medium ml-6">
          <Link to="/shop" className="hover:text-blue-600 transition">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600 transition">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600 transition">Über uns</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600">
          <Link to="/login" title="Einloggen" className="hidden md:inline">
            <span role="img" aria-label="Login" className="text-xl">👤</span>
          </Link>
          <Link to="/cart" title="Warenkorb">
            <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Menü öffnen"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Suchleiste Desktop */}
      <div className="hidden md:flex justify-center px-4 mb-2">
        <div className="relative w-full max-w-3xl">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mobile Menu Slide-in */}
      <Transition
        show={menuOpen}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={() => setMenuOpen(false)}></div>
        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 px-6 py-6 flex flex-col gap-6 text-right">
          <button
            className="text-2xl self-end"
            onClick={() => setMenuOpen(false)}
            aria-label="Menü schließen"
          >
            ✕
          </button>
          <Link to="/shop" className="hover:text-blue-600 transition">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600 transition">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600 transition">Über uns</Link>
          <hr />
          <Link to="/login" className="flex items-center justify-end gap-2 hover:text-blue-600">
            👤 Einloggen
          </Link>
        </div>
      </Transition>
    </header>
  );
}
