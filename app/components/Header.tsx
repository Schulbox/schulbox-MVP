import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { LoginModal } from "~/components/LoginModal";

type UserType = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email?: string;
} | null;

export default function Header({ user }: { user: UserType }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<"login" | "cart" | "logout" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLinkClick = () => setMenuOpen(false);

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

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      console.log("Logout gestartet...");
      localStorage.removeItem('sb-refresh-token');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('user-profile-cache');
      localStorage.removeItem('user-profile-cache-time');
      console.log("Tokens aus localStorage gelöscht");
      await fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
      console.log("Logout-Anfrage gesendet");
      navigate("/login");
    } catch (error) {
      console.error("Fehler beim Logout:", error);
      navigate("/login");
    }
  };

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

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600 relative">
          {/* Login */}
          {!user && (
            <div className="hidden md:flex items-center gap-4">
              <div
                className="relative group"
                onMouseEnter={() => setHoveredIcon("login")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <motion.div
                  onClick={() => {
                    if (window.innerWidth > 768) {
                      setShowLoginModal(true);
                    } else {
                      navigate("/login");
                    }
                  }}
                  initial={{ color: "#6B7280" }}
                  whileHover={{ scale: 1.2, color: "#3B82F6" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer"
                >
                  <User className="h-6 w-6" />
                </motion.div>
                <AnimatePresence>
                  {hoveredIcon === "login" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none"
                    >
                      Einloggen
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Warenkorb Icon */}
          <div
            className="relative group"
            onMouseEnter={() => setHoveredIcon("cart")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <Link to="/cart" title="Warenkorb">
              <motion.div
                initial={{ color: "#6B7280" }}
                whileHover={{ scale: 1.2, color: "#3B82F6" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              >
                <ShoppingCart className="h-6 w-6" />
              </motion.div>
            </Link>
            <AnimatePresence>
              {hoveredIcon === "cart" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none"
                >
                  Warenkorb
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hallo Box */}
          {user && (
            <div className="hidden md:flex flex-col items-center justify-center relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition relative"
              >
                <div className="text-xs text-gray-500">Hallo</div>
                <div className="text-sm font-semibold flex items-center gap-1">
                  {user.vorname} {user.nachname}
                  <motion.span
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </div>
              </button>

              {/* Dropdown */}
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
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                  >
                    Ausloggen
                  </button>
                </div>
              </Transition>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
}
