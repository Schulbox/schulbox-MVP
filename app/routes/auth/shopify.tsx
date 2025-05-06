import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { shopify } from "~/lib/shopify/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) throw new Error("Shop-Parameter fehlt.");

  const authRoute = await shopify.auth.begin({
    shop,
    callbackPath: "/api/shopify/callback",
    isOnline: true,
    rawRequest: {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      body: undefined,
    },
  });

  return redirect(authRoute);
}
