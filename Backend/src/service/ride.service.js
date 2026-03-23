const mapService = require("./maps.service");
const rideModel = require("../models/ride.model");


// 🔹 Fare Function
const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination required");
    }

    const origin = await mapService.getAddressCoordinate(pickup);
    const dest = await mapService.getAddressCoordinate(destination);

    if (!origin || !dest) {
        throw new Error("Invalid locations");
    }

    const route = await mapService.getDistanceTime(origin, dest);

    if (!route) {
        throw new Error("Route not found");
    }

    const distanceKm = parseFloat(route.distance);
    const durationMin = parseFloat(route.duration);

    const rates = {
        motorbike: { base: 10, perKm: 6, perMin: 1 },
        auto: { base: 15, perKm: 8, perMin: 1.5 },
        car: { base: 20, perKm: 10, perMin: 2 }
    };

    const fare = {};

    for (let type in rates) {
        const r = rates[type];

        const total =
            r.base +
            distanceKm * r.perKm +
            durationMin * r.perMin;

        fare[type] = total.toFixed(2);
    }

    return {
        distance: distanceKm,
        duration: durationMin,
        fare
    };
};


const crypto = require("crypto");

// 🔥 Secure OTP (better than Math.random)
const getOtp = (length = 4) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    return otp;
};
// 🔹 Create Ride
const createRide = async ({
    user,
    pickup,
    destination,
    vehicleType
}) => {

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required");
    }

    const fareData = await getFare(pickup, destination);

    // 🔥 Safety check
    if (!fareData.fare[vehicleType]) {
        throw new Error("Invalid vehicle type");
    }

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp:getOtp(4),
        fare: fareData.fare[vehicleType],
        distance: fareData.distance,
        duration: fareData.duration
    });

    return ride;
};

module.exports = {
    getFare,
    createRide,
    getOtp
};