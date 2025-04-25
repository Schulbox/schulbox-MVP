import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session.server";
import { getSupabaseServerClient } from "~/lib/supabase.server";

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args;
  const session = await getSession(request.headers.get("Cookie"));

  const supabaseAccessToken = session.get("supabaseAccessToken");
  const supabaseRefreshToken = session.get("supabaseRefreshToken");

  const supabase = getSupabaseServerClient(args); // <- GANZES Objekt

  try {
    if (supabaseAccessToken && supabaseRefreshToken) {
      await supabase.auth.signOut();
      console.log("[logout] Supabase-Session erfolgreich abgemeldet");
    }
  } catch (err) {
    console.warn("[logout] Fehler beim Supabase signOut:", err);
  }

  session.unset("supabaseRefreshToken");
  session.unset("supabaseAccessToken");
  const sessionCookie = await destroySession(session);

  console.log("[logout] Benutzer erfolgreich ausgeloggt");

  return redirect("/login", {
    headers: new Headers([
      ["Set-Cookie", sessionCookie],
      ["Set-Cookie", "sb-access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"],
      ["Set-Cookie", "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"],
    ]),
  });
}
