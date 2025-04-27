const SHOPIFY_STORE_DOMAIN = "nqwde0-ua.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "0c3034ae8fb79a0fd9f3cb7a2cfedf30";

export async function fetchFromShopify(query: string, variables = {}) {
  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("Shopify API Fehler:", result.errors);
    throw new Error("Fehler beim Abrufen von Daten aus Shopify");
  }

  return result.data;
}
