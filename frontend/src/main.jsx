import './globals.css'
import RootApp from './App.jsx'
import 'antd/dist/reset.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  </React.StrictMode>
);
