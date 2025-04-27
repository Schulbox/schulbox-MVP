// app/routes/webshop.tsx

import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { Product } from "~/types";


export async function loader() {
  const response = await fetch("https://nqwde0-ua.myshopify.com/api/2023-04/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": "DEIN_STOREFRONT_API_TOKEN",
    },
    body: JSON.stringify({
      query: `{
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 1) {
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
      }`
    })
  });

  const result = await response.json();
  return json(result.data.products.edges.map((edge: any) => edge.node));
}

export default function Webshop() {
  const products = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span>🎒</span> Unser Schulbox Webshop
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: Product) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 shadow hover:shadow-md transition flex flex-col"
          >
            {product.images.edges[0]?.node.url && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                className="w-full h-40 object-contain mb-2"
              />
            )}
            <h2 className="text-md font-semibold mb-1">{product.title}</h2>
            {/* Hier später: ⭐⭐⭐⭐⭐ (Bewertungen) */}
            <div className="text-lg font-bold mb-1">
              {product.priceRange.minVariantPrice.amount}{" "}
              {product.priceRange.minVariantPrice.currencyCode}
            </div>
            <div className="text-gray-500 text-xs mb-3">inkl. Lieferung</div>
            <button className="mt-auto bg-[#005eb8] text-white py-2 rounded-lg hover:bg-blue-700 transition">
              In den Einkaufswagen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
