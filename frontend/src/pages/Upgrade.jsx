import { useState } from "react";

export default function Upgrade({ onSuccess }) {
  const [showPayment, setShowPayment] = useState(false);
  const [selected, setSelected] = useState("");

  const methods = [
    "Orange Money",
    "M-Pesa",
    "Airtel Money",
    "Carte Visa",
    "Autres pays africains (bientôt)"
  ];

  const pay = async () => {
    if (!selected) {
      alert("Choisissez un moyen de paiement");
      return;
    }

    const token = localStorage.getItem("token");

    const methodMap = {
      "Orange Money": "ORANGE",
      "M-Pesa": "MPESA",
      "Airtel Money": "AIRTEL",
      "Carte Visa": "VISA",
      "Autres pays africains (bientôt)": "AFRICA"
    };

    try {
      const res = await fetch(
        "http://localhost:3000/api/payment/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          } ,
          body: JSON.stringify({
            plan: "PRO",
            method: methodMap[selected],
            billingCycle: "MONTHLY",
            autoRenew: true
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
  alert("Paiement validé ✅ Réf: " + data.reference);

  if (onSuccess) {
    onSuccess();
  }

} else {
  alert(data.message || "Paiement refusé");
}


    } catch (error) {
      console.log(error);
      alert("Erreur serveur");
    }
  };

  const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    width: "250px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Débloquez votre croissance 🚀</h1>
      <p>Choisissez le plan idéal pour accélérer vos ventes</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "40px"
        }}
      >
        <div style={cardStyle}>
          <h2>STARTER</h2>
          <h3>5$/mois</h3>
          <p>10 produits</p>
          <p>Boutique simple</p>
        </div>

        <div style={cardStyle}>
          <h2>STANDARD</h2>
          <h3>15$/mois</h3>
          <p>20 produits</p>
          <p>Stats vendeur</p>
        </div>

        <div
          style={{
            ...cardStyle,
            border: "3px solid gold",
            transform: "scale(1.05)"
          }}
        >
          <h2>PRO 🚀</h2>
          <h3>25$/mois</h3>
          <p>Produits illimités</p>
          <p>Badge premium</p>
          <p>Priorité affichage</p>

          <button
            onClick={() => setShowPayment(true)}
            style={{
              marginTop: "10px",
              background: "#111",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Choisir PRO
          </button>
        </div>
      </div>

      {showPayment && (
        <div
          style={{
            maxWidth: "500px",
            margin: "50px auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h2>Paiement sécurisé</h2>
          <p>Plan PRO — 25$/mois</p>

          <div style={{ marginTop: "20px" }}>
            {methods.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelected(item)}
                style={{
                  padding: "14px",
                  marginBottom: "12px",
                  border:
                    selected === item
                      ? "2px solid #111"
                      : "1px solid #ddd",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={pay}
            style={{
              marginTop: "20px",
              background: "#111",
              color: "#fff",
              padding: "14px 28px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Continuer paiement
          </button>
        </div>
      )}
    </div>
  );
}