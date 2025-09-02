import Joi from "joi";

export const SignUpSchema={   //! normal js object that has objects inside it beta3 el hagat ely gaya fel request  

    body: Joi.object({
        firstName:Joi.string().required().alphanum(),
        lastName:Joi.string().required().alphanum().max(20).min(2),
        age:Joi.number().required(),
        email:Joi.string().email().required(),
        gender:Joi.string().required().valid("male","female").message("Gender must be male or female"),
        password:Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/),
             // one or more small one or more capital one or more number one or more special character  minimum length is 8 max length is 12
        confirmPassword:Joi.string().valid(Joi.ref("password")).required().message("Passwords do not match"),
   //? keda rabatohom be ba3d en lazem yeb2o equal

   // .valid () beta5od magmo3a men el enums
            })
    //query:{},
    //params:{},
    
}