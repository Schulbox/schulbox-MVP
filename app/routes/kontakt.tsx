// app/routes/kontakt.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, type LoaderFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { sendMail } from "~/lib/email.server";

type ActionResponse = {
    success: boolean;
    error?: string;
  };

  export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
  
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return json<ActionResponse>({ success: false, error: "Ungültige Eingabe." });
    }
  
    try {
      await sendMail({
        to: "office@schulbox.at",
        subject: `Neue Nachricht von ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Nachricht:</strong><br>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
      return json<ActionResponse>({ success: true });
    } catch (error) {
      console.error("[Kontakt] Fehler beim Senden der Mail:", error);
      return json<ActionResponse>({ success: false, error: "Fehler beim Senden der Nachricht." });
    }
  };

export default function Kontakt() {
  const result = useActionData<typeof action>();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-semibold text-center mb-8">Kontakt</h1>

      {result?.success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-sm text-center">
          Vielen Dank für Ihre Nachricht! Wir melden uns in Kürze.
        </div>
      ) : result?.error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6 text-sm text-center">
          {result.error}
        </div>
      ) : null}

      <Form method="post" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            required
            type="text"
            name="name"
            id="name"
            className="" // Rely on base styles from tailwind.css
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            E-Mail
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            className="" // Rely on base styles from tailwind.css
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Nachricht
          </label>
          <textarea
            required
            name="message"
            id="message"
            rows={6}
            className="" // Rely on base styles from tailwind.css
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Nachricht senden
        </button>
      </Form>
    </div>
  );
}

