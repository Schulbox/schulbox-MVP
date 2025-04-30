// app/routes/impressum.tsx
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Impressum – Schulbox" }];

export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-6">Impressum</h1>
      <p className="text-sm text-gray-600 text-center mb-10">
        Informationen und Offenlegung gemäß §5 (1) ECG, § 25 MedienG, § 63 GewO und § 14 UGB
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="font-semibold">Webseitenbetreiber:</h2>
          <p>Ahmed Kamal el din</p>
        </div>

        <div>
          <h2 className="font-semibold">Anschrift:</h2>
          <p>Exlwöhr 57, 4870 Vöcklamarkt</p>
        </div>

        <div>
          <h2 className="font-semibold">UID-Nr:</h2>
          <p className="text-gray-500 italic">—</p>
        </div>

        <div>
          <h2 className="font-semibold">Gewerbeaufsichtbehörde:</h2>
          <p>Bezirkshauptmannschaft Vöcklabruck</p>
        </div>

        <div>
          <h2 className="font-semibold">Mitgliedschaften:</h2>
          <p className="text-gray-500 italic">—</p>
        </div>

        <div>
          <h2 className="font-semibold">Kontaktdaten:</h2>
          <p>Telefon: <a href="tel:+436763172307" className="text-blue-600 hover:underline">+43 676 3172307</a></p>
          <p>E-Mail: <a href="mailto:office@schulbox.at" className="text-blue-600 hover:underline">office@schulbox.at</a></p>
          <p>Fax: <span className="text-gray-500 italic">—</span></p>
        </div>

        <div>
          <h2 className="font-semibold">Anwendbare Rechtsvorschrift:</h2>
          <p><a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.ris.bka.gv.at</a></p>
        </div>

        <div>
          <h2 className="font-semibold">Berufsbezeichnung:</h2>
          <p className="text-gray-500 italic">—</p>
        </div>

        <div>
          <h2 className="font-semibold">Online Streitbeilegung:</h2>
          <p>
            Verbraucher, welche in Österreich oder in einem sonstigen Vertragsstaat der ODR-VO niedergelassen sind, haben die Möglichkeit, Probleme bezüglich dem entgeltlichen Kauf von Waren oder Dienstleistungen im Rahmen einer Online-Streitbeilegung zu lösen.
          </p>
          <p>
            Plattform der EU-Kommission:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Urheberrecht:</h2>
          <p>
            Die Inhalte dieser Webseite unterliegen, soweit dies rechtlich möglich ist, diversen Schutzrechten (z.B. dem Urheberrecht). Jegliche Verwendung/Verbreitung von bereitgestelltem Material, welche urheberrechtlich untersagt ist, bedarf schriftlicher Zustimmung des Webseitenbetreibers.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Haftungsausschluss:</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernimmt der Webseitenbetreiber keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
          <p>
            Sollten Sie dennoch auf ausgehende Links aufmerksam werden, die auf eine Webseite mit rechtswidriger Tätigkeit/Information verweisen, ersuchen wir um dementsprechenden Hinweis, um diese umgehend zu entfernen.
          </p>
          <p>
            Die Urheberrechte Dritter werden mit größter Sorgfalt beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen Hinweis. Bei Bekanntwerden werden die betroffenen Inhalte umgehend entfernt.
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-8">Quelle: Impressum Generator Österreich</p>
      </div>
    </div>
  );
}
