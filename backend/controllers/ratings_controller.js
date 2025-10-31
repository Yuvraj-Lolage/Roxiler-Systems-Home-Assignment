const RatingModel = require("../models/ratings");

const submitRating = async (req, res) => {
  try {
    // prefer user from auth middleware
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

module.exports = { submitRating };
