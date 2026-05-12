import  Product  from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDescription, price, category } = req.body;
    const userId = req.id;

    if (!productName || !productDescription || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required",
      });
    }

    let productImg = [];

    for (const file of req.files) {
      const fileUri = getDataUri(file);

      const result = await cloudinary.uploader.upload(fileUri.content, {
        folder: "products",
      });

      productImg.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const newProduct = await Product.create({
      userId,
      productName,
      productDescription,
      price,
      category,
      productImg,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("addProduct error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.productImg && product.productImg.length > 0) {
      for (const img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("deleteProduct error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productDescription, price, category, existingImages } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updateImage = [];

    if (existingImages || req.body.keepIds) {
      let keepIds = [];

      if (existingImages) {
        keepIds = JSON.parse(existingImages);
      } else if (Array.isArray(req.body.keepIds)) {
        keepIds = req.body.keepIds;
      } else if (req.body.keepIds) {
        keepIds = [req.body.keepIds];
      }

      updateImage = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      );

      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id)
      );

      for (const img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updateImage = product.productImg;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri.content, {
          folder: "mern_products",
        });

        updateImage.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    product.productName = productName || product.productName;
    product.productDescription = productDescription || product.productDescription;
    product.price = price || product.price;
    product.category = category || product.category;
    product.productImg = updateImage;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("updateProduct error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
