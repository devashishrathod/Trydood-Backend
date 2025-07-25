const { getUserByPhoneOrEmail } = require("../../service/userServices");

exports.isOldUser = async (email, phone, currentUserId) => {
  const reused = await getUserByPhoneOrEmail(email, phone);
  if (!reused) return false;
  return reused._id.toString() !== currentUserId.toString();
};
