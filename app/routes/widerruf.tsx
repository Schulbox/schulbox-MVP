// app/routes/widerruf.tsx
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Widerruf – Schulbox" }];

export default function Widerruf() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-6">Widerruf</h1>
      <p className="text-sm text-gray-600 text-center mb-10">Widerrufsbelehrung</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          Verbraucher:innen haben grundsätzlich ein <strong>14-tägiges Widerrufsrecht</strong>.
        </p>

        <p className="font-semibold">Vom Widerruf ausgeschlossen sind:</p>
        <ul className="list-disc pl-6">
          <li>
            Waren, die nach Kundenspezifikation angefertigt wurden
            (z. B. personalisierte Schulartikel).
          </li>
        </ul>

        <p>
          Zur Ausübung des Widerrufsrechts senden Sie bitte eine formlose Nachricht an:
        </p>

        <p>
          <strong>E-Mail:</strong>{" "}
          <a href="mailto:office@schulbox.at" className="text-blue-600 hover:underline">
            office@schulbox.at
          </a>
          <br />
          <strong>Telefon:</strong>{" "}
          <a href="tel:+436763172307" className="text-blue-600 hover:underline">
            +43 676 3172307
          </a>
        </p>

        <p>
          Rücksendungen erfolgen <strong>ausschließlich nach Rücksprache</strong> und
          werden direkt mit dem Lieferanten abgewickelt.
        </p>
      </div>
    </div>
  );
}
