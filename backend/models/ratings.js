// models/ratingModel.js
const db = require("../config/db"); // your promisePool

const RatingModel = {
  // insert or update rating
  async upsertRating(userId, storeId, rating) {
    // Try update first (if exists)
    const [updateResult] = await db.query(
      `UPDATE ratings SET rating_value = ?, updated_at = NOW() 
       WHERE user_id = ? AND store_id = ?`,
      [rating, userId, storeId]
    );

    if (updateResult.affectedRows === 0) {
      // insert new rating
      await db.query(
        `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
        [userId, storeId, rating]
      );
    }

    // calculate and return new average rating
    const [rows] = await db.query(
      `SELECT ROUND(AVG(rating_value), 1) AS average_rating, COUNT(*) AS total_ratings
       FROM ratings
       WHERE store_id = ?`,
      [storeId]
    );

    const avg = rows[0]?.average_rating ?? null;
    const total = rows[0]?.total_ratings ?? 0;

    return { average_rating: avg, total_ratings: total };
  },

  async getUserRating(userId, storeId) {
    const [rows] = await db.query(
      `SELECT rating_value FROM ratings WHERE user_id = ? AND store_id = ?`,
      [userId, storeId]
    );
    return rows[0] ? rows[0].rating : null;
  },
};

module.exports = RatingModel;
