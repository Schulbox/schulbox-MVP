// app/routes/webshop/$handle.tsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const handle = { breadcrumb: false };

export async function loader({ params }: { params: { handle: string } }) {
  const decodedHandle = decodeURIComponent(params.handle);

  console.log("Empfangener Handle aus URL:", params.handle);
  console.log("Handle nach decodeURIComponent:", decodedHandle);

  const response = await fetch("https://nqwde0-ua.myshopify.com/api/2023-04/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `
        query getProductByHandle($query: String!) {
          products(first: 1, query: $query) {
            edges {
              node {
                title
                description
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
          }
        }
      `,
      variables: {
        query: `handle:${decodedHandle}`,
      },
    }),
  });

  const result = await response.json();

  if (!result.data.products.edges.length) {
    console.error("Produkt nicht gefunden für Handle:", decodedHandle);
    throw new Response("Produkt nicht gefunden", { status: 404 });
  }

  const product = result.data.products.edges[0].node;

  return json(product);
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
          {product.description}
        </div>

        <button className="bg-[#005eb8] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition">
          In den Einkaufswagen
        </button>
      </div>
    </div>
  );
}
