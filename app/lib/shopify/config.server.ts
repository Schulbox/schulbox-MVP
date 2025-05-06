import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import nodeAdapter from "@shopify/shopify-api/adapters/node"; // ✅ Das ist korrekt für 11.12.0

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!;
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || "read_products,write_products";
const HOST = process.env.HOST || "https://schulbox-mvp.vercel.app";

export const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SHOPIFY_SCOPES.split(","),
  hostName: new URL(HOST).host,
  isEmbeddedApp: false,
  apiVersion: LATEST_API_VERSION,
  restResources,
  adapter: nodeAdapter, // ✅ richtig für v11.12.0
});
