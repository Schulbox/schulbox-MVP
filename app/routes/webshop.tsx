// app/routes/webshop/index.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { Product } from "~/types";
import { useState } from "react";
import { Link } from "@remix-run/react";

// Dein Loader bleibt gleich
export async function loader() {
  const response = await fetch("https://nqwde0-ua.myshopify.com/api/2023-04/graphql.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `{
        products(first: 50) {
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

export default function WebshopPage() {
  const products = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("standard");

  const filteredProducts = products
    .filter((product: Product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    })
    .sort((a: Product, b: Product) => {
      if (sortOption === "preis-auf") {
        return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      }
      if (sortOption === "preis-ab") {
        return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
      }
      if (sortOption === "az") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div>
      {/* Deine Suchleiste, Filter usw. */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <div key={product.id} className="border rounded-lg p-3 shadow hover:shadow-md transition flex flex-col">
            <Link to={`/webshop/${product.handle}`}>
              {product.images.edges[0]?.node.url && (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.images.edges[0].node.altText || product.title}
                  className="w-full h-40 object-contain mb-2"
                />
              )}
              <h2 className="text-md font-semibold mb-1">{product.title}</h2>
            </Link>
            <div className="text-lg font-bold mb-1">
              {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
