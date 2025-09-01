
// this middleware is used to check if the user is authorized to access the route
//! allowed rules // ["admin","user"]
                                         //? comes from the api middleware
export const authorizationMiddleware =  (allowedRoles) => {
    return (req,res,next)=>{  
        console.log(req.loggedInUser.role)
     
        if (allowedRoles.includes(req.loggedInUser.role)){
           return next();
        }
        else{
            return res.status(401).json({message:"Unauthorized"});
        }
    }
}