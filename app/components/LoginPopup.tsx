import { Form, useNavigate } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRevalidator, useFetcher } from "@remix-run/react"; // <-- fetcher statt useActionData
import { LoginResponse } from "~/types";

export default function LoginPopup({ onClose }: { onClose: () => void }) {
  const fetcher = useFetcher<LoginResponse>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.tokens) {
      // Tokens im localStorage speichern
      localStorage.setItem('sb-refresh-token', fetcher.data.tokens.refresh_token);
      localStorage.setItem('sb-access-token', fetcher.data.tokens.access_token);
      localStorage.setItem('sb-auth-timestamp', Date.now().toString());
      localStorage.setItem('sb-is-logged-in', 'true');
  
      console.log("[LoginPopup] Tokens erfolgreich im localStorage gespeichert");
  
      // Jetzt revalidieren
      window.dispatchEvent(new Event("storage"));
  
      // Und Popup schließen
      onClose();
    }
  }, [fetcher.data, revalidator, onClose]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white/90 backdrop-blur-md ring-1 ring-black ring-opacity-5 p-6 z-50"
      >
        <fetcher.Form method="post" action="/login" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="E-Mail"
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded px-4 py-2 transition"
          >
            {isSubmitting ? "Einloggen..." : "Einloggen"}
          </button>
          <div className="border-t my-4" />
          <div className="text-center text-sm">
            Noch kein Konto?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Jetzt hier registrieren
            </button>
          </div>
        </fetcher.Form>
      </motion.div>
    </AnimatePresence>
  );
}
