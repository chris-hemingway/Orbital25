import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default RequireAuth;
