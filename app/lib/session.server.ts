// app/lib/session.server.ts - localStorage-basierte Lösung
import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * Speichert nur einen Marker, dass der Benutzer eingeloggt ist
 * Die eigentlichen Tokens werden im localStorage gespeichert
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
): Promise<string> {
  // Speichere nur einen Marker in der Session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("has_supabase_session", true);
  
  console.log("[setSupabaseSessionCookie] Session-Marker gesetzt");
  
  return await commitSession(session);
}

/**
 * Prüft nur, ob der Benutzer eingeloggt ist
 * Die eigentlichen Tokens werden clientseitig aus localStorage geholt
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const hasSession = session.get("has_supabase_session");
  
  if (hasSession) {
    console.log("[getSupabaseTokensFromSession] Session-Marker gefunden, verwende localStorage-Tokens");
    // Die echten Tokens werden clientseitig aus localStorage geholt
    return {
      refresh_token: "client-side-token", // Platzhalter
      access_token: "client-side-token"   // Platzhalter
    };
  }
  
  console.log("[getSupabaseTokensFromSession] Kein Session-Marker gefunden");
  return {
    refresh_token: null,
    access_token: null
  };
}

/**
 * Löscht den Session-Marker
 * Die Tokens im localStorage müssen clientseitig gelöscht werden
 */
export async function clearSupabaseSession(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("has_supabase_session");
  
  console.log("[clearSupabaseSession] Session-Marker gelöscht");
  
  return await commitSession(session);
}
