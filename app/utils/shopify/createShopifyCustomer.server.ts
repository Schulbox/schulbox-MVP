// app/utils/shopify/createShopifyCustomer.server.ts

/**
 * Creates a customer in Shopify and sends them an email invite.
 * This function is intended to be called from a server-side context (e.g., Remix action)
 * after a user has successfully registered in the primary user system (e.g., Supabase).
 *
 * Required Environment Variables:
 * - SHOP_DOMAIN: Your Shopify store's domain (e.g., 'your-store.myshopify.com').
 * - SHOPIFY_ADMIN_API_TOKEN: A Shopify Admin API access token with 'write_customers' and 'read_customers' scopes.
 *   This is typically generated for a custom app in your Shopify admin settings.
 */
export async function createShopifyCustomer({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  console.log(
    `[Shopify Customer Sync] Attempting to create Shopify customer for: ${email}, Name: ${firstName} ${lastName}`
  );

  const shopDomain = process.env.SHOP_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!shopDomain || !adminToken) {
    const errorMessage = "[Shopify Customer Sync] Error: Missing required Shopify environment variables (SHOP_DOMAIN or SHOPIFY_ADMIN_API_TOKEN). Customer not created in Shopify.";
    console.error(errorMessage);
    // Depending on desired behavior, you might throw an error or return a specific status
    // For now, we log the error and let the primary registration succeed without Shopify sync if this happens.
    // throw new Error(errorMessage); 
    return { success: false, error: "Shopify configuration missing." };
  }

  const customerData = {
    customer: {
      email,
      first_name: firstName,
      last_name: lastName,
      send_email_invite: true, // This will send an invitation to the customer to create an account and set their password on Shopify.
      // Note: We are not setting a password here directly. The user will set it via the Shopify invite.
    },
  };

  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-04/customers.json`, // Using a recent, stable API version
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify(customerData),
      }
    );

    if (!response.ok) {
      let errorBody = "Unknown error structure";
      try {
        errorBody = await response.json();
      } catch (e) {
        // Could not parse JSON, use text if available
        try {
            errorBody = await response.text();
        } catch (textErr) {
            // ignore
        }
        console.error("[Shopify Customer Sync] Shopify API response was not OK, and error body was not valid JSON.", e);
      }
      const errorMessage = `[Shopify Customer Sync] Shopify API Error: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorBody, null, 2)}`;
      console.error(errorMessage);
      throw new Error("Shopify customer could not be created due to API error.");
    }

    const responseData = await response.json();
    console.log(
      `[Shopify Customer Sync] Successfully created Shopify customer. ID: ${responseData.customer?.id}, Email: ${responseData.customer?.email}`
    );
    return { success: true, customerId: responseData.customer?.id };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error during Shopify customer creation.";
    console.error("[Shopify Customer Sync] Exception during Shopify customer creation:", errorMessage);
    // Re-throw the error so the calling function (e.g., the Remix action) can handle it.
    // Or return a structured error response.
    throw new Error(`Failed to create Shopify customer: ${errorMessage}`);
  }
}

