import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import crypto from "crypto";

// CREATE ORDER
// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products, amount, delivery } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required",
      });
    }

    if (!delivery) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = await Order.create({
      user: userId,

      products: products.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
      })),

      amount,
      delivery: {
        fullName: delivery.fullName,
        phone: delivery.phone,
        email: delivery.email,
        address: delivery.address,
        city: delivery.city,
        state: delivery.state,
        zip: delivery.zip,
      },

      razorpayOrderId: razorpayOrder.id,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" }
      );

      return res.json({
        success: true,
        message: "Payment failed",
        order,
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "Paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { returnDocument: "after" }
    );

    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalPrice: 0 }
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

// USER ORDERS
  export const getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("products.product")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("GET MY ORDERS ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get orders",
      });
    }
  };

// ADMIN: GET SINGLE USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user orders",
    });
  }
};

// ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all orders",
    });
  }
};

// ADMIN: UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Confirmed",
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { returnDocument: "after" }
    ).populate("products.product").populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const orders = await Order.find();

    // Total Orders
    const totalOrders = orders.length;

    // Total Revenue
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount || order.totalPrice || 0),
      0
    );

    // Total Products Sold
    let totalProductsSold = 0;

    orders.forEach((order) => {
      order.products?.forEach((item) => {
        totalProductsSold += item.quantity;
      });
    });

    // Monthly Sales
    const monthlySales = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }

      monthlySales[month] += order.amount || order.totalPrice || 0;
    });

    return res.status(200).json({
      success: true,
      salesData: {
        totalOrders,
        totalRevenue,
        totalProductsSold,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("GET SALES DATA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
    });
  }
};