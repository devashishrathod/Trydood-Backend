const User = require("../../model/User");
const Location = require("../../model/Location");

// const { uploadToCloudinary } = require("../../service/uploadImage");

exports.userProfileComplete = async (req, res) => {
  const id = req.payload?._id;
  const name = req.body?.name;
  const email = req.body?.email;
  const mobile = req.body?.mobile;
  const address = req.body?.address;
  const dob = req.body?.dob;
  const applyReferalCode = req.body?.referCode;
  const lat = req.body?.lat;
  const lng = req.body?.lng;
  const city = req.body?.city;
  const state = req.body?.state;
  const country = req.body?.country;
  const postalCode = req.body?.postalCode;
  const formattedAddress = req.body?.formattedAddress;
  const street = req.body?.street;
  const landMark = req.body?.landMark;
  const image = req.body?.image;

  try {
    const checkUser = await User.findById(id);
    if (!checkUser) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    if (lat && lng) {
      let checkLocation = await Location.findOne({ user: id });
      if (!checkLocation) {
        const location = new Location({
          user: id,
          name,
          address,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
          city,
          state,
          country,
          postalCode,
          formattedAddress,
          street,
          landMark,
        });
        checkUser.location = location._id;
        await location.save();
      } else {
        checkLocation = new Location({
          user: id,
          name,
          address,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
          city,
          state,
          country,
          postalCode,
          formattedAddress,
          street,
          landMark,
        });
        checkUser.location = checkLocation._id;
        await checkLocation.save();
      }
    }
    if (name) checkUser.name = name;
    if (email) checkUser.email = email;
    if (mobile) checkUser.mobile = mobile;
    if (address) checkUser.address = address;
    if (dob) checkUser.dob = dob;
    if (image) checkUser.image = image;
    // let imageUrl = await uploadToCloudinary(image.tempFilePath);

    if (req.body?.isFirst) {
      if (applyReferalCode) checkUser.applyReferalCode = applyReferalCode;
    }
    await checkUser.save();
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      result: checkUser,
    });
  } catch (error) {
    console.log("error on userProfileComplete: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
