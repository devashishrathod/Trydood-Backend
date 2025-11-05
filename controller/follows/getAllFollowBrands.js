const { asyncWrapper, sendSuccess } = require("../../utils");
const { getUserFollowedBrands } = require("../../service/brandServices");

exports.getAllFollowBrands = asyncWrapper(async (req, res) => {
  const userId = req.query?.userId || req.payload?._id;
  const result = await getUserFollowedBrands(userId, req.query);
  return sendSuccess(res, 200, "Followed brands", result);
});
