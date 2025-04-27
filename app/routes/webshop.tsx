import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchFromShopify } from "~/lib/shopify/shopifyClient.server"; // ← Du verwendest jetzt deinen sauberen Client!

type Product = {
  id: string;
  title: string;
  description: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export async function loader() {
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
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
    }
  `;

  const data = await fetchFromShopify(query);
  const products = data.products.edges.map((edge: any) => edge.node);

  return json(products);
}

export default function Webshop() {
  const products = useLoaderData<typeof loader>() as Product[];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🎒 Unser Schulbox Webshop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            {product.images.edges[0]?.node.url && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <div className="font-bold">
              {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
