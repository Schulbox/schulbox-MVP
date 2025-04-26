// localStorage-only Login-Komponente
import { useEffect, useState } from "react";
import { Form, useActionData, useNavigate, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { setSupabaseSessionCookie } from "~/lib/session.server";

// Typ für die Antwort vom Server
type LoginResponse = {
  success?: boolean;
  tokens?: {
    refresh_token: string;
    access_token: string;
  };
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validierung
  if (!email || !password) {
    return json<LoginResponse>({ error: "E-Mail und Passwort sind erforderlich" });
  }

  // Erstelle Supabase-Client
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Versuche Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[login.action] Login-Fehler:", error);
    return json<LoginResponse>({ error: error.message });
  }

  if (!data.session) {
    console.error("[login.action] Keine Session nach Login");
    return json<LoginResponse>({ error: "Login fehlgeschlagen" });
  }

  console.log("[login.action] Login erfolgreich:", {
    email: data.user?.email,
    user_id: data.user?.id,
    session_token_length: data.session.refresh_token.length,
  });

  // Setze Session-Cookie (leerer String im localStorage-only Ansatz)
  const cookie = await setSupabaseSessionCookie(
    request,
    data.session.refresh_token,
    data.session.access_token
  );

  // Gib Tokens direkt als JSON zurück
  return json<LoginResponse>(
    {
      success: true,
      tokens: {
        refresh_token: data.session.refresh_token,
        access_token: data.session.access_token
      }
    },
    {
      headers: {
        // Leerer Cookie-Header im localStorage-only Ansatz
        ...(cookie ? { "Set-Cookie": cookie } : {})
      }
    }
  );
}

export default function Login() {
  const actionData = useActionData<LoginResponse>();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Wenn Login erfolgreich war und Tokens zurückgegeben wurden
    if (actionData?.success && actionData?.tokens) {
      setIsLoggingIn(true);
      
      try {
        // Speichere Tokens im localStorage mit Zeitstempel
        localStorage.setItem('sb-refresh-token', actionData.tokens.refresh_token);
        localStorage.setItem('sb-access-token', actionData.tokens.access_token);
        localStorage.setItem('sb-auth-timestamp', Date.now().toString());
        
        // Speichere zusätzlich einen Login-Status-Flag
        localStorage.setItem('sb-is-logged-in', 'true');
        
        console.log("[Login] Tokens erfolgreich im localStorage gespeichert");
        
        // Navigiere zur Startseite mit Replace, um die Login-Seite aus dem Verlauf zu entfernen
        navigate("/", { replace: true });
      } catch (error) {
        console.error("[Login] Fehler beim Speichern der Tokens:", error);
        // Zeige Fehlermeldung an, falls localStorage nicht verfügbar ist
        alert("Es gab ein Problem beim Speichern der Anmeldedaten. Bitte stellen Sie sicher, dass Cookies und localStorage aktiviert sind.");
        setIsLoggingIn(false);
      }
    }
  }, [actionData, navigate]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 p-4">
      <div className="border p-2 rounded">
        <Form method="post" className="space-y-4 w-full max-w-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="E-Mail"
              className="border p-2 rounded w-full"
              disabled={isLoggingIn}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Passwort"
              className="border p-2 rounded w-full"
              disabled={isLoggingIn}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded px-4 py-2 disabled:opacity-50 w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Anmeldung läuft...
              </div>
            ) : (
              "Einloggen"
            )}
          </button>
          
          {actionData?.error && (
            <p className="text-red-500 text-sm">{actionData.error}</p>
          )}
        </Form>
        
        <p className="mt-6 text-sm text-center text-gray-600">
          Noch nicht registriert?{" "}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Jetzt hier registrieren.
          </Link>
        </p>
      </div>
    </div>
  );
}
