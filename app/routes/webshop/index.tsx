// app/routes/webshop/index.tsx
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

// Loader für Produktliste
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
              handle
              images(first: 1) {
                edges {
                  node {
                    url
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
    }),
  });

  const result = await response.json();

  if (!result.data || !result.data.products) {
    console.error("Fehler beim Laden der Produkte:", result);
    throw new Response("Produkte konnten nicht geladen werden", { status: 500 });
  }

  return json(result.data.products.edges.map((edge: any) => edge.node));
}


export default function Webshop() {
  const products = useLoaderData<typeof loader>();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("standard");

  const filteredProducts = products
    .filter((product: any) => {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    })
    .sort((a: any, b: any) => {
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
    <div className="max-w-7xl mx-auto p-4">
      {/* Filter und Sortieren */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label className="font-bold text-sm mb-1">Sortieren nach:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="standard">Standard</option>
              <option value="preis-auf">Preis aufsteigend</option>
              <option value="preis-ab">Preis absteigend</option>
              <option value="az">Alphabetisch (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Suche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 w-full md:w-64"
          />
        </div>
      </div>

      {/* Produktliste */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 shadow hover:shadow-md transition flex flex-col"
          >
            <Link to={`/webshop/${product.handle}`}>
              {product.images.edges[0]?.node.url && (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-2"
                />
              )}
              <h2 className="text-md font-semibold mb-1">{product.title}</h2>
            </Link>
            <div className="text-lg font-bold mb-1">
              {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </div>
            <button className="mt-auto bg-[#005eb8] text-white py-2 rounded-lg hover:bg-blue-700 transition">
              In den Einkaufswagen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
