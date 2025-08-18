// generate token
import jwt from "jsonwebtoken"; // if you're using ES modules

export const generateToken=(payload,secret,options)=>{
    return jwt.sign(payload,secret,options)
}

// verify token
export const verifyToken=(token,secret)=>{
    return jwt.verify(token,secret)
}

//! dont repeat ur code 