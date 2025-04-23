// app/lib/shopify/config.server.ts
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";

// Diese Werte sollten in einer .env Datei gespeichert werden
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "PLACEHOLDER_API_KEY";
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "PLACEHOLDER_API_SECRET";
const SHOPIFY_SHOP = "nqwde0-ua.myshopify.com";
const SCOPES = [
  "read_products",
  "write_products",
  "read_orders",
  "write_orders",
  "read_customers",
  "write_customers"
];
const HOST = process.env.HOST || "https://schulbox-app.vercel.app";

export const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  restResources
});

export const shopifyStore = SHOPIFY_SHOP;
