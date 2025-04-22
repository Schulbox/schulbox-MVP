import { FC } from "react";

const UeberUns: FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Über uns
      </h1>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-gray-700 text-center">
          Unsere Vision
        </h2>
        <p className="text-lg text-gray-600 text-center">
          Bildung sollte leicht, freudig und für alle zugänglich sein. Mit
          Schulbox möchten wir den Schulstart für alle Familien einfacher und
          angenehmer machen. Wir setzen auf Leichtigkeit und geben den Eltern
          ihre wertvolle Zeit zurück – für die Dinge, die wirklich zählen:
          gemeinsame Erlebnisse, entspannte Ferien und einen stressfreien
          Schulanfang.
        </p>

        <h2 className="text-3xl font-semibold text-gray-700 text-center">
          Unsere Mission
        </h2>
        <p className="text-lg text-gray-600 text-center">
          Unsere Mission bei Schulbox ist es, den Stress aus der
          Schulvorbereitung zu nehmen und Familien die Freiheit zu geben, ihre
          Zeit sinnvoll zu verbringen. Wir übernehmen die gesamte Planung und
          Organisation. Und das nicht nur effizient, sondern auch sozial
          verantwortungsbewusst.
        </p>

        <h2 className="text-3xl font-semibold text-gray-700 text-center">
          Unsere Geschichte
        </h2>
        <p className="text-lg text-gray-600">
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
        <p className="text-lg text-gray-600">
          Da kam mir die Idee: Schulbox. Ich wollte den Eltern all diese
          anstrengenden Aufgaben abnehmen und ihnen ermöglichen, die Zeit in den
          Ferien für sich und ihre Familie zu nutzen. Schulvorbereitungen sollten
          nicht mehr der Mittelpunkt der Ferien sein. Stattdessen soll Schulbox
          diese Last übernehmen – sodass die Eltern den ersten Schultag endlich
          entspannt und mit mehr Zeit für ihre Liebsten genießen können.
        </p>
        <p className="text-lg text-gray-600">
          Doch das war noch nicht alles. Ich hörte, dass viele geschützte
          Werkstätten dringend Aufträge suchen, um ihre Werkstätten am Leben zu
          erhalten. So kam die Idee, nicht nur den Schulstart zu erleichtern, sondern
          auch den sozialen Aspekt zu integrieren. Jede Schulbox wird in einer
          geschützten Werkstatt verpackt, sodass wir gleichzeitig auch diesen
          wichtigen sozialen Beitrag leisten.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Schulbox ist also mehr als nur eine Dienstleistung – es ist ein Projekt
          mit Herz, das Familien unterstützt und gleichzeitig den Menschen hilft,
          die in geschützten Werkstätten eine sinnvolle Arbeit finden.
        </p>
      </section>

      {/* Optional: Add some images or icons here */}
      <div className="text-center">
        <img
          src="https://via.placeholder.com/600x400"
          alt="Schulbox"
          className="rounded-lg shadow-lg mb-8"
        />
        <p className="text-lg text-gray-600">Unser Team bei Schulbox</p>
      </div>
    </div>
  );
};

export default UeberUns;
