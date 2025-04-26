// app/lib/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

// Hauptsession für normale App-Daten
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

// Separate Cookie-Storages für Supabase-Tokens mit konsistenten Namen
const refreshTokenStorage = createCookieSessionStorage({
  cookie: {
    name: "sb_refresh_token",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  },
});

const accessTokenStorage = createCookieSessionStorage({
  cookie: {
    name: "sb_access_token",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  },
});

// Hilfsfunktion zum Aufteilen eines Tokens
function splitToken(token: string, parts: number): string[] {
  const partLength = Math.ceil(token.length / parts);
  const result = [];
  
  for (let i = 0; i < parts; i++) {
    const start = i * partLength;
    const end = Math.min(start + partLength, token.length);
    result.push(token.substring(start, end));
  }
  
  return result;
}

/**
 * Speichert Supabase-Tokens in separaten Cookies
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
): Promise<string> {
  // Teile die Tokens in jeweils 3 Teile für kleinere Cookie-Größen
  const refreshTokenParts = splitToken(refresh_token, 3);
  const accessTokenParts = splitToken(access_token, 3);
  
  // Speichere die Token-Teile in den jeweiligen Sessions
  const refreshSession = await refreshTokenStorage.getSession();
  refreshTokenParts.forEach((part, index) => {
    refreshSession.set(`part${index + 1}`, part);
  });
  const refreshCookie = await refreshTokenStorage.commitSession(refreshSession);
  
  const accessSession = await accessTokenStorage.getSession();
  accessTokenParts.forEach((part, index) => {
    accessSession.set(`part${index + 1}`, part);
  });
  const accessCookie = await accessTokenStorage.commitSession(accessSession);
  
  // Setze einen Marker in der Hauptsession
  const mainSession = await getSession(request.headers.get("Cookie"));
  mainSession.set("has_supabase_tokens", true);
  const mainCookie = await commitSession(mainSession);
  
  console.log("[setSupabaseSessionCookie] Tokens aufgeteilt und in separaten Cookies gespeichert");
  
  // Kombiniere alle Cookies mit korrekter Formatierung (Semikolon-getrennt)
  return [mainCookie, refreshCookie, accessCookie].join("; ");
}

/**
 * Holt Supabase-Tokens aus separaten Cookies
 */
export async function getSupabaseTokensFromSession(request: Request) {
  // Hole die Token-Teile aus den separaten Sessions
  const refreshSession = await refreshTokenStorage.getSession(request.headers.get("Cookie"));
  const accessSession = await accessTokenStorage.getSession(request.headers.get("Cookie"));
  
  // Setze die Token-Teile zusammen
  let refresh_token = "";
  for (let i = 1; i <= 3; i++) {
    const part = refreshSession.get(`part${i}`) || "";
    refresh_token += part;
  }
  
  let access_token = "";
  for (let i = 1; i <= 3; i++) {
    const part = accessSession.get(`part${i}`) || "";
    access_token += part;
  }
  
  if (refresh_token) {
    console.log("[getSupabaseTokensFromSession] Refresh-Token gefunden:", refresh_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Refresh-Token gefunden");
  }
  
  if (access_token) {
    console.log("[getSupabaseTokensFromSession] Access-Token gefunden:", access_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Access-Token gefunden");
  }
  
  return {
    refresh_token: refresh_token || null,
    access_token: access_token || null
  };
}

/**
 * Löscht alle Supabase-Token-Cookies
 */
export async function clearSupabaseSession(request: Request): Promise<string> {
  const refreshCookie = await refreshTokenStorage.destroySession(
    await refreshTokenStorage.getSession(request.headers.get("Cookie"))
  );
  
  const accessCookie = await accessTokenStorage.destroySession(
    await accessTokenStorage.getSession(request.headers.get("Cookie"))
  );
  
  // Entferne den Marker aus der Hauptsession
  const mainSession = await getSession(request.headers.get("Cookie"));
  mainSession.unset("has_supabase_tokens");
  const mainCookie = await commitSession(mainSession);
  
  console.log("[clearSupabaseSession] Alle Token-Cookies gelöscht");
  
  // Kombiniere alle Cookies mit korrekter Formatierung
  return [mainCookie, refreshCookie, accessCookie].join("; ");
}
