// app/routes/webshop.tsx
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getAllProducts } from "~/lib/shopify/products.server";

type ProductType = {
    id: string;
    title: string;
    variants: {
      price: string;
    }[];
  };

export const loader = async ({}: LoaderFunctionArgs) => {
  const products = await getAllProducts();
  return json({ products });
};

export default function Webshop() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🎒 Schulbox Webshop</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">Keine Produkte gefunden.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: ProductType) => (
            <div key={product.id} className="border p-4 rounded-md shadow-sm">
              <h2 className="font-semibold text-lg mb-2">{product.title}</h2>
              <p className="text-gray-600">
                {parseFloat(product.variants[0].price).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
