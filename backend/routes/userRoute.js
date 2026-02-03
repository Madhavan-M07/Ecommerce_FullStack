import express from 'express'
import {loginUser,registerUser,loginAdmin} from '../controllers/userController.js'
import adminAuth from '../middleware/adminAuth.js';


const userRouter = express.Router();

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.post('/admin' , adminAuth  ,loginAdmin)


export default userRouter;
