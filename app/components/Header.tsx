// app/components/Header.tsx
import { Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingCart } from "lucide-react";
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
  const [hoveredIcon, setHoveredIcon] = useState<"login" | "cart" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [user?.email]);

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
          {!user && (
            <div className="hidden md:flex items-center gap-4">
              {/* Login Icon */}
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

          {/* Warenkorb Icon immer */}
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

          {/* Hallo Box für eingeloggte Nutzer */}
          {user && (
            <div className="hidden md:flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
              <div className="text-xs text-gray-500">Hallo</div>
              <div className="text-sm font-semibold">{user.vorname} {user.nachname}</div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
}
