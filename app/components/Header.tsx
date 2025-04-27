// app/components/Header.tsx
import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import LoginPopup from "./LoginPopup";
import { useRevalidator, useFetcher } from "@remix-run/react";
import { useOutletContext } from "@remix-run/react";

// Typdefinition
export type UserType = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email?: string;
} | null;

type OutletContextType = {
  user: UserType;
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
};

export default function Header({ user, isLoggedIn, isLoading }: { user: UserType, isLoggedIn: boolean, isLoading: boolean }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const logoutFetcher = useFetcher(); // Fetcher für Logout
  
  // Sicheres Abrufen des Outlet-Kontexts mit Fallback
  const outletContext = useOutletContext<OutletContextType | null>();
  const refreshAuth = outletContext?.refreshAuth;

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
    setUserMenuOpen(false); // Dropdown schließen
    setMobileMenuOpen(false); // Mobile Menü schließen
    
    // Client-seitige Bereinigung
    localStorage.removeItem("sb-refresh-token");
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-auth-timestamp");
    localStorage.removeItem("user-profile-cache");
    localStorage.removeItem("user-profile-cache-time");
    localStorage.setItem("sb-is-logged-in", "false");
    console.log("[Logout] localStorage bereinigt");
    
    // Server-seitige Session löschen (Cookies)
    logoutFetcher.submit(null, { method: "post", action: "/logout" });
    
    // Direkt refreshAuth aufrufen, wenn verfügbar
    if (refreshAuth) {
      try {
        await refreshAuth();
        console.log("[Logout] Auth-Status aktualisiert");
      } catch (error) {
        console.error("[Logout] Fehler beim Aktualisieren des Auth-Status:", error);
      }
    }
    
    // UI sofort aktualisieren
    revalidator.revalidate();
    
    // Manuell ein Storage-Event auslösen, um andere Komponenten zu benachrichtigen
    window.dispatchEvent(new Event("storage"));
  };

  // Benutzeranzeigename bestimmen
  const userDisplayName = user ? 
    (user.vorname || user.nachname
      ? `${user.vorname ?? ""} ${user.nachname ?? ""}`.trim()
      : user.email?.split("@")[0]) 
    : "";

  // Ist der Benutzer eine Lehrkraft?
  const isTeacher = user?.role === "lehrkraft";

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
          {isTeacher && (
            <Link to="/konfigurator" className="hover:text-blue-600 text-blue-700 font-semibold">Box Konfigurator</Link>
          )}
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
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium hover:text-blue-600"
              >
                <User size={18} />
                <span>{userDisplayName}</span>
                <motion.span animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              {/* Korrekt positioniertes Dropdown */}
              <Transition
                show={userMenuOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 py-1"
                >
                  <div className="px-4 py-2 border-b mb-1">
                    <p className="text-sm font-medium text-gray-900">Eingeloggt als</p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/profil" 
                    onClick={() => setUserMenuOpen(false)} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} /> Profil bearbeiten
                  </Link>
                  <Link 
                    to="/bestellungen" 
                    onClick={() => setUserMenuOpen(false)} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingCart size={16} /> Meine Bestellungen
                  </Link>
                  {isTeacher && (
                    <Link 
                      to="/konfigurator" 
                      onClick={() => setUserMenuOpen(false)} 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg> Box Konfigurator
                    </Link>
                  )}
                  <div className="border-t my-1"></div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg> Ausloggen
                  </button>
                </div>
              </Transition>
            </div>
          ) : (
            <div className="hidden md:flex gap-2 text-sm">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <button 
                  onClick={() => setLoginPopupOpen(true)}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  <User size={18} /> Einloggen
                </button>
              </motion.div>
            </div>
          )}

          {/* Warenkorb Icon */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="cursor-pointer ml-2">
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
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Menü schließen"
          >
            <X size={24} />
          </button>
          
          <div className="mt-10 space-y-4">
            {isLoggedIn && user && (
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm font-medium text-gray-900">Hallo, {userDisplayName}</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            )}
            
            {isLoggedIn && (
              <>
                <Link to="/profil" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Profil bearbeiten</Link>
                <Link to="/bestellungen" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Meine Bestellungen</Link>
              </>
            )}
            <Link to="/webshop" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Webshop</Link>
            <Link to="/schulboxen" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Schulboxen</Link>
            {isTeacher && (
              <Link to="/konfigurator" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 text-blue-700 font-semibold">Box Konfigurator</Link>
            )}
            <Link to="/ueber-uns" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Über uns</Link>
            <hr />
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-red-600 text-left w-full hover:text-red-700">Ausloggen</button>
            ) : (
              <>
                <button onClick={() => { setLoginPopupOpen(true); setMobileMenuOpen(false); }} className="block hover:text-blue-600">Einloggen</button>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Registrieren</Link>
              </>
            )}
          </div>
          
          <div className="mt-auto text-sm text-gray-500 space-y-1">
            <Link to="/impressum" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Impressum</Link>
            <Link to="/datenschutz" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Datenschutz</Link>
            <Link to="/agb" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">AGB</Link>
            <Link to="/widerruf" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Widerruf</Link>
            <Link to="/kontakt" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Kontakt</Link>
          </div>
        </div>
      </Transition>

      {/* Desktop Login Popup */}
      {loginPopupOpen && <LoginPopup onClose={() => setLoginPopupOpen(false)} />}
    </header>
  );
}
