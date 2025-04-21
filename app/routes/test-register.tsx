import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TestRegister() {
  const [email, setEmail] = useState("kamal.a15190@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [message, setMessage] = useState("");

  const handleTestRegister = async () => {
    console.log("✅ signup() wurde aufgerufen");

    setMessage("⏳ Registrierung wird verarbeitet...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("❌ Fehler bei der Registrierung:", error.message);
      setMessage("❌ Fehler: " + error.message);
    } else {
      console.log("✅ Registrierung erfolgreich:", data);
      setMessage("✅ Registrierung erfolgreich! Bitte E-Mail bestätigen.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <h2>Testregistrierung</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleTestRegister}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Testregistrieren
        </button>

        <p style={{ marginTop: "1.5rem", color: "#333" }}>{message}</p>
      </div>
    </div>
  );
}
