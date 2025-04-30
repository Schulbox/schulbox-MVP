// app/routes/agb.tsx
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "AGB – Schulbox" }];

export default function AGB() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-6">AGB</h1>
      <p className="text-sm text-gray-600 text-center mb-10">
        Allgemeine Geschäftsbedingungen (AGB)
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          Die folgenden Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen über unseren Online-Shop durch Verbraucher mit Wohnsitz in Österreich. Mit der Bestellung akzeptieren Kund:innen die nachstehenden Bedingungen.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            Vertragspartner ist <strong>Schulbox</strong>, Einzelunternehmen mit Sitz in Vöcklamarkt.
          </li>
          <li>
            Bestellungen sind ausschließlich für den privaten Gebrauch bestimmt.
          </li>
          <li>
            Die Preise verstehen sich in Euro inkl. Steuern. Versandkosten werden separat ausgewiesen.
          </li>
          <li>
            Die Bezahlung erfolgt über <strong>PayPal, Klarna, Kreditkarte oder Debitkarte</strong>.
          </li>
          <li>
            Personalisierte Produkte sind vom <strong>Widerrufsrecht ausgeschlossen</strong>.
          </li>
          <li>
            Für Rückgaben bitten wir um vorherige Kontaktaufnahme per <a href="mailto:office@schulbox.at" className="text-blue-600 hover:underline">E-Mail</a> oder telefonisch.
          </li>
          <li>
            Es gilt das <strong>Recht der Republik Österreich</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
}
