import API_URL from "../services/api";
import { useState } from "react";

export default function Messages() {
  const gold = "#d4af37";

  const [conversations] =
    useState([
      {
        id: 1,
        shop: "Tech Store",
        lastMessage:
          "Votre commande est prête.",
        unread: true
      },
      {
        id: 2,
        shop: "Mode Queen",
        lastMessage:
          "Merci pour votre achat.",
        unread: false
      }
    ]);

  const [active, setActive] =
    useState(
      conversations[0]
    );

  const [messages, setMessages] =
    useState([
      {
        from: "shop",
        text: "Bonjour 👋"
      },
      {
        from: "me",
        text:
          "Je veux commander."
      },
      {
        from: "shop",
        text:
          "Quel article ?"
      }
    ]);

  const [text, setText] =
    useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages([
      ...messages,
      {
        from: "me",
        text
      }
    ]);

    setText("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#fff",
        padding: "25px"
      }}
    >
      <h1 style={{ color: gold }}>
        Messages 💬
      </h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "320px 1fr",
          gap: "18px"
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#111",
            borderRadius: "18px",
            padding: "15px",
            border:
              "1px solid rgba(212,175,55,0.15)"
          }}
        >
          <h3
            style={{
              color: gold
            }}
          >
            Conversations
          </h3>

          {conversations.map(
            (item) => (
              <div
                key={item.id}
                onClick={() =>
                  setActive(
                    item
                  )
                }
                style={{
                  marginTop:
                    "12px",
                  padding:
                    "12px",
                  background:
                    active.id ===
                    item.id
                      ? "#1a1a1a"
                      : "transparent",
                  borderRadius:
                    "12px",
                  cursor:
                    "pointer"
                }}
              >
                <strong>
                  {
                    item.shop
                  }
                </strong>

                <p
                  style={{
                    color:
                      "#aaa",
                    fontSize:
                      "14px"
                  }}
                >
                  {
                    item.lastMessage
                  }
                </p>

                {item.unread && (
                  <span
                    style={{
                      color:
                        gold,
                      fontSize:
                        "12px"
                    }}
                  >
                    Nouveau
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* RIGHT */}
        <div
          style={{
            background: "#111",
            borderRadius: "18px",
            padding: "15px",
            border:
              "1px solid rgba(212,175,55,0.15)",
            display: "flex",
            flexDirection:
              "column",
            height: "75vh"
          }}
        >
          <h3
            style={{
              color: gold
            }}
          >
            {active.shop}
          </h3>

          <div
            style={{
              flex: 1,
              overflowY:
                "auto",
              marginTop:
                "15px"
            }}
          >
            {messages.map(
              (
                msg,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  style={{
                    textAlign:
                      msg.from ===
                      "me"
                        ? "right"
                        : "left",
                    marginBottom:
                      "12px"
                  }}
                >
                  <span
                    style={{
                      display:
                        "inline-block",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "12px",
                      background:
                        msg.from ===
                        "me"
                          ? gold
                          : "#1d1d1d",
                      color:
                        msg.from ===
                        "me"
                          ? "#000"
                          : "#fff"
                    }}
                  >
                    {
                      msg.text
                    }
                  </span>
                </div>
              )
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop:
                "15px"
            }}
          >
            <input
              value={text}
              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
              placeholder="Écrire..."
              style={{
                flex: 1,
                padding:
                  "12px",
                borderRadius:
                  "10px",
                border:
                  "none"
              }}
            />

            <button
              onClick={
                sendMessage
              }
              style={{
                background:
                  gold,
                color:
                  "#000",
                border:
                  "none",
                padding:
                  "12px 18px",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer"
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}