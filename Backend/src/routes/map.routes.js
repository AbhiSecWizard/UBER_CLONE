const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/maps.controller");

// GET /maps/get-coordinates?address=...
router.get(
    "/get-coordinates",
    query("address").isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get("/get-distance-time",
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3}),
    authMiddleware.authUser,
    mapController.getDistanceType
)

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getSuggestions
);











module.exports = router;




