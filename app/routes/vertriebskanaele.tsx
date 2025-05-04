import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const res = await fetch(`https://${process.env.SHOP_DOMAIN}/admin/api/2023-04/publications.json`, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN!,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Fehler beim Laden: ${errorData}`);
    }

    const data = await res.json();
    return json(data.publications);
  } catch (err: any) {
    return json({ error: err.message });
  }
};

export default function Vertriebskanaele() {
  const data = useLoaderData<typeof loader>();

  if ("error" in data) {
    return <div>Fehler: {data.error}</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Vertriebskanäle</h1>
      <ul>
        {data.map((p: any) => (
          <li key={p.id}>
            <strong>{p.name}</strong> – ID: <code>{p.id}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
