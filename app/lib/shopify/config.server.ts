// app/lib/shopify/config.server.ts
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import { shopifyFetch } from "@shopify/shopify-api/adapters/node"; // der Adapter wird _implizit_ registriert

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "PLACEHOLDER_API_KEY";
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "PLACEHOLDER_API_SECRET";
const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP || "PLACEHOLDER_SHOP";
const HOST = process.env.HOST || "https://schulbox-mvp.vercel.app";

const SCOPES = [
  "read_products",
  "write_products",
  "read_orders",
  "write_orders",
  "read_customers",
  "write_customers",
];

export const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/^https:\/\//, ""),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  restResources,
});

export const shopifyStore = SHOPIFY_SHOP;
