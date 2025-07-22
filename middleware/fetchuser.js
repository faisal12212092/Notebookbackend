const jwt = require("jsonwebtoken"); //give token to client who sign in
const jwtsign = "Fomasol"; //like signature
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token)
    {
    return res.status(401).send({ error: "Access denied: No token provided" });
    }
    try{
    const data=jwt.verify(token,jwtsign);
    req.user=data.user;
    console.log("Decoded token user:", req.user.id);

    next();
    }
    catch(error)
    {
        return res.status(401).send({ error: "Access denied: Invalid token" });
    }

}



module.exports=fetchuser;