import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register'; 
// Add more imports here for new pages

function App() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => { //login logic
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/login', values);
      alert("Login successful!");
      navigate('/dashboard'); // post-login page
    } catch (err) {
      alert("Login failed: " + (err?.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => { // register logic
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
    <Routes>
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
        path="/"
        element={<Login onFinish={handleLogin} loading={loading} />}
      />
    </Routes>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}