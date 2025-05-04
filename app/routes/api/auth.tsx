// app/routes/api/auth.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/lib/shopify/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticate(request);
}
