import { Form, useActionData, useNavigation, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";
import { useState } from "react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  // E-Mail Validation
  if (!email) {
    return json({ error: "Bitte E-Mail eingeben." });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return json({ error: "Bitte gültige E-Mail Adresse eingeben." });
  }

  // Passwort Validation
  if (!password) {
    return json({ error: "Bitte Passwort eingeben." });
  }

  // Login Versuchen
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("invalid login credentials")) {
      return json({ error: "Passwort nicht korrekt. Bitte prüfe das Passwort und gebe es erneut ein." });
    }
    return json({ error: error.message });
  }

  return redirect("/");
};

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert("Fehler beim Senden der Passwort zurücksetzen E-Mail.");
    } else {
      alert("Passwort zurücksetzen E-Mail wurde gesendet.");
    }
  };

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

      <p className="mt-2 text-sm text-center text-gray-600">
      <span
            onClick={() => handleForgotPassword(email)}
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
          >
            Passwort vergessen?
          </span>
      </p>
    </div>
  );
}
