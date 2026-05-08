import API_URL from "../config/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const gold = "#d4af37";

  const card = {
    background: "#111",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid rgba(212,175,55,0.15)",
    color: "#fff"
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/auth/me`
      );

      const data = await res.json();

      setProducts(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCartCount(cart.length);
  }, []);

  const addToCart = (product) => {
    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    cart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    setCartCount(cart.length);

    alert("Ajouté au panier 🛒");
  };

const filteredProducts = products
  .filter((item) =>
    item.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
  .sort((a, b) => {
    if (
      a.isBoosted &&
      !b.isBoosted
    )
      return -1;

    if (
      !a.isBoosted &&
      b.isBoosted
    )
      return 1;

    return 0;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#fff"
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          padding: "18px 25px",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <h2 style={{ color: gold }}>
          Empire Market DRC 👑
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <button>
            💬 Messages
          </button>

          <button>
            👑 Mon Empire
          </button>

          <button>
            🛒 Panier (
            {cartCount})
          </button>
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          padding: "45px 25px",
          textAlign: "center"
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            color: gold
          }}
        >
          Le Super Marché
          Digital de la RDC 🇨🇩
        </h1>

        <p
          style={{
            color: "#aaa",
            maxWidth: "700px",
            margin:
              "15px auto"
          }}
        >
          Achetez, vendez,
          développez votre
          business partout au
          Congo.
        </p>

        {/* SEARCH */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent:
              "center",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Rechercher produit..."
            style={{
              width: "340px",
              padding: "14px",
              borderRadius:
                "12px",
              border: "none"
            }}
          />

          <button
            style={{
              background: gold,
              border: "none",
              padding:
                "14px 18px",
              borderRadius:
                "12px"
            }}
          >
            🔍
          </button>

          <button
            style={{
              background: "#111",
              color: "#fff",
              border:
                "1px solid rgba(255,255,255,0.1)",
              padding:
                "14px 18px",
              borderRadius:
                "12px"
            }}
          >
            🎤
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        style={{
          padding: "25px"
        }}
      >
        <h2 style={{ color: gold }}>
          Produits tendance
        </h2>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(230px,1fr))",
            gap: "18px"
          }}
        >
          {filteredProducts.map(
            (item) => (
              <div
                key={item.id}
                style={card}
              >

                {item.isBoosted && (
  <div
    style={{
      background: "#d4af37",
      color: "#000",
      padding: "6px 10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "10px",
      display: "inline-block"
    }}
  >
    🔥 Sponsorisé
  </div>
)}

                {item.image ? (
                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.name
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "180px",
                      objectFit:
                        "cover",
                      borderRadius:
                        "12px",
                      marginBottom:
                        "12px"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height:
                        "180px",
                      background:
                        "#1b1b1b",
                      borderRadius:
                        "12px",
                      marginBottom:
                        "12px"
                    }}
                  />
                )}

                <h3>
                  {item.name}
                </h3>

                <p
                  style={{
                    color:
                      "#999"
                  }}
                >
                  {
                    item
                      .vendor
                      ?.shopName
                  }
                </p>

                <p
                  style={{
                    color:
                      gold,
                    fontWeight:
                      "bold"
                  }}
                >
                  $
                  {
                    item.price
                  }
                </p>

                <button
                  onClick={() =>
                    addToCart(
                      item
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    background:
                      gold,
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    marginTop:
                      "10px"
                  }}
                >
                  Ajouter au
                  panier
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* TRUST */}
      <div
        style={{
          padding: "25px"
        }}
      >
        <h2 style={{ color: gold }}>
          Pourquoi Empire
          Market DRC ?
        </h2>

        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px"
          }}
        >
          <div style={card}>
            ✅ Vendeurs
            vérifiés
          </div>

          <div style={card}>
            🔒 Paiement
            sécurisé
          </div>

          <div style={card}>
            🚚 Livraison
            rapide
          </div>

          <div style={card}>
            💬 Support
            WhatsApp
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#777"
        }}
      >
        Empire Market DRC ©
        2026
      </div>
    </div>
  );
}

