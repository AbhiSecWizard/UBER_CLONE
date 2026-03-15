const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express() // machine created 

const cors = require("cors")
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
   res.send("this is get funcion")
})
app.get("/hello",(req,res)=>{
   res.send("hello section")
})

module.exports = app