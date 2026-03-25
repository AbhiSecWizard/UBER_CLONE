const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
    firstname, lastname, email, password,
    color, plate, capacity, vehicleType
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error("All fields are required");
    }

    // 🔥 Added await and default location to fix MongoServerError
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        location: {
            type: 'Point',
            coordinates: [0, 0] // Default [lng, lat] to prevent indexing error
        }
    });

    return captain;
};