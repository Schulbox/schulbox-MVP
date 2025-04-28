import { Link } from "@remix-run/react";

export default function TestIndex() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Test-Bereich</h1>
      <p className="text-xl mb-6">
        Dies ist eine Übersichtsseite für den Test-Bereich mit Links zu dynamischen Routen.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Test-Links:</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <Link to="/test/beispiel-id-1" className="text-blue-600 hover:underline">
              Test mit ID: beispiel-id-1
            </Link>
          </li>
          <li>
            <Link to="/test/beispiel-id-2" className="text-blue-600 hover:underline">
              Test mit ID: beispiel-id-2
            </Link>
          </li>
          <li>
            <Link to="/test/mit-bindestrich" className="text-blue-600 hover:underline">
              Test mit ID: mit-bindestrich
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
