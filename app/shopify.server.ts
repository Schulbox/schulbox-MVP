// app/shopify.server.ts
import { LATEST_API_VERSION, shopifyApp } from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";

// Ensure that all environment variables are set.
if (!process.env.SHOPIFY_API_KEY) {
  throw new Error("Missing SHOPIFY_API_KEY environment variable");
}
if (!process.env.SHOPIFY_API_SECRET) {
  throw new Error("Missing SHOPIFY_API_SECRET environment variable");
}
if (!process.env.SHOPIFY_SCOPES) {
  throw new Error("Missing SHOPIFY_SCOPES environment variable");
}
if (!process.env.APP_URL) {
  throw new Error("Missing APP_URL environment variable");
}

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES.split(","),
  appUrl: process.env.APP_URL,
  apiVersion: LATEST_API_VERSION,
  restResources,
  // You can add optional configuration here, such as session storage.
  // For Vercel, you might use Vercel KV or another persistent storage solution.
  // Example using a simple cookie-based session storage (not recommended for production without careful consideration of cookie size and security):
  // sessionManager: new CookieSessionStorage(
  //   process.env.SESSION_SECRET || "defaultsecretsessionkeyformanustesting", // Use a strong secret from env vars
  //   {
  //     secure: process.env.NODE_ENV === "production",
  //     httpOnly: true,
  //     path: "/",
  //     sameSite: "lax",
  //     maxAge: 60 * 60 * 24 * 7, // 7 days
  //   }
  // ),
  // For a more robust solution, consider using a database-backed session storage.
  // See Shopify documentation for session storage options:
  // https://shopify.dev/docs/apps/tools/shopify-app-remix/v2/session-storage
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;

// Helper function to get an authenticated admin API client
export const authenticate = shopify.authenticate;

