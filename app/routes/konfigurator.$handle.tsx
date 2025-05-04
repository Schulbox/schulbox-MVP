import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useSchulbox } from "~/context/SchulboxContext";

export async function loader({ params }: LoaderFunctionArgs) {
  const handle = params.handle;

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
            id
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
      variables: { handle },
    }),
  });

  const result = await response.json();

  if (!result.data || !result.data.productByHandle) {
    throw new Response("Produkt nicht gefunden", { status: 404 });
  }

  return json(result.data.productByHandle);
}

export default function KonfiguratorDetailPage() {
  const product = useLoaderData<typeof loader>();
  const image = product.images.edges[0]?.node;
  const [clicked, setClicked] = useState(false);
  const { addToBox } = useSchulbox(); // ✅ nur im Client verwenden

  const handleAddToBox = () => {
    addToBox({
      id: product.id,
      title: product.title,
      quantity: 1,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      image: image?.url || "",
    });

    setClicked(true);
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{product.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex justify-center items-start">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="rounded-lg w-full max-w-sm object-contain shadow-md"
            />
          ) : (
            <div className="text-gray-400">Kein Bild vorhanden</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold text-gray-900">
            {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
          </div>

          <div className="text-sm text-green-600 font-medium">✔ Verfügbar für Schulbox</div>

          <button
            onClick={handleAddToBox}
            className={`bg-[#005eb8] text-white font-bold py-3 px-6 rounded-lg text-lg transition w-full max-w-xs transform ${
              clicked ? "scale-110 bg-blue-700" : "hover:scale-105 hover:bg-blue-700"
            }`}
          >
            In die Schulbox
          </button>
        </div>
      </div>

      <div
        className="mt-12 text-gray-700 leading-relaxed prose max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
    </div>
  );
}
