import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axiosInstance from "../../API/axios_instance";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    alert(`${newUser.role} added successfully!`);
    setStats({ ...stats, users: stats.users + 1 });
    setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
  };

  const handleAddStore = (e) => {
    e.preventDefault();
    alert("Store added successfully!");
    setStats({ ...stats, stores: stats.stores + 1 });
    setNewStore({ name: "", email: "", address: "" });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5 text-primary">
        System Administrator Dashboard
      </h2>

      {/* ===== Dashboard Summary Cards ===== */}
      <div className="row g-4 text-center mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white rounded-4">
            <div className="card-body">
              <h5>Total Users</h5>
              <h1>{stats.totalUsers}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-info text-white rounded-4">
            <div className="card-body">
              <h5>Total Stores</h5>
              <h1>{stats.totalStores}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-secondary text-white rounded-4">
            <div className="card-body">
              <h5>Total Ratings</h5>
              <h1>{stats.totalRatings}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="text-center mb-4">
        <button
          className="btn btn-primary px-4 me-3"
          data-bs-toggle="modal"
          data-bs-target="#addUserModal"
        >
          Add New User
        </button>

        <button
          className="btn btn-info px-4 text-white"
          data-bs-toggle="modal"
          data-bs-target="#addStoreModal"
        >
           Add New Store
        </button>
      </div>

      {/* ===== Add User Modal ===== */}
      <div
        className="modal fade"
        id="addUserModal"
        tabIndex="-1"
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="addUserModalLabel">
                Add New User
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddUser}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleUserChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleUserChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleUserChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={newUser.address}
                    onChange={handleUserChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleUserChange}
                    className="form-select"
                  >
                    <option value="user">Normal User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Add Store Modal ===== */}
      <div
        className="modal fade"
        id="addStoreModal"
        tabIndex="-1"
        aria-labelledby="addStoreModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title" id="addStoreModalLabel">
                Add New Store
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddStore}>
                <div className="mb-3">
                  <label className="form-label">Store Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newStore.name}
                    onChange={handleStoreChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newStore.email}
                    onChange={handleStoreChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={newStore.address}
                    onChange={handleStoreChange}
                    className="form-control"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-info w-100 text-white">
                  Add Store
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
