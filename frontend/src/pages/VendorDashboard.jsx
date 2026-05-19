import API_URL from "./services/api";
import { useEffect, useState } from "react";

export default function VendorDashboard({ goUpgrade }) {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: ""
  });

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization:`Bearer ${token}`
  };

  const gold = "#d4af37";

  const card = {
    background: "#121212",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "18px",
    padding: "22px",
    color: "#fff"
  };

  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#0e0e0e",
    color: "#fff"
  };

  const loadData = async () => {
    try {
      const p = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization:`Bearer ${token}`
          }
        }
      ).then((r) => r.json());

      const my = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization:`Bearer ${token}`
          }
        }
      ).then((r) => r.json());

      setProfile(p);
      setProducts(my);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const saveProfile = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(profile)
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Profil sauvegardé ✅");
        loadData();
      } else {
        alert(data.message || "Erreur");
      }

    } catch (error) {
      alert("Erreur serveur");
    }
  };

  const createProduct = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...newProduct,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock)
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Produit publié 🚀");

        setNewProduct({
          name: "",
          description: "",
          price: "",
          image: "",
          stock: ""
        });

        loadData();

      } else {
        alert(data.message || "Erreur");
      }

    } catch (error) {
      alert("Erreur serveur");
    }
  };

  const deleteProduct = async (id) => {
    const ok = window.confirm(
      "Supprimer ce produit ?"
    );

    if (!ok) return;

    try {
      const res = await fetch(
       `${API_URL}/api/auth/me`,
        {
          method: "DELETE",
          headers
        }
      );

      const data = await res.json();

      if (res.ok) {
        loadData();
      } else {
        alert(data.message || "Erreur");
      }

    } catch (error) {
      alert("Erreur serveur");
    }
  };

const chooseBoostPlan = (id) => {
 
   const choice = prompt(
`Choisir boost :

1 = 3 jours ($5)
2 = 7 jours ($10)
3 = 30 jours ($25)

Après paiement :
Envoyer référence transaction`
);
  if (choice === "1") {
    boostProduct(id, 3);
  } else if (choice === "2") {
    boostProduct(id, 7, reference);
  } else if (choice === "3") {
    boostProduct(id, 30);
  } else {
    alert("Choix annulé");
  }
};

const reference = prompt(
"Entrez référence Mobile Money :"
);

if (!reference) {
  alert("Paiement annulé");
  return;
}


const boostProduct = async (
  id,
  days = 3,
  reference = ""
) => {
  try {
    const res = await fetch(
     `${API_URL}/api/auth/me`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ days, reference })
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert(`Produit boosté ${days} jours 🚀`);
      loadData();
    } else {
      alert(data.message || "Erreur");
    }

  } catch (error) {
    alert("Erreur serveur");
  }
};

const getBoostStatus = (date) => {
  if (!date) return null;

  const now = new Date();
  const end = new Date(date);

  const diff =
    end.getTime() - now.getTime();

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Expiré";
  }

  if (days === 1) {
    return "Expire demain ⚠️";
  }

  if (days <= 3) {
    return `Expire dans ${days} jours ⚠️`;
  }

  return `Actif ${days} jours`;
};

  if (!profile) {
    return (
      <h2 style={{ padding: 40 }}>
        Chargement...
      </h2>
    );
  }

  const boostedCount = products.filter(
    (item) => item.isBoosted
  ).length;

  const totalViews = products.reduce(
  (sum, item) =>
    sum + (item.views || 0),
  0
);

const totalSold = products.reduce(
  (sum, item) =>
    sum + (item.soldCount || 0),
  0
);

const activeProducts = products.filter(
  (item) => item.isActive
).length;

const totalRevenue = products.reduce(
  (sum, item) =>
    sum + (item.price * (item.soldCount || 0)),
  0
);

const totalBoostCost = products.reduce(
  (sum, item) =>
    item.isBoosted ? sum + 10 : sum,
  0
);

const roi =
  totalBoostCost > 0
    ? (totalRevenue / totalBoostCost).toFixed(1)
    : 0;

const topProduct = [...products].sort(
  (a, b) =>
    (b.price * (b.soldCount || 0)) -
    (a.price * (a.soldCount || 0))
)[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
        padding: "30px"
      }}
    >
      <h1 style={{ color: gold }}>
        Empire Vendor Center 👑
      </h1>

      <p style={{ color: "#aaa" }}>
        Gérez votre boutique comme un pro
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
  <h3>Produits</h3>
  <h1>{activeProducts}</h1>
