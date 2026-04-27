import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../dashboard/admin_dashboard.css";
import "./admin_forms.css";
import { FiArrowLeft, FiHome, FiMapPin, FiPlus } from "react-icons/fi";

const AddStore = () => {
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [notice, setNotice] = useState({ type: "", message: "" });

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStore = (e) => {
    e.preventDefault();
    setNotice({ type: "success", message: "Store added successfully!" });
    setNewStore({ name: "", email: "", address: "" });
  };

  return (
    <div className="admin-page">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>
      <div className="admin-shell">
        <section className="admin-form-layout">
          <div className="admin-form-side">
            <span className="admin-kicker">
              <FiHome />
              Store Onboarding
            </span>
            <h1>Register new stores in a dedicated page with the same modern admin design.</h1>
            <p>
              Add fresh store records cleanly and keep the management flow focused
              without modal interruptions.
            </p>

            <div className="admin-mini-note">
              <FiMapPin />
              <span>Each store entry expands platform coverage and becomes available for user ratings and analytics.</span>
            </div>

            <Link className="admin-back-link" to="/admin/dashboard">
              <FiArrowLeft />
              Back to Dashboard
            </Link>
          </div>

          <div className="admin-form-surface">
            <div className="admin-form-header-block">
              <span className="admin-overview-kicker">Store Setup</span>
              <h2>Add New Store</h2>
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

            <form onSubmit={handleAddStore} className="admin-modal-form">
              <div className="admin-form-field">
                <label className="admin-form-label">Store Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStore.name}
                  onChange={handleStoreChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newStore.email}
                  onChange={handleStoreChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newStore.address}
                  onChange={handleStoreChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <button type="submit" className="admin-submit-btn secondary">
                <FiPlus />
                Add Store
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddStore;
