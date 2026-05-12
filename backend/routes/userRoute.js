import express from "express";
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  changePassword,
  verifyOTP,
  allUser,
  getUserById,
  updateUser,
  changeUserRole,
} from "../controllers/userController.js";

import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify); 
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

router.post("/forgot-Password", forgotPassword);
router.post("/verify-OTP/:email", verifyOTP);
router.post("/change-Password/:email", changePassword);

router.get("/allUser", isAuthenticated, isAdmin, allUser);
router.get("/get-User/:userId", isAuthenticated, getUserById);

router.put("/update/:id", isAuthenticated, updateUser);
router.put("/change-role/:userId", isAuthenticated, isAdmin, changeUserRole);

export default router;