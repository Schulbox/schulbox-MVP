import { Form, useNavigate } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRevalidator, useFetcher } from "@remix-run/react";
import { X } from "lucide-react";
import { useOutletContext } from "@remix-run/react";

type OutletContextType = {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    refreshAuth: () => Promise<void>;
};

type User = {
    email?: string;
    role?: string;
    vorname?: string;
    nachname?: string;
} | null;

type LoginResponse = {
    success?: boolean;
    tokens?: {
        refresh_token: string;
        access_token: string;
    };
    error?: string;
};

export default function LoginPopup({ onClose }: { onClose: () => void }) {
  const fetcher = useFetcher<LoginResponse>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const revalidator = useRevalidator();

  // Schließen beim Klicken außerhalb des Popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.tokens) {
      setIsSubmitting(false);
      
      // Tokens speichern
      localStorage.setItem('sb-refresh-token', fetcher.data.tokens.refresh_token);
      localStorage.setItem('sb-access-token', fetcher.data.tokens.access_token);
      localStorage.setItem('sb-auth-timestamp', Date.now().toString());
      localStorage.setItem('sb-is-logged-in', 'true');

      console.log("[LoginPopup] Tokens erfolgreich im localStorage gespeichert");

      // Seite neu validieren
      revalidator.revalidate();
      
      // Popup schließen
      onClose();
    } else if (fetcher.data?.error) {
      setIsSubmitting(false);
    }
  }, [fetcher.data, revalidator, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Schließen"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-center mb-6">Anmelden</h2>
        
        <fetcher.Form method="post" action="/login" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Ihre E-Mail-Adresse"
              required
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Ihr Passwort"
              required
              className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {fetcher.data?.error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {fetcher.data.error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Anmeldung läuft...
              </div>
            ) : (
              "Einloggen"
            )}
          </button>
          
          <div className="border-t my-4" />
          
          <div className="text-center text-sm">
            Noch kein Konto?{" "}
            <button
              type="button"
              onClick={() => {
                navigate("/register");
                onClose();
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Jetzt hier registrieren
            </button>
          </div>
        </fetcher.Form>
      </motion.div>
    </div>
  );
}
