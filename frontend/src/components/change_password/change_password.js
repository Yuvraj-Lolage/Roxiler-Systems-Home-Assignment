import React, { useState } from "react";
import axiosInstance from "../../API/axios_instance";
import { Eye, EyeSlash, ShieldLock } from "react-bootstrap-icons";
import { FiZap } from "react-icons/fi";
import "./change_password.css";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setMessageType("error");
      setMessage(
        "Password must be 8–16 characters long, include one uppercase letter and one special character."
      );
      return;
    }

    try {
      const response = await axiosInstance.put(
        "/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessageType("success");
      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="password-page">
      <div className="password-page-orb password-page-orb-one"></div>
      <div className="password-page-orb password-page-orb-two"></div>

      <div className="password-shell">
        <section className="password-hero-card">
          <div className="password-kicker">
            <FiZap />
            Security Upgrade
          </div>
          <h1>Refresh your credentials with a cleaner, safer access flow.</h1>
          <p>
            Use a stronger password to keep your account protected across the
            platform. Your update is applied instantly after validation.
          </p>

          <div className="password-tip-card">
            <ShieldLock />
            <div>
              <strong>Password rule</strong>
              <span>8 to 16 characters, 1 uppercase letter, and 1 special character.</span>
            </div>
          </div>
        </section>

        <section className="password-form-card">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword} className="password-form">
            <div className="password-field">
              <label htmlFor="oldPassword" className="password-label">
                Old Password
              </label>
              <div className="password-input-shell">
                <input
                  type={showOld ? "text" : "password"}
                  className="password-input"
                  id="oldPassword"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-visibility-btn"
                  onClick={() => setShowOld(!showOld)}
                  aria-label={showOld ? "Hide old password" : "Show old password"}
                >
                  {showOld ? <EyeSlash /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="password-field">
              <label htmlFor="newPassword" className="password-label">
                New Password
              </label>
              <div className="password-input-shell">
                <input
                  type={showNew ? "text" : "password"}
                  className="password-input"
                  id="newPassword"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-visibility-btn"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                >
                  {showNew ? <EyeSlash /> : <Eye />}
                </button>
              </div>
            </div>

            <button type="submit" className="password-submit-btn">
              Update Password
            </button>
          </form>

          {message && (
            <div
              className={`password-message ${
                messageType === "success" ? "is-success" : "is-error"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChangePassword;
