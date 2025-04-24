// app/lib/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

// Session-Name & Key
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // Session-Name (wichtig für Vercel + Supabase-Flow)
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

// ✅ Tokens aus der Session extrahieren
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("supabaseRefreshToken") as string | null;
  const access_token = session.get("supabaseAccessToken") as string | null;

  console.log("[getSupabaseTokensFromSession] Token gefunden:",
    refresh_token ? "refresh_token vorhanden" : "kein refresh_token",
    access_token ? "access_token vorhanden" : "kein access_token"
  );

  return { refresh_token, access_token };
}

// ✅ Tokens in Session speichern
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseRefreshToken", refresh_token);
  session.set("supabaseAccessToken", access_token);

  console.log("[setSupabaseSessionCookie] Tokens gespeichert:",
    refresh_token.substring(0, 10) + "...",
    access_token.substring(0, 10) + "..."
  );

  return await commitSession(session, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });
}

// Optional: Session löschen
export async function destroySupabaseSessionCookie(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}
