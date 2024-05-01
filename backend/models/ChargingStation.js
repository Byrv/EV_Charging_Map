// models/ChargingStation.js
const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
    location: {
        lat: Number,
        lng: Number
    },
    type: String,
    capacity: Number,
    approved: Boolean
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);
