const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: address, format: "json", limit: 1 },
            headers: { "User-Agent": "uber-clone" }
        });
        if (response.data.length > 0) {
            return { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
        }
        return null;
    } catch (err) { return null; }
};

// 🔥 FIXED: Status 'active' add kiya aur radius logic testing ke liye 5000km kiya
module.exports.getCaptainsInTheRadius = async (lat, lng, radiusKm) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                // radiusKm agar nahi aaya toh default 5000km rakhega
                $centerSphere: [[lng, lat], (radiusKm || 5000) / 6371] 
            }
        },
        status: 'active' 
    });
    return captains;
};

module.exports.getDistanceTime = async (origin, destination) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
        const response = await axios.get(url, { params: { overview: "false" } });

        if (response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: route.distance / 1000, // numerical value for math
                duration: route.duration / 60   // numerical value for math
            };
        }
        return null;
    } catch (error) { return null; }
};
    module.exports.getAutoSuggestions = async (input) => {
        try {
            const url = `https://nominatim.openstreetmap.org/search`;
            const response = await axios.get(url, {
                params: { q: input, format: "json", addressdetails: 1, limit: 5 },
                headers: { "User-Agent": "uber-clone-app" }
            });
            return response.data.map((place) => ({
                display_name: place.display_name,
                lat: place.lat,
                lng: place.lon
            }));
        } catch (error) {
            console.error("Error in getAutoSuggestions:", error.message);
            return [];
        }
    };