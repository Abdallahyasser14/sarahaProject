import {Router} from 'express';
import * as userService from './Services/user.service.js'; // Assuming addUser is defined in user.service.js
import { authenticationMiddleware } from '../../Middelwares/authentication.middleware.js';
import { authorizationMiddleware } from '../../Middelwares/authorization.middleware.js';
import { validationMiddleware } from '../../Middelwares/validation.middleware.js';
import { SignUpSchema } from '../../Validators/Schemas/user.schema.js';
import {localUpload} from '../../Middelwares/multer.middleware.js';

const userRouter = Router();



userRouter.post('/add',validationMiddleware(SignUpSchema),userService.addUser); // Route to add a new user
userRouter.put('/update', authenticationMiddleware,userService.UpdateService); // Route to update an existing user by ID
userRouter.delete('/delete', authenticationMiddleware,userService.DeleteService); // Route to delete a user by ID
userRouter.get('/list',userService.ListUsers)
userRouter.post('/signIn',userService.signInUser)
userRouter.put('/confirm',userService.confirmUser)
userRouter.post('/refreshToken',userService.RefreshTokenService)
userRouter.post('/forgetPassword',userService.forgetPasswordUser)
userRouter.put('/confirmForgetPassword',userService.confirmForgetPasswordUser)
userRouter.post('/logout', authenticationMiddleware,userService.logoutUser)
userRouter.post('/signup-gmail',userService.SignUpServiceGmail)
// we will encrypt the phone number when the user sign up and decrypt it when the user retrieve or view their profile 
userRouter.post('/upload-profile',localUpload("profile").single("profile"),userService.uploadProfile)

// admin operation autherization
userRouter.get('/list',authenticationMiddleware, authorizationMiddleware(["admin"]),userService.ListUsers)

                                                 
/***!! any authorization needs ya3ni el admin maslan
 ** allowd roles masmoh lemin yed5lo 
 ** we el role beta3 el user ely 3male login delwa2ty 3hsan law ok ye5osh
 ** => di keda middelware laze teb2a b3l el authentication
 */



export default userRouter;