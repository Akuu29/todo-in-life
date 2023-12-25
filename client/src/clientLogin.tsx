import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./views/Login/LoginPage";

ReactDOM.createRoot(document.getElementById("login")!).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
);
