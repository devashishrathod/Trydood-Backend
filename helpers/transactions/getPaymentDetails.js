const axios = require("axios");

exports.getPaymentDetails = async (razorpayPaymentId) => {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_SECRET;
    const authString = Buffer.from(`${key_id}:${key_secret}`).toString(
      "base64"
    );
    const response = await axios.get(
      `${process.env.RAZORPAY_BASEURL}${razorpayPaymentId}`,
      {
        headers: {
          Authorization: `Basic ${authString}`,
        },
      }
    );
    console.log("Payment full details:===========>", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payment details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
