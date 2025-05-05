// app/lib/shopify/auth.server.ts
import { shopify, shopifyStore } from "./config.server";
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";
import type { Session } from "@shopify/shopify-api";



// Generiert die OAuth-URL für die Shopify-Autorisierung
export function getAuthUrl(request: Request) {
  return shopify.auth.begin({
    shop: shopifyStore,
    callbackPath: "/auth/callback",
    isOnline: true,
    rawRequest: request,
  });
}

// Verarbeitet den OAuth-Callback und speichert das Access Token
export async function handleCallback(request: Request) {
  try {
    const { session } = await shopify.auth.callback({
      rawRequest: request,
    });

    if (!session || !session.accessToken) {
      throw new Error("Shopify-Authentifizierung fehlgeschlagen");
    }

    // Speichere das Access Token in Supabase
    const { error } = await supabase
      .from("shopify_tokens")
      .upsert(
        {
          shop: shopifyStore,
          access_token: session.accessToken,
          scope: session.scope,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "shop" }
      );

    if (error) {
      console.error("Fehler beim Speichern des Access Tokens:", error);
      throw new Error("Token konnte nicht gespeichert werden");
    }

    return redirect("/konfigurator");
  } catch (error) {
    console.error("Fehler bei der Shopify-Authentifizierung:", error);
    return redirect("/auth/error");
  }
}

// Holt das gespeicherte Access Token aus der Datenbank
export async function getAccessToken() {
  const { data, error } = await supabase
    .from("shopify_tokens")
    .select("access_token")
    .eq("shop", shopifyStore)
    .single();

  if (error || !data) {
    return null;
  }

  return data.access_token;
}

// Prüft, ob ein gültiges Access Token vorhanden ist
export async function hasValidAccessToken() {
  const token = await getAccessToken();
  return !!token;
}

// Erstellt einen authentifizierten Shopify-Client mit dem gespeicherten Token
// Erstellt einen authentifizierten Shopify-Client mit dem gespeicherten Token
export async function getAuthenticatedClient() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Kein Access Token vorhanden");
  }

  const session = shopify.session.customAppSession(shopifyStore);
  session.accessToken = accessToken;
  session.scope = process.env.SHOPIFY_SCOPES || "";

  const client = new shopify.clients.Rest({ session });
  return client;
}


