require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoute = require("./routes/map.routes");
const rideRoute = require("./routes/ride.routes");

const app = express();

// Isko update karo
// Purana cors hata kar ye dalo
app.use(cors({
    origin: "http://localhost:5173", // No '*', use exact URL
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/user", userRoutes);
app.use("/captain", captainRoutes); // Double check: routes file mein '/profile' hai toh URL '/captain/profile' banega
app.use("/maps", mapsRoute);
app.use("/rides", rideRoute);

app.get("/", (req, res) => {
    res.send("Server is Healthy 🚀");
});

module.exports = app;