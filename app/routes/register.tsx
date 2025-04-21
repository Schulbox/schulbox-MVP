import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "@remix-run/react";

export default function Register() {
  const navigate = useNavigate();
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

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { email, password, ...profileData } = formData;

    // Schritt 1: Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Fehler bei der Registrierung:", error.message);
      setErrorMsg(`Registrierung fehlgeschlagen: ${error.message}`);
      return;
    }

    if (!data?.user?.id) {
      setErrorMsg("Registrierung fehlgeschlagen: Kein Benutzerobjekt erhalten.");
      return;
    }

    // Schritt 2: Benutzerprofil in 'benutzer' eintragen
    const { error: insertError } = await supabase
      .from("benutzer")
      .insert([
        {
          user_id: data.user.id,
          ...profileData,
        },
      ]);

    if (insertError) {
      console.error("Fehler beim Einfügen in 'benutzer':", insertError.message);
      setErrorMsg(`Fehler beim Speichern der Benutzerdaten: ${insertError.message}`);
      return;
    }

    navigate("/profil");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrieren</h2>
      {["Vorname", "Nachname", "Straße", "Hausnummer", "Türnummer", "Stiege", "Postleitzahl", "Ort", "Telefonnummer", "email", "password"].map((field) => (
        <div key={field}>
          <label>
            {field}:
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required={["Vorname", "Nachname", "Straße", "Hausnummer", "Postleitzahl", "Ort", "email", "password"].includes(field)}
            />
          </label>
        </div>
      ))}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <button type="submit">Registrieren</button>
    </form>
  );
}
