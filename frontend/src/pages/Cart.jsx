import API_URL from "../config/api";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const gold = "#d4af37";

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(saved);
  }, []);

  const removeItem = (index) => {
    const updated = [...cart];

    updated.splice(index, 1);

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price),
    0
  );

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
        Mon Panier 🛒
      </h1>

      {cart.length === 0 ? (
        <p>
          Votre panier est vide.
        </p>
      ) : (
        <>
          {cart.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  background:
                    "#111",
                  padding:
                    "18px",
                  borderRadius:
                    "14px",
                  marginTop:
                    "15px",
                  border:
                    "1px solid rgba(212,175,55,0.15)"
                }}
              >
                <h3>
                  {item.name}
                </h3>

                <p>
                  $
                  {
                    item.price
                  }
                </p>

                <button
                  onClick={() =>
                    removeItem(
                      index
                    )
                  }
                  style={{
                    marginTop:
                      "10px",
                    background:
                      "#ff4444",
                    color:
                      "#fff",
                    border:
                      "none",
                    padding:
                      "10px 14px",
                    borderRadius:
                      "10px",
                    cursor:
                      "pointer"
                  }}
                >
                  Supprimer
                </button>
              </div>
            )
          )}

          <h2
            style={{
              marginTop: "25px",
              color: gold
            }}
          >
            Total : ${total}
          </h2>

          <button
            style={{
              marginTop: "15px",
              background: gold,
              color: "#000",
              border: "none",
              padding:
                "14px 20px",
              borderRadius:
                "12px",
              fontWeight:
                "bold",
              cursor:
                "pointer"
            }}
          >
            Commander 🚀
          </button>
        </>
      )}
    </div>
  );
}