import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../API/axios_instance";
import "./admin_dashboard.css";
import {
  FiActivity,
  FiArrowUpRight,
  FiHome,
  FiPlus,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

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
    <div className="admin-page">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>

      <div className="admin-shell">
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <span className="admin-kicker">
              <FiShield />
              Administrator Control Grid
            </span>
            <h1>Oversee platform growth, user access, and store operations from one command center.</h1>
            <p>
              Track system health, manage new entities, and keep the platform
              organized with a more focused administrative workspace.
            </p>
          </div>

          <div className="admin-actions-panel">
            <Link
              className="admin-action-btn primary admin-action-link"
              to="/admin/dashboard/add-user"
            >
              <FiPlus />
              Add New User
            </Link>

            <Link
              className="admin-action-btn secondary admin-action-link"
              to="/admin/dashboard/add-store"
            >
              <FiHome />
              Add New Store
            </Link>

            <div className="admin-mini-note">
              <FiArrowUpRight />
              <span>Use the management tabs above to review full user and store datasets.</span>
            </div>
          </div>
        </section>

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <div className="admin-stat-icon users">
              <FiUsers />
            </div>
            <span className="admin-stat-label">Total Users</span>
            <strong>{stats.totalUsers}</strong>
            <span className="admin-stat-meta">Registered accounts in the system</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon stores">
              <FiHome />
            </div>
            <span className="admin-stat-label">Total Stores</span>
            <strong>{stats.totalStores}</strong>
            <span className="admin-stat-meta">Retail nodes currently listed</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon ratings">
              <FiActivity />
            </div>
            <span className="admin-stat-label">Total Ratings</span>
            <strong>{stats.totalRatings}</strong>
            <span className="admin-stat-meta">User engagement across the network</span>
          </article>
        </section>

        <section className="admin-overview-card">
          <div className="admin-overview-header">
            <div>
              <span className="admin-overview-kicker">System Snapshot</span>
              <h2>Platform overview</h2>
            </div>
            <span className="admin-overview-chip">Live admin summary</span>
          </div>

          <div className="admin-overview-grid">
            <div className="admin-overview-panel">
              <span>User footprint</span>
              <strong>{stats.totalUsers}</strong>
              <p>Accounts currently able to access role-based workflows.</p>
            </div>
            <div className="admin-overview-panel">
              <span>Store coverage</span>
              <strong>{stats.totalStores}</strong>
              <p>Store records available for ratings, reviews, and oversight.</p>
            </div>
            <div className="admin-overview-panel">
              <span>Engagement pulse</span>
              <strong>{stats.totalRatings}</strong>
              <p>Ratings powering analytics and store performance visibility.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
