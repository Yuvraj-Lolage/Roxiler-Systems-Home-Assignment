import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // install this: npm install jwt-decode
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLogin(true);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        setIsLogin(false);
        setRole(null);
      }
    } else {
      setIsLogin(false);
      setRole(null);
    }
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Store Ratings Platform
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isLogin && (
            <ul className="navbar-nav ms-auto align-items-center">

              {role === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">
                      Admin Dashboard
                    </Link>
                  </li>
                   <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard/users">
                      Manage Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard/stores">
                      Manage Stores
                    </Link>
                  </li>
                </>
              )}

              {role === "USER" && (
                <>
                 <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/stores">
                      View Stores
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                    <Link className="nav-link" to="/change-password">
                      Change Password
                    </Link>
                  </li>

              <li className="nav-item ms-3">
                <button className="btn btn-info" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
