const express       = require("express")
const routes        = express.Router()
const models        = require("../models")
const jwt           = require("jsonwebtoken")
const bcrypt        = require("bcrypt")
const uuid          = require("uuid")
require("dotenv").config()

/////////////////////////////////////////////////
// CRÉER UN COMPTE
/////////////////////////////////////////////////
routes.post("/register", (req,res)=>{

    const username       = req.body.username
    const email          = req.body.email
    const password       = req.body.password

    // check if email exist
    models.User.findOne({attributes :['id'], where:{email:email}})
    .then((data)=>{
        if(data){
            return res.status(403).json({"error":"EMAIL AL READY EXIST"})
        }else{
            checkUsername();
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // check if username exist
    function checkUsername(){
        models.User.findOne({attributes :['id'], where:{username:username}})
        .then((data)=>{
            if(data){
                return res.status(403).json({"error":"USERNAME AL READY EXIST"})
            }else{
                createAccount();
            }
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

    // create account
    function createAccount(){
        const uuidUser = uuid.v4()
        models.User.create({
            id:uuidUser,
            username:username,
            email:email,
            password: bcrypt.hashSync(password, 5)
        })
        .then(()=>{
            const token = jwt.sign({
                "id": uuidUser,
                "username": username,
            }, process.env.SECTOKEN,{expiresIn:'48h'})
            return res.status(201).json({
                "token":token,
                "id": uuidUser,
                "username": username,
            }) 
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

})


/////////////////////////////////////////////////
// SE CONNECTER
/////////////////////////////////////////////////
routes.post("/login", (req,res)=>{
    
    const email          = req.body.email
    const password       = req.body.password

    // check if email exist
    models.User.findOne({attributes :['id','username', 'password'], where:{email:email}})
    .then((data)=>{
        if(data){
            const resultat = bcrypt.compareSync(password, data.password)
            if(resultat){
                const token = jwt.sign({
                    "id": data.id,
                    "username": data.username,
                }, process.env.SECTOKEN,{expiresIn:'48h'})
                return res.status(201).json({
                    "token":token,
                    "id": data.id,
                    "username": data.username,
                }) 
            }else{
                return res.status(403).json({"error":"INVALID PASSWORD"})
            }

        }else{
            return res.status(403).json({"error":"EMAIL NOT FOUND"})
            
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

})


/////////////////////////////////////////////////
// MODIFIER LE MOT DE PASSE
/////////////////////////////////////////////////
routes.patch("/password", (req,res)=>{

    const username       = req.body.username
    const password       = req.body.password
    const newpassword       = req.body.newpassword

    // check if username exist
    models.User.findOne({attributes :['id','username', 'password'], where:{username:username}})
    .then((data)=>{
        if(data){
            const resultat = bcrypt.compareSync(password, data.password)
            if(resultat){
                editPassword()
            }else{
                return res.status(403).json({"error":"INVALID PASSWORD"})
            }

        }else{
            return res.status(403).json({"error":"ACCOUNT NOT FOUND"})
            
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // edit password
    function editPassword(){
        models.User.update({password: bcrypt.hashSync(newpassword, 5)}, {where:{username:username}})
        .then(()=>{return res.status(201).json({"success":"PASSWORD CHANGED"})})
        .catch((error)=>{return res.status(500).json(error)})
    }
})


/////////////////////////////////////////////////
// SUPPRIMER UN COMPTE
/////////////////////////////////////////////////
routes.delete("/delete", (req,res)=>{
    
    const username       = req.body.username
    const password       = req.body.password

    // check if username exist
    models.User.findOne({attributes :['id','username', 'password'], where:{username:username}})
    .then((data)=>{
        if(data){
            const resultat = bcrypt.compareSync(password, data.password)
            if(resultat){
                removeAccount()
            }else{
                return res.status(403).json({"error":"INVALID PASSWORD"})
            }

        }else{
            return res.status(403).json({"error":"ACCOUNT NOT FOUND"})
            
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // delete account
    function removeAccount(){
        models.User.destroy({where:{username:username}})
        .then(()=>{return res.status(200).json({"success":"ACCOUNT DELETED"})})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

module.exports      = routes