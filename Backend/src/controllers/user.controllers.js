const userModel = require("../models/user.model")
const userService = require("../service/user.service")

const {validationResult}= require("express-validator")


module.exports.registerUser = async (req,res,next)=>{
// error handle from which is empty 
const errors = validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({
        errors:errors.array()
    })
}
const {fullname,email,password} = req.body
// hash method is created in schema uesrmodel folder 
const hashedPassword = await userModel.hashPassword(password)

// 
const user = await userService.createUser({
firstname:fullname.firstname,
lastname:fullname.lastname,
email,
password:hashedPassword
})

const token = user.generateAuthToken()

res.status(200).json({
    token:token,
    userData:user   
})
}