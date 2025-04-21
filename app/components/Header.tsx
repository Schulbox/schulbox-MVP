// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Schulbox Logo" className="h-12" />
        </Link>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen"
        >
          ☰
        </button>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-700 font-medium">
          <Link to="/shop" className="hover:text-blue-600">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600">Über uns</Link>
        </nav>

        {/* Suche */}
        <div className="hidden md:block flex-1 max-w-xl px-4">
          <input
            type="text"
            placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
            className="w-full border rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Icons Desktop */}
        <div className="hidden md:flex items-center gap-4 text-gray-600">
          <Link to="/login" title="Einloggen">
            <span role="img" aria-label="Login" className="text-xl">👤</span>
          </Link>
          <Link to="/cart" title="Warenkorb">
            <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-3 text-gray-700 text-sm font-medium">
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Webshop</Link>
            <Link to="/schulboxen" onClick={() => setMenuOpen(false)}>Schulboxen</Link>
            <Link to="/ueber-uns" onClick={() => setMenuOpen(false)}>Über uns</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center gap-2">
              👤 <span>Einloggen</span>
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              🛒 <span>Warenkorb</span>
            </Link>
          </nav>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}
