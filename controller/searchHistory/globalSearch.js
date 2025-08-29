const { asyncWrapper, sendSuccess } = require("../../utils");
const { searchQuery } = require("../../service/searchHistoryServices");

exports.globalSearch = asyncWrapper(async (req, res, next) => {
  const { userId, query, page, limit } = req.query;
  const results = await searchQuery(query, userId, page, limit);
  sendSuccess(res, 200, "Search results", results);
});
