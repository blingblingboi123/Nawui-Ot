import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    delivery: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      zip: String,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Confirmed",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);