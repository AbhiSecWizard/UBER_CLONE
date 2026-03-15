const mongoose = require("mongoose")

async function  connectToDb() {
    await mongoose.connect(process.env.MONGOBD_URI)
    console.log("connect to db")
}

module.exports = connectToDb