const app = require("./src/app")
const port = process.env.PORT || 4000
const connectToDb = require("./src/db/db")
connectToDb()
app.listen(port,()=>{
    console.log(`server is running on ${port} port`)
})