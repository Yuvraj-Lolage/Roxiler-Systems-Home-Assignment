import React, { useState } from "react";
import axiosInstance from "../../API/axios_instance";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // install react-bootstrap-icons if not already

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
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
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          {/* Old Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="oldPassword" className="form-label fw-semibold">
              Old Password
            </label>
            <div className="input-group">
              <input
                type={showOld ? "text" : "password"}
                className="form-control border-0 shadow-sm bg-body-secondary"
                id="oldPassword"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-body-secondary border-0"
                style={{ cursor: "pointer" }}
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeSlash /> : <Eye />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="newPassword" className="form-label fw-semibold">
              New Password
            </label>
            <div className="input-group">
              <input
                type={showNew ? "text" : "password"}
                className="form-control border-0 shadow-sm bg-body-secondary"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-body-secondary border-0"
                style={{ cursor: "pointer" }}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeSlash /> : <Eye />}
              </span>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary fw-semibold">
              Update Password
            </button>
          </div>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3 py-2" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;
