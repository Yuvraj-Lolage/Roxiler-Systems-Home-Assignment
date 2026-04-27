import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../API/axios_instance";
import "../dashboard/admin_dashboard.css";
import "./admin_tables.css";
import { FiArrowUpRight, FiHome, FiMapPin, FiStar } from "react-icons/fi";

export default function Stores() {
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/stores", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStoreData(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const averageAcrossStores =
    storeData.length > 0
      ? (
          storeData.reduce(
            (sum, store) => sum + (parseFloat(store.average_rating) || 0),
            0
          ) / storeData.length
        ).toFixed(1)
      : "0.0";

  const ratedStores = storeData.filter(
    (store) => parseFloat(store.average_rating || 0) > 0
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-orb admin-orb-one"></div>
      <div className="admin-orb admin-orb-two"></div>

      <div className="admin-shell">
        <section className="admin-table-hero">
          <div className="admin-hero-copy">
            <span className="admin-kicker">
              <FiHome />
              Store Network
            </span>
            <h1>View and manage store records through a sharper operations dashboard.</h1>
            <p>
              Track store coverage, see owner assignments, and review rating
              performance in a cleaner table-driven layout.
            </p>
          </div>

          <div className="admin-actions-panel">
            <div className="admin-mini-note">
              <FiArrowUpRight />
              <span>Use this page to validate store listings, ownership mapping, and average rating health.</span>
            </div>
          </div>
        </section>

        <section className="admin-table-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-icon stores">
              <FiHome />
            </div>
            <span className="admin-stat-label">Total Stores</span>
            <strong>{storeData.length}</strong>
            <span className="admin-stat-meta">Store records currently listed</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon users">
              <FiMapPin />
            </div>
            <span className="admin-stat-label">Rated Stores</span>
            <strong>{ratedStores}</strong>
            <span className="admin-stat-meta">Stores with at least one rating</span>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-icon ratings">
              <FiStar />
            </div>
            <span className="admin-stat-label">Network Rating</span>
            <strong>{averageAcrossStores}</strong>
            <span className="admin-stat-meta">Average score across all stores</span>
          </article>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-card-header">
            <div>
              <span className="admin-overview-kicker">Store Registry</span>
              <h2>Stores Overview</h2>
            </div>
          </div>

          {loading ? (
            <div className="admin-table-empty">Loading stores...</div>
          ) : storeData.length > 0 ? (
            <div className="table-responsive">
              <table className="table admin-modern-table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Store Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Owner ID</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {storeData.map((store) => (
                    <tr key={store.id}>
                      <td className="admin-table-id">{store.id}</td>
                      <td>{store.name}</td>
                      <td className="admin-table-muted">{store.email}</td>
                      <td className="admin-table-muted">{store.address}</td>
                      <td>{store.owner_id ?? "N/A"}</td>
                      <td>
                        <span
                          className={`admin-role-pill ${
                            parseFloat(store.average_rating) >= 4
                              ? "is-owner"
                              : parseFloat(store.average_rating) >= 2
                              ? "is-user"
                              : "is-admin"
                          }`}
                        >
                          {store.average_rating || "0.0"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-table-empty">No stores found.</div>
          )}
        </section>
      </div>
    </div>
  );
}
