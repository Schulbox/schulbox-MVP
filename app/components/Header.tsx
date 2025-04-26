// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";

type User = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email?: string;
} | null;

export default function Header({ user }: { user: User }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = () => setMenuOpen(false);

  // 🧠 Dropdown nach Login schließen
  useEffect(() => {
    setUserMenuOpen(false);
  }, [user?.email]);

  // Klick außerhalb / ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-box.png" alt="Schulbox Icon" className="h-10 block md:hidden" />
          <img src="/logo.png" alt="Schulbox Logo" className="h-10 hidden md:block" />
        </Link>

        {/* Suche Mobil */}
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

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium ml-6">
          <Link to="/webshop" className="hover:text-blue-600">Webshop</Link>
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

        {/* Icons + Login */}
        <div className="flex items-center gap-4 text-gray-600 relative">
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="text-sm font-medium hover:text-blue-600 underline"
              >
                {`Hallo, ${user.vorname} ${user.nachname}`} ⌄
              </button>

              <Transition
                show={userMenuOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                >
                  <Link
                    to="/profil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right transition"
                  >
                    Profil bearbeiten
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right transition"
                  >
                    Einkaufswagen
                  </Link>
                  <div className="border-t my-1" />
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-right transition"
                  >
                    Ausloggen
                  </Link>
                </div>
              </Transition>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              {/* Login Icon */}
              <div className="relative group">
                <Link to="/login" title="Einloggen">
                  <motion.span
                    role="img"
                    aria-label="Login"
                    className="text-xl cursor-pointer text-gray-600"
                    whileHover={{ scale: 1.2, color: "#3B82F6" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    👤
                  </motion.span>
                </Link>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Einloggen
                </div>
              </div>
            </div>
          )}

          {/* Warenkorb Icon mit Tooltip */}
          <div className="relative group">
            <Link to="/cart" title="Warenkorb">
              <motion.span
                role="img"
                aria-label="Warenkorb"
                className="text-xl cursor-pointer"
                whileHover={{ scale: 1.2, color: "#3B82F6" }}
                whileTap={{ scale: 0.9 }}
              >
                🛒
              </motion.span>
            </Link>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Warenkorb
            </div>
          </div>

          {/* Hamburger Mobil */}
          <button
            className={`md:hidden ${menuOpen ? "rotate-90" : ""} transition-transform`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Menü */}
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
            <Link to="/webshop" onClick={handleLinkClick} className="block text-gray-800 font-medium hover:text-blue-600">Webshop</Link>
            <Link to="/schulboxen" onClick={handleLinkClick} className="block text-gray-800 font-medium hover:text-blue-600">Schulboxen</Link>
            <Link to="/ueber-uns" onClick={handleLinkClick} className="block text-gray-800 font-medium hover:text-blue-600">Über uns</Link>
            <hr />
            {user ? (
              <>
                <p className="text-sm font-medium text-gray-600">
                  {`Hallo, ${user?.vorname ?? user?.email ?? ""} ${user?.nachname ?? ""}`.trim()}
                </p>
                <Link to="/profil" onClick={handleLinkClick} className="block text-gray-800 hover:text-blue-600">Profil bearbeiten</Link>
                <Link to="/cart" onClick={handleLinkClick} className="block text-gray-800 hover:text-blue-600">Einkaufswagen</Link>
                <Link to="/logout" onClick={handleLinkClick} className="block text-red-600 hover:text-red-800">Ausloggen</Link>
              </>
            ) : (
              <Link to="/login" onClick={handleLinkClick} className="block text-gray-800 font-medium hover:text-blue-600">👤 Einloggen</Link>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
}
