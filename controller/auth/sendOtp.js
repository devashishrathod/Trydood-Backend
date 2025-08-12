const { sendOtp, verifyOtp } = require("../../service/otpServices");

exports.sendOTP = async (req, res) => {
  try {
    const { whatsappNumber } = req.body;
    if (!whatsappNumber) {
      return res.status(400).json({ error: "whatsappNumber is required" });
    }
    const message = await sendOtp(whatsappNumber);
    console.log("Message sent successfully:", message);
    return res.status(200).json({ message: "OTP sent", sid: message?.sid });
  } catch (error) {
    console.error("Twilio error:", error);
    return res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { whatsappNumber, code } = req.body;
    const result = await verifyOtp(whatsappNumber, code);
    if (result.ok) return res.json({ success: true });
    res.status(400).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
