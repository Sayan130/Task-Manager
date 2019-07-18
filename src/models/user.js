const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const Task = require("./task");
const userSchema = new mongoose.Schema({name : {
 
    type : String,
    trim : true,
    required : true
},

        age : {
            type : Number,
            validate(value){
                if(value < 0)throw new Error("Age can't be negative")
            }
        },

        email : {
            type : String,
            unique : true,
            required : true,
            lowercase : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Not a valid mail Id")
                }
            }

        },
        password :{
            trim : true,
            required : true,
            type : String,
            minlength : 6,
            validate(value){
                if(value.toLowerCase().includes("password"))
                    throw new Error("Weak Password Or Password shouldn't contain the word \"Password\" ")

            }
        }, 
        tokens :[{
            token : {
                    required:true,
                    type:String,
            }
        }
        ] 
    }, {
        timestamps : true,
    } )
userSchema.virtual("task", {
    ref : "task",
    localField : "_id",
    foreignField:"owner_id"
})
userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.tokens;
    delete user.password;
    return user;
}
userSchema.methods.getToken = async function(){
    
    token = await jwt.sign({_id:this.id.toString()}, "1406130" );
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;

}

userSchema.statics.isPresent = async (email, password)=>{

        
        emailCheck = await User.findOne({email});
        
        if(!emailCheck) throw new Error("Not found")
    
        passwordCheck = await bcrypt.compare(password, emailCheck.password );
        
        if(!passwordCheck) throw new Error("Password doesn't match");
        console.log(emailCheck);
        return emailCheck;
    }

userSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
        console.log("Password modification");
        this.password = await bcrypt.hash(this.password, 8);
        next();
    }

}) 
userSchema.pre("remove", async function(next){

        await Task.deleteMany({"owner_id":this._id});
        next();

})   

const User = mongoose.model("users", userSchema );

module.exports = User;