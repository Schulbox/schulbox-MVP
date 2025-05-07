import "@shopify/shopify-api/adapters/node"; // Corrected: Import for side effects
import { shopifyApi, LATEST_API_VERSION, ApiVersion } from "@shopify/shopify-api"; // Added ApiVersion import
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!;
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || "read_products,write_products";
const HOST = process.env.HOST || "https://schulbox-mvp.vercel.app";

export const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SHOPIFY_SCOPES.split(","),
  hostName: new URL(HOST).host,
  isEmbeddedApp: true,
  apiVersion: ApiVersion.October23, // Corrected: Use ApiVersion enum
  restResources,
  // runtimeString: nodeRuntimeString, // Removed: Adapter is imported for side effects
});

