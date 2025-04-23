// app/routes/auth/shopify.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUrl } from "~/lib/shopify/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Jeder darf den Shopify-OAuth-Flow starten – kein Login nötig
  return getAuthUrl();
}
