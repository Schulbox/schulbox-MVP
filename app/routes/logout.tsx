// app/routes/logout.tsx
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session.server";
import { createServerClient } from "@supabase/auth-helpers-remix";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response: new Response() }
    );

    // Supabase ausloggen (Client-Session invalidieren)
    await supabase.auth.signOut();

    // Session holen & Cookies leeren
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("supabaseRefreshToken");
    session.unset("supabaseAccessToken");
    const cookie = await destroySession(session);

    console.log("[logout.loader] Benutzer erfolgreich ausgeloggt");

    return redirect("/login", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    console.error("[logout.loader] Fehler beim Ausloggen:", error);
    return redirect("/login");
  }
}
