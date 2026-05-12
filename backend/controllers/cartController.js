import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ================= GET CART =================
export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    return res.status(200).json({
      success: true,
      cart: cart || {
        userId,
        items: [],
        totalPrice: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADD TO CART =================
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity = 1 } = req.body;

    const qty = Number(quantity);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId,
        quantity: qty,
        price: product.price,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE QUANTITY =================
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REMOVE FROM CART =================
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};