import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axios_instance";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        return decoded;
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  });

  const placeholderImage =
    "https://via.placeholder.com/400x250.png?text=Store+Image";

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

  const handleRatingChange = async (storeId, value) => {
    const rating = parseFloat(value);
    if (!(rating >= 1 && rating <= 5)) return;

    setUserRatings((prev) => ({ ...prev, [storeId]: rating }));

    try {
      const payload = { storeId, rating };

      const res = await axiosInstance.post("  /ratings", payload, {
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
    } catch (err) {
      console.error("Failed to save rating:", err.response?.data || err.message);

      setUserRatings((prev) => {
        const copy = { ...prev };
        delete copy[storeId];
        return copy;
      });

      alert("Could not save rating. Try again.");
    }
  };


  const handleSubmitRating = (storeId) => {
    alert(
      `You submitted a rating of ${userRatings[storeId]} for store ID: ${storeId}`
    );
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading stores...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">User Dashboard</h2>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/*Store Cards */}
      <div className="row g-4">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div key={store.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <img
                  src={placeholderImage}
                  className="card-img-top"
                  alt="Store"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">{store.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Email:</strong> {store.email}
                  </p>

                  {/* Average Rating Display */}
                  <p className="card-text mb-3">
                    <strong>Average Rating:</strong>{" "}
                    <span className="text-warning fw-semibold">
                      {store.average_rating
                        ? `${parseFloat(store.average_rating).toFixed(1)} ⭐`
                        : "No ratings yet"}
                    </span>
                  </p>

                  {/* User Rating Section */}
                  <div className="mt-3">
                    <label className="form-label">
                      <strong>Your Rating:</strong>
                    </label>
                    <div className="d-flex justify-content-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "1.8rem",
                            color:
                              star <= (userRatings[store.id] || 0) ? "#ffc107" : "#e4e5e9",
                            cursor: "pointer",
                            transition: "color 0.2s ease",
                          }}
                          onClick={() => handleRatingChange(store.id, star)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#ffca2c")
                          }
                          onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            star <= (userRatings[store.id] || 0)
                              ? "#ffc107"
                              : "#e4e5e9")
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleSubmitRating(store.id)}
                      disabled={!userRatings[store.id]}
                    >
                      {userRatings[store.id] ? "Update Rating" : "Submit Rating"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No stores found.</div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
