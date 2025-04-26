// Vereinfachte Session-Server-Implementierung mit direktem Cookie-Zugriff
import { createCookieSessionStorage } from "@remix-run/node";

// Definiere eine längere Cookie-Lebensdauer
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage in Sekunden

// Vereinfachte Cookie-Namen für direkten Zugriff
const SESSION_COOKIE_NAME = "sb-session-marker";

// Vereinfachte Cookie-Einstellungen
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_COOKIE_NAME,
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * Setzt ein einfaches Session-Cookie direkt
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
): Promise<string> {
  // Erstelle ein einfaches Cookie mit dem Session-Marker
  const cookieValue = "true";
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
  
  console.log("[setSupabaseSessionCookie] Setze einfaches Session-Cookie:", cookieValue);
  
  // Gib das Cookie direkt zurück
  return `${SESSION_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`;
}

/**
 * Prüft, ob das Session-Cookie vorhanden ist
 */
export async function getSupabaseTokensFromSession(request: Request) {
  // Hole alle Cookies aus dem Request
  const cookieHeader = request.headers.get("Cookie") || "";
  console.log("[getSupabaseTokensFromSession] Cookie-Header:", cookieHeader);
  
  // Suche direkt nach dem Session-Cookie
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const sessionCookie = cookies.find(cookie => cookie.startsWith(`${SESSION_COOKIE_NAME}=`));
  
  console.log("[getSupabaseTokensFromSession] Gefundenes Session-Cookie:", sessionCookie);
  
  if (sessionCookie) {
    console.log("[getSupabaseTokensFromSession] Session-Cookie gefunden");
    return {
      refresh_token: "client-side-token",
      access_token: "client-side-token"
    };
  }
  
  console.log("[getSupabaseTokensFromSession] Kein Session-Cookie gefunden");
  return {
    refresh_token: null,
    access_token: null
  };
}

/**
 * Löscht das Session-Cookie
 */
export async function clearSupabaseSession(request: Request): Promise<string> {
  console.log("[clearSupabaseSession] Session-Cookie gelöscht");
  
  // Setze das Cookie mit einem Ablaufdatum in der Vergangenheit
  const expires = new Date(0); // 1970-01-01
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`;
}
