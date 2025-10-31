const db = require("../config/db"); // your promisePool

class AdminStats {

    static async getAdminStats(userId, storeId) {
        try {
            const [users] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
            const [stores] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
            const [ratings] = await db.query("SELECT SUM(rating_value) AS totalRatings FROM ratings");
            return {
                totalUsers: users[0].totalUsers,
                totalStores: stores[0].totalStores,
                totalRatings: ratings[0].totalRatings,
            };
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            throw error;
        }
    }
}


module.exports = AdminStats;