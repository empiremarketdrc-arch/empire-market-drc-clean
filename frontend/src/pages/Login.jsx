import API_URL from "../config/api";
import { useState } from "react";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] =
    useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const url = isRegister
        ? `${API_URL}/api/auth/me`
        : `${API_URL}/api/auth/me`;

      const body = isRegister
        ? {
            name,
            phone,
            email,
            password
          }
        : {
            identifier,
            password
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message || "Erreur"
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role || "CLIENT"
      );

      if (onLogin) {
        onLogin();
      }

    } catch (error) {
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px"
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "30px"
      }}
    >
      <h1>
        {isRegister
          ? "Créer un compte"
          : "Connexion Empire"}
      </h1>

      {isRegister ? (
        <>
          <input
            style={input}
            placeholder="Nom"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            style={input}
            placeholder="Téléphone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <input
            style={input}
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />
        </>
      ) : (
        <input
          style={input}
          placeholder="Email ou téléphone"
          value={identifier}
          onChange={(e) =>
            setIdentifier(
              e.target.value
            )
          }
        />
      )}

      <input
        style={input}
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px"
        }}
      >
        {loading
          ? "Chargement..."
          : isRegister
          ? "Créer compte"
          : "Se connecter"}
      </button>

      <p
        style={{
          marginTop: "15px",
          cursor: "pointer"
        }}
        onClick={() =>
          setIsRegister(
            !isRegister
          )
        }
      >
        {isRegister
          ? "Déjà un compte ? Connexion"
          : "Pas de compte ? Inscription"}
      </p>
    </div>
  );
}