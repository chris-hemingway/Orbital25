import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import Search from './pages/Search/Search';
import { useAuth } from "./components/AuthContext";

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/search'];
  const [messageApi, contextHolder] = message.useMessage();
  const [username, setUsername] = useState(null);
  const auth = useAuth();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5001/api/login', values);
      const token = res.data.token;
      auth.login(res.data.token);

      // decode username
      const decoded = jwtDecode(res.data.token);
      setUsername(decoded.username);

      messageApi.success("Login successful!");
      navigate('/search');
    } catch (err) {
      messageApi.error("Login failed: " + (err?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/register', values);
      messageApi.success("Registered successfully!");
      navigate('/login');
    } catch (err) {
      messageApi.error("Registration failed: " + (err?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    //token get username info
    setUsername(decoded.username);

    if (decoded.exp < now) {
      // Token expired
      localStorage.removeItem("token");
      messageApi.warning("Session expired. Please log in again.");
      navigate("/login");
    } else {
      // Token is valid
      const timeout = setTimeout(() => {
        localStorage.removeItem("token");
        messageApi.warning("Session expired. Please log in again.");
        navigate("/login");
      }, (decoded.exp - now) * 1000);

      return () => clearTimeout(timeout);
    }
  }
}, []);

  return (
    <>
      {contextHolder}
      {!hideHeaderRoutes.includes(location.pathname) && <Header username={username} />}
      <Routes>
        <Route
          path="/home"
          element={
          <Layout>
            <Home />
          </Layout>
          }
        />
        <Route
           path="/"
           element={
               <Layout>
                    <Home />
                  </Layout>
                  }
                />
        <Route
          path="/login"
          element={<Login onFinish={handleLogin} loading={loading} />}
        />
        <Route
          path="/register"
          element={
            <Register
              onFinish={handleRegister}
              loading={loading}
              onNavigateToLogin={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
              <RequireAuth>
               <Layout><Dashboard /></Layout>
             </RequireAuth>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAuth>
              <Layout><Search /></Layout>
            </RequireAuth>
          }
        />
      </Routes>

      {!hideHeaderRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}