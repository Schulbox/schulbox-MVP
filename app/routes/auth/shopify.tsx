// app/routes/auth/shopify.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUrl } from "~/lib/shopify/auth.server";
import { requireLehrkraft } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Stelle sicher, dass nur Lehrkräfte die Shopify-Authentifizierung starten können
  await requireLehrkraft({ request } as LoaderFunctionArgs);
  
  // Leite zur Shopify OAuth-URL weiter
  return getAuthUrl();
}
