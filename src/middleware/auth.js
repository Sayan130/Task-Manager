const jwt = require("jsonwebtoken");
const User = require("../models/user");
auth = async(req, res, next)=>{

    try{
    let token = req.header("Authorization").replace('Bearer ', '');
    const decoded = await jwt.verify(token, "1406130");
 
    const user = await User.findOne({_id : decoded._id, "tokens.token":token});
    req.token = token;
    if(user === null)throw new Error("Undefined");
    req.user = user;
    next();
    
    }
    catch(e){
        res.status(404).send("Please authenticate");
    }
    
}
module.exports = auth;