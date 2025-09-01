

//import User from "../Modules/user/user.model.js";
import { verifyToken } from "../Utils/tokens.utils.js";
//import BlacklistedTokens from "../Models/black-listed-tokens.model.js";
import {BlacklistedTokens} from "../DB/Models/black-listed-tokens.model.js";
import User from "../DB/Models/user.model.js";
export const authenticationMiddleware = async (req, res, next) => { 
     // the step of authentication before the request reaches the controller
    try {
        const {authorization: accesstoken}=req.headers;
        if(!accesstoken){
            return res.status(401).json({message:"Access token is required"});
        }

        const [prefix, token ]= accesstoken.split(' ');
       

        const decodedToken=verifyToken(token,process.env.JWT_SECRET_KEY); //? verify the token
        if (!decodedToken.jti){
            return res.status(401).json({message:"Invalid token"});
        }
        const userId=decodedToken.id; //? get the user id from the token
       
        console.log(decodedToken);

        const blaclistfind=await BlacklistedTokens.findOne({tokenId:decodedToken.jti});
        if(blaclistfind){
            return res.status(401).json({message:"Token is blacklisted"});
        }
        const user=await User.findById(userId);  // to ensure that the last version of the data saved in database is the one that is being used
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        req.loggedInUser=user; //! info of the user is stored in the request object to be used in the the rest srevice so we dont get the data from the database again
        req.tokenId=decodedToken.jti;
        req.expirationDate=decodedToken.exp;
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({message:"Invalid token"});
    }
}