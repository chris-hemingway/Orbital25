import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';

import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Search from './pages/Search/Search';

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // to check current location
  const hideHeaderRoutes = ['/login', '/register', '/search'];
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/login', values);
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

  return (
    <>
      {contextHolder}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
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
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
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