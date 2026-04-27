import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../API/axios_instance";
import "../dashboard/admin_dashboard.css";
import "./admin_tables.css";
import { FiArrowUpRight, FiShield, FiUser, FiUsers } from "react-icons/fi";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalAdmins = userData.filter((user) => user.role === "ADMIN").length;
  const totalStoreOwners = userData.filter(
    (user) => user.role === "STORE_OWNER"
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>

      <div className="admin-shell">
        <section className="admin-table-hero">
          <div className="admin-hero-copy">
            <span className="admin-kicker">
              <FiUsers />
              User Directory
            </span>
            <h1>Manage platform accounts with a cleaner, live admin roster.</h1>
            <p>
              Review user access, monitor account mix, and scan role coverage in
              a more modern data surface.
            </p>
          </div>

          <div className="admin-actions-panel">
            <div className="admin-mini-note">
              <FiArrowUpRight />
              <span>Use this page to verify who has access and what role they hold across the platform.</span>
            </div>
          </div>
        </section>

        <section className="admin-table-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-icon users">
              <FiUsers />
            </div>
            <span className="admin-stat-label">Total Accounts</span>
            <strong>{userData.length}</strong>
            <span className="admin-stat-meta">All users currently in the system</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon ratings">
              <FiShield />
            </div>
            <span className="admin-stat-label">Admins</span>
            <strong>{totalAdmins}</strong>
            <span className="admin-stat-meta">Accounts with administrative control</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon stores">
              <FiUser />
            </div>
            <span className="admin-stat-label">Store Owners</span>
            <strong>{totalStoreOwners}</strong>
            <span className="admin-stat-meta">Accounts linked to store management</span>
          </article>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-card-header">
            <div>
              <span className="admin-overview-kicker">Access Overview</span>
              <h2>User Accounts</h2>
            </div>
          </div>

          {loading ? (
            <div className="admin-table-empty">Loading user accounts...</div>
          ) : userData.length > 0 ? (
            <div className="table-responsive">
              <table className="table admin-modern-table align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user) => (
                    <tr key={user.id}>
                      <td className="admin-table-id">{user.id}</td>
                      <td>{user.name}</td>
                      <td className="admin-table-muted">{user.email}</td>
                      <td>
                        <span
                          className={`admin-role-pill ${
                            user.role === "ADMIN"
                              ? "is-admin"
                              : user.role === "STORE_OWNER"
                              ? "is-owner"
                              : "is-user"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-table-empty">No user accounts found.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Users;
