import {Router} from 'express';
import * as userService from './Services/user.service.js'; // Assuming addUser is defined in user.service.js
import { authenticationMiddleware } from '../../Middelwares/authentication.middleware.js';
const userRouter = Router();



userRouter.post('/add',userService.addUser); // Route to add a new user
userRouter.put('/update', authenticationMiddleware,userService.UpdateService); // Route to update an existing user by ID
userRouter.delete('/delete', authenticationMiddleware,userService.DeleteService); // Route to delete a user by ID
userRouter.get('/list',userService.ListUsers)
userRouter.post('/signIn',userService.signInUser)
userRouter.put('/confirm',userService.confirmUser)
userRouter.post('/refreshToken',userService.RefreshTokenService)
userRouter.post('/forgetPassword',userService.forgetPasswordUser)
userRouter.put('/confirmForgetPassword',userService.confirmForgetPasswordUser)
userRouter.post('/logout', authenticationMiddleware,userService.logoutUser)
// we will encrypt the phone number when the user sign up and decrypt it when the user retrieve or view their profile 

export default userRouter;