// app/routes/webshop/$slug.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

console.log("🛠️ $slug.tsx wird geladen...");


// Loader für ein einzelnes Produkt anhand des Handles
export async function loader({ params }: { params: { handle: string } }) {
  const { handle } = params;
  console.log("🛠️ $slug.tsx wird geladen...");

  if (!handle) {
    throw new Response("Kein Produkt-Slug angegeben", { status: 400 });
  }

  const response = await fetch("https://nqwde0-ua.myshopify.com/api/2023-04/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `
        query getProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            title
            descriptionHtml
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      `,
      variables: { handle: handle },
    }),
  });

  const result = await response.json();

  console.log("Shopify API Antwort:", JSON.stringify(result, null, 2));

  if (!result.data || !result.data.productByHandle) {
    console.error("Produkt nicht gefunden oder Shopify-Fehler:", JSON.stringify(result, null, 2));
    throw new Response("Produkt nicht gefunden", { status: 404 });
  }

  return json(result.data.productByHandle);
}


export default function ProductDetailPage() {
  const product = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Linke Seite: Produktbild */}
      <div className="flex items-center justify-center">
        <img
          src={product.images.edges[0]?.node.url}
          alt={product.images.edges[0]?.node.altText || product.title}
          className="rounded-lg w-full max-w-md object-contain max-h-[400px] shadow-md"
        />
      </div>

      {/* Rechte Seite: Produktinfos */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h1>

        <div className="text-2xl font-semibold text-gray-900 mb-4">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </div>

        <div className="text-gray-600 mb-8 whitespace-pre-line">
          {product.descriptionHtml}
        </div>

        <button className="bg-[#005eb8] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition">
          In den Einkaufswagen
        </button>
      </div>
    </div>
  );
}
