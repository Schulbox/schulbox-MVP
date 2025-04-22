import { FC } from "react";

const UeberUns: FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Über uns
      </h1>

      <section className="space-y-8">
        {/* Vision Section */}
        <div className="bg-blue-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <i className="fas fa-lightbulb text-3xl text-blue-600"></i>
            <h2 className="text-xl font-semibold text-gray-700">Unsere Vision</h2>
          </div>
          <p className="text-base text-gray-600 mt-4">
            Bildung sollte leicht, freudig und für alle zugänglich sein. Mit
            Schulbox möchten wir den Schulstart für alle Familien einfacher und
            angenehmer machen. Wir setzen auf Leichtigkeit und geben den Eltern
            ihre wertvolle Zeit zurück – für die Dinge, die wirklich zählen:
            gemeinsame Erlebnisse, entspannte Ferien und einen stressfreien
            Schulanfang.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-green-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <i className="fas fa-bullseye text-3xl text-green-600"></i>
            <h2 className="text-xl font-semibold text-gray-700">Unsere Mission</h2>
          </div>
          <p className="text-base text-gray-600 mt-4">
            Unsere Mission bei Schulbox ist es, den Stress aus der
            Schulvorbereitung zu nehmen und Familien die Freiheit zu geben, ihre
            Zeit sinnvoll zu verbringen. Wir übernehmen die gesamte Planung und
            Organisation. Und das nicht nur effizient, sondern auch sozial
            verantwortungsbewusst.
          </p>
        </div>

        {/* Geschichte Section */}
        <div className="bg-yellow-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <i className="fas fa-history text-3xl text-yellow-600"></i>
            <h2 className="text-xl font-semibold text-gray-700">Unsere Geschichte</h2>
          </div>
          <p className="text-base text-gray-600 mt-4">
            „Ich wollte nie Millionär werden, ich wollte die Welt verändern und
            etwas Bleibendes hinterlassen.“ Als mein Stiefsohn in die Schule kam,
            fiel mir zum ersten Mal die enorme Vorbereitung auf, die der Schulstart
            mit sich brachte. Das Suchen und Kaufen von Materialien, das
            Beschriften der Hefte, das Verpacken der Schulutensilien und das
            mühsame Schleppen der Schulsachen an den ersten Schultagen – das alles
            kostete unglaublich viel Zeit, Geld und Nerven.
          </p>
          <p className="text-base text-gray-600 mt-4">
            Da kam mir die Idee: Schulbox. Ich wollte den Eltern all diese
            anstrengenden Aufgaben abnehmen und ihnen ermöglichen, die Zeit in den
            Ferien für sich und ihre Familie zu nutzen. Schulvorbereitungen sollten
            nicht mehr der Mittelpunkt der Ferien sein. Stattdessen soll Schulbox
            diese Last übernehmen – so dass die Eltern den ersten Schultag endlich
            entspannt und mit mehr Zeit für ihre Liebsten genießen können.
          </p>
          <p className="text-base text-gray-600 mt-4">
            Doch das war noch nicht alles. Ich hörte, dass viele geschützte
            Werkstätten dringend Aufträge suchen, um ihre Werkstätten am Leben zu
            erhalten. So kam die Idee, nicht nur den Schulstart zu erleichtern,
            sondern auch den sozialen Aspekt zu integrieren. Jede Schulbox wird in
            einer geschützten Werkstatt verpackt, sodass wir gleichzeitig auch diesen
            wichtigen sozialen Beitrag leisten.
          </p>
          <p className="text-base text-gray-600 mt-4">
            Schulbox ist also mehr als nur eine Dienstleistung – es ist ein Projekt
            mit Herz, das Familien unterstützt und gleichzeitig den Menschen hilft,
            die in geschützten Werkstätten eine sinnvolle Arbeit finden.
          </p>
        </div>
      </section>
    </div>
  );
};

export default UeberUns;
