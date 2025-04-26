// app/routes/login.tsx - Vereinfachte Version
import { Form, useActionData, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect } from "react";
import { supabase } from "~/lib/supabaseClient";
import { setSupabaseSessionCookie } from "~/lib/session.server";

// Typ für die Antwort vom Server
type LoginResponse = {
  success?: boolean;
  error?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error("[login.action] Login fehlgeschlagen:", error?.message);
      return json<LoginResponse>({ error: error?.message || "Login fehlgeschlagen." });
    }

    console.log("✅ Login erfolgreich:", { 
      email, 
      user_id: data.user?.id,
      session_token_length: data.session.refresh_token?.length || 0
    });
    
    // Setze nur den Session-Marker im Cookie
    const cookie = await setSupabaseSessionCookie(
      request, 
      data.session.refresh_token,
      data.session.access_token
    );

    // Speichere Tokens im localStorage (clientseitig)
    return json<LoginResponse>(
      { success: true },
      {
        headers: {
          "Set-Cookie": cookie,
          // Setze einen speziellen Header, der vom Client erkannt wird
          "X-Supabase-Refresh-Token": data.session.refresh_token,
          "X-Supabase-Access-Token": data.session.access_token
        }
      }
    );
  } catch (err) {
    console.error("[login.action] Unerwarteter Fehler:", err);
    return json<LoginResponse>({ 
      error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." 
    });
  }
};

export default function Login() {
  const actionData = useActionData<LoginResponse>();

  useEffect(() => {
    // Prüfe, ob die Antwort-Header Tokens enthalten
    const refreshToken = document.querySelector('meta[name="x-supabase-refresh-token"]')?.getAttribute('content');
    const accessToken = document.querySelector('meta[name="x-supabase-access-token"]')?.getAttribute('content');
    
    if (refreshToken && accessToken) {
      // Speichere Tokens im localStorage
      localStorage.setItem('sb-refresh-token', refreshToken);
      localStorage.setItem('sb-access-token', accessToken);
      
      // Navigiere zur Startseite
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 p-4">
      <h1 className="text-2xl font-bold mb-6">🔐 Login</h1>

      <Form method="post" className="flex flex-col gap-4 w-full max-w-sm">
        <input
          name="email"
          type="email"
          required
          placeholder="E-Mail"
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Passwort"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded px-4 py-2 disabled:opacity-50"
        >
          Einloggen
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
  );
}
