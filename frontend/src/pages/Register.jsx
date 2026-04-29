import { useState } from "react";

export default function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            password
          })
        }
      );

      const data = await res.json();

      console.log("REGISTER RESPONSE =", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "role",
          data.role || "CLIENT"
        );

        if (onLogin) {
          onLogin();
        }

      } else {
        alert(
          data.message ||
          "Erreur inscription"
        );
      }

    } catch (error) {
      console.log(error);
      alert("Erreur serveur");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Créer un compte</h1>

      <input
        placeholder="Nom"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br /><br />

      <input
        placeholder="Téléphone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={handleRegister}>
        Créer mon compte
      </button>
    </div>
  );
}