</div>

        <div style={card}>
  <h3>Vues</h3>
  <h1>{totalViews}</h1>
</div>

        <div style={card}>
  <h3>Boostés</h3>
  <h1>{boostedCount}</h1>
</div>

        <div style={card}>
  <h3>Ventes</h3>
  <h1>{totalSold}</h1>
</div>

<div style={card}>
  <h3>Revenus</h3>
  <h1>${totalRevenue.toFixed(2)}</h1>
</div>

<div style={card}>
  <h3>ROI</h3>
  <h1>x{roi}</h1>
</div>

<div style={card}>
  <h3>Top Produit</h3>
  <h1>
    {topProduct
      ? topProduct.name
      : "-"}
  </h1>
</div>
</div>

      {/* PROFIL */}
      <div style={{ ...card, marginTop: 25 }}>
        <h2 style={{ color: gold }}>
          Profil boutique
        </h2>

        <input
          style={input}
          placeholder="Nom boutique"
          value={profile.shopName || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              shopName: e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="Logo URL"
          value={profile.logo || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              logo: e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="WhatsApp"
          value={profile.whatsapp || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              whatsapp: e.target.value
            })
          }
        />

        <textarea
          rows="4"
          style={input}
          placeholder="Description"
          value={
            profile.description || ""
          }
          onChange={(e) =>
            setProfile({
              ...profile,
              description:
                e.target.value
            })
          }
        />

        <button
          onClick={saveProfile}
          style={{
            background: gold,
            color: "#000",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Sauvegarder profil
        </button>
      </div>

      {/* ADD PRODUCT */}
      <div style={{ ...card, marginTop: 25 }}>
        <h2 style={{ color: gold }}>
          Ajouter produit
        </h2>

        <input
          style={input}
          placeholder="Nom produit"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              name: e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="Description"
          value={
            newProduct.description
          }
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description:
                e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="Prix"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              image: e.target.value
            })
          }
        />

        <input
          style={input}
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              stock: e.target.value
            })
          }
        />

        <button
          onClick={createProduct}
          style={{
            background: gold,
            color: "#000",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Publier 🚀
        </button>
      </div>

      {/* MES PRODUITS */}
      <div style={{ ...card, marginTop: 25 }}>
        <h2 style={{ color: gold }}>
          Mes produits
        </h2>

        {products.length === 0 ? (
          <p>
            Aucun produit publié.
          </p>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 0",
                borderBottom:
                  "1px solid #222"
              }}
            >
              <h3>
                {item.name}
                {item.isBoosted &&
                  " 🚀"}
              </h3>

              <p>
                ${item.price} |
                Stock :
                {item.stock}
              </p>


{item.isBoosted && (
  <div style={{ marginTop: "6px" }}>
    <p
      style={{
        color: "#d4af37",
        fontWeight: "bold",
        marginBottom: "8px"
      }}
    >
      {getBoostStatus(item.boostUntil)}
    </p>

    {getBoostStatus(item.boostUntil)?.includes("Expire") && (
      <>
        <button
          onClick={() =>
            chooseBoostPlan(item.id)
          }
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Repayer maintenant
        </button>

        <label
          style={{
            display: "block",
            marginTop: "10px",
            color: "#aaa",
            fontSize: "14px"
          }}
        >
          <input
            type="checkbox"
            style={{
              marginRight: "8px"
            }}
          />
          Renouvellement auto
        </label>
      </>
    )}
  </div>
)}
    
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px"
                }}
              >
                <button
                  onClick={() =>
                   chooseBoostPlan(
                      item.id
                    )
                  }
                  style={{
                    background:
                      gold,
                    color:
                      "#000",
                    border:
                      "none",
                    padding:
                      "8px 14px",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer"
                  }}
                >
                  Booster Produit 🚀
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      item.id
                    )
                  }
                  style={{
                    background:
                      "#ff4444",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "8px 14px",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer"
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPGRADE */}
      <div style={{ ...card, marginTop: 25 }}>
        <button
          onClick={goUpgrade}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Upgrade / Boost 🚀
        </button>
      </div>
    </div>
  );
}