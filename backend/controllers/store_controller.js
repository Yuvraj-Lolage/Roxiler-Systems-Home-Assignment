const { Store } = require("../models/store");
const { buildPaginatedResponse, parsePagination } = require("../utils/pagination");

const getAllStores = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    if (pagination.isPaginatedRequest) {
      const result = await Store.findPaginated(pagination);
      return res.status(200).json(
        buildPaginatedResponse({
          rows: result.rows,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
        })
      );
    }

    const stores = await Store.findAll();
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllStores };
