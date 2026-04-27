import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axios_instance";
import "bootstrap/dist/css/bootstrap.min.css";
import "./store_dashboard.css";
import {
  FiActivity,
  FiArrowUpRight,
  FiBarChart2,
  FiCalendar,
  FiMail,
  FiStar,
} from "react-icons/fi";

const StoreDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/ratings/store/ratings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoreData(res.data);
      } catch (err) {
        console.error("Failed to fetch store details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="store-page store-loading-shell">
        <div className="store-loader-ring" role="status"></div>
        <p className="store-loading-text">Loading store intelligence...</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="store-page store-loading-shell">
        <div className="store-empty-card">No store data available.</div>
      </div>
    );
  }

  const { store_name, total_ratings, average_rating, ratings } = storeData;
  const latestActivity =
    ratings.length > 0
      ? new Date(ratings[0].created_at).toLocaleDateString()
      : "No activity yet";

  return (
    <div className="store-page">
      <div className="store-orb store-orb-one"></div>
      <div className="store-orb store-orb-two"></div>

      <div className="store-shell">
        <section className="store-hero">
          <div className="store-hero-copy">
            <span className="store-kicker">
              <FiActivity />
              Store Performance Grid
            </span>
            <h1>{store_name}</h1>
            <p>
              Monitor customer sentiment, rating volume, and recent feedback activity
              from a cleaner store-owner command center.
            </p>
          </div>

          <div className="store-hero-side">
            <div className="store-mini-note">
              <FiArrowUpRight />
              <span>Track incoming ratings and use the activity table below to spot recent feedback patterns.</span>
            </div>
          </div>
        </section>

        <section className="store-stats-grid">
          <article className="store-stat-card">
            <div className="store-stat-icon ratings">
              <FiBarChart2 />
            </div>
            <span className="store-stat-label">Total Ratings</span>
            <strong>{total_ratings}</strong>
            <span className="store-stat-meta">All customer responses collected</span>
          </article>

          <article className="store-stat-card">
            <div className="store-stat-icon average">
              <FiStar />
            </div>
            <span className="store-stat-label">Average Rating</span>
            <strong>{average_rating || "0.0"}</strong>
            <span className="store-stat-meta">Current reputation score</span>
          </article>

          <article className="store-stat-card">
            <div className="store-stat-icon activity">
              <FiCalendar />
            </div>
            <span className="store-stat-label">Latest Activity</span>
            <strong>{latestActivity}</strong>
            <span className="store-stat-meta">Most recent rating date</span>
          </article>
        </section>

        <section className="store-table-card">
          <div className="store-table-header">
            <div>
              <span className="store-kicker small">Customer Activity</span>
              <h2>Ratings Received</h2>
            </div>
          </div>

          {ratings.length > 0 ? (
            <div className="table-responsive">
              <table className="table store-modern-table align-middle">
                <thead>
                  <tr>
                    <th>Rating ID</th>
                    <th>Rated By</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.rating_id}>
                      <td className="store-table-id">{r.rating_id}</td>
                      <td>{r.rated_by}</td>
                      <td className="store-table-muted">
                        <span className="store-email-cell">
                          <FiMail />
                          {r.rated_by_email}
                        </span>
                      </td>
                      <td>
                        <span className="store-rating-pill">
                          <FiStar />
                          {r.rating_value}
                        </span>
                      </td>
                      <td className="store-table-muted">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="store-empty-card">No ratings yet.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StoreDashboard;
