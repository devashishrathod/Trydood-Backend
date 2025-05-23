const mongoose = require('mongoose')

const WorkHoursSchema = new mongoose.Schema({
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    monday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    tuesday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    wednesday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    thursday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    friday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    saturday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    sunday: {
        start: {
            type: String
        },
        end: {
            type: String
        }
    }
}, { timestamps: true })
const WorkHours = mongoose.model('WorkHours', WorkHoursSchema)
module.exports = WorkHours