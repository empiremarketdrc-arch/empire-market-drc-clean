import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Upgrade from "./pages/Upgrade";
import ShopPublic from "./pages/ShopPublic";
import BecomeVendor from "./pages/BecomeVendor";

import Cart from "./pages/Cart";
import MyEmpire from "./pages/MyEmpire";
import Messages from "./pages/Messages";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedRole =
      localStorage.getItem("role");

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
      setPage("home");

      checkVendorStatus(
        savedToken
      );
    }
  }, []);

  const checkVendorStatus =
    async (savedToken) => {
      if (!savedToken) return;

      try {
        const res =
          await fetch(
            "http://localhost:3000/api/auth/me",
            {
              headers: {
                Authorization:`Bearer ${savedToken}`
              }
            }
          );

        const data =
          await res.json();

        if (
          data.dashboardType ===
          "VENDOR"
        ) {
          setIsVendor(true);
        } else {
          setIsVendor(false);
        }

      } catch (error) {
        console.log(error);
      }
    };

  const handleLogin =
    async () => {
      const tk =
        localStorage.getItem(
          "token"
        );

      const rl =
        localStorage.getItem(
          "role"
        );

      setToken(tk);
      setRole(rl);
      setPage("home");

      await checkVendorStatus(
        tk
      );
    };

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    setToken(null);
    setRole(null);
    setIsVendor(false);
    setPage("login");
  };

  const path =
    window.location.pathname;

  /* SHOP PUBLIC */
  if (
    path.startsWith("/shop/")
  ) {
    const shopName =
      decodeURIComponent(
        path.split("/shop/")[1]
      );

    return (
      <ShopPublic
        shopName={shopName}
      />
    );
  }

  return (
    <>
      <Navbar
        token={token}
        setPage={setPage}
        onLogout={
          handleLogout
        }
      />

      {/* NON CONNECTÉ */}
      {!token ? (
        page ===
        "register" ? (
          <Register
            onLogin={
              handleLogin
            }
          />
        ) : (
          <Login
            onLogin={
              handleLogin
            }
            goRegister={() =>
              setPage(
                "register"
              )
            }
          />
        )
      ) : role === "ADMIN" ? (

        /* ADMIN */
        <AdminDashboard />

      ) : page ===
        "cart" ? (

        <Cart />

      ) : page ===
        "messages" ? (

        <Messages />

      ) : page ===
        "myEmpire" ? (

        <MyEmpire
          setPage={setPage}
        />

      ) : page ===
        "becomeVendor" ? (

        <BecomeVendor />

      ) : page ===
        "upgrade" ? (

        <Upgrade
          onSuccess={() =>
            setPage(
              "home"
            )
          }
        />

      ) : isVendor ? (

        <VendorDashboard
          goUpgrade={() =>
            setPage(
              "upgrade"
            )
          }
        />

      ) : (

        <HomePage />

      )}
    </>
  );
}

export default App;