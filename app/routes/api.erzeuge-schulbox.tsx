import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

// Define the list of Publication GIDs based on the provided IDs
// Removed "gid://shopify/Publication/270673903883" based on user feedback (Publication does not exist or is not publishable)
const PUBLICATION_GIDS = [
  "gid://shopify/Publication/270673871115",
  "gid://shopify/Publication/270673805579",
  "gid://shopify/Publication/270673936651",
  // "gid://shopify/Publication/270673903883", // Removed
  "gid://shopify/Publication/271702917387",
  "gid://shopify/Publication/273434902795",
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const items = JSON.parse(formData.get("items") as string);
  const schule = formData.get("schule") as string;
  const klasse = formData.get("klasse") as string;

  const titel = `Schulbox – ${schule} – ${klasse}`;
  const beschreibung = items
    .map((item: any) => `${item.quantity}x ${item.title} – ${item.price.toFixed(2)} €`)
    .join("\n");

  const zwischensumme = items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
    0
  );
  const gesamtpreis = (zwischensumme * 1.1).toFixed(2);

  // Step 1: Create the product using the REST API
  const produktResponse = await fetch(
    `https://${process.env.SHOP_DOMAIN}/admin/api/2023-04/products.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN!,
      },
      body: JSON.stringify({
        product: {
          title: titel,
          body_html: `<pre>${beschreibung}</pre><br><strong>+10 % Aufschlag für geschützte Werkstätte</strong>`,
          tags: ["schulbox"],
          published: true, // Keep product active, channels assigned via GraphQL
          variants: [
            {
              price: gesamtpreis,
              inventory_management: null,
              fulfillment_service: "manual",
              requires_shipping: true,
            },
          ],
          images: [
            {
              src: "https://schulbox-mvp.vercel.app/images/schulbox-default.png",
            },
          ],
        },
      }),
    }
  );

  const created = await produktResponse.json();

  if (!produktResponse.ok || !created.product?.admin_graphql_api_id) {
    console.error("❌ Fehler beim Erstellen des Produkts", created);
    return json(
      { error: "Fehler beim Erstellen des Produkts", details: created },
      { status: produktResponse.status }
    );
  }

  const productGid = created.product.admin_graphql_api_id;
  console.log(`✅ Produkt erstellt: ${titel} (GID: ${productGid})`);

  // Step 2: Publish the product to all specified sales channels using GraphQL API
  const publishMutation = `
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const publicationInput = PUBLICATION_GIDS.map(id => ({ publicationId: id }));

  const graphqlResponse = await fetch(
    `https://${process.env.SHOP_DOMAIN}/admin/api/2023-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN!,
      },
      body: JSON.stringify({
        query: publishMutation,
        variables: {
          id: productGid,
          input: publicationInput,
        },
      }),
    }
  );

  const graphqlResult = await graphqlResponse.json();

  // Check for network errors, GraphQL errors, or userErrors from the mutation
  if (!graphqlResponse.ok || graphqlResult.errors || (graphqlResult.data?.publishablePublish?.userErrors && graphqlResult.data.publishablePublish.userErrors.length > 0)) {
    console.error("❌ Fehler beim Veröffentlichen auf Vertriebskanälen:", JSON.stringify(graphqlResult, null, 2));
    // Return success for product creation, but add a warning about publishing
    return json({
      warning: "Produkt erstellt, aber Fehler beim Veröffentlichen auf allen Kanälen.",
      handle: created.product.handle,
      details: graphqlResult
    });
  }

  console.log(`✅ Produkt ${titel} erfolgreich auf ${PUBLICATION_GIDS.length} Kanälen veröffentlicht (Mutation erfolgreich).`);

  return json({
    success: `Die Schulbox „${titel}“ wurde erfolgreich erstellt und auf ${PUBLICATION_GIDS.length} Kanälen veröffentlicht!`,
    handle: created.product.handle,
  });
};

export default function NoUI() {
  return null;
}

