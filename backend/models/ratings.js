
const db = require("../config/db");

const RatingModel = {
  async upsertRating(userId, storeId, rating) {
    const [updateResult] = await db.query(
      `UPDATE ratings SET rating_value = ?, updated_at = NOW() 
       WHERE user_id = ? AND store_id = ?`,
      [rating, userId, storeId]
    );

    if (updateResult.affectedRows === 0) {
      await db.query(
        `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
        [userId, storeId, rating]
      );
    }

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

const getStoreRatings = async (ownerId) => {
  const [store] = await db.promise().query(
    "SELECT id AS store_id FROM stores WHERE owner_id = ?",
    [ownerId]
  );
  if (!store.length) return { message: "No store found" };

  const storeId = store[0].store_id;

  const [ratings] = await db.promise().query(
    `SELECT r.*, u.name AS rated_by, u.email 
     FROM ratings r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.store_id = ?`,
    [storeId]
  );

  const [avg] = await db.promise().query(
    "SELECT AVG(rating_value) AS avg_rating FROM ratings WHERE store_id = ?",
    [storeId]
  );

  return { storeId, ratings, avgRating: avg[0].avg_rating || 0 };
};


module.exports = RatingModel;
