import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { FiLogOut } from "react-icons/fi";

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
    <nav className="navbar navbar-expand-lg futuristic-navbar">
      <div className="container navbar-shell">
        <Link className="navbar-brand futuristic-brand" to="/">
          <span className="brand-mark">SR</span>
          Store Ratings Platform
        </Link>

        <button
          className="navbar-toggler futuristic-navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon futuristic-navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse futuristic-navbar-collapse" id="navbarNav">
          {isLogin && (
            <ul className="navbar-nav ms-auto align-items-center futuristic-nav-list">

              {role === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link futuristic-nav-link ${isActive ? "is-active" : ""}`
                      }
                      to="/admin/dashboard"
                    >
                      Admin Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link futuristic-nav-link ${isActive ? "is-active" : ""}`
                      }
                      to="/admin/dashboard/users"
                    >
                      Manage Users
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link futuristic-nav-link ${isActive ? "is-active" : ""}`
                      }
                      to="/admin/dashboard/stores"
                    >
                      Manage Stores
                    </NavLink>
                  </li>
                </>
              )}

              {role === "USER" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link futuristic-nav-link ${isActive ? "is-active" : ""}`
                      }
                      to="/dashboard"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link futuristic-nav-link ${isActive ? "is-active" : ""}`
                  }
                  to="/change-password"
                >
                  Change Password
                </NavLink>
              </li>

              <li className="nav-item ms-lg-3">
                <button className="btn futuristic-logout-btn" onClick={logout}>
                  <FiLogOut />
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
