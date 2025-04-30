// app/routes/datenschutz.tsx
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Datenschutz – Schulbox" }];

export default function Datenschutz() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-6">Datenschutz</h1>
      <p className="text-sm text-gray-600 text-center mb-10">
        Erklärung zur Informationspflicht gemäß DSGVO
      </p>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          In folgender Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Webseite. Wir erheben und verarbeiten personenbezogene Daten nur auf Grundlage der gesetzlichen Bestimmungen (Datenschutzgrundverordnung, Telekommunikationsgesetz 2003).
        </p>

        <p>
          Sobald Sie unsere Webseite besuchen, wird Ihre IP-Adresse sowie Beginn und Ende der Sitzung erfasst. Dies ist technisch bedingt und stellt ein berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO dar.
        </p>

        <h2 className="font-semibold mt-8">Kontakt mit uns</h2>
        <p>
          Wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage für sechs Monate gespeichert. Ohne Ihre Einwilligung erfolgt keine Weitergabe.
        </p>

        <h2 className="font-semibold mt-8">Datenspeicherung</h2>
        <p>
          Zur Vertragsabwicklung und Benutzerfreundlichkeit speichern wir Daten wie IP-Adresse, Vorname, Nachname, Adresse, E-Mail, Telefonnummer, Name des Kindes. Die Datenverarbeitung basiert auf Art. 6 Abs. 1 lit. a und b DSGVO sowie § 96 Abs. 3 TKG.
        </p>
        <p>
          Bei Abbruch eines Einkaufs werden Ihre Daten gelöscht. Bei Vertragsabschluss bleiben sie bis zum Ablauf gesetzlicher Fristen gespeichert (7 Jahre steuerlich, 10 Jahre produkthaftungsrechtlich).
        </p>
        <p>
          Eine Weitergabe erfolgt nur an Zahlungsdienstleister, Versandunternehmen und unseren Steuerberater.
        </p>

        <h2 className="font-semibold mt-8">Cookies</h2>
        <p>
          Unsere Website verwendet Cookies zur Verbesserung der Nutzerfreundlichkeit. Einige Cookies bleiben auf Ihrem Gerät gespeichert, bis Sie diese löschen. Sie können die Nutzung in Ihrem Browser konfigurieren.
        </p>

        <h2 className="font-semibold mt-8">Google Fonts</h2>
        <p>
          Wir nutzen Schriftarten von Google Fonts (Google Ireland Limited, Gordon House, Dublin). Dabei werden Daten wie IP-Adresse an Google übermittelt, ggf. auch Cookies gesetzt. Dies erfolgt im berechtigten Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Weitere Informationen:{" "}
          <a
            href="https://developers.google.com/fonts/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://developers.google.com/fonts/faq
          </a>{" "}
          und{" "}
          <a
            href="https://policies.google.com/privacy?hl=de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://policies.google.com/privacy?hl=de
          </a>
        </p>
        <p>
          Google ist unter dem EU-US Privacy Shield zertifiziert:{" "}
          <a
            href="https://www.privacyshield.gov/EU-US-Framework"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.privacyshield.gov
          </a>
        </p>

        <h2 className="font-semibold mt-8">Ihre Rechte als Betroffener</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerruf und Einschränkung der Verarbeitung. Beschwerden richten Sie bitte an uns oder an die Datenschutzbehörde.
        </p>

        <div>
          <h2 className="font-semibold mt-6">Kontakt:</h2>
          <p>Webseitenbetreiber: Ahmed Kamal el din</p>
          <p>Telefon: <a href="tel:+436763172307" className="text-blue-600 hover:underline">+43 676 3172307</a></p>
          <p>Email: <a href="mailto:office@schulbox.at" className="text-blue-600 hover:underline">office@schulbox.at</a></p>
        </div>

        <p className="text-xs text-gray-400 mt-8">Quelle: Datenschutzgenerator Österreich DSGVO</p>
      </div>
    </div>
  );
}
