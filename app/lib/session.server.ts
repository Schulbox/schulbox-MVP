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

// Separate Cookie-Storages für Supabase-Tokens
const createTokenStorage = (name: string) => createCookieSessionStorage({
  cookie: {
    name,
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  },
});

const refreshTokenStorage1 = createTokenStorage("sb_rt_1");
const refreshTokenStorage2 = createTokenStorage("sb_rt_2");
const refreshTokenStorage3 = createTokenStorage("sb_rt_3");
const accessTokenStorage1 = createTokenStorage("sb_at_1");
const accessTokenStorage2 = createTokenStorage("sb_at_2");
const accessTokenStorage3 = createTokenStorage("sb_at_3");

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
  // Teile die Tokens in jeweils 3 Teile
  const refreshTokenParts = splitToken(refresh_token, 3);
  const accessTokenParts = splitToken(access_token, 3);
  
  // Speichere jeden Teil in einem separaten Cookie
  const refreshSession1 = await refreshTokenStorage1.getSession();
  refreshSession1.set("token", refreshTokenParts[0]);
  const refreshCookie1 = await refreshTokenStorage1.commitSession(refreshSession1);
  
  const refreshSession2 = await refreshTokenStorage2.getSession();
  refreshSession2.set("token", refreshTokenParts[1]);
  const refreshCookie2 = await refreshTokenStorage2.commitSession(refreshSession2);
  
  const refreshSession3 = await refreshTokenStorage3.getSession();
  refreshSession3.set("token", refreshTokenParts[2]);
  const refreshCookie3 = await refreshTokenStorage3.commitSession(refreshSession3);
  
  const accessSession1 = await accessTokenStorage1.getSession();
  accessSession1.set("token", accessTokenParts[0]);
  const accessCookie1 = await accessTokenStorage1.commitSession(accessSession1);
  
  const accessSession2 = await accessTokenStorage2.getSession();
  accessSession2.set("token", accessTokenParts[1]);
  const accessCookie2 = await accessTokenStorage2.commitSession(accessSession2);
  
  const accessSession3 = await accessTokenStorage3.getSession();
  accessSession3.set("token", accessTokenParts[2]);
  const accessCookie3 = await accessTokenStorage3.commitSession(accessSession3);
  
  // Setze einen Marker in der Hauptsession
  const mainSession = await getSession(request.headers.get("Cookie"));
  mainSession.set("has_supabase_tokens", true);
  const mainCookie = await commitSession(mainSession);
  
  console.log("[setSupabaseSessionCookie] Tokens aufgeteilt und in separaten Cookies gespeichert:", 
    refresh_token.substring(0, 10) + "...", 
    access_token.substring(0, 10) + "..."
  );
  
  // Kombiniere alle Cookies
  return [
    mainCookie,
    refreshCookie1,
    refreshCookie2,
    refreshCookie3,
    accessCookie1,
    accessCookie2,
    accessCookie3
  ].join(", ");
}

/**
 * Holt Supabase-Tokens aus separaten Cookies
 */
export async function getSupabaseTokensFromSession(request: Request) {
  // Hole alle Token-Teile aus den separaten Cookies
  const refreshSession1 = await refreshTokenStorage1.getSession(request.headers.get("Cookie"));
  const refreshSession2 = await refreshTokenStorage2.getSession(request.headers.get("Cookie"));
  const refreshSession3 = await refreshTokenStorage3.getSession(request.headers.get("Cookie"));
  
  const accessSession1 = await accessTokenStorage1.getSession(request.headers.get("Cookie"));
  const accessSession2 = await accessTokenStorage2.getSession(request.headers.get("Cookie"));
  const accessSession3 = await accessTokenStorage3.getSession(request.headers.get("Cookie"));
  
  // Setze die Token-Teile zusammen
  const refreshTokenPart1 = refreshSession1.get("token") || "";
  const refreshTokenPart2 = refreshSession2.get("token") || "";
  const refreshTokenPart3 = refreshSession3.get("token") || "";
  const refresh_token = refreshTokenPart1 + refreshTokenPart2 + refreshTokenPart3;
  
  const accessTokenPart1 = accessSession1.get("token") || "";
  const accessTokenPart2 = accessSession2.get("token") || "";
  const accessTokenPart3 = accessSession3.get("token") || "";
  const access_token = accessTokenPart1 + accessTokenPart2 + accessTokenPart3;
  
  if (refresh_token) {
    console.log("[getSupabaseTokensFromSession] Refresh-Token zusammengesetzt:", refresh_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Refresh-Token gefunden");
  }
  
  if (access_token) {
    console.log("[getSupabaseTokensFromSession] Access-Token zusammengesetzt:", access_token.substring(0, 10) + "...");
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
  const refreshCookie1 = await refreshTokenStorage1.destroySession(await refreshTokenStorage1.getSession(request.headers.get("Cookie")));
  const refreshCookie2 = await refreshTokenStorage2.destroySession(await refreshTokenStorage2.getSession(request.headers.get("Cookie")));
  const refreshCookie3 = await refreshTokenStorage3.destroySession(await refreshTokenStorage3.getSession(request.headers.get("Cookie")));
  
  const accessCookie1 = await accessTokenStorage1.destroySession(await accessTokenStorage1.getSession(request.headers.get("Cookie")));
  const accessCookie2 = await accessTokenStorage2.destroySession(await accessTokenStorage2.getSession(request.headers.get("Cookie")));
  const accessCookie3 = await accessTokenStorage3.destroySession(await accessTokenStorage3.getSession(request.headers.get("Cookie")));
  
  // Entferne den Marker aus der Hauptsession
  const mainSession = await getSession(request.headers.get("Cookie"));
  mainSession.unset("has_supabase_tokens");
  const mainCookie = await commitSession(mainSession);
  
  console.log("[clearSupabaseSession] Alle Token-Cookies gelöscht");
  
  // Kombiniere alle Cookies
  return [
    mainCookie,
    refreshCookie1,
    refreshCookie2,
    refreshCookie3,
    accessCookie1,
    accessCookie2,
    accessCookie3
  ].join(", ");
}
