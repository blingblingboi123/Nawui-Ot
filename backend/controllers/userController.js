import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/emailVerify.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPEmail } from "../emailVerify/sendOTPMail.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    verifyEmail(token, email);

    newUser.token = token;

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized or Invalid Token" });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ success: false, message: "Token expired" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Token verification failed" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    user.token = token;
    await user.save();

    await verifyEmail(token, email);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔴 Check if user exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔴 Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔴 Check if email verified
    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
      });
    }

    // ✅ Generate tokens
    const accesstoken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );

    const refreshtoken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    // ✅ Update login status
    existingUser.isLoggedIn = true;
    await existingUser.save();

    // ✅ Session handling
    await Session.deleteOne({ userId: existingUser._id });
    await Session.create({ userId: existingUser._id });

    // ✅ Send safe user data
    const user = {
      id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      phoneNo: existingUser.phoneNo,
      address: existingUser.address,
      zipcode: existingUser.zipcode,
      role: existingUser.role,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${existingUser.firstName}!`,
      user,
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();
    await sendOTPEmail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res
        .status(400)
        .json({ success: false, message: "OTP and email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiration) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already used",
      });
    }

    if (user.otpExpiration < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allUser = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const { firstName, lastName, email, address, zipcode, phoneNo, role } =
      req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.zipcode = zipcode || user.zipcode;
    user.phoneNo = phoneNo || user.phoneNo;

    if (loggedInUser.role === "admin" && role) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot disable your own account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isDeleted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User account disabled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
