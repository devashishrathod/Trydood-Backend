


exports.registerVendor = async (req, res) => {
    const brandName = req.body?.brandName
    const brandSlogan = req.body?.brandSlogan
    const companyName = req.body?.companyName
    const companyEmail = req.body?.companyEmail
    const mobile = req.body?.mobile
    const whatsappNumber = req.body?.whatsappNumber
    const gst = req.body?.gst
    const pan = req.body?.pan
    const referCode = req.body?.referCode

    try {
        const checkUser = await User.findOne({ mobile, role: 'vendor' })
        if (!checkUser) {
            return res.status(404).json({ msg: "No register mobile number found!", success: false })
        }
        const checkReferUser = await User.findOne({ referCode })
        if (!checkReferUser) {
            return res.status(404).json({ msg: "No refer code found!", success: false })
        }


        checkUser.brandName = brandName
        checkUser.brandSlogan = brandSlogan
        checkUser.companyName = companyName
        checkUser.companyEmail = companyEmail
        checkUser.mobile = mobile
        checkUser.whatsappNumber = whatsappNumber
        checkUser.gst = gst
        checkUser.pan = pan
        checkUser.referCode = referCode
        await checkUser.save()
        return res.status(200).json({ msg: "Vendor registered successfully.", success: true })
    } catch (error) {
        console.log("error on registerVendor: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message })
    }
}