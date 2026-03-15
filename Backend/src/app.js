const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express() // machine created 
const cors = require("cors")
const userRoutes = require("../src/routes/user.routes")




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/user",userRoutes)

app.get("/",(req,res)=>{
   res.send("this is get funcion")
})

module.exports = app