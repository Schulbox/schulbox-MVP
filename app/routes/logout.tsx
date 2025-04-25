// app/routes/logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { destroySession, getSession } from "~/lib/session.server";
import { supabase } from "~/lib/supabaseClient";

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Supabase ausloggen (optional, da nur auf Clientseite effektiv)
    await supabase.auth.signOut();

    // Session-Cookie löschen
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("supabaseRefreshToken");
    session.unset("supabaseAccessToken");
    const sessionCookie = await destroySession(session);

    console.log("[logout.action] Benutzer erfolgreich ausgeloggt");

    return redirect("/login", {
      headers: {
        "Set-Cookie": [
          sessionCookie,
          // Supabase-Cookies löschen
          "sb-access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
          "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
        ].join(", "),
      },
    });
  } catch (error) {
    console.error("[logout.action] Fehler beim Ausloggen:", error);
    return redirect("/login");
  }
}

export default function Logout() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 p-4">
      <h1 className="text-2xl font-bold mb-6">🚪 Ausloggen</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <p className="mb-6 text-center">
          Möchten Sie sich wirklich ausloggen?
        </p>

        <Form method="post" className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-center"
            >
              Abbrechen
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ausloggen
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
