// adminRoutes.js
const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/ChargingStation');

// Route to get all unapproved charging stations
router.get('/pending-stations', async (req, res) => {
    try {
        const stations = await ChargingStation.find({ approved: false });
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to approve a charging station
router.patch('/approve-station/:id', async (req, res) => {
    try {
        const updatedStation = await ChargingStation.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        res.status(200).json(updatedStation);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
