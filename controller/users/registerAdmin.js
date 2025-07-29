exports.registorUser = async (req, res) => {
  const name = req.body?.name;
  const email = req.body?.email;
  const mobile = req.body?.mobile;
  const password = req.body?.password;
  const role = req.body?.role;
  const address = req.body?.address;
  const image = req.files?.image;

  try {
    const checkUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email or Mobile Number already exists" });
    }
    const hashedPass = await bcrypt.hash(password, parseInt(salt));
    if (!hashedPass) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to register!" });
    }

    const uniqueId = await generateUniqueUserId();
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPass,
      role,
      address,
      uniqueId,
      referCode: generateReferralCode(6),
    });

    if (image) {
      let imageUrl = await uploadToCloudinary(image.tempFilePath);
      user.image = imageUrl;
    }
    const result = await user.save();
    // let result = "ok"
    if (result) {
      const token = await generateToken(result);
      return res.status(200).json({
        success: true,
        msg: `User registered successfully`,
        result,
        token,
      });
    }
    return res.status(400).json({
      error: "Failed to register user",
      success: false,
      msg: "Failed to register user",
    });
  } catch (error) {
    console.log("error on registorUser: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
