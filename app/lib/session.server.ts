// app/lib/session.server.ts
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
 * Hilfsfunktion zum Aufteilen eines Tokens in mehrere Teile
 */
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
 * Hilfsfunktion zum Zusammensetzen eines Tokens aus mehreren Teilen
 */
function joinTokenParts(session: any, prefix: string, parts: number): string {
  let token = '';
  
  for (let i = 0; i < parts; i++) {
    const part = session.get(`${prefix}${i}`);
    if (part) token += part;
  }
  
  return token;
}

/**
 * ✅ Speichert beide Tokens in mehreren kleineren Cookies für Firefox-Kompatibilität
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));

  // Teile die Tokens in jeweils 3 Teile auf (unter ~1400 Bytes pro Teil)
  const refreshTokenParts = splitToken(refresh_token, 3);
  const accessTokenParts = splitToken(access_token, 3);
  
  // Speichere die Teile in separaten Session-Einträgen
  refreshTokenParts.forEach((part, index) => {
    session.set(`sbt${index}`, part); // sbt = Supabase Refresh Token
  });
  
  accessTokenParts.forEach((part, index) => {
    session.set(`sat${index}`, part); // sat = Supabase Access Token
  });

  console.log("[setSupabaseSessionCookie] Tokens aufgeteilt und gespeichert:", 
    refresh_token.substring(0, 10) + "...", 
    access_token.substring(0, 10) + "..."
  );

  return await commitSession(session);
}

/**
 * ✅ Holt Tokens aus der Session und setzt sie wieder zusammen
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  
  // Setze die Token-Teile wieder zusammen
  const refresh_token = joinTokenParts(session, "sbt", 3);
  const access_token = joinTokenParts(session, "sat", 3);

  if (refresh_token) {
    console.log("[getSupabaseTokensFromSession] Refresh-Token zusammengesetzt:", refresh_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Refresh-Token in der Session gefunden");
  }

  if (access_token) {
    console.log("[getSupabaseTokensFromSession] Access-Token zusammengesetzt:", access_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Access-Token in der Session gefunden");
  }

  return {
    refresh_token: refresh_token || null,
    access_token: access_token || null
  };
}

/**
 * Löscht alle Token-Teile aus der Session
 */
export async function clearSupabaseSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  
  // Lösche alle Token-Teile
  for (let i = 0; i < 3; i++) {
    session.unset(`sbt${i}`);
    session.unset(`sat${i}`);
  }
  
  console.log("[clearSupabaseSession] Alle Token-Teile aus der Session gelöscht");
  
  return await commitSession(session);
}
