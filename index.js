const express       = require("express")
const app           = express()

// cors policy
const cors          = require("cors")
app.use(cors())

// body parser
const bodyparser    = require("body-parser")
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

// importer les routes
const userRoutes    = require("./routes/routesUser")
const productRoutes = require("./routes/routesProduct")
const reviewRoutes  = require("./routes/routesView")
app.use("/user", userRoutes)
app.use("/product", productRoutes)
app.use("/review", reviewRoutes)

// lancer l'application
app.listen(3000, ()=>{console.log("SERVER START ON PORT 3000")})