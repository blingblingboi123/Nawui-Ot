import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productName: {
      type: String,
      required: true,
    },

    productDescription: {
      type: String,
      required: true,
    },

    productImg: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;