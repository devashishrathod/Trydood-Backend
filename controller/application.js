const ApplicationHome = require("../model/ApplicationHome");
const State = require("../model/State");
const { uploadToCloudinary, deleteFromCloudinary } = require("../service/uploadImage");


// ===================================== home ====================================================

exports.getAllHome = async (req, res) => {
    const id = req.params?.id

    try {
        if (id) {
            const result = await ApplicationHome.findById(id)
            if (result) {
                return res.status(200).json({ success: true, msg: "Home Application details", result })
            }
            return res.status(404).json({ msg: "Home Application not found", success: false })
        }
        const result = await ApplicationHome.find().sort({ createdAt: -1 })
        if (result) {
            return res.status(200).json({ success: true, msg: "Home Application details", result })
        }
        return res.status(404).json({ msg: "Home Application not found", success: false })
    } catch (error) {
        console.log("error on getAllHome: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}


exports.getOne = async (req, res) => {

    try {
        const result = await ApplicationHome.findOne().sort({ createdAt: -1 })
        if (result) {
            return res.status(200).json({ success: true, msg: "Home Application details", result })
        }
        return res.status(404).json({ msg: "Home Application not found", success: false })
    } catch (error) {
        console.log("error on getOne: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

exports.addHomeApplication = async (req, res) => {
    const image = req.files?.image
    const title = req.body?.title
    const header = req.body?.header
    const description = req.body?.description
    try {
        const home = new ApplicationHome({ title, header, description })
        if (image) {
            let imageUrl = await uploadToCloudinary(image.tempFilePath)
            home.image = imageUrl
        }
        const result = await home.save()
        return res.status(200).json({ success: true, msg: "Home Application added successfully.", result })
    } catch (error) {
        console.log("error on addHomeApplication: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

exports.updateHomeApplication = async (req, res) => {
    const id = req.params?.id

    const image = req.files?.image
    const title = req.body?.title
    const header = req.body?.header
    const description = req.body?.description
    try {
        const checkHome = await ApplicationHome.findById(id)
        if (!checkHome) {
            return res.status(400).json({ success: false, msg: "Home Application not found" })
        }
        if (title) checkHome.title = title
        if (header) checkHome.header = header
        if (description) checkHome.description = description
        if (image) {
            let imageUrl = await uploadToCloudinary(image.tempFilePath)
            if (checkHome?.image) {
                await deleteFromCloudinary(checkHome?.image)
            }
            checkHome.image = imageUrl
        }
        const result = await checkHome.save()
        return res.status(200).json({ success: true, msg: "Home Application updated successfully.", result })
    } catch (error) {
        console.log("error on updateHomeApplication: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}


exports.deleteHomeApplication = async (req, res) => {
    const id = req.params?.id
    try {
        const checkHome = await ApplicationHome.findById(id)
        if (!checkHome) {
            return res.status(400).json({ success: false, msg: "Home Application not found" })
        }
        if (checkHome?.image) {
            await deleteFromCloudinary(checkHome?.image)
        }
        const result = await ApplicationHome.findByIdAndDelete(id)
        if (result) {
            return res.status(200).json({ success: true, msg: "Home Application deleted successfully.", result })
        } else {
            return res.status(404).json({ success: false, msg: "Home Application not found" })
        }
    } catch (error) {
        console.log("error on deleteHomeApplication: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}


// ===================================== state ====================================================
exports.getAllState = async (req, res) => {
    const id = req.params?.id
    try {
        if (id) {
            const result = await State.findById(id)
            if (result) {
                return res.status(200).json({ success: true, msg: "State details", result });
            }
            return res.status(404).json({ msg: "State not found", success: false });
        }
        const result = await State.find().sort({ createdAt: -1 })
        if (result) {
            return res.status(200).json({ success: true, msg: "State details", result });
        }
        return res.status(404).json({ msg: "State not found", success: false });
    } catch (error) {
        console.log("error on getAllState: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

exports.addState = async (req, res) => {
    const name = req.body?.name


    try {
        const checkState = await State.findOne({ name });
        if (checkState) {
            return res.status(400).json({ success: false, msg: "State already exists" });
        }
        const state = new State({ name });
        const result = await state.save();
        return res.status(200).json({ success: true, msg: "State added successfully.", result });
    } catch (error) {
        console.log("error on addState: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

exports.updateState = async (req, res) => {
    const id = req.params?.id
    const name = req.body?.name
    try {
        const checkState = await State.findById(id)
        if (!checkState) {
            return res.status(400).json({ success: false, msg: "State not found" });
        }
        const checkAlread = await State.findOne({ name });
        if (checkAlread) {
            return res.status(400).json({ success: false, msg: "State already exists" });
        }
        checkState.name = name
        const result = await checkState.save();
        return res.status(200).json({ success: true, msg: "State updated successfully.", result });
    } catch (error) {
        console.log("error on updateState: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

exports.deleteState = async (req, res) => {
    const id = req.params?.id
    try {
        const result = await State.findByIdAndDelete(id)
        if (result) {
            return res.status(200).json({ success: true, msg: "State deleted successfully." });
        }
        return res.status(400).json({ success: false, msg: "State not found" });
    } catch (error) {
        console.log("error on deleteState: ", error);
        return res.status(500).json({ success: false, msg: error.message });
    }
}