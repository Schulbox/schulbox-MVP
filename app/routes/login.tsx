// app/routes/login.tsx - localStorage-basierte Lösung
import { Form, useActionData, useNavigation, Link, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect } from "react";
import { supabase } from "~/lib/supabaseClient";
import { setSupabaseSessionCookie } from "~/lib/session.server";

type LoginResponse = {
  success?: boolean;
  tokens?: {
    refresh_token: string;
    access_token: string;
  };
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
      return json({ error: error?.message || "Login fehlgeschlagen." });
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

    // Übergebe die Tokens an den Client zur Speicherung im localStorage
    return json(
      { 
        success: true,
        tokens: {
          refresh_token: data.session.refresh_token,
          access_token: data.session.access_token
        }
      },
      {
        headers: {
          "Set-Cookie": cookie,
        }
      }
    );
  } catch (err) {
    console.error("[login.action] Unerwarteter Fehler:", err);
    return json({ 
      error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." 
    });
  }
};

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<LoginResponse>();
  const [searchParams] = useSearchParams();

// In login.tsx
useEffect(() => {
  // Wenn Login erfolgreich war und Tokens zurückgegeben wurden
  if (actionData && 
      'success' in actionData && 
      actionData.success === true && 
      'tokens' in actionData && 
      actionData.tokens) {
    
    // Speichere Tokens im localStorage
    localStorage.setItem('sb-refresh-token', actionData.tokens.refresh_token);
    localStorage.setItem('sb-access-token', actionData.tokens.access_token);
    
    // Navigiere zur Startseite
    window.location.href = "/";
  }
}, [actionData]);


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
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Einloggen..." : "Einloggen"}
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
