// app/components/Footer.tsx
import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-gray-500">
          <span>© 2025 Schulbox</span>
          <span className="text-gray-300">|</span>
          <Link to="/impressum" className="hover:text-blue-600 transition">Impressum</Link>
          <span className="text-gray-300">|</span>
          <Link to="/datenschutz" className="hover:text-blue-600 transition">Datenschutz</Link>
          <span className="text-gray-300">|</span>
          <Link to="/agb" className="hover:text-blue-600 transition">AGB</Link>
          <span className="text-gray-300">|</span>
          <Link to="/widerruf" className="hover:text-blue-600 transition">Widerruf</Link>
          <span className="text-gray-300">|</span>
          <Link to="/kontakt" className="hover:text-blue-600 transition">Kontakt</Link>
        </div>
      </div>
    </footer>
  );
}
