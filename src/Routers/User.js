const express = require('express');
const router = new express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
require('../db/mongoose');
const User = require('../models/user');

router.post("/user", async (req, res)=>{

    try{

        user = new User(req.body);
        const token = await user.getToken();
        
        const result = await user.save()
        return res.status(200).send({result, token});
    }
    catch(err){

        res.status(400).send(err);
    } 
})

router.get("/user/me",auth, async (req, res)=>{
    res.send(req.user);
    
})

router.get("/user/:id", async(req, res)=>{
    const _id = req.params.id;
    try{
        const  result = await User.findById({_id})
        
        if(!result)
            throw new Error("No data found")
        else
            res.status(200).send(result);
    }
    catch{

        res.status(404).send("No data found");
    }
    
})


router.patch("/user/me",auth,  async (req, res)=>{
    const a_update = Object.keys(req.body);
    const all = ['name', 'age', 'password', 'email']

    const isvalid = a_update.every((a_update)=>  all.includes(a_update) )
    if(!isvalid)  return res.status(404).send("Invalid parameter")    
    try{
        const u = req.params.id;    
        const findUser = req.user;
        a_update.forEach((all)=> {
            return findUser[all] = req.body[all];
        })
        
        const k = await findUser.save();
        return  res.status(200).send(k);

    }catch(e){

            res.status(404).send(e)
    }



})
router.delete("/user/me",auth,  async (req, res)=>{

    try{
        const user = req.user;
        user.remove();
        return  res.status(200).send("Your account has been deactivated");

    }catch(e){

        return res.status(404).send(e)
    }


})

router.post('/user/login', async (req, res)=>{

    try{
       
       const user =  await User.isPresent(req.body.email, req.body.password);
       console.log(user);
       const oauth = await user.getToken();
       res.status(200).send({message : "Welcome, Here's your token", token: oauth});
    }
    catch(e){
        res.status(404).send("Invalid credentials");
    }
})
router.post('/user/logout', auth, async (req, res)=>{

    try{
        
        req.user.tokens = req.user.tokens.filter((token)=>{

            return token.token !== req.token;
        })

        await req.user.save();
        res.send("Logout Successfully");
    }catch(e){
        res.status(500).send("Unsucessful");
    }

})
router.post('/user/logoutall', auth, (req, res)=>{

    try{
    req.user.tokens = [];
    req.user.save();
    res.send("Logged out from all other session");
    }
    catch(e){
        res.status(500).send("Problem occured during logging out");
    }
})
const upload = multer({
    dest:'avatar'
})
router.post("/user/me/avatar", upload.single('upload'), (req, res)=>{

    res.status(200).send("Successfully images has been added ")
})
module.exports = router