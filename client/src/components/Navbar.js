import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../pages/styles.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // 🔑 Remove token to log out
    localStorage.removeItem("token");

    // 🧭 Navigate to login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">BLOG</Link>
      </div>
      <div className="navbar-links">
        {!token ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        ) : (
          <>
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/profile" className="navbar-link">Profile</Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
