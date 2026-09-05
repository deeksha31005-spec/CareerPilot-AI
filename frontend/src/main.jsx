import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App";
import "./styles/main.css";

import { AuthProvider } from "./context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    if (
      typeof config.url === "string" &&
      config.url.startsWith("http://localhost:5000")
    ) {
      config.url = config.url.replace(
        "http://localhost:5000",
        API_BASE_URL
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);