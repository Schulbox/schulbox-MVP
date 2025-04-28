// app/routes/shoptest/$id.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader({ params }: { params: { id: string } }) {
  return json({ id: params.id });
}

export default function ShoptestIdPage() {
  const { id } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Produkt-Detailseite</h1>
      <p className="text-xl mb-4">
        Dies ist die Detailansicht für: <strong>{id}</strong>
      </p>
    </div>
  );
}
