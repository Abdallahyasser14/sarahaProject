import {Router} from 'express';
import * as userService from './Services/user.service.js'; // Assuming addUser is defined in user.service.js
const userRouter = Router();



userRouter.post('/add',userService.addUser); // Route to add a new user
userRouter.put('/update/:userId', userService.UpdateService); // Route to update an existing user by ID
userRouter.delete('/delete/:userId', userService.DeleteService); // Route to delete a user by ID




export default userRouter;