import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // to check current location
  const hideHeaderRoutes = ['/login', '/register'];

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/login', values);
      alert("Login successful!");
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed: " + (err?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/register', values);
      alert("Registered successfully!");
      navigate('/login');
    } catch (err) {
      alert("Registration failed: " + (err?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
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

        {}
        <Route
          path="/"
          element={<Login onFinish={handleLogin} loading={loading} />}
        />

        {}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Routes>
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