// app/lib/shopify/auth.server.ts
import { shopify } from "./config.server";
import { redirect } from "@remix-run/node";
import { Readable } from "stream";
import { Request } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

// Hilfsfunktion zum Umwandeln in RawRequest
function toRawRequest(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    method: request.method,
    url: request.url,
    headers,
    body: request.body ? Readable.from(request.body as any) : undefined,
  };
}

export async function getAuthUrl(request: Request) {
  const shop = new URL(request.url).searchParams.get("shop");
  if (!shop) throw new Error("Missing shop parameter");

  const rawRequest = toRawRequest(request);

  return shopify.auth.begin({
    shop,
    callbackPath: "/api/shopify/callback",
    isOnline: true,
    rawRequest,
  });
}

export async function handleCallback(request: Request) {
  const rawRequest = toRawRequest(request);
  const { session } = await shopify.auth.callback({ rawRequest });

  if (!session || !session.accessToken) {
    throw new Error("Shopify-Authentifizierung fehlgeschlagen");
  }

  return session;
}

// Access Token aus Supabase holen
export async function getAccessToken(shop: string) {
  const { data, error } = await supabase
    .from("shopify_tokens")
    .select("*")
    .eq("shop", shop)
    .single();

  if (error || !data) throw new Error("Kein Token für diesen Shop");

  return data.access_token;
}




// ✅ Prüft, ob ein Access Token existiert
export async function hasValidAccessToken(shop: string) {
  const token = await getAccessToken(shop);
  return !!token;
}

// ✅ Gibt einen authentifizierten REST-Client für einen Shop zurück
export async function getAuthenticatedClient(shop: string) {
  const accessToken = await getAccessToken(shop);
  if (!accessToken) throw new Error("Kein gültiger Access Token vorhanden");

  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;
  session.scope = process.env.SHOPIFY_SCOPES || "";

  const client = new shopify.clients.Rest({ session });
  return client;
}
