// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShoppingCart, LogOut } from "lucide-react";

type HeaderProps = {
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
  const [hoveredIcon, setHoveredIcon] = useState<"login" | "cart" | "logout" | null>(null);

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
        {/* Logo + Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-box.png" alt="Schulbox Icon" className="h-10 block md:hidden" />
            <img src="/logo.png" alt="Schulbox Logo" className="h-10 hidden md:block" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600">Startseite</Link>
            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
            <Link to="/about" className="hover:text-blue-600">Über uns</Link>
          </nav>
        </div>

        {/* Icons rechts */}
        <div className="flex items-center gap-4 text-gray-600 relative">
          {isLoading ? (
            <div className="text-gray-400 text-sm">Lade...</div>
          ) : isLoggedIn ? (
            <>
              {/* Warenkorb */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredIcon("cart")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <Link to="/cart">
                  <motion.div
                    whileHover={{ scale: 1.2, color: "#3B82F6" }}
                    whileTap={{ scale: 0.9 }}
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
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1"
                    >
                      Warenkorb
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hallo-Box */}
              <div className="flex flex-col items-center px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                <span className="text-xs text-gray-500 leading-none">Hallo</span>
                <span className="text-sm font-semibold text-gray-800 leading-none">
                  {user?.vorname} {user?.nachname}
                </span>
              </div>

              {/* Logout */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredIcon("logout")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <motion.div
                  onClick={handleLogout}
                  whileHover={{ scale: 1.2, color: "#EF4444" }}
                  whileTap={{ scale: 0.9 }}
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
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1"
                    >
                      Abmelden
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Einloggen
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm"
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