import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [formData, setFormData] = useState({
    Vorname: "",
    Nachname: "",
    Straße: "",
    Hausnummer: "",
    Türnummer: "",
    Stiege: "",
    Postleitzahl: "",
    Ort: "",
    Telefonnummer: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { email, password, ...profileData } = formData;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setError("Registrierung fehlgeschlagen. Kein Benutzer-ID erhalten.");
      return;
    }

    const { error: insertError } = await supabase
      .from("benutzer")
      .update(profileData)
      .eq("user_id", userId);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Registrieren</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="Vorname"
          placeholder="Vorname"
          value={formData.Vorname}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Nachname"
          placeholder="Nachname"
          value={formData.Nachname}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Straße"
          placeholder="Straße"
          value={formData.Straße}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Hausnummer"
          placeholder="Hausnummer"
          value={formData.Hausnummer}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Türnummer"
          placeholder="Türnummer"
          value={formData.Türnummer}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="Stiege"
          placeholder="Stiege"
          value={formData.Stiege}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="Postleitzahl"
          placeholder="Postleitzahl"
          value={formData.Postleitzahl}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Ort"
          placeholder="Ort"
          value={formData.Ort}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="Telefonnummer"
          placeholder="Telefonnummer"
          value={formData.Telefonnummer}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="col-span-1 sm:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrieren
        </button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">Registrierung erfolgreich!</p>}
    </div>
  );
}
