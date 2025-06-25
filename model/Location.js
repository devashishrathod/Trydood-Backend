const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    area: {
        type: String
    },
    landMark: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    pinCode: {
        type: String
    },
    country: {
        type: String
    },
    street: {
        type: String
    },
    formattedAddress: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            // required: true
        }
    }
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
LocationSchema.index({ location: '2dsphere' });

const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;
