const express       = require("express")
const routes        = express.Router()
const models        = require("../models")
const jwt           = require("jsonwebtoken")
const bcrypt        = require("bcrypt")
const uuid          = require("uuid")
const validator     = require("validator")
const tokenVerif    = require("../middleware/tokenVerification")
const multer        = require("../middleware/multer")
require("dotenv").config()

//////////////////////////////////////////////
// CREER UN PRODUIT
//////////////////////////////////////////////
routes.post("/new", tokenVerif, multer.single('file'), (req,res)=>{

    if(req.body.productName==undefined || req.body.productName==null)
    {return res.status(403).json({"error":"PRODUCT NAME UNDEFINED"})}

    if(req.body.productDetails==undefined || req.body.productDetails==null)
    {return res.status(403).json({"error":"PRODUCT DETAILS UNDEFINED"})}

    if(req.body.productPrice==undefined || req.body.productPrice==null)
    {return res.status(403).json({"error":"PRICE UNDEFINED"})}

    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    const idUser = tokenDecoded.id

    const uuidProduct = uuid.v4()

    const productName = req.body.productName
    const productDetails = req.body.productDetails
    const productPrice = req.body.productPrice

    models.Product.create({
        id:uuidProduct,
        productName:productName,
        productDetails:productDetails,
        productImage: req.myName,
        productPrice: productPrice,
        idUser: idUser,
        reviewNumber: 0
    })
    .then(()=>{return res.status(201).json({"success":"PRODUCT ADDED"})})
    .catch((error)=>{return res.status(500).json(error)})

})

//////////////////////////////////////////////
// MODIFIER UN PRODUIT
//////////////////////////////////////////////


//////////////////////////////////////////////
// AFFICHER UN PRODUIT
//////////////////////////////////////////////


//////////////////////////////////////////////
// AFICHER TOUS LES PRODUITS
//////////////////////////////////////////////



module.exports      = routes