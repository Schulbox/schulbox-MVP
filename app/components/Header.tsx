import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import LoginPopup from "./LoginPopup";
import { useRevalidator } from "@remix-run/react";

// Typdefinition
export type UserType = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email?: string;
} | null;

export default function Header({ user, isLoggedIn, isLoading }: { user: UserType, isLoggedIn: boolean, isLoading: boolean }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await fetch("/api/logout", { method: "POST" });
      localStorage.setItem("sb-is-logged-in", "false");
      window.dispatchEvent(new Event("storage"));      
    } catch (error) {
      console.error("Fehler beim Logout:", error);
      revalidator.revalidate();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-normal">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-box.png" alt="Schulbox Icon" className="h-10 block md:hidden" />
          <img src="/logo.png" alt="Schulbox Logo" className="h-10 hidden md:block" />
        </Link>

        {/* Mobile Suche */}
        <div className="flex-1 mx-4 block md:hidden">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full bg-gray-100 border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 ml-6">
          <Link to="/webshop" className="hover:text-blue-600">Webshop</Link>
          <Link to="/schulboxen" className="hover:text-blue-600">Schulboxen</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600">Über uns</Link>
        </nav>

        {/* Suche Desktop */}
        <div className="hidden md:block flex-1 px-6">
          <div className="relative w-full max-w-xl mx-auto">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Produkt suche Artikelbezeichnung, Artikelnummer"
              className="w-full border rounded-full pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600 relative">
          {/* Desktop Version */}
          {isLoading ? (
            <div className="text-sm text-gray-400">Lade...</div>
          ) : isLoggedIn && user ? (
<div className="hidden md:flex flex-col items-center justify-center relative">
  <button
    onClick={() => setUserMenuOpen(!userMenuOpen)}
    className="flex flex-col items-center justify-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition relative"
  >
    <div className="text-xs text-gray-500">Hallo</div>
    <div className="text-sm font-medium flex items-center gap-1">
      {user.vorname} {user.nachname}
      <motion.span animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </div>
  </button>

  <Transition
    show={userMenuOpen}
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 scale-95 translate-y-2"
    enterTo="opacity-100 scale-100 translate-y-0"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 scale-100 translate-y-0"
    leaveTo="opacity-0 scale-95 translate-y-2"
  >
    <div
      ref={dropdownRef}
      className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
    >
      <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil bearbeiten</Link>
      <Link to="/bestellungen" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meine Bestellungen</Link>
      {user?.role === "lehrkraft" && (
        <Link to="/box-konfigurator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Box Konfigurator</Link>
      )}
      <div className="border-t my-1"></div>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Ausloggen</button>
    </div>
  </Transition>
</div>

          ) : (
            <div className="hidden md:flex gap-2 text-sm">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }}>
                <button onClick={() => setLoginPopupOpen(true)}>
                  <User className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                </button>
              </motion.div>
            </div>
          )}

          {/* Warenkorb Icon */}
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} className="cursor-pointer ml-2">
            <Link to="/cart">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
            </Link>
          </motion.div>

          {/* Mobile Menü Button */}
          <div className="block md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menü */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-300"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition ease-in duration-200"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        <div ref={mobileMenuRef} className="fixed inset-0 bg-white z-40 px-8 py-8 flex flex-col gap-6 text-lg font-medium text-gray-700 overflow-auto">
          {isLoggedIn && (
            <>
              <Link to="/profil" onClick={() => setMobileMenuOpen(false)}>Profil bearbeiten</Link>
              <Link to="/bestellungen" onClick={() => setMobileMenuOpen(false)}>Meine Bestellungen</Link>
            </>
          )}
          <Link to="/webshop" onClick={() => setMobileMenuOpen(false)}>Webshop</Link>
          <Link to="/schulboxen" onClick={() => setMobileMenuOpen(false)}>Schulboxen</Link>
          <Link to="/ueber-uns" onClick={() => setMobileMenuOpen(false)}>Über uns</Link>
          {user?.role === "lehrkraft" && (
            <Link to="/box-konfigurator" onClick={() => setMobileMenuOpen(false)}>Box Konfigurator</Link>
          )}
          <hr />
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-red-600 text-left">Ausloggen</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Einloggen</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Registrieren</Link>
            </>
          )}
          <div className="mt-auto text-sm text-gray-500">
            <Link to="/impressum" onClick={() => setMobileMenuOpen(false)}>Impressum</Link><br />
            <Link to="/datenschutz" onClick={() => setMobileMenuOpen(false)}>Datenschutz</Link><br />
            <Link to="/agb" onClick={() => setMobileMenuOpen(false)}>AGB</Link><br />
            <Link to="/widerruf" onClick={() => setMobileMenuOpen(false)}>Widerruf</Link><br />
            <Link to="/kontakt" onClick={() => setMobileMenuOpen(false)}>Kontakt</Link>
          </div>
        </div>
      </Transition>

      {/* Desktop Login Popup */}
      {loginPopupOpen && <LoginPopup onClose={() => setLoginPopupOpen(false)} />}
    </header>
  );
}
