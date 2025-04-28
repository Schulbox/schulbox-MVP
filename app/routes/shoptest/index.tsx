// app/routes/shoptest/index.tsx
import { Link } from "@remix-run/react";

export default function ShoptestIndex() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Shoptest Übersicht</h1>
      <p className="text-xl mb-6">
        Hier sind einige Produkte als Links:
      </p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Produkte:</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <Link to="/shoptest/produkt-1" className="text-blue-600 hover:underline">
              Produkt 1
            </Link>
          </li>
          <li>
            <Link to="/shoptest/produkt-2" className="text-blue-600 hover:underline">
              Produkt 2
            </Link>
          </li>
          <li>
            <Link to="/shoptest/produkt-3" className="text-blue-600 hover:underline">
              Produkt 3
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
