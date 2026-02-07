import express from 'express'
import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import { verifyStripe } from '../controllers/orderController.js';


const orderRouter = express.Router();

//Admin Features
orderRouter.post('/list' ,adminAuth , allOrders)
orderRouter.post('/status' ,adminAuth , updateStatus)


// Payment features
orderRouter.post('/place' ,authUser, placeOrder)
orderRouter.post('/stripe' ,authUser, placeOrderStripe)
orderRouter.post('/razorpay' ,authUser, placeOrderRazorpay)

//User Features

orderRouter.post('/userOrders' ,authUser, userOrders)

//verify payment
orderRouter.post('/verify',authUser,verifyStripe)



export default orderRouter;
