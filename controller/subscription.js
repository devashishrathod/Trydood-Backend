const Brand = require("../model/Brand");
const Subscribed = require("../model/Subscribed");
const Subscription = require("../model/Subscription");
const User = require("../model/User");
const { getEndDate } = require("../utils/referCode");


exports.getAllSubscription = async (req, res) => {
    const id = req?.params?.id
    try {
        if (id) {
            const result = await Subscription.findById(id);
            if (result) {
                return res.status(200).json({ data: result, success: true });
            }
            return res.status(400).json({ msg: "Failed to get subscription!", success: false });
        }
        const result = await Subscription.find();
        if (result) {
            return res.status(200).json({ data: result, success: true });
        }
        return res.status(400).json({ msg: "Failed to get subscription!", success: false });
    } catch (error) {
        console.log("error on getAllSubscription: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}

exports.pagination = async (req, res) => {
    const page = parseInt(req?.query?.page)
    const limit = parseInt(req?.query?.limit)
    const skip = (page - 1) * limit
    const isActive = req?.query?.isActive
    try {
        let query = {}
        if (isActive) {
            query = { isActive: isActive }
        }
        const result = await Subscription.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
        const totalDocuments = await Subscription.countDocuments()
        const totalPages = Math.ceil(totalDocuments / limit);
        if (result) {
            return res.status(200).json({ success: true, msg: "Subscription details", result, pagination: { totalDocuments, totalPages, currentPage: page, limit, } })
        }
        return res.status(404).json({ msg: "Subscription not found", success: false })
    } catch (error) {
        console.log("error on getAllSubscription: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}

exports.getActive = async (req, res) => {
    try {
        const result = await Subscription.find({ isActive: true })
        if (result) {
            return res.status(200).json({ data: result, success: true });
        }
        return res.status(400).json({ msg: "Failed to get subscription!", success: false });
    } catch (error) {
        console.log("error on getActive: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}

exports.addSubscription = async (req, res) => {
    const name = req.body?.name;
    const price = req.body?.price;
    const duration = req.body?.duration;
    const subBrand = req.body?.subBrand;
    const discount = req.body?.discount;
    try {
        const result = await Subscription.create({ name, price, duration, subBrand, discount });
        if (result) {
            return res.status(200).json({ msg: "Subscription added successfully.", success: true });
        }
        return res.status(400).json({ msg: "Failed to add subscription!", success: false });
    } catch (error) {
        console.log("error on addSubscription: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}


exports.updateSubscription = async (req, res) => {
    const id = req.params?.id;
    const name = req.body?.name;
    const price = req.body?.price;
    const duration = req.body?.duration;
    const subBrand = req.body?.subBrand;
    const discount = req.body?.discount;
    const isActive = req.body?.isActive;

    try {
        const result = await Subscription.findByIdAndUpdate(id, { name, price, duration, subBrand, discount, isActive });
        if (result) {
            return res.status(200).json({ msg: "Subscription updated successfully.", success: true });
        }
        return res.status(400).json({ msg: "Failed to update subscription!", success: false });
    } catch (error) {
        console.log("error on updateSubscription: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}

exports.changeStatus = async (req, res) => {
    const id = req.params?.id;
    const isActive = req.body?.isActive
    try {
        const result = await Subscription.findByIdAndUpdate(id, { isActive });
        if (result) {
            return res.status(200).json({ msg: "Subscription status updated successfully.", success: true });
        }
        return res.status(400).json({ msg: "Failed to update subscription status!", success: false });
    } catch (error) {
        console.log("error on changeStatus: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}

exports.deleteSubscription = async (req, res) => {
    const id = req.params?.id;
    try {
        const result = await Subscription.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ msg: "Subscription deleted successfully.", success: true });
        }
        return res.status(400).json({ msg: "Failed to delete subscription!", success: false });
    } catch (error) {
        console.log("error on updateSubscription: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}



// =============================== subscribed ===============================

exports.subscribed = async (req, res) => {
    const userId = req.payload?._id
    const id = req?.params?.id //subscription id
    const amount = req.body?.amount
    try {

        const checkSubscription = await Subscription.findById(id)
        if (!checkSubscription) {
            return res.status(400).json({ success: false, msg: "Subscription not found" })
        }
        const checkUser = await User.findById(userId)
        if (!checkUser) {
            return res.status(400).json({ success: false, msg: "User not found" })
        }
        if (checkUser.isSubscribed) {
            return res.status(400).json({ success: false, msg: "User already subscribed" })
        }

        const checkBrand = await Brand.findOne({ user: userId })

        const subscribed = new Subscribed({ user: userId, brand: id, duration: checkSubscription.duration, startDate: new Date(), price: checkSubscription.price, discount: checkSubscription.discount, paidAmount: amount })
        subscribed.endDate = getEndDate(subscribed.startDate, checkSubscription.duration)
        const result = await subscribed.save()
        if (result) {
            checkUser.isSubscribed = true
            checkUser.subscribed = subscribed?._id
            checkBrand.isSubscribed = true
            checkBrand.subscribed = subscribed?._id

            await checkBrand.save()
            await checkUser.save()

            return res.status(200).json({ success: true, msg: "Subscribed successfully" })
        }
        return res.status(400).json({ success: false, msg: "Failed to subscribe" })

    } catch (error) {
        console.log("error on subscribed: ", error);
        return res.status(500).json({ error: error, success: false, msg: error.message });
    }
}