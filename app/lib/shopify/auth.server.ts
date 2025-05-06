// app/lib/shopify/auth.server.ts
import { shopify } from "./config.server";
import { redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

// ✅ Startet die OAuth-Autorisierung
export async function getAuthUrl(request: Request) {
  const shop = new URL(request.url).searchParams.get("shop");
  if (!shop) throw new Error("Missing shop parameter");

  const rawRequest = request as any; // Shopify akzeptiert Node.js-kompatibles Objekt
  return shopify.auth.begin({
    shop,
    callbackPath: "/api/shopify-auth-callback",
    isOnline: true,
    rawRequest,
  });
}

// ✅ Verarbeitet den Callback nach Shopify-Login
export async function handleCallback(request: Request) {
  try {
    const rawRequest = request as any;

    const { session } = await shopify.auth.callback({ rawRequest });

    if (!session?.accessToken) {
      throw new Error("Shopify-Authentifizierung fehlgeschlagen");
    }

    const { error } = await supabase
      .from("shopify_tokens")
      .upsert({
        shop: session.shop,
        access_token: session.accessToken,
        scope: session.scope,
        updated_at: new Date().toISOString(),
      }, { onConflict: "shop" });

    if (error) {
      console.error("Fehler beim Speichern des Tokens:", error);
      throw new Error("Token konnte nicht gespeichert werden");
    }

    return redirect("/konfigurator");
  } catch (err) {
    console.error("Callback-Fehler:", err);
    return redirect("/auth/error");
  }
}

// ✅ Holt das gespeicherte Access Token für einen Shop
export async function getAccessToken(shop: string) {
  const { data, error } = await supabase
    .from("shopify_tokens")
    .select("access_token")
    .eq("shop", shop)
    .single();

  if (error || !data) return null;
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
