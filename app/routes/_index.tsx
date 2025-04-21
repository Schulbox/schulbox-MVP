import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="text-center px-4 py-10">
      <section className="py-16">
      <h1 className="text-3xl font-bold text-center mb-2">
         📦 Schulbox – Dein Schulstart mit einem Klick
      </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-2">
          Lehrer:innen stellen ein Klassenset zusammen. <br /> Eltern bestellen alles mit 1 Klick.
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          Persönlich beschriftet. Verpackt mit Herz. Sozial & stressfrei.
        </p>
        <Link
          to="/webshop"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-semibold"
        >
          Jetzt bestellen
        </Link>
      </section>

      <section className="py-16 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-10">Warum Schulbox?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              📦 Alles auf einen Klick
            </h3>
            <p className="text-gray-600">
              Kein mühsames Zusammensuchen von Schulmaterialien. Einfach bestellen und fertig.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              💌 Persönlich beschriftet
            </h3>
            <p className="text-gray-600">
              Alle Materialien werden auf Wunsch mit dem Namen des Kindes versehen – fix & fertig.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
               ❤️ Sozial & lokal
            </h3>
            <p className="text-gray-600">
              Verpackung und Beschriftung erfolgen in einer geschützten Werkstätte in Österreich.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-2xl font-semibold mb-6">Über Schulbox</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Schulbox wurde gegründet, um Eltern und Lehrer:innen den Start ins Schuljahr zu erleichtern –
          und gleichzeitig einen sozialen Beitrag zu leisten. Gemeinsam mit regionalen Werkstätten sorgen
          wir dafür, dass jedes Kind vorbereitet und mit Freude startet.
        </p>
      </section>

      <footer className="border-t py-6 text-sm text-gray-500">
        <p>© 2025 Schulbox &nbsp;&nbsp;|
          <Link to="/impressum" className="hover:underline"> Impressum</Link> &nbsp;|
          <Link to="/datenschutz" className="hover:underline"> Datenschutz</Link> &nbsp;|
          <Link to="/agb" className="hover:underline"> AGB</Link> &nbsp;|
          <Link to="/widerruf" className="hover:underline"> Widerruf</Link> &nbsp;|
          <Link to="/kontakt" className="hover:underline"> Kontakt</Link>
        </p>
      </footer>
    </div>
  );
}
