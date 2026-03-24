const mapService = require("./maps.service");
const rideModel = require("../models/ride.model");


// 🔹 Fare Function
const getFare = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Pickup and destination required");
    }

    const pickup = origin; // 🔥 map karo
    const dest = destination;

    const originCoords = await mapService.getAddressCoordinate(pickup);
    const destCoords = await mapService.getAddressCoordinate(dest);

    if (!originCoords || !destCoords) {
        throw new Error("Invalid locations");
    }

    const route = await mapService.getDistanceTime(originCoords, destCoords);

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

        fare[type] = Number((
  r.base +
  distanceKm * r.perKm +
  durationMin * r.perMin
).toFixed(2));
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