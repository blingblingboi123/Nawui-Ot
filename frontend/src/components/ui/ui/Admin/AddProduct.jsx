import React, { useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    category: "",
    files: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("You can upload only 5 images");
      return;
    }

    setFormData({
      ...formData,
      files,
    });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      files: updatedFiles,
    });

    setPreviewImages(updatedPreviews);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.productDescription ||
      !formData.price ||
      !formData.category ||
      formData.files.length === 0
    ) {
      toast.error("Please fill all fields and select images");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("productDescription", formData.productDescription);
      data.append("price", formData.price);
      data.append("category", formData.category);

      formData.files.forEach((file) => {
        data.append("files", file);
      });

      const res = await api.post(
        "/api/v1/product/addproduct",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product added successfully");

        setFormData({
          productName: "",
          productDescription: "",
          price: "",
          category: "",
          files: [],
        });

        setPreviewImages([]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Product Description
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Snacks">Snacks</option>
              <option value="Drinks">Drinks</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload up to 5 images.
            </p>
          </div>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {previewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;