import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../API/axios_instance";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiZap } from "react-icons/fi";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setAlert({ type: "", message: "" });

    try {
      const response = await axiosInstance.post("/user/login", formData);
      localStorage.setItem("token", response.data.token);
      setAlert({ type: "success", message: "Login successful!" });
      setFormData({ email: "", password: "" });
      setErrors({});
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      const errMsg =
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setAlert({ type: "danger", message: errMsg });
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-orb login-orb-one"></div>
      <div className="login-orb login-orb-two"></div>

      <div className="login-shell">
        <section className="login-hero-card">
          <div className="login-kicker">
            <FiZap />
            Secure Access Layer
          </div>
          <h1>Step back into your store network with a sharper control surface.</h1>
          <p>
            Review ratings, manage activity, and move through the platform with
            a faster, cleaner sign-in experience.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-card">
              <FiShield />
              <div>
                <strong>Protected sessions</strong>
                <span>JWT-based access with encrypted password verification.</span>
              </div>
            </div>
            <div className="login-feature-card">
              <FiArrowRight />
              <div>
                <strong>Fast routing</strong>
                <span>Jump straight to the dashboard that matches your role.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-form-card">
          <div className="login-form-header">
            <span className="login-form-eyebrow">Welcome Back</span>
            <h2>User Login</h2>
            <p>Enter your credentials to continue.</p>
          </div>

          {alert.message && (
            <div
              className={`login-alert ${
                alert.type === "success" ? "is-success" : "is-error"
              }`}
              role="alert"
            >
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-shell">
                <input
                  type="email"
                  name="email"
                  className={`login-input ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <div className="login-error-text">{errors.email}</div>
              )}
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-shell">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`login-input ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="login-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <div className="login-error-text">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Signing In..." : "Login"}</span>
              <FiArrowRight />
            </button>

            <p className="login-footer-note">
              New to the platform? <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
