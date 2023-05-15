const express       = require("express")
const routes        = express.Router()
const models        = require("../models")
const jwt           = require("jsonwebtoken")
const bcrypt        = require("bcrypt")
const uuid          = require("uuid")
const validator     = require("validator")
require("dotenv").config()

/////////////////////////////////////////////////
// CRÉER UN COMPTE
/////////////////////////////////////////////////
routes.post("/register", (req,res)=>{

    if(req.body.username==undefined || req.body.username==null)
    {return res.status(403).json({"error":"USERNAME UNDEFINED"})}

    if(req.body.email==undefined || req.body.email==null)
    {return res.status(403).json({"error":"EMAIL UNDEFINED"})}

    if(req.body.password==undefined || req.body.password==null)
    {return res.status(403).json({"error":"PASSWORD UNDEFINED"})}

    const username       = req.body.username
    const email          = req.body.email
    const password       = req.body.password

    if(!validator.isEmail(email))
    {return res.status(403).json({"error":"INVALID EMAIL"})}
    
    if(!validator.isLength(username, {min:5, max:20}))
    {return res.status(403).json({"error":"USERNAME MUST BE MIN: 5 & MAX:20 CHARS"})}
    
    if(!validator.isLength(password, {min:5, max:20}))
    {return res.status(403).json({"error":"PASSWORD MUST BE MIN: 5 & MAX:20 CHARS"})}

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
                "email": email
            }, process.env.SECTOKEN,{expiresIn:'48h'})
            return res.status(201).json({
                "token":token,
                "id": uuidUser,
                "username": username,
                "email":email
            }) 
        })
        .catch((error)=>{return res.status(500).json(error)})
    }

})


/////////////////////////////////////////////////
// SE CONNECTER
/////////////////////////////////////////////////
routes.post("/login", (req,res)=>{

    if(req.body.email==undefined || req.body.email==null)
    {return res.status(403).json({"error":"EMAIL UNDEFINED"})}

    if(req.body.password==undefined || req.body.password==null)
    {return res.status(403).json({"error":"PASSWORD UNDEFINED"})}

    const email          = req.body.email
    const password       = req.body.password

    if(!validator.isEmail(email))
    {return res.status(403).json({"error":"INVALID EMAIL"})}
    
    if(!validator.isLength(password, {min:5, max:20}))
    {return res.status(403).json({"error":"PASSWORD MUST BE MIN: 5 & MAX:20 CHARS"})}

    // check if email exist
    models.User.findOne({attributes :['id','username','email','password'], where:{email:email}})
    .then((data)=>{
        if(data){
            const resultat = bcrypt.compareSync(password, data.password)
            if(resultat){
                const token = jwt.sign({
                    "id": data.id,
                    "username": data.username,
                    "email": data.email
                }, process.env.SECTOKEN,{expiresIn:'48h'})
                return res.status(201).json({
                    "token":token,
                    "id": data.id,
                    "username": data.username,
                    "email": data.email
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
routes.post("/password", (req,res)=>{

    if(req.body.username==undefined || req.body.username==null)
    {return res.status(403).json({"error":"USERNAME UNDEFINED"})}
    
    if(req.body.password==undefined || req.body.password==null)
    {return res.status(403).json({"error":"PASSWORD UNDEFINED"})}

    if(req.body.newpassword==undefined || req.body.newpassword==null)
    {return res.status(403).json({"error":"NEW PASSWORD UNDEFINED"})}

    const username       = req.body.username
    const password       = req.body.password
    const newpassword    = req.body.newpassword

    if(!validator.isLength(username, {min:5, max:20}))
    {return res.status(403).json({"error":"USERNAME MUST BE MIN: 5 & MAX:20 CHARS"})}
    
    if(!validator.isLength(newpassword, {min:5, max:20}))
    {return res.status(403).json({"error":"NEW PASSWORD MUST BE MIN: 5 & MAX:20 CHARS"})}
    
    if(!validator.isLength(password, {min:5, max:20}))
    {return res.status(403).json({"error":"PASSWORD MUST BE MIN: 5 & MAX:20 CHARS"})}

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
routes.post("/delete", (req,res)=>{

    if(req.body.username==undefined || req.body.username==null)
    {return res.status(403).json({"error":"USERNAME UNDEFINED"})}
    
    if(req.body.password==undefined || req.body.password==null)
    {return res.status(403).json({"error":"PASSWORD UNDEFINED"})}

    const username       = req.body.username
    const password       = req.body.password

    if(!validator.isLength(username, {min:5, max:20}))
    {return res.status(403).json({"error":"USERNAME MUST BE MIN: 5 & MAX:20 CHARS"})}
    
    if(!validator.isLength(password, {min:5, max:20}))
    {return res.status(403).json({"error":"PASSWORD MUST BE MIN: 5 & MAX:20 CHARS"})}

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