import { useLoaderData, Link, Outlet, useMatches } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useSearch } from "~/context/SearchContext";
import { motion } from "framer-motion";
import { BoxIcon } from "~/components/icons";
import { useSchulbox } from "~/context/SchulboxContext";

export const loader: LoaderFunction = async () => {
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
    throw new Response("Produkte konnten nicht geladen werden", { status: 500 });
  }

  const produkte = result.data.products.edges.map((edge: any) => edge.node);
  return json({ produkte });
};

export default function KonfiguratorSeite() {
  const { produkte } = useLoaderData<typeof loader>();
  const { searchQuery, setSearchQuery } = useSearch();
  const [sortOption, setSortOption] = useState("standard");
  const { addToBox, totalItems, justAdded } = useSchulbox();
  const [clickedId, setClickedId] = useState<string | null>(null);

  const matches = useMatches();
  const isDetailPage = matches.some((m) => m.id?.includes("konfigurator.$handle"));

  if (isDetailPage) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Link
          to="/konfigurator"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition"
        >
          ← Zurück zur Übersicht
        </Link>
        <Outlet />
      </div>
    );
  }

  const gefilterteProdukte = produkte
    .filter((product: any) => {
      const query = searchQuery.toLowerCase();
      return product.title.toLowerCase().includes(query);
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

    const artikelZurBoxHinzufuegen = (product: any) => {
      addToBox({
        id: product.id,
        title: product.title,
        quantity: 1,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        image: product.images.edges[0]?.node.url || "",
      });
    };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Filter, Suche und Box */}
      <div className="sticky top-16 z-10 bg-white p-6 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 mb-4 md:mb-0">
          <label className="font-bold text-sm">Sortieren nach:</label>
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

        <div className="flex items-center gap-4">


          
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="cursor-pointer ml-2 relative"
                >
                  <Link to="/schulboxcart" title="Schulbox erstellen">
                    <BoxIcon className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                    {totalItems > 0 && (
                      <motion.div
                        key={totalItems}
                        initial={{ scale: 1 }}
                        animate={{ scale: justAdded ? [1.3, 1.1, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow"
                      >
                        {totalItems}
                      </motion.div>
                    )}
                  </Link>
                </motion.div>

          
          
        </div>
      </div>

      {/* Produktliste */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gefilterteProdukte.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 shadow hover:shadow-md transition flex flex-col"
          >
            <Link to={`/konfigurator/${product.handle}`}>
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
              onClick={() => artikelZurBoxHinzufuegen(product)}
              className={`mt-auto bg-[#005eb8] text-white py-2 px-3 rounded-lg text-sm transition transform ${
                clickedId === product.id
                  ? "scale-110 bg-blue-700"
                  : "hover:scale-105 hover:bg-blue-700"
              }`}
            >
              In die Schulbox
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}