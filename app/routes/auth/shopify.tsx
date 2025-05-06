// routes/auth/shopify.tsx
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getAuthUrl } from "~/lib/shopify/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = await getAuthUrl(request);
  return redirect(url);
}
