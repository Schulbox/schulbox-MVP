import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="text-center px-4 py-6">
      <section className="py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 transition-all duration-500 ease-in-out">
          📦 Schulbox – Dein Schulstart mit einem Klick
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-4 text-sm md:text-base">
          Lehrer:innen stellen ein Klassenset zusammen. <br /> Eltern bestellen alles mit 1 Klick.
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mb-6 text-xs md:text-sm">
          Persönlich beschriftet. Verpackt mit Herz. Sozial & stressfrei.
        </p>
        <Link
          to="/webshop"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Jetzt bestellen
        </Link>
      </section>

      <section className="py-12 bg-white md:bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 transition-all duration-500 ease-in-out">
          Warum Schulbox?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📦 Alles auf einen Klick</h3>
            <p className="text-gray-600 text-sm">
              Kein mühsames Zusammensuchen von Schulmaterialien. Einfach bestellen und fertig.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">💌 Persönlich beschriftet</h3>
            <p className="text-gray-600 text-sm">
              Alle Materialien werden auf Wunsch mit dem Namen des Kindes versehen – fix & fertig.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">❤️ Sozial & lokal</h3>
            <p className="text-gray-600 text-sm">
              Verpackung und Beschriftung erfolgen in einer geschützten Werkstätte in Österreich.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 transition-all duration-500 ease-in-out">
          Über Schulbox
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
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
