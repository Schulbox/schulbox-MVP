// app/routes/login.tsx
import { Form, useActionData, useNavigation, Link } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";
import { setSupabaseSessionCookie } from "~/lib/session.server";

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
      return json({ error: error?.message || "Login fehlgeschlagen." });
    }

    const access_token = data.session.access_token;
    const refresh_token = data.session.refresh_token;

    console.log("✅ Login erfolgreich:", { email, user_id: data.user.id });

    // 👉 Setze Tokens direkt als Cookies – **ohne Remix-Session!**
    const headers = new Headers();
    headers.append("Set-Cookie", `sb-access-token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`);
    headers.append("Set-Cookie", `sb-refresh-token=${refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    return redirect("/", {
      headers,
    });
  } catch (err) {
    console.error("[login.action] Fehler:", err);
    return json({ error: "Ein unerwarteter Fehler ist aufgetreten." });
  }
};


export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

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
