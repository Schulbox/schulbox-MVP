import { Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { LogOut, ShoppingCart } from "lucide-react";

// Typdefinition für Props
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

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
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Schulbox
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Startseite</Link>
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <Link to="/ueber-uns" className="hover:text-blue-600">Über uns</Link>
        </nav>

        <div className="flex items-center gap-4 relative">
          {isLoading ? (
            <div className="text-gray-500 text-sm">Lade...</div>
          ) : isLoggedIn && user ? (
            <>
              <div
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl text-sm flex flex-col items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-gray-500">Hallo</span>
                <span className="font-medium">{user.vorname} {user.nachname}</span>
              </div>

              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-12 bg-white shadow-md rounded-lg border text-sm w-48 z-50"
                >
                  <Link to="/profil" className="block px-4 py-2 hover:bg-gray-100">🧾 Profil bearbeiten</Link>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">🛒 Einkaufswagen</Link>
                  <div className="border-t mt-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    🚪 Ausloggen
                  </button>
                </div>
              )}

              <Link to="/cart" className="ml-2">
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link to="/login" className="text-blue-600 hover:underline">Einloggen</Link>
              <Link to="/register" className="text-blue-600 hover:underline">Registrieren</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
