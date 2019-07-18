const mongoose = require("mongoose")
const validator = require("validator")

const taskschema = new mongoose.Schema({

    Description : {
        type: String,
        required : true,
        trim : true,
    
    }, status:{
        type : Boolean,
        default : false
    },
    owner_id:{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "users"
    
    }
},{
    timestamps : true,
})
const task = mongoose.model("task", taskschema,);


module.exports = task;