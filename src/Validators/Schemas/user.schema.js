import Joi from "joi";
import { isValidObjectId } from "mongoose";


function objectValidation (value,helper){
    return isValidObjectId(value)? helper.message("Invalid object ID") : value;
    
}

export const SignUpSchema={   //! normal js object that has objects inside it beta3 el hagat ely gaya fel request  

    body: Joi.object({
        firstName:Joi.string().required().alphanum(),
        lastName:Joi.string().required().alphanum().max(20).min(2),
        age:Joi.number().required(),
        email:Joi.string().email().required(),
        gender:Joi.string().required().valid("male","female"),
        password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/),
             // one or more small one or more capital one or more number one or more special character  minimum length is 8 max length is 12
        confirmPassword:Joi.string().valid(Joi.ref("password")).required(),
   //? keda rabatohom be ba3d en lazem yeb2o equal
   phoneNumber:Joi.string().required(),
   role:Joi.string().required().valid("admin","user"),
   _id:Joi.string().custom(objectValidation), //? custom validation  if ur validation hasnt a pre defined one u can create a custom one

   //? conditional rules in joi 
   couponType:Joi.string().valid("flat","percent"),
   couponValue:Joi.number().
   when("couponType", // the condition is on which variable
    
    {is:"flat", // the condition is what
        then:Joi.number().min(0).max(100), // if the condition is true then the value must be between 0 and 100
        else:Joi.number().min(0).max(50)}), // if the condition is false then the value must be between 0 and 50
   
   // .valid () takes 
            })//.with('email','confirmPassword')    // */ law 3awez te3m peer keda el email optional law mesh 3amel 3ando required ya3ny bs law geh so confirm pass b2a required heya di el peer en hagtin yego ma3 b3d
    //query:{},
    //params:{},
    
}

//! conditional rules in joi 
//* 
//* 
//* 
//* 
//* 
//** 
//* 
//           
//  */