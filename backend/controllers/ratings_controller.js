const RatingModel = require("../models/ratings");
const db = require("../config/db");
const submitRating = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user required" });
    }

    const { storeId, rating } = req.body;
    if (!storeId || typeof rating === "undefined") {
      return res.status(400).json({ message: "storeId and rating are required" });
    }

    const numericRating = parseFloat(rating);
    if (!(numericRating >= 1 && numericRating <= 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const result = await RatingModel.upsertRating(userId, storeId, numericRating);

    return res.status(200).json({
      success: true,
      average_rating: result.average_rating,
      total_ratings: result.total_ratings,
    });
  } catch (err) {
    console.error("submitRating error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getStoreDetailsAndAvgRating = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [storeRows] = await db.query(
      "SELECT id AS store_id, name AS store_name FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ message: "No store found for this owner." });
    }

    const { store_id, store_name } = storeRows[0];

    const [ratingRows] = await db.query(
      `SELECT r.id AS rating_id, r.rating_value, 
              u.name AS rated_by, u.email AS rated_by_email, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store_id]
    );

    const [avgResult] = await db.query(
      "SELECT AVG(rating_value) AS avg_rating FROM ratings WHERE store_id = ?",
      [store_id]
    );

    const avgRating = avgResult[0].avg_rating || 0;

    res.status(200).json({
      store_id,
      store_name,
      total_ratings: ratingRows.length,
      average_rating: parseFloat(avgRating).toFixed(1),
      ratings: ratingRows,
    });

  } catch (error) {
    console.error("Error fetching store ratings:", error);
    res.status(500).json({ error: "Failed to fetch store ratings." });
  }
};

module.exports = { submitRating, getStoreDetailsAndAvgRating };
