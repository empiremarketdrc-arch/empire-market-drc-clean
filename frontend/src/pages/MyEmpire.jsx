import API_URL from "./services/api";
import { useEffect, useState } from "react";

export default function MyEmpire({
  setPage
}) {
  const [userName, setUserName] =
    useState("Utilisateur");

  const gold = "#d4af37";

  const card = {
    background: "#111",
    borderRadius: "18px",
    padding: "18px",
    border:
      "1px solid rgba(212,175,55,0.15)",
    color: "#fff",
    cursor: "pointer"
  };

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "userName"
      );

    if (saved) {
      setUserName(saved);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#fff",
        padding: "30px"
      }}
    >
      <h1 style={{ color: gold }}>
        Mon Empire 👑
      </h1>

      <p
        style={{
          color: "#aaa",
          marginTop: "8px"
        }}
      >
        Bienvenue {userName}
      </p>

      <div
        style={{
          marginTop: "25px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px"
        }}
      >
        <div style={card}>
          📦 Mes commandes
        </div>

        <div style={card}>
          ❤️ Favoris
        </div>

        <div style={card}>
          🔍 Historique recherches
        </div>

        <div style={card}>
          💬 Messages
        </div>

        <div
          style={card}
          onClick={() =>
            setPage(
              "becomeVendor"
            )
          }
        >
          🚀 Devenir vendeur
        </div>

        <div style={card}>
          🎁 Parrainage
        </div>

        <div style={card}>
          🔒 Sécurité compte
        </div>

        <div style={card}>
          ⚙️ Paramètres
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          background: "#111",
          padding: "20px",
          borderRadius: "18px",
          border:
            "1px solid rgba(212,175,55,0.15)"
        }}
      >
        <h2 style={{ color: gold }}>
          Empire Level
        </h2>

        <p
          style={{
            color: "#aaa"
          }}
        >
          Continuez vos achats
          pour débloquer des
          avantages VIP.
        </p>
      </div>
    </div>
  );
}