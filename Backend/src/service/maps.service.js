const axios = require("axios");

// 🔹 Address → Coordinates (OSM - Nominatim)
module.exports.getAddressCoordinate = async (address) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search`;

        const response = await axios.get(url, {
            params: {
                q: address,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "uber-clone-app"
            }
        });

        if (response.data.length > 0) {
            const location = response.data[0];

            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        }

        return null;

    } catch (error) {
        console.error("Error in getAddressCoordinate:", error.message);
        return null;
    }
};


// 🔹 Distance + Time (OSRM)
module.exports.getDistanceTime = async (origin, destination) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

        const response = await axios.get(url, {
            params: {
                overview: "false"
            }
        });

        if (response.data.routes.length > 0) {
            const route = response.data.routes[0];

            const distanceKm = route.distance / 1000;
            const durationMinutes = route.duration / 60;

            const hours = Math.floor(durationMinutes / 60);
            const minutes = Math.floor(durationMinutes % 60);

            return {
                distance: `${distanceKm.toFixed(2)} km`,
                duration: hours > 0 
                    ? `${hours} hr ${minutes} min`
                    : `${minutes} min`
            };
        }

        return null;

    } catch (error) {
        console.error("Error in getDistanceTime:", error.message);
        return null;
    }
};

module.exports.getAutoSuggestions = async (input) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search`;

        const response = await axios.get(url, {
            params: {
                q: input,
                format: "json",
                addressdetails: 1,
                limit: 5
            },
            headers: {
                "User-Agent": "uber-clone-app"
            }
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