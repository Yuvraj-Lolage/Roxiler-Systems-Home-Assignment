import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axios_instance";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import {
  FiCheckCircle,
  FiArrowUpRight,
  FiMapPin,
  FiMail,
  FiSearch,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [hoveredRatings, setHoveredRatings] = useState({});
  const [savedRatings, setSavedRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingPopup, setRatingPopup] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get("/stores/all");
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to load stores.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (!ratingPopup) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setRatingPopup(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [ratingPopup]);

  const handleRatingChange = async (storeId, value) => {
    const rating = parseFloat(value);
    if (!(rating >= 1 && rating <= 5)) return;

    setUserRatings((prev) => ({ ...prev, [storeId]: rating }));

    try {
      const payload = { storeId, rating };

      const res = await axiosInstance.post("/ratings", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newAvg = res.data.average_rating;

      setStores((prevStores) =>
        prevStores.map((s) =>
          s.id === storeId ? { ...s, average_rating: newAvg } : s
        )
      );
      setSavedRatings((prev) => ({ ...prev, [storeId]: rating }));
      setRatingPopup({
        storeName:
          stores.find((store) => store.id === storeId)?.name || "Selected Store",
        rating,
      });
    } catch (err) {
      console.error("Failed to save rating:", err.response?.data || err.message);

      setUserRatings((prev) => {
        const copy = { ...prev };
        delete copy[storeId];
        return copy;
      });
      setSavedRatings((prev) => {
        const copy = { ...prev };
        delete copy[storeId];
        return copy;
      });

      alert("Could not save rating. Try again.");
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ratedStoresCount = Object.keys(savedRatings).length;
  const averageOfAverages =
    stores.length > 0
      ? (
          stores.reduce(
            (sum, store) => sum + (parseFloat(store.average_rating) || 0),
            0
          ) / stores.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="dashboard-shell dashboard-loading">
        <div className="dashboard-loader-ring" role="status"></div>
        <p className="dashboard-loading-text">Loading live store signals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell dashboard-state-shell">
        <div className="dashboard-state-card dashboard-state-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-orb dashboard-orb-one"></div>
      <div className="dashboard-orb dashboard-orb-two"></div>

      {ratingPopup && (
        <div className="dashboard-rating-popup" role="status" aria-live="polite">
          <div className="dashboard-rating-popup-icon">
            <FiCheckCircle />
          </div>
          <div className="dashboard-rating-popup-copy">
            <span className="dashboard-rating-popup-label">Rating Synced</span>
            <strong>{ratingPopup.storeName}</strong>
            <p>{ratingPopup.rating.toFixed(1)} stars sent successfully</p>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <span className="dashboard-kicker">Retail Intelligence Grid</span>
            <h1>Discover, rate, and track standout stores in one sleek command center.</h1>
            <p>
              Search the network, inspect store details, and submit ratings with
              instant feedback in a streamlined futuristic interface.
            </p>
          </div>

          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Stores Online</span>
              <strong>{stores.length}</strong>
              <span className="dashboard-stat-meta">Live directory coverage</span>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Ratings Sent</span>
              <strong>{ratedStoresCount}</strong>
              <span className="dashboard-stat-meta">Session interactions</span>
            </div>
            <div className="dashboard-stat-card">
              <span className="dashboard-stat-label">Network Score</span>
              <strong>{averageOfAverages}</strong>
              <span className="dashboard-stat-meta">Average store rating</span>
            </div>
          </div>
        </section>

        <section className="dashboard-toolbar">
          <div className="dashboard-search">
            <FiSearch className="dashboard-search-icon" />
            <input
              type="text"
              className="dashboard-search-input"
              placeholder="Search by store name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dashboard-toolbar-chip">
            <FiTrendingUp />
            <span>{filteredStores.length} stores matched</span>
          </div>
        </section>

        <div className="dashboard-grid">
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => {
              const activeRating = hoveredRatings[store.id] || userRatings[store.id] || 0;
              const savedRating = savedRatings[store.id];

              return (
                <article
                  key={store.id}
                  className="dashboard-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="dashboard-card-topline">
                    <span className="dashboard-card-badge">Store Node #{store.id}</span>
                    <span className="dashboard-card-link">
                      Explore <FiArrowUpRight />
                    </span>
                  </div>

                  <div className="dashboard-card-visual">
                    <div className="dashboard-card-visual-grid"></div>
                    <div className="dashboard-card-score">
                      <FiStar />
                      <span>
                        {store.average_rating
                          ? parseFloat(store.average_rating).toFixed(1)
                          : "New"}
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-card-body">
                    <div className="dashboard-card-header">
                      <h3>{store.name}</h3>
                      <p>Community-rated retail destination</p>
                    </div>

                    <div className="dashboard-card-meta">
                      <div className="dashboard-meta-row">
                        <FiMapPin />
                        <span>{store.address}</span>
                      </div>
                      <div className="dashboard-meta-row">
                        <FiMail />
                        <span>{store.email}</span>
                      </div>
                    </div>

                    <div className="dashboard-rating-panel">
                      <div className="dashboard-rating-header">
                        <div>
                          <span className="dashboard-rating-label">Your Rating</span>
                          <strong>
                            {activeRating > 0
                              ? `${activeRating.toFixed(1)} / 5`
                              : "Choose a score"}
                          </strong>
                        </div>
                        <span className="dashboard-rating-hint">Tap to rate instantly</span>
                      </div>

                      <div
                        className="dashboard-stars"
                        onMouseLeave={() =>
                          setHoveredRatings((prev) => ({ ...prev, [store.id]: 0 }))
                        }
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`dashboard-star-button ${
                              star <= activeRating ? "is-active" : ""
                            }`}
                            onMouseEnter={() =>
                              setHoveredRatings((prev) => ({ ...prev, [store.id]: star }))
                            }
                            onClick={() => handleRatingChange(store.id, star)}
                            aria-label={`Rate ${store.name} ${star} stars`}
                          >
                            ★
                          </button>
                        ))}
                      </div>

                      <div className="dashboard-card-footer">
                        <span className="dashboard-average-pill">
                          Avg Rating:{" "}
                          {store.average_rating
                            ? `${parseFloat(store.average_rating).toFixed(1)}`
                            : "No ratings yet"}
                        </span>
                        <span className="dashboard-save-state">
                          {savedRating
                            ? `Saved at ${savedRating.toFixed(1)} stars`
                            : "No rating submitted yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="dashboard-state-card">
              No stores matched your search. Try a different keyword.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
