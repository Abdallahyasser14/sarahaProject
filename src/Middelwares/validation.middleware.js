//  body: Joi.object({
//         firstName:Joi.string().required(),
//         lastName:Joi.string().required(),
//         age:Joi.number().required(),
//         email:Joi.string().email().required(),
//         gender:Joi.string().required(),
//         password:joi.string().required(),
//     })
import Joi from "joi";

const reqKeys=["body","query","params","headers"]; //? 3shan nelef 3la dool bs dont loop 3la all the request

export const validationMiddleware=(schema)=>{  //? ay middleware benehtag eno ya5od parameter 8ir el request bene3mlo function that returns middleware function
    return (req,res,next)=>{
        //! lazem abl ma te3ml validate neta2ked en el haga di leha schema gowa el object aslan 
        const validationErrors=[];
        for(const key of reqKeys){
        if (schema[key]) {
            const {error,value}=schema[key]?.validate(req[key],{abortEarly:false});  //? kan lazem henak yeb2a joi object 3shan ne3raf ne3mel .validate
            if(error){
                validationErrors.push(error.details[0].message);
            }
         
        }
     }
       
        if(validationErrors.length>0){
            return res.status(400).json({message:"Validation failed",errors:validationErrors});
        }
        
        next();
    }

}