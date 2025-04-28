import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader({ params }: { params: { id: string } }) {
  // Einfacher Loader, der nur die ID zurückgibt
  return json({ id: params.id });
}

export default function TestIdPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Test-Route</h1>
      <p className="text-xl mb-4">
        Dies ist eine Test-Route für dynamische Parameter.
      </p>
      <div className="p-4 bg-blue-100 rounded-lg">
        <p className="font-semibold">Parameter ID:</p>
        <p className="text-2xl text-blue-700">{data.id}</p>
      </div>
    </div>
  );
}
