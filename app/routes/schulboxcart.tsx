import { useSchulbox } from "~/context/SchulboxContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import SchulboxLoading from "~/components/SchulboxLoading";

export default function SchulboxCart() {
  const {
    items,
    removeFromBox,
    clearBox,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
  } = useSchulbox();

  const [aufpreis, setAufpreis] = useState(0);
  const [gesamt, setGesamt] = useState(0);
  const [schule, setSchule] = useState("");
  const [klasse, setKlasse] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [redirectHandle, setRedirectHandle] = useState("");


  useEffect(() => {
    const summe = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const aufschlag = summe * 0.1;
    setAufpreis(aufschlag);
    setGesamt(summe + aufschlag);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Deine Schulbox ist leer.</h2>
        <Link to="/konfigurator" className="text-blue-600 hover:underline">
          Zurück zur Produktauswahl
        </Link>
      </div>
    );
  }

  const handleDecrease = (itemId: string, currentQty: number, title: string) => {
    if (currentQty <= 1) {
      const confirmed = confirm(`Möchtest du „${title}“ aus der Schulbox entfernen?`);
      if (confirmed) {
        removeFromBox(itemId);
      }
    } else {
      decreaseQuantity(itemId);
    }
  };

  const handleCreateSchulbox = async () => {
    if (!schule || !klasse) {
      alert("Bitte wähle zuerst Schule und Klasse aus.");
      return;
    }
  
    setIsCreating(true); // 👉 Starte Animation
  
    const formData = new FormData();
    formData.append("items", JSON.stringify(items));
    formData.append("schule", schule);
    formData.append("klasse", klasse);
  
    const res = await fetch("/api/erzeuge-schulbox", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
  
    if (res.ok) {
      clearBox();
      setRedirectHandle(data.handle); // 👉 Trigger Weiterleitung nach Animation
    } else {
      alert("Fehler: " + data.error);
      console.error(data.details);
      setIsCreating(false);
    }
  };
  

if (isCreating && redirectHandle) {
  return <SchulboxLoading targetUrl={`/products/${redirectHandle}`} />;
}


  return (
    <>
      {successMessage && (
        <div className="max-w-4xl mx-auto mt-6 mb-4 p-4 bg-green-100 text-green-800 rounded border border-green-300 shadow">
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Linke Seite */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Deine Schulbox</h1>

          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      Menge: {item.quantity}
                      <button
                        onClick={() => handleDecrease(item.id, item.quantity, item.title)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        -
                      </button>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right font-medium">
                  {(item.quantity * item.price).toFixed(2)} €
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-6 mt-6 space-y-2 text-right text-lg">
            <div>
              Zwischensumme:{" "}
              {items.reduce((s, i) => s + i.quantity * i.price, 0).toFixed(2)} €
            </div>
            <div className="text-gray-600">
              +10% Aufschlag für geschützte Werkstätte: {aufpreis.toFixed(2)} €
            </div>
            <div className="font-bold text-xl">Gesamt: {gesamt.toFixed(2)} €</div>
          </div>
        </div>

        {/* Rechte Seite */}
        <div className="border-l pl-10">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Schule:</label>
              <select
                value={schule}
                onChange={(e) => setSchule(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Bitte auswählen</option>
                <option value="Volkschule Mustergasse">Volkschule Mustergasse</option>
                <option value="Volkschule Beispielstraße">Volkschule Beispielstraße</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Klasse:</label>
              <select
                value={klasse}
                onChange={(e) => setKlasse(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Bitte auswählen</option>
                <option value="1A">1A</option>
                <option value="1B">1B</option>
                <option value="2A">2A</option>
              </select>
            </div>

            <div className="mt-6 text-lg text-right font-semibold">
              Gesamt: {gesamt.toFixed(2)} €
            </div>

            <div className="text-right">
              <button
                onClick={handleCreateSchulbox}
                className="bg-[#005eb8] text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
              >
                Jetzt Schulbox erstellen
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
