// api/shopify-auth.js
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

console.log("[Shopify Auth] Initializing Shopify API client...");
console.log(`[Shopify Auth] SHOPIFY_API_KEY: ${process.env.SHOPIFY_API_KEY ? "SET" : "NOT SET"}`);
console.log(`[Shopify Auth] SHOPIFY_API_SECRET: ${process.env.SHOPIFY_API_SECRET ? "SET" : "NOT SET"}`);
console.log(`[Shopify Auth] SHOPIFY_SCOPES: ${process.env.SHOPIFY_SCOPES}`);
console.log(`[Shopify Auth] HOST: ${process.env.HOST}`);

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES ? process.env.SHOPIFY_SCOPES.split(",") : ["read_products", "write_products"],
  hostName: process.env.HOST ? process.env.HOST.replace(/^https?:\/\//, "") : "schulbox-mvp.vercel.app",
  isEmbeddedApp: true,
  apiVersion: ApiVersion.October23,
  restResources,
});

console.log("[Shopify Auth] Shopify API client initialized.");

export default async function handler(req, res) {
  console.log("[Shopify Auth] Handler called.");
  const { shop } = req.query;
  console.log(`[Shopify Auth] Received shop parameter: ${shop}`);

  if (!shop) {
    console.error("[Shopify Auth] Missing shop parameter.");
    res.status(400).send("Missing shop parameter");
    return;
  }

  console.log("[Shopify Auth] Attempting to begin OAuth flow...");
  try {
    const authRoute = await shopify.auth.begin({
      shop: shop.toString(),
      callbackPath: "/api/shopify-auth-callback",
      isOnline: true, // For online tokens, typically used for non-embedded apps or first-time install
      rawRequest: req,
      rawResponse: res,
    });

    console.log("[Shopify Auth] shopify.auth.begin() completed.");
    console.log(`[Shopify Auth] Auth route received: ${authRoute}`);

    if (authRoute) {
        console.log(`[Shopify Auth] Redirecting to: ${authRoute}`);
        res.redirect(authRoute);
    } else {
        console.error("[Shopify Auth] authRoute is undefined after shopify.auth.begin(). This should not happen if no error was thrown.");
        res.status(500).send("Internal Server Error: OAuth initiation failed to produce a redirect URL.");
    }

  } catch (error) {
    console.error("[Shopify Auth] Error during shopify.auth.begin():", error);
    // Log more details about the error object
    if (error && typeof error === "object") {
      console.error("[Shopify Auth] Error properties:", Object.keys(error).map(key => `${key}: ${error[key]}` ).join(", "));
      if (error.response) {
        console.error("[Shopify Auth] Error response details:", error.response);
      }
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error during OAuth initiation.";
    res.status(500).send(`Internal Server Error: ${errorMessage}`);
  }
}

