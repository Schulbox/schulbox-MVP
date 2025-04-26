// app/components/LoginModal.tsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";

type LoginModalProps = {
  onClose: () => void;
};

export function LoginModal({ onClose }: LoginModalProps) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/login", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000); // 1 Sekunde Erfolg anzeigen, dann Modal schließen
    } else {
      alert("Login fehlgeschlagen. Bitte prüfe deine Eingaben.");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Hintergrund */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal-Inhalt */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Schließen"
          >
            ✕
          </button>

          {success ? (
            <div className="text-center text-green-600 text-lg font-semibold">
              ✅ Erfolgreich eingeloggt!
            </div>
          ) : (
            <>
              <Dialog.Title className="text-lg font-bold mb-4 text-center">Login</Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-Mail-Adresse"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Passwort"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                >
                  Einloggen
                </button>
              </form>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
