const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 1. Captain Registration
router.post('/register', [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body('vehicle.color').isLength({ min: 3 }).withMessage("Color must be at least 3 characters"),
    body('vehicle.plate').isLength({ min: 3 }).withMessage("Plate number must be at least 3 characters"),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid Vehicle Type')
],
    captainController.registerCaptain
);

// 2. Captain Login
router.post('/login', [
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
],
    captainController.loginCaptain
);

// 3. Get Captain Profile
router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

// 4. Logout Captain
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

// 🔥 5. Update Status (FIX: Isse captain online/offline ho payega)
router.patch('/update-status', 
    authMiddleware.authCaptain, 
    [
        body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
    ],
    captainController.updateStatus
);

// captain.routes.js
// router.patch('/update-status', authCaptain, captainController.updateStatus);
router.patch('/update-location', authMiddleware.authCaptain, captainController.updateLocation); // Ye add karein


module.exports = router;