import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axios_instance";
import "bootstrap/dist/css/bootstrap.min.css";

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
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container text-center mt-5">
        <h4>No store data available.</h4>
      </div>
    );
  }

  const { store_name, total_ratings, average_rating, ratings } = storeData;

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4">{store_name}</h2>

      {/* Store Summary */}
      <div className="row mb-4 text-center">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white">
            <div className="card-body">
              <h5>Total Ratings</h5>
              <h3>{total_ratings}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white">
            <div className="card-body">
              <h5>Average Rating</h5>
              <h3>{average_rating}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="text-primary fw-semibold mb-3">Ratings Received</h4>
          {ratings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-dark">
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
                      <td>{r.rating_id}</td>
                      <td>{r.rated_by}</td>
                      <td>{r.rated_by_email}</td>
                      <td>
                        <span className="badge bg-warning text-dark fs-6">
                          ⭐ {r.rating_value}
                        </span>
                      </td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
