import API_URL from "../config/api";
import { useEffect, useState } from "react";

export default function ShopPublic({ shopName }) {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`)
      .then(res => res.json())
      .then(data => setShop(data))
      .catch(err => console.error(err));
  }, [shopName]);

  if (!shop) {
    return <h2 style={{ padding: 40 }}>Chargement boutique...</h2>;
  }

  if (shop.message) {
    return <h2 style={{ padding: 40 }}>{shop.message}</h2>;
  }

  const gold = "#d4af37";

  return (
    <div style={{ padding: 40, background: "#070707", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ color: gold }}>{shop.shopName}</h1>

      <p>Propriétaire : {shop.user.name}</p>

      <div style={{ marginTop: 30 }}>
        {shop.products.map(product => (
          <div key={product.id} style={{ marginBottom: 30 }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>

            <button
              onClick={() => {
                const message =
                 `Bonjour ${shop.shopName}, je veux commander ${product.name}`;

                window.open(
                  

`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }}
            >
              Commander WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}