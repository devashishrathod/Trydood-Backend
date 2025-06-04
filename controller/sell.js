import User from "../model/User"
import { generateReferralCode } from "../utils/referCode"



export const addMarketPerson = async (req, res) => {
    const name = req.body?.name;
    const email = req.body?.email;
    const mobile = req.body?.mobile;
    const address = req.body?.address;
    const dob = req.body?.dob;

    try {
        const checkUser = await User.findOne({ mobile });
        if (checkUser) {
            return res.status(400).json({ msg: "Market person already register.", success: false });
        }

        const result = await User.create({ name, email, mobile, address, dob, referCode: generateReferralCode(6), });
        if (result) {
            return res.status(200).json({ msg: "Market person added successfully.", success: true });
        }
        return res.status(400).json({ msg: "Failed to add market person!", success: false });
    } catch (error) {
        console.log("error on addMarketPerson: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
};
