// app/utils/createShopifyCheckout.ts
type CheckoutItem = {
  merchandiseId: string;
  quantity: number;
};

export async function createShopifyCheckout(
  items: CheckoutItem[]
): Promise<string | null> {
  const domain = process.env.SHOP_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error("❌ Shopify Umgebungsvariablen fehlen!");
    return null;
  }

  const endpoint = `https://${domain}/api/2023-10/graphql.json`;

  const checkoutResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query: `
        mutation createCart($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              checkoutUrl
            }
            userErrors {
              message
            }
          }
        }
      `,
      variables: {
        lines: items,
      },
    }),
  });

  const checkoutJson = await checkoutResponse.json();
  console.log("🧾 Shopify Checkout Response:", checkoutJson);

  return checkoutJson?.data?.cartCreate?.cart?.checkoutUrl ?? null;
}
