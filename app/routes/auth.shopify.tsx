// app/routes/auth.shopify.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUrl } from "~/lib/shopify/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return getAuthUrl(); // <-- Aufruf ohne Argument
}
