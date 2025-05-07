// app/routes/auth.$.tsx
import { type LoaderFunctionArgs } from "@remix-run/node";
import shopify from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // The `shopify.authenticate.admin` method will automatically handle the OAuth flow
  // It will redirect to Shopify for authentication if necessary, or handle the callback.
  // It also sets up the session and provides an authenticated admin API client.
  await shopify.authenticate.admin(request);

  // If authentication is successful, Shopify typically redirects the merchant
  // back to your app's root URL within the Shopify admin.
  // You might not need to return anything specific here if the library handles the redirect.
  // However, it's good practice to ensure a response is always returned.
  // If shopify.authenticate.admin throws an error (e.g. for an invalid request),
  // Remix will catch it and display an error boundary.
  // If it completes successfully and handles a redirect, this return might not be hit.
  return new Response(null, { status: 200 });
}

