const mapService = require("./maps.service");
const rideModel = require("../models/ride.model");
const crypto = require("crypto");

const getFare = async (origin, destination) => {
    if (!origin || !destination) throw new Error("Pickup and destination required");

    const originCoords = await mapService.getAddressCoordinate(origin);
    const destCoords = await mapService.getAddressCoordinate(destination);

    if (!originCoords || !destCoords) throw new Error("Invalid locations");

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
        fare[type] = Number((r.base + distanceKm * r.perKm + durationMin * r.perMin).toFixed(2));
    }

    return { distance: distanceKm, duration: durationMin, fare };
};

const getOtp = (length = 4) => {
    return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length) - 1).toString();
};

const createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) throw new Error("All fields are required");

    const fareData = await getFare(pickup, destination);
    
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fareData.fare[vehicleType],
        distance: fareData.distance,
        duration: fareData.duration
    });

    return ride;
};

// 🔥 Naya function: Captain ride confirm karega
const confirmRide = async ({ rideId, captain }) => {
    if (!rideId) throw new Error("Ride id is required");

    await rideModel.findOneAndUpdate(
        { _id: rideId }, 
        {
            status: 'accepted',
            captain: captain._id
        },
        { returnDocument: 'after' } // 🔥 Added this
    );

    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');

    if (!ride) throw new Error("Ride not found");

    return ride;
}

// 🔥 Naya function: Ride end karna (Payment dikhane ke liye)
const endRide = async ({ rideId, captain }) => {
    if (!rideId) throw new Error("Ride id is required");

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain');

    if (!ride) throw new Error("Ride not found");
    if (ride.status !== 'ongoing') throw new Error("Ride not ongoing");

    ride.status = 'completed';
    await ride.save();

    return ride;
}

module.exports = { getFare, createRide, getOtp, confirmRide, endRide };