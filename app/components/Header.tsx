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

        {/* Navigation + Suche */}
        <div className="flex-1 flex items-center justify-center gap-8">
          {/* Dropdowns */}
                <nav className="hidden md:flex gap-8 text-sm text-gray-700 font-medium">
                    <Link
                        to="/shop"
                        className="hover:text-blue-600 transition-colors duration-200"
                    >
                        Webshop
                    </Link>
                    <Link
                        to="/schulboxen"
                        className="hover:text-blue-600 transition-colors duration-200"
                    >
                        Schulboxen
                    </Link>
                    <Link
                        to="/ueber-uns"
                        className="hover:text-blue-600 transition-colors duration-200"
                    >
                        Über uns
                    </Link>
                </nav>


          {/* Suche */}
          <div className="flex-1 max-w-xl w-full px-4">
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600">
          <Link to="/login" title="Einloggen">
            <span role="img" aria-label="Login" className="text-xl">👤</span>
          </Link>
          <Link to="/cart" title="Warenkorb">
            <span role="img" aria-label="Warenkorb" className="text-xl">🛒</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Dropdown({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-blue-600">{title}</button>
      {open && (
        <div className="absolute top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50 py-2">
          <div className="flex flex-col space-y-1 px-4 text-sm text-gray-800">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
