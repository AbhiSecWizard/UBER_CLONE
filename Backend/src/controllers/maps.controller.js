const mapService = require("../service/maps.service");
const { validationResult } = require("express-validator");


// 🔹 Get Coordinates
module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);

        if (!coordinates) {
            return res.status(404).json({
                success: false,
                message: "Coordinates not found"
            });
        }

        res.status(200).json({
            success: true,
            data: coordinates
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// 🔹 Get Distance + Time
module.exports.getDistanceType = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { origin, destination } = req.query;

    try {
        // Step 1: Address → Coordinates
        const originCoords = await mapService.getAddressCoordinate(origin);
        const destCoords = await mapService.getAddressCoordinate(destination);

        if (!originCoords || !destCoords) {
            return res.status(404).json({
                success: false,
                message: "Coordinates not found"
            });
        }

        // Step 2: Distance + Time
        const result = await mapService.getDistanceTime(originCoords, destCoords);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Unable to calculate route"
            });
        }

        // Step 3: Send Response
        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports.getSuggestions = async (req, res) => {
    const { input } = req.query;

    if (!input || input.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Input must be at least 3 characters"
        });
    }

    try {
        const suggestions = await mapService.getAutoSuggestions(input);

        res.status(200).json({
            success: true,
            data: suggestions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

