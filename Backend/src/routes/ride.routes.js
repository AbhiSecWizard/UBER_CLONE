const express = require("express")
const router = express.Router()
const {body} = require('express-validator')
const authMiddleware = require("../middlewares/auth.middleware")
const rideController = require("../controllers/ride.controller")
router.post(
    "/create",
    authMiddleware.authUser,
    body("pickup").isString().isLength({ min: 3 }),
    body("destination").isString().isLength({ min: 3 }),
    body("vehicleType").isIn(["motorbike", "auto", "car"]),
    rideController.createRide
);

router.post(
    "/verify-otp",
    authMiddleware.authUser,
    body("rideId").isString().isLength({ min: 24 }),
    body("otp").isLength({ min: 4, max: 4 }),
    rideController.verifyOtp
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  rideController.getFare
);

module.exports = router