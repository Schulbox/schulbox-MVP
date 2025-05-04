// app/routes/api/check-scopes.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getAuthenticatedClient } from "~/lib/shopify/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const client = await getAuthenticatedClient();

    const response = await client.get({
      path: "oauth/access_scopes",
    });

    return json({ scopes: response.body });
  } catch (error) {
    console.error("Fehler beim Scope-Check:", error);
    return json({ error: "Fehler beim Scope-Check" }, { status: 500 });
  }
}

export default function CheckScopesRoute() {
  return null; // oder: <div>Scope Check</div>
}

