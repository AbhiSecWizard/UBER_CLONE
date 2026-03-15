const app = require("./src/app")
const port = process.env.PORT || 4000
const http = require("http")

const server = http.createServer(app)


app.listen(port,()=>{
    console.log(`server is running on ${port} port`)
})
