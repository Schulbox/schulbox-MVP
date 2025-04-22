import { Link } from "@remix-run/react";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo: Mobil = Icon, Desktop = Vollversion */}
        <Link to="/" className="flex items-center gap-2">
          {/* Mobile Icon */}
          <img src="/logo-box.png" alt="Schulbox Icon" className="h-10 block md:hidden" />
          {/* Desktop Logo */}
          <img src="/logo.png" alt="Schulbox Logo" className="h-10 hidden md:block" />
        </Link>

        {/* Mobile Search (always visible between logo and cart) */}
        <div className="flex-1 mx-4 block md:hidden">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full bg-gray-100 border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium ml-6">
          <Link to="/shop" className="hover:text-blue-600">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600">Über uns</Link>
        </nav>

        {/* Suche Desktop */}
        <div className="hidden md:block flex-1 px-6">
          <div className="relative w-full max-w-xl mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600">
          <div className="hidden md:block">
            <Link to="/login" title="Einloggen">
              <span role="img" aria-label="Login" className="text-xl">👤</span>
            </Link>
          </div>
          <Link to="/cart" title="Warenkorb">
            <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
          </Link>

          {/* Hamburger Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={menuOpen}
        enter="transition duration-300 ease-out"
        enterFrom="transform translate-x-full opacity-0"
        enterTo="transform translate-x-0 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform translate-x-0 opacity-100"
        leaveTo="transform translate-x-full opacity-0"
      >
        <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 px-6 py-6">
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Menü schließen"
          >
            ✕
          </button>
          <div className="mt-10 space-y-4 text-right">
            <Link to="/shop" className="block text-gray-800 font-medium hover:text-blue-600">Webshop</Link>
            <Link to="/schulboxen" className="block text-gray-800 font-medium hover:text-blue-600">Schulboxen</Link>
            <Link to="/ueber-uns" className="block text-gray-800 font-medium hover:text-blue-600">Über uns</Link>
            <hr />
            <Link to="/login" className="block text-gray-800 font-medium hover:text-blue-600">👤 Einloggen</Link>
          </div>
        </div>
      </Transition>
    </header>
  );
}
