import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { shopify } from "~/lib/shopify/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const rawRequest = {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    body: undefined,
  };

  const { session } = await shopify.auth.callback({ rawRequest });

  if (!session || !session.accessToken) {
    throw new Error("Shopify Auth fehlgeschlagen.");
  }

  // Optional: hier könntest du z.B. session-Daten in Supabase speichern

  console.log("Shopify auth erfolgreich:", {
    shop: session.shop,
    accessToken: session.accessToken,
  });

  return redirect(`/`); // Zielseite nach Login (z. B. Dashboard)
}
