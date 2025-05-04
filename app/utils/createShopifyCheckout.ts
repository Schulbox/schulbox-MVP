export async function createShopifyCheckout(
    items: { variantId: string; quantity: number }[]
  ): Promise<string | null> {
    const endpoint = "https://nqwde0-ua.myshopify.comapi/2023-10/graphql.json";
    const token = "0c3034ae8fb79a0fd9f3cb7a2cfedf30";
  
    const response = await fetch(endpoint, {
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
  
    const json = await response.json();
    return json?.data?.cartCreate?.cart?.checkoutUrl ?? null;
  }
  