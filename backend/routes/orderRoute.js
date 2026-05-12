import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getUserOrders,
  verifyPayment,
  updateOrderStatus,
  getSalesData
} from "../controllers/orderController.js";

import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/user-orders/:userId", isAuthenticated, isAdmin, getUserOrders);
router.get("/all", isAuthenticated, isAdmin, getAllOrders);
router.put("/update-status/:orderId", isAuthenticated, isAdmin, updateOrderStatus);
router.get("/sales-data", isAuthenticated, isAdmin, getSalesData);

export default router;