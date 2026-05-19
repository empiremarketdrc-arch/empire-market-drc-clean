import API_URL from "./services/api";
import { useState } from "react";

export default function Navbar({
  token,
  setPage,
  onLogout
}) {
  const [open, setOpen] =
    useState(false);

  const gold = "#d4af37";

  const btn = {
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "15px"
  };

  const action = {
    background: gold,
    color: "#000",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "#080808",
        borderBottom:
          "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center"
        }}
      >
        {/* LOGO */}
        <div
          onClick={() =>
            setPage("home")
          }
          style={{
            color: gold,
            fontWeight: "bold",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          Empire Market DRC 👑
        </div>

        {/* DESKTOP MENU */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center"
          }}
        >
          <button
            style={btn}
            onClick={() =>
              setPage("home")
            }
          >
            Accueil
          </button>

          {token && (
            <>
              <button
                style={btn}
                onClick={() =>
                  setPage("cart")
                }
              >
                Panier
              </button>

              <button
                style={btn}
                onClick={() =>
                  setPage(
                    "messages"
                  )
                }
              >
                Messages
              </button>

              <button
                style={btn}
                onClick={() =>
                  setPage(
                    "myEmpire"
                  )
                }
              >
                Mon Empire
              </button>
            </>
          )}

          {!token ? (
            <button
              style={action}
              onClick={() =>
                setPage(
                  "register"
                )
              }
            >
              Commencer
            </button>
          ) : (
            <button
              style={action}
              onClick={onLogout}
            >
              Déconnexion
            </button>
          )}

          {/* MOBILE */}
          <button
            style={{
              ...btn,
              fontSize: "22px"
            }}
            onClick={() =>
              setOpen(!open)
            }
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          style={{
            padding: "15px 20px",
            borderTop:
              "1px solid rgba(255,255,255,0.06)",
            display: "grid",
            gap: "12px",
            background:
              "#111"
          }}
        >
          <button
            style={btn}
            onClick={() => {
              setPage("home");
              setOpen(false);
            }}
          >
            Accueil
          </button>

          {token && (
            <>
              <button
                style={btn}
                onClick={() => {
                  setPage(
                    "cart"
                  );
                  setOpen(
                    false
                  );
                }}
              >
                Panier
              </button>

              <button
                style={btn}
                onClick={() => {
                  setPage(
                    "messages"
                  );
                  setOpen(
                    false
                  );
                }}
              >
                Messages
              </button>

              <button
                style={btn}
                onClick={() => {
                  setPage(
                    "myEmpire"
                  );
                  setOpen(
                    false
                  );
                }}
              >
                Mon Empire
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}