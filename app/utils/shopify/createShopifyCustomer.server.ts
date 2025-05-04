export async function createShopifyCustomer({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {

  console.log("🧪 createShopifyCustomer aufgerufen mit", email, firstName, lastName); // 👈 HIER

  const shopDomain = process.env.SHOP_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!shopDomain || !adminToken) {
    console.error("❌ Shopify Umgebungsvariablen fehlen!");
    return;
  }

  const response = await fetch(`https://${shopDomain}/admin/api/2023-10/customers.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({
      customer: {
        email,
        first_name: firstName,
        last_name: lastName,
        send_email_invite: true,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Shopify-Fehlermeldung:", JSON.stringify(data.errors || data, null, 2));
    throw new Error("Shopify-Kunde konnte nicht erstellt werden.");
  }

  console.log("📬 Shopify-Kunde erstellt:", data.customer?.id || data);
  console.log("📦 Shopify response status:", response.status);
console.log("📦 Shopify response body:", JSON.stringify(data, null, 2));

}
