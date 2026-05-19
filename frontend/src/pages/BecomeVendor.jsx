import API_URL from "./services/api";
import { useState } from "react";

export default function BecomeVendor() {
  const [type, setType] = useState("INFORMAL");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    whatsapp: "",
    phoneBusiness: "",
    description: "",
    paymentMethod: "MPESA",
    paymentNumber: "",
    bankName: "",
    bankHolder: "",
    bankAccount: ""
  });

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Connectez-vous d’abord.");
      return;
    }

    if (!form.shopName || !form.whatsapp) {
      alert("Champs obligatoires manquants");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`
          },
          body: JSON.stringify({
            type,
            ...form
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Demande envoyée avec succès");
      } else {
        alert(data.message || "Erreur");
      }

    } catch (error) {
      alert("Erreur serveur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const gold = "#d4af37";

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    marginBottom: "15px"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#fff",
        padding: "30px"
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#111",
          padding: "30px",
          borderRadius: "18px",
          border: "1px solid rgba(212,175,55,0.15)"
        }}
      >
        <h1 style={{ color: gold }}>
          Devenir vendeur Empire 👑
        </h1>

        <p style={{ color: "#aaa" }}>
          Lancez votre boutique digitale en RDC.
        </p>

        <h3 style={{ marginTop: "25px" }}>
          Type de vendeur
        </h3>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="INFORMAL">
            Informel
          </option>

          <option value="FORMAL">
            Formel
          </option>
        </select>

        <input
          placeholder="Nom boutique"
          value={form.shopName}
          onChange={(e) =>
            updateField("shopName", e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={(e) =>
            updateField("whatsapp", e.target.value)
          }
          style={inputStyle}
        />

        <input
          placeholder="Téléphone business"
          value={form.phoneBusiness}
          onChange={(e) =>
            updateField(
              "phoneBusiness",
              e.target.value
            )
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Description boutique"
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          style={{
            ...inputStyle,
            minHeight: "110px"
          }}
        />

        <h3>Méthode de paiement</h3>

        <select
          value={form.paymentMethod}
          onChange={(e) =>
            updateField(
              "paymentMethod",
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="MPESA">M-Pesa</option>
          <option value="AIRTEL">
            Airtel Money
          </option>
          <option value="ORANGE">
            Orange Money
          </option>
          <option value="BANK">Banque</option>
        </select>

        {form.paymentMethod !== "BANK" ? (
          <input
            placeholder="Numéro paiement"
            value={form.paymentNumber}
            onChange={(e) =>
              updateField(
                "paymentNumber",
                e.target.value
              )
            }
            style={inputStyle}
          />
        ) : (
          <>
            <input
              placeholder="Nom banque"
              value={form.bankName}
              onChange={(e) =>
                updateField(
                  "bankName",
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              placeholder="Nom titulaire"
              value={form.bankHolder}
              onChange={(e) =>
                updateField(
                  "bankHolder",
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              placeholder="Numéro compte"
              value={form.bankAccount}
              onChange={(e) =>
                updateField(
                  "bankAccount",
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: gold,
            color: "#000",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          {loading
            ? "Envoi..."
            : "Soumettre candidature"}
        </button>
      </div>
    </div>
  );
}