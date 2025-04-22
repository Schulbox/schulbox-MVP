import { FC } from "react";

const UeberUns: FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 animate__animated animate__fadeIn">
        Über uns
      </h1>

      <section className="space-y-12">
        <div className="bg-blue-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all ease-in-out">
          <div className="flex items-center space-x-4">
            <img
              src="/path/to/vision-icon.svg"
              alt="Vision Icon"
              className="w-12 h-12 text-blue-500"
            />
            <h2 className="text-3xl font-semibold text-gray-700">Unsere Vision</h2>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Bildung sollte leicht, freudig und für alle zugänglich sein. Mit
            Schulbox möchten wir den Schulstart für alle Familien einfacher und
            angenehmer machen. Wir setzen auf Leichtigkeit und geben den Eltern
            ihre wertvolle Zeit zurück – für die Dinge, die wirklich zählen:
            gemeinsame Erlebnisse, entspannte Ferien und einen stressfreien
            Schulanfang.
          </p>
        </div>

        <div className="bg-green-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all ease-in-out">
          <div className="flex items-center space-x-4">
            <img
              src="/path/to/mission-icon.svg"
              alt="Mission Icon"
              className="w-12 h-12 text-green-500"
            />
            <h2 className="text-3xl font-semibold text-gray-700">Unsere Mission</h2>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Unsere Mission bei Schulbox ist es, den Stress aus der
            Schulvorbereitung zu nehmen und Familien die Freiheit zu geben, ihre
            Zeit sinnvoll zu verbringen. Wir übernehmen die gesamte Planung und
            Organisation. Und das nicht nur effizient, sondern auch sozial
            verantwortungsbewusst.
          </p>
        </div>

        <div className="bg-yellow-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all ease-in-out">
          <div className="flex items-center space-x-4">
            <img
              src="/path/to/history-icon.svg"
              alt="Geschichte Icon"
              className="w-12 h-12 text-yellow-500"
            />
            <h2 className="text-3xl font-semibold text-gray-700">Unsere Geschichte</h2>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            „Ich wollte nie Millionär werden, ich wollte die Welt verändern und
            etwas Bleibendes hinterlassen.“ Als mein Stiefsohn in die Schule kam,
            fiel mir zum ersten Mal die enorme Vorbereitung auf, die der Schulstart
            mit sich brachte. Das Suchen und Kaufen von Materialien, das
            Beschriften der Hefte, das Verpacken der Schulutensilien und das
            mühsame Schleppen der Schulsachen an den ersten Schultagen – das alles
            kostete unglaublich viel Zeit, Geld und Nerven. Zwischen dem Gottesdienst
            und den Einschulungsritualen quetschte sich dann noch der Versuch, alles
            rechtzeitig ins Klassenzimmer zu bekommen.
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Da kam mir die Idee: Schulbox. Ich wollte den Eltern all diese
            anstrengenden Aufgaben abnehmen und ihnen ermöglichen, die Zeit in den
            Ferien für sich und ihre Familie zu nutzen. Schulvorbereitungen sollten
            nicht mehr der Mittelpunkt der Ferien sein. Stattdessen soll Schulbox
            diese Last übernehmen – so dass die Eltern den ersten Schultag endlich
            entspannt und mit mehr Zeit für ihre Liebsten genießen können.
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Doch das war noch nicht alles. Ich hörte, dass viele geschützte
            Werkstätten dringend Aufträge suchen, um ihre Werkstätten am Leben zu
            erhalten. So kam die Idee, nicht nur den Schulstart zu erleichtern, sondern
            auch den sozialen Aspekt zu integrieren. Jede Schulbox wird in einer
            geschützten Werkstatt verpackt, sodass wir gleichzeitig auch diesen
            wichtigen sozialen Beitrag leisten.
          </p>
          <p className="text-lg text-gray-600 mt-4">
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
