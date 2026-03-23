require("dotenv").config(); // dotenv properly load
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes"); // adjust path if needed
const captainRoutes = require("./routes/captain.routes");
const mapsRoute = require("./routes/map.routes")
const rideRoute = require("./routes/ride.routes")
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/user", userRoutes);
app.use("/captain", captainRoutes);
app.use("/maps", mapsRoute);
app.use("/rides",rideRoute );

app.get("/", (req, res) => {
    res.send("This is GET function");
});

module.exports = app;