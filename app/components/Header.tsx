import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";

// Typdefinition für die Header-Komponente
export type HeaderProps = {
  user: {
    email?: string;
    role?: string;
    vorname?: string;
    nachname?: string;
  } | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

export default function Header({ user, isLoggedIn, isLoading }: HeaderProps) {
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState<"login" | "cart" | "logout" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("sb-refresh-token");
      localStorage.removeItem("sb-access-token");
      localStorage.removeItem("sb-auth-timestamp");
      localStorage.removeItem("sb-is-logged-in");
      localStorage.removeItem("user-profile-cache");
      localStorage.removeItem("user-profile-cache-time");
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Schulbox
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium ml-6">
            <Link to="/" className="hover:text-blue-600">Startseite</Link>
            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
            <Link to="/about" className="hover:text-blue-600">Über uns</Link>
          </nav>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-600 relative">
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

          {isLoading ? (
            <div className="text-gray-500">Lade...</div>
          ) : isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition relative">
                <span className="text-xs text-gray-500">Hallo</span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {user.vorname} {user.nachname}
                </span>
              </div>
              <div
                className="relative group"
                onMouseEnter={() => setHoveredIcon("logout")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <motion.div
                  onClick={handleLogout}
                  initial={{ color: "#6B7280" }}
                  whileHover={{ scale: 1.2, color: "#EF4444" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer"
                >
                  <LogOut className="h-6 w-6" />
                </motion.div>
                <AnimatePresence>
                  {hoveredIcon === "logout" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none"
                    >
                      Abmelden
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
              >
                Einloggen
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm transition"
              >
                Registrieren
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}