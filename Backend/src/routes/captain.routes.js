const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const captainController = require("../controllers/captain.controller")
const authCaptain = require("../middlewares/auth.middleware")

router.post('/register',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters'),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 character"),
    body('vehicle.color').isLength({min:3}).withMessage("Color must be at least 3 character "),
    body('vehicle.plate').isLength({min:3}).withMessage("plate number must be at least 3 character "),
    body('vehicle.capacity').isInt({min:1}).withMessage("Capacity must be at least 1 "),
    body('vehicle.vehicleType').isIn(['car','motercycle','auto']).withMessage('Invalid Vehicle Type')
],
captainController.registerCaptain
)
router.post('/login',[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min:6}).withMessage("password must be at least 6 character")
],
captainController.loginCaptain
)

router.get('/profile',authCaptain.authCaptain,captainController.getCaptainProfile)
router.get('/logout',authCaptain.authCaptain,captainController.logoutCaptain)


module.exports = router 


