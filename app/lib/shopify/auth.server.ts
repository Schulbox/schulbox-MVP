// app/lib/shopify/auth.server.ts
import { shopify } from "./config.server";
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";
import type { Session } from "@shopify/shopify-api";

// ✅ Generiert die OAuth-URL für die Shopify-Autorisierung
export function getAuthUrl(request: Request) {
  const shop = new URL(request.url).searchParams.get("shop");
  if (!shop) throw new Error("Missing shop parameter");

  const rawRequest = shopify.api.adaptRequest(request);

  return shopify.auth.begin({
    shop,
    callbackPath: "/auth/callback",
    isOnline: true,
    rawRequest,
  });
}

// ✅ Verarbeitet den OAuth-Callback und speichert das Access Token
export async function handleCallback(request: Request) {
  try {
    const rawRequest = shopify.api.adaptRequest(request); // ✅ korrekt ersetzen!

    const { session } = await shopify.auth.callback({
      rawRequest,
    });

    if (!session || !session.accessToken) {
      throw new Error("Shopify-Authentifizierung fehlgeschlagen");
    }

    const { error } = await supabase
      .from("shopify_tokens")
      .upsert(
        {
          shop: session.shop,
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

// ✅ Holt das gespeicherte Access Token aus der Datenbank
export async function getAccessToken(shop: string) {
  const { data, error } = await supabase
    .from("shopify_tokens")
    .select("access_token")
    .eq("shop", shop)
    .single();

  if (error || !data) {
    return null;
  }

  return data.access_token;
}

// ✅ Prüft, ob ein gültiges Access Token vorhanden ist
export async function hasValidAccessToken(shop: string) {
  const token = await getAccessToken(shop);
  return !!token;
}

// ✅ Erstellt einen authentifizierten Shopify-Client mit dem gespeicherten Token
export async function getAuthenticatedClient(shop: string) {
  const accessToken = await getAccessToken(shop);

  if (!accessToken) {
    throw new Error("Kein Access Token vorhanden");
  }

  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;
  session.scope = process.env.SHOPIFY_SCOPES || "";

  const client = new shopify.clients.Rest({ session });
  return client;
}
