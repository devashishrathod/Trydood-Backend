


exports.registerVendor = async (req, res) => {
    try {

    } catch (error) {
        console.log("error on registerVendor: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message })
    }
}