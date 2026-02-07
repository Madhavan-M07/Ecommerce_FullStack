import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing order using  COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, msg: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// placing order using  Stripe Method

const placeOrderStripe = async (req, res) => {};

// placing order using  RazorPay Method

const placeOrderRazorpay = async (req, res) => {};

// All Orders Data for Admin Panel

const allOrders = async (req, res) => {

  try{

  const orders = await orderModel.find({});
  res.json({ success: true, orders });
  } catch(error){

    console.log(error);
    res.json({ success: false, message: error.message });

  }

};

// User OrderData for frontend

const userOrders = async (req, res) => {
  console.log(req.body);
  try {
    const { userId } = req.body;
    console.log(userId);
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status from the admin panel

const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
