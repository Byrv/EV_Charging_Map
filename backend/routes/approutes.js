// approutes.js
const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/ChargingStation');

// Route to submit a new charging station for review
router.post('/submit-station', async (req, res) => {
    try {
        let newStation = new ChargingStation({ ...req.body, approved: false });
        await newStation.save();
        res.status(201).send('Charging station submitted for approval.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/all-stations', async (req, res) => {
    try {
        const stations = await ChargingStation.find({});
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve charging stations", error: error.message });
    }
});

module.exports = router;
