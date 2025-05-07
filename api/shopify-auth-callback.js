// api/shopify-auth-callback.js
import "@shopify/shopify-api/adapters/node"; // Corrected: Import for side effects
import { shopifyApi, ApiVersion } from "@shopify/shopify-api"; // Added ApiVersion import
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES ? process.env.SHOPIFY_SCOPES.split(",") : ["read_products", "write_products"],
  hostName: process.env.HOST ? process.env.HOST.replace(/^https?:\/\//, "") : "schulbox-mvp.vercel.app",
  isEmbeddedApp: true,
  apiVersion: ApiVersion.October23, // Corrected: Use ApiVersion enum
  restResources,
  // runtimeString: nodeRuntimeString, // Removed: Adapter is imported for side effects
});

export default async function handler(req, res) {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const shop = callback.session.shop;
    const host = req.query.host; 

    if (shopify.config.isEmbeddedApp && host) {
        const decodedHost = Buffer.from(host.toString(), "base64").toString("utf-8");
        // Construct the redirect URL carefully. Ensure apiKey is defined.
        const appApiKey = shopify.config.apiKey;
        if (appApiKey) {
            res.redirect(`https://${decodedHost}/apps/${appApiKey.substring(0, appApiKey.indexOf("-"))}`);
        } else {
            console.error("Shopify API Key is not defined, cannot redirect to embedded app.");
            res.status(500).send("Internal Server Error: Shopify API Key not configured.");
        }
    } else {
        res.redirect("/");
    }

  } catch (error) {
    console.error("Error during Shopify auth callback:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(`Internal Server Error: ${errorMessage}`);
  }
}

