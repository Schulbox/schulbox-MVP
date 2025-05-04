import { useLoaderData, Link, Outlet, useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { useCart } from "~/context/CartContext"; // <--- NEU
import { useSearch } from "~/context/SearchContext";

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
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
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
  const { searchQuery, setSearchQuery } = useSearch();
  const [sortOption, setSortOption] = useState("standard");
  const { addToCart } = useCart(); // <--- NEU
  const [clickedId, setClickedId] = useState<string | null>(null); // <--- NEU
 
  const matches = useMatches();
  const isDetailPage = matches.some((m) => m.id?.includes("webshop.$handle"));

  if (isDetailPage) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Link
          to="/webshop"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition"
        >
          ← Zurück zum Shop
        </Link>
        <Outlet />
      </div>
    );
  }

  const filteredProducts = products
    .filter((product: any) => {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query)
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

    const handleAddToCart = (product: any) => {
      const variantId = product.variants?.edges?.[0]?.node?.id;
      if (!variantId) {
        console.error("❌ Keine VariantID gefunden für Produkt", product.id);
        return;
      }
    
      addToCart({
        id: product.id,
        variantId,
        title: product.title,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        image: product.images.edges[0]?.node.url || "",
        quantity: 1,
      });
    
      setClickedId(product.id);
      setTimeout(() => setClickedId(null), 300);
    };
    

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
        className="bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
      className="bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded px-4 py-2 w-full md:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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

              <button
                onClick={() => handleAddToCart(product)}
                className={`mt-auto bg-[#005eb8] text-white py-2 px-3 rounded-lg text-sm transition transform ${
                  clickedId === product.id
                    ? "scale-110 bg-blue-700"
                    : "hover:scale-105 hover:bg-blue-700"
                }`}
              >
                In den Einkaufswagen
              </button>

          </div>
        ))}
      </div>
    </div>
  );
}
