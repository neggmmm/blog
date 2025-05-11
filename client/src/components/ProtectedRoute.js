import { Navigate } from "react-router-dom";

// 🧠 Hint: Accept a child component and check for the token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🧠 If token is missing, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If token exists, allow access to the protected route
  return children;
}

export default ProtectedRoute;
