import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const RenderLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded?.role) {
        switch (decoded.role.toUpperCase()) {
          case "USER":
            navigate("/dashboard");
            break;

          case "ADMIN":
            navigate("/admin-dashboard");
            break;

          case "STORE_OWNER":
            navigate("/store-dashboard");
            break;

          default:
            navigate("/login");
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default RenderLayout;
