// app/routes/warenkorb.tsx
import { useCart } from "~/context/CartContext";
import { Link } from "@remix-run/react";

export default function Warenkorb() {
  const { items, totalItems } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Dein Warenkorb</h1>

      {items.length === 0 ? (
        <div className="text-center space-y-6">
          <p className="text-gray-500 text-lg">Dein Warenkorb ist leer.</p>
          <Link
            to="/webshop"
            className="inline-block bg-[#005eb8] hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Zurück zum Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between border-b pb-6"
            >
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain rounded-lg bg-gray-100"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.quantity} Stück</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                <p className="text-lg font-bold text-gray-800">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
                <button
                  onClick={() => {
                    const event = new CustomEvent("remove-from-cart", { detail: item.id });
                    window.dispatchEvent(event);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ✖ Entfernen
                </button>
              </div>
            </div>
          ))}

          {/* Summenzeile */}
          <div className="text-right space-y-4 pt-6 border-t">
            <div className="text-lg font-semibold text-gray-800">
              Zwischensumme ({totalItems} Artikel):{" "}
              <span className="text-[#005eb8]">{totalPrice.toFixed(2)} €</span>
            </div>
            <Link
              to="/kasse"
              className="inline-block bg-[#005eb8] hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg transition"
            >
              Zur Kasse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
