import jwt from "jsonwebtoken";

const adminAuth = (req,res,next)=>{
    try{
        const {token} = req.headers
        console.log("adminAuth",token);
         if(!token){
            return res.json({success:false,msg:"Unauthorized Access.Login Again"});
         }
            
            const token_decode = jwt.verify(token,process.env.JWT_SECRET);
            if(token_decode !== (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)){
                return res.json({success:false,msg:"Unauthorized Access"});
            }
                next()
        
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export default adminAuth;