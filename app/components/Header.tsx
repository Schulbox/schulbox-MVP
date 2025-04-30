// app/components/Header.tsx
import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import LoginPopup from "./LoginPopup";
import { useRevalidator, useFetcher } from "@remix-run/react";
import { useOutletContext } from "@remix-run/react";
import { useCart } from "~/context/CartContext";
import {
  HomeIcon,
  BoxIcon,
  InfoIcon,
  ConfigIcon,
  CartIcon,
  UserIcon,
  LogoutIcon,
  LoginIcon,
  RegisterIcon,
  UserGroupIcon,
  ToolboxIcon,
} from "~/components/icons";


const NavItem = ({
  icon: Icon,
  label,
  to,
  onClick,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}) => {
  const baseClass =
    "flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-200 transition w-full text-left";
  const combinedClass = `${baseClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClass}>
        <Icon className="w-5 h-5 text-gray-400" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClass}>
      <Icon className="w-5 h-5 text-gray-400" />
      <span>{label}</span>
    </button>
  );
};





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
  const { totalItems, justAdded, setItems, clearCart } = useCart();


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
    
     // 🧹 Warenkorb lokal leeren
     clearCart();     // ⛔ Supabase-Speichern blockieren
  sessionStorage.removeItem("cart-synced");
    
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
    
        // Nach erfolgreichem Logout: cart leeren
        setTimeout(() => {
          clearCart(); // <- aus CartContext
          console.log("[Logout] Cart geleert nach Logout");
        }, 300);
      } catch (error) {
        console.error("[Logout] Fehler beim Aktualisieren des Auth-Status:", error);
      }
    }
    
    // UI sofort aktualisieren
    revalidator.revalidate();
    
    // Manuell ein Storage-Event auslösen, um andere Komponenten zu benachrichtigen
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-changed"));
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
          <motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="cursor-pointer ml-2 relative"
>
  <Link to="/warenkorb">
    <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
    {totalItems > 0 && (
      <motion.div
        key={totalItems} 
        initial={{ scale: 1 }}
        animate={{ scale: justAdded ? [1.3, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow"
      >
        {totalItems}
      </motion.div>
    )}
  </Link>
</motion.div>

              {/* Mobile Menü Button */}
{/* Hamburger-Button */}
<div className="block md:hidden">
  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
    <motion.div
      initial={false}
      animate={{ rotate: mobileMenuOpen ? 360 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-6 h-6 flex items-center justify-center"
    >
      <Menu className="w-6 h-6 text-gray-600" />
    </motion.div>
  </button>
</div>
</div>
</div>

{/* Mobile Menü – ohne <Transition> */}
<div
  className={`fixed top-0 right-0 h-full z-[999] bg-gray-100 shadow-xl rounded-l-2xl transform transition-transform duration-300 ease-in-out ${
    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
  } w-fit max-w-[300px]`}
>
  {/* Blauer Kopfbereich */}
  <div className="bg-blue-100 px-6 py-6 rounded-t-2xl shadow-md relative">
    {user && (
      <p className="text-sm text-center">
        <span className="text-green-600 font-semibold">Hallo</span>{" "}
        <span className="text-gray-800 font-semibold">{user.vorname}</span>
      </p>
    )}
    <button
      onClick={() => setMobileMenuOpen(false)}
      className="absolute top-4 right-4"
    >
      <motion.div
        initial={false}
        animate={{ rotate: mobileMenuOpen ? 360 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-6 h-6 flex items-center justify-center"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </motion.div>
    </button>
  </div>

  {/* Navigation */}
  <div className="h-full px-6 py-6 flex flex-col justify-between text-base text-gray-800">
    <nav className="space-y-2 font-medium">
      <NavItem icon={HomeIcon} label="Webshop" to="/webshop" onClick={() => setMobileMenuOpen(false)} />
      <NavItem icon={BoxIcon} label="Schulboxen" to="/schulboxen" onClick={() => setMobileMenuOpen(false)} />
      <NavItem icon={UserGroupIcon} label="Über uns" to="/ueber-uns" onClick={() => setMobileMenuOpen(false)} />
      {isTeacher && (
        <NavItem icon={ToolboxIcon} label="Box Konfigurator" to="/konfigurator" onClick={() => setMobileMenuOpen(false)} />
      )}
      {isLoggedIn && (
        <>
          <hr className="my-2 border-gray-300" />
          <NavItem icon={UserIcon} label="Profil bearbeiten" to="/profil" onClick={() => setMobileMenuOpen(false)} />
          <NavItem icon={CartIcon} label="Meine Bestellungen" to="/bestellungen" onClick={() => setMobileMenuOpen(false)} />
          <hr className="my-2 border-gray-300" />
          <NavItem icon={LogoutIcon} label="Ausloggen" onClick={handleLogout} className="text-red-600 hover:text-red-700" />
        </>
      )}
      {!isLoggedIn && (
        <>
          <hr className="my-2 border-gray-300" />
          <NavItem icon={LoginIcon} label="Einloggen" onClick={() => { setLoginPopupOpen(true); setMobileMenuOpen(false); }} />
          <NavItem icon={RegisterIcon} label="Registrieren" to="/register" onClick={() => setMobileMenuOpen(false)} />
        </>
      )}
    </nav>
  </div>
</div>



      {/* Desktop Login Popup */}
      {loginPopupOpen && <LoginPopup onClose={() => setLoginPopupOpen(false)} />}
    </header>
  );
}
