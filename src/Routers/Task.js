const express = require('express');
const router = new express.Router();
require('../db/mongoose')
const auth = require("../middleware/auth")
const task = require('../models/task') 

router.get("/task",auth, async (req, res)=>{
    match = {}
    sort = {}
    if(req.query.status){
        match.status = req.query.status === "true"
    }
    if(req.query.sortby){
        sort.createdAt = req.query.sortby.split(":")[1] === "asc" ? 1 : -1;
    }
    console.log(req.query.createdAt);
    try{
        await req.user.populate({
            path : 'task',
            match,  
            options :{
            limit : parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort 
            }
        }).execPopulate();
        
        res.status(200).send(req.user.task);

    }
    catch(e){
        res.status(404).send("Error");
    }
    

})

router.get("/task/:id",auth, async (req, res)=>{
    try{
        const _id = req.params.id;
        const data = await task.findOne({_id, owner_id:req.user._id});
        data.populate('owner_id').execPopulate("User");
        if(!data)
            throw new Error("not found");
        else 
            res.status(200).send(data);
    }
    catch(e){
        
        res.status(404).send(e);
    }
        
    })

router.post("/task",auth,  async (req, res)=>{

    try{
   // console.log(req.user);
    Task = new task({...req.body, owner_id:req.user._id});
    
    const result = await Task.save()
    
    console.log(Task.owner_id);
        res.status(200).send(result);
    }catch(err){
        res.status(400).send(err);
    }

})


router.patch("/task/:id",auth,  async (req, res)=>{

        const tsk_id = req.params.id;
        const a_taskupdate = ['status', "Description"]
        const req_update = Object.keys(req.body)

        const isValid = req_update.every((a)=>a_taskupdate.includes(a))

        if(!isValid) return res.status(404).send("Invalid parameter", )

        try{

            tsk = await task.findOneAndUpdate({"_id":tsk_id, "owner_id":req.user._id}, req.body, {new:true, runValidators : true});
            tsk.save();
            return res.status(200).send(tsk)

        }catch(e){
               
                return res.status(404).send(e)
        }

})


router.delete("/task/:id",auth,  async (req, res)=>{

    try{
        const user = req.params.id;
        const result = await task.findOneAndRemove({"_id":user, "owner_id":req.user._id});
        return  res.status(200).send(result)

    }catch(e){

        return res.status(404).send(e)
    }

})
module.exports = router;