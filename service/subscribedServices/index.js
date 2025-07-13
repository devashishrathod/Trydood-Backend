const { getSubscribedById } = require("./getSubscribedById");
const { createSubscribed } = require("./createSubscribed");
const { updateSubscribedById } = require("./updateSubscribedById");
const { updateSubscribedAmountById } = require("./updateSubscribedAmountById");

module.exports = {
  getSubscribedById,
  createSubscribed,
  updateSubscribedById,
  updateSubscribedAmountById,
};
