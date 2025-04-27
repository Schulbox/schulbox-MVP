import { useEffect, useState } from "react";
import { Form, useActionData, useNavigate, Link, useRevalidator } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { setSupabaseSessionCookie } from "~/lib/session.server";

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

  if (!email || !password) {
    return json<LoginResponse>({ error: "E-Mail und Passwort sind erforderlich" });
  }

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

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

  const cookie = await setSupabaseSessionCookie(
    request,
    data.session.refresh_token,
    data.session.access_token
  );

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
        ...(cookie ? { "Set-Cookie": cookie } : {})
      }
    }
  );
}

export default function Login() {
  const actionData = useActionData<LoginResponse>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();  // <-- hinzugefügt!
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (actionData?.success && actionData?.tokens) {
      setIsLoggingIn(true);
      try {
        localStorage.setItem('sb-refresh-token', actionData.tokens.refresh_token);
        localStorage.setItem('sb-access-token', actionData.tokens.access_token);
        localStorage.setItem('sb-auth-timestamp', Date.now().toString());
        localStorage.setItem('sb-is-logged-in', 'true');
        console.log("[Login] Tokens erfolgreich im localStorage gespeichert");

        // ✅ Seite neu validieren (user, isLoggedIn etc. wird neu geladen)
        revalidator.revalidate();

        // ✅ Danach auf Startseite navigieren
        navigate("/", { replace: true });
      } catch (error) {
        console.error("[Login] Fehler beim Speichern der Tokens:", error);
        alert("Fehler beim Speichern der Anmeldedaten. Bitte stellen Sie sicher, dass Cookies und localStorage aktiviert sind.");
        setIsLoggingIn(false);
      }
    }
  }, [actionData, navigate, revalidator]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>

        <Form method="post" className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              E-Mail Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="E-Mail"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              disabled={isLoggingIn}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Passwort"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              disabled={isLoggingIn}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition transform hover:scale-105 disabled:opacity-50"
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
            <p className="text-red-500 text-center text-sm mt-2">{actionData.error}</p>
          )}
        </Form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
