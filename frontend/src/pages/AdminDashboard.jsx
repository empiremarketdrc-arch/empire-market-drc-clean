import API_URL from "./services/api";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const gold = "#d4af37";

  const [stats] = useState({
    users: 1240,
    vendors: 148,
    products: 3290,
    orders: 812,
    revenue: 18450
  });

  const [vendors, setVendors] =
    useState([
      {
        id: 1,
        name:
          "Tech Kin",
        status:
          "APPROVED"
      },
      {
        id: 2,
        name:
          "Mode Queen",
        status:
          "PENDING"
      },
      {
        id: 3,
        name:
          "Fresh Food",
        status:
          "SUSPENDED"
      }
    ]);

    const [payments, setPayments] =
  useState([]);

  useEffect(() => {
  const loadData = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const payRes =
        await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const payData =
        await payRes.json();

      if (payRes.ok) {
        setPayments(payData);
      }

      const vendorRes =
        await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const vendorData =
        await vendorRes.json();

      if (vendorRes.ok) {
        setVendors(vendorData);
      }

    } catch (error) {
      console.log(error);
    }
  };

  loadData();
}, []);
  
  const card = {
    background: "#111",
    borderRadius: "18px",
    padding: "20px",
    border:
      "1px solid rgba(212,175,55,0.15)"
  };

  const realRevenue =
  payments.reduce(
    (sum, item) =>
      sum + item.amount,
    0
  );
  const recentPayments =
  [...payments]
    .reverse()
    .slice(0, 5);

    
const topVendors =
  Object.values(
    payments.reduce(
      (acc, item) => {
        const key =
          item.vendorId ||
          "unknown";

        if (!acc[key]) {
          acc[key] = {
            vendorId: key,
            total: 0
          };
        }

        acc[key].total +=
          item.amount;

        return acc;
      },
      {}
    )
  )
    .sort(
      (a, b) =>
        b.total - a.total
    )
    .slice(0, 5);

    const updateVendorStatus =
  async (id, status) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              status
            })
          }
        );

      const data =
        await res.json();

      if (res.ok) {
        alert(
          "Statut modifié ✅"
        );
        window.location.reload();
      } else {
        alert(
          data.message ||
            "Erreur"
        );
      }

    } catch (error) {
      alert("Erreur serveur");
    }
  };

const deleteVendor =
  async (id) => {
    const ok =
      window.confirm(
        "Supprimer ce vendeur ?"
      );

    if (!ok) return;

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await res.json();

      if (res.ok) {
        alert(
          "Vendeur supprimé ✅"
        );
        window.location.reload();
      } else {
        alert(
          data.message ||
            "Erreur"
        );
      }

    } catch (error) {
      alert("Erreur serveur");
    }
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
      <h1 style={{ color: gold }}>
        Empire Control Center 👑
      </h1>

      <p style={{ color: "#aaa" }}>
        Supervision totale de
        Empire Market DRC
      </p>

      {/* KPI */}
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
          <h3>Utilisateurs</h3>
          <h1>
            {stats.users}
          </h1>
        </div>

        <div style={card}>
          <h3>Vendeurs</h3>
          <h1>
            {stats.vendors}
          </h1>
        </div>

        <div style={card}>
          <h3>Produits</h3>
          <h1>
            {stats.products}
          </h1>
        </div>

        <div style={card}>
          <h3>Commandes</h3>
          <h1>
            {stats.orders}
          </h1>
        </div>

        <div style={card}>
          <h3>Revenus</h3>
          <h1>
            $
            {
              realRevenue.toFixed(2)
            }
          </h1>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        style={{
          marginTop: "25px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "18px"
        }}
      >
        <div style={card}>
          <h3>
            Validation vendeurs
          </h3>

          <p>
            Approuver /
            bloquer
            boutiques.
          </p>
        </div>

        <div style={card}>
          <h3>
            Contrôle produits
          </h3>

          <p>
            Supprimer faux
            produits / spam.
          </p>
        </div>

        <div style={card}>
          <h3>
            Gestion paiements
          </h3>

          <p>
            Vérifier flux
            financiers.
          </p>
        </div>

        <div style={card}>
          <h3>
            Referral system
          </h3>

          <p>
            Voir top
            ambassadeurs.
          </p>
        </div>
      </div>

      {/* VENDEURS */}
      <div
        style={{
          ...card,
          marginTop: "30px"
        }}
      >
        <h2 style={{ color: gold }}>
          Vendeurs récents
        </h2>

        {vendors.map((item) => (
  <div
    key={item.id}
    style={{
      marginTop: "14px",
      padding: "12px",
      background: "#1a1a1a",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <strong>
      {item.name}
    </strong>

    <div>
      <span>
        {item.status}
      </span>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        {item.status === "PENDING" && (
          <button
            onClick={() =>
              updateVendorStatus(
                item.id,
                "APPROVED"
              )
            }
          >
            Approuver
          </button>
        )}

        {item.status === "APPROVED" && (
          <button
            onClick={() =>
              updateVendorStatus(
                item.id,
                "SUSPENDED"
              )
            }
          >
            Suspendre
          </button>
        )}

        {item.status === "SUSPENDED" && (
          <button
            onClick={() =>
              updateVendorStatus(
                item.id,
                "APPROVED"
              )
            }
          >
            Réactiver
          </button>
        )}

        <button
  onClick={() =>
    deleteVendor(item.id)
  }
>
  Supprimer
</button>

      </div>
    </div>
  </div>
))}
      </div>

      <div
  style={{
    ...card,
    marginTop: "25px"
  }}
>
  <h2 style={{ color: gold }}>
    Transactions récentes
  </h2>

  {recentPayments.length === 0 ? (
    <p>Aucun paiement.</p>
  ) : (
    recentPayments.map((item) => (
      <div
        key={item.id}
        style={{
          marginTop: "12px",
          padding: "12px",
          background: "#1a1a1a",
          borderRadius: "12px"
        }}
      >
        <strong>{item.reference}</strong>

        <p>${item.amount}</p>

        <p>{item.status}</p>
      </div>
    ))
  )}
</div>

<div
  style={{
    ...card,
    marginTop: "25px"
  }}
>
  <h2 style={{ color: gold }}>
    Top vendeurs payants
  </h2>

  {topVendors.length === 0 ? (
    <p>Aucune donnée.</p>
  ) : (
    topVendors.map((item, index) => (
      <div
        key={item.vendorId}
        style={{
          marginTop: "12px",
          padding: "12px",
          background: "#1a1a1a",
          borderRadius: "12px"
        }}
      >
        <strong>#{index + 1}</strong>

        <p>ID : {item.vendorId}</p>

        <p>${item.total}</p>
      </div>
    ))
  )}
</div>

      {/* ALERTES */}
      <div
        style={{
          ...card,
          marginTop: "25px"
        }}
      >
        <h2 style={{ color: gold }}>
          Alertes système
        </h2>

        <p>
          ⚠️ 3 vendeurs en
          attente validation
        </p>

        <p>
          ⚠️ 2 litiges clients
          ouverts
        </p>

        <p>
          ⚠️ 14 produits
          signalés
        </p>
      </div>
    </div>
  );
}