import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const StoreDashboard = () => {
  // Dummy rating data from users
  const [ratings, setRatings] = useState([
    { id: 1, userName: "Yuvraj Lolage", comment: "Great service!", rating: 5 },
    { id: 2, userName: "Aisha Verma", comment: "Good experience overall.", rating: 4 },
    { id: 3, userName: "Rahul Singh", comment: "Could improve decoration quality.", rating: 3 },
    { id: 4, userName: "Priya Sharma", comment: "Amazing staff and coordination!", rating: 5 },
  ]);

  // Calculate average rating
  const averageRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  // Password update state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle password field change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  // Handle password update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    alert("Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Handle logout
  const handleLogout = () => {
    alert("Logged out successfully!");
    // Clear tokens/session logic here
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary text-center">Store Owner Dashboard</h2>
      </div>

      {/* ====== Average Rating Section ====== */}
      <div className="card shadow-sm mb-5 border-0">
        <div className="card-body text-center">
          <h5 className="fw-semibold">Average Store Rating</h5>
          <h2 className="text-warning">{averageRating.toFixed(1)} ⭐</h2>
          <p className="text-muted">Based on {ratings.length} user reviews</p>
        </div>
      </div>

      {/* ====== Ratings List ====== */}
      <div className="card shadow-sm mb-5 border-0">
        <div className="card-body">
          <h5 className="fw-semibold mb-3 text-success">User Ratings</h5>
          {ratings.map((r) => (
            <div key={r.id} className="border-bottom py-2">
              <strong>{r.userName}</strong> — <span className="text-warning">{r.rating} ⭐</span>
              <p className="mb-1 text-muted">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ====== Update Password Section ====== */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-semibold mb-3 text-primary">Update Password</h5>
          <form onSubmit={handleUpdatePassword}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
