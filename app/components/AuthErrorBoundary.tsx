// app/components/AuthErrorBoundary.tsx
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

interface AuthErrorBoundaryProps {
  error?: Error;
  children: React.ReactNode;
}

export default function AuthErrorBoundary({ error, children }: AuthErrorBoundaryProps) {
  const [hasAuthError, setHasAuthError] = useState(false);
  
  useEffect(() => {
    // Prüfe, ob ein Authentifizierungsfehler vorliegt
    if (error && (
      error.message.includes("auth") || 
      error.message.includes("token") || 
      error.message.includes("session") ||
      error.message.includes("user.id")
    )) {
      console.error("[AuthErrorBoundary] Authentifizierungsfehler erkannt:", error);
      setHasAuthError(true);
    }
  }, [error]);
  
  if (!hasAuthError) {
    return <>{children}</>;
  }
  
  return (
    <div className="p-6 max-w-md mx-auto my-8 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-semibold text-red-700 mb-4">Authentifizierungsproblem</h2>
      <p className="mb-4 text-red-600">
        Es ist ein Problem mit Ihrer Anmeldung aufgetreten. Dies kann folgende Ursachen haben:
      </p>
      <ul className="list-disc pl-5 mb-6 text-red-600 space-y-1">
        <li>Ihre Sitzung ist abgelaufen</li>
        <li>Ihre Anmeldedaten konnten nicht verifiziert werden</li>
        <li>Es liegt ein technisches Problem mit dem Authentifizierungsdienst vor</li>
      </ul>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          to="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
        >
          Erneut anmelden
        </Link>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-center"
        >
          Seite neu laden
        </button>
      </div>
    </div>
  );
}
