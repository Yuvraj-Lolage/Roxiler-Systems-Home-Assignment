const parsePagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const limit = Math.min(requestedLimit, 100);
  const offset = (page - 1) * limit;
  const isPaginatedRequest =
    typeof query.page !== "undefined" || typeof query.limit !== "undefined";

  return {
    page,
    limit,
    offset,
    isPaginatedRequest,
  };
};

const buildPaginatedResponse = ({ rows, total, page, limit }) => ({
  data: rows,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  },
});

module.exports = { parsePagination, buildPaginatedResponse };
