// app/routes/logout.tsx - Neue optimierte Logout-Komponente
import { useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { clearSupabaseSession } from "~/lib/session.server";
import { supabase } from "~/lib/supabaseClient";

// Server-seitiger Logout
export const action = async ({ request }: ActionFunctionArgs) => {
  // Lösche den Session-Marker im Cookie
  const cookie = await clearSupabaseSession(request);
  
  console.log("[logout.action] Session-Marker gelöscht");
  
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
};

// Redirect GET-Anfragen an die Logout-Route zur Startseite
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirect("/");
};

// Client-seitige Logout-Komponente
export default function Logout() {
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);
  
  useEffect(() => {
    const performLogout = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      
      try {
        console.log("[Logout] Starte Logout-Prozess");
        
        // Lösche Tokens aus localStorage sofort (für schnelleres UI-Feedback)
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('user-profile-cache');
        localStorage.removeItem('user-profile-cache-time');
        
        console.log("[Logout] Tokens aus localStorage gelöscht");
        
        // Führe den Server-Logout im Hintergrund durch
        const logoutPromise = supabase.auth.signOut();
        
        // Sende eine POST-Anfrage an die Logout-Route, um den Session-Marker zu löschen
        const cookiePromise = fetch("/logout", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        // Warte auf beide Prozesse, aber mit Timeout
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
        await Promise.race([
          Promise.all([logoutPromise, cookiePromise]),
          timeoutPromise
        ]);
        
        console.log("[Logout] Logout-Prozess abgeschlossen oder Timeout erreicht");
      } catch (error) {
        console.error("[Logout] Fehler beim Logout:", error);
      } finally {
        // Navigiere zur Login-Seite, unabhängig vom Ergebnis
        console.log("[Logout] Navigiere zur Login-Seite");
        navigate("/login", { replace: true });
      }
    };
    
    performLogout();
    
    return () => {
      isProcessingRef.current = false;
    };
  }, [navigate]);
  
  // Zeige eine Lade-Animation während des Logouts
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Abmelden...</p>
    </div>
  );
}
