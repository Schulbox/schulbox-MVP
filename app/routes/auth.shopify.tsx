import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUrl } from "~/lib/shopify/auth.server"; // ✅ Pfad anpassen, falls nötig

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = await getAuthUrl(request);

  if (!redirectUrl) {
    throw new Error("Kein Redirect-URL zurückgegeben");
  }

  return redirect(redirectUrl);
}
