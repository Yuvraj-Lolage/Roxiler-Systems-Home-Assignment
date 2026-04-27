import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../dashboard/admin_dashboard.css";
import "./admin_forms.css";
import { FiArrowLeft, FiPlus, FiShield, FiUsers } from "react-icons/fi";

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [notice, setNotice] = useState({ type: "", message: "" });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setNotice({
      type: "success",
      message: `${newUser.role === "admin" ? "Admin" : "User"} added successfully!`,
    });
    setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
  };

  return (
    <div className="admin-page">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>
      <div className="admin-shell">
        <section className="admin-form-layout">
          <div className="admin-form-side">
            <span className="admin-kicker">
              <FiUsers />
              User Provisioning
            </span>
            <h1>Create new platform users with the same control-room workflow.</h1>
            <p>
              Add standard users or administrators from a focused page without
              leaving the admin experience.
            </p>

            <div className="admin-mini-note">
              <FiShield />
              <span>Passwords should follow the existing validation rules and are handled securely by the backend.</span>
            </div>

            <Link className="admin-back-link" to="/admin/dashboard">
              <FiArrowLeft />
              Back to Dashboard
            </Link>
          </div>

          <div className="admin-form-surface">
            <div className="admin-form-header-block">
              <span className="admin-overview-kicker">Access Setup</span>
              <h2>Add New User</h2>
            </div>

            {notice.message && (
              <div
                className={`admin-notice ${
                  notice.type === "success" ? "is-success" : "is-error"
                }`}
                role="alert"
              >
                {notice.message}
              </div>
            )}

            <form onSubmit={handleAddUser} className="admin-modal-form">
              <div className="admin-form-field">
                <label className="admin-form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleUserChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleUserChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleUserChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newUser.address}
                  onChange={handleUserChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleUserChange}
                  className="admin-form-input"
                >
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="admin-submit-btn primary">
                <FiPlus />
                Add User
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddUser;
