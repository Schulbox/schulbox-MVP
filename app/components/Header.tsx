// app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useState } from "react";

type Props = {
  user?: {
    email: string;
    vorname?: string;
    nachname?: string;
    role?: string;
  };
};

export default function Header({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white px-6 py-4 shadow-sm flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Schulbox
      </Link>

      <nav className="flex items-center gap-6 relative">
        {user?.role === "lehrkraft" && (
          <Link to="/konfigurator" className="text-sm text-gray-700 hover:text-blue-600">
            📦 Box-Konfigurator
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">
              Einloggen
            </Link>
            <Link to="/register" className="text-sm text-gray-700 hover:text-blue-600">
              Registrieren
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              Hallo, {user.vorname} {user.nachname} ⌄
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md p-2 z-50">
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Meine Bestellungen
                </Link>
                <Link to="/profil" className="block px-4 py-2 text-sm hover:bg-gray-50">
                  Profil bearbeiten
                </Link>
                <FormLogout />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function FormLogout() {
  return (
    <form method="post" action="/logout">
      <button type="submit" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
        Ausloggen
      </button>
    </form>
  );
}
