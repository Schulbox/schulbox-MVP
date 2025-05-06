// app/lib/shopify/config.server.ts
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import "@shopify/shopify-api/adapters/node";


const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "PLACEHOLDER_API_KEY";
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "PLACEHOLDER_API_SECRET";
const SHOPIFY_SHOP = "nqwde0-ua.myshopify.com";
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
