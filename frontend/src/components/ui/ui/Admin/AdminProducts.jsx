import React, { useEffect, useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";
import { Trash2, Edit, X } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [editData, setEditData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    category: "",
  });

  const token = localStorage.getItem("accessToken");

  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/api/v1/product/getallproducts"  
      );

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(
        `/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product deleted successfully");
        setProducts(products.filter((product) => product._id !== productId));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditProductId(product._id);

    setEditData({
      productName: product.productName || "",
      productDescription: product.productDescription || "",
      price: product.price || "",
      category: product.category || "",
    });

    setOldImages(product.productImg || []);
    setNewImages([]);
    setNewPreviews([]);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (oldImages.length + newImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setNewImages([...newImages, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };

  const removeOldImage = (index) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (
      !editData.productName ||
      !editData.productDescription ||
      !editData.price ||
      !editData.category
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (oldImages.length === 0 && newImages.length === 0) {
      toast.error("Product must have at least one image");
      return;
    }

    try {
      const data = new FormData();

      data.append("productName", editData.productName);
      data.append("productDescription", editData.productDescription);
      data.append("price", editData.price);
      data.append("category", editData.category);

      // old images that you want to keep
      oldImages.forEach((img) => {
        data.append("keepIds", img.public_id);
      });

      // new uploaded images
      newImages.forEach((file) => {
        data.append("files", file);
      });

      const res = await api.put(
        `/api/v1/product/update/${editProductId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product updated successfully");
        setEditOpen(false);
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>

          <button
            onClick={getAllProducts}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-100 text-left">
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Description</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <img
                        src={
                          product.productImg?.[0]?.url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>

                    <td className="p-3 border font-medium">
                      {product.productName}
                    </td>

                    <td className="p-3 border">{product.category}</td>

                    <td className="p-3 border">₹{product.price}</td>

                    <td className="p-3 border max-w-xs">
                      <p className="line-clamp-2">
                        {product.productDescription}
                      </p>
                    </td>

                    <td className="p-3 border">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-5">Edit Product</h2>

            <form onSubmit={updateProduct} className="space-y-4">
              <input
                type="text"
                name="productName"
                value={editData.productName}
                onChange={handleEditChange}
                placeholder="Product name"
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                name="productDescription"
                value={editData.productDescription}
                onChange={handleEditChange}
                placeholder="Product description"
                rows="4"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="price"
                value={editData.price}
                onChange={handleEditChange}
                placeholder="Price"
                className="w-full border rounded-lg px-4 py-2"
              />

              <select
                name="category"
                value={editData.category}
                onChange={handleEditChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Select category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Drinks">Drinks</option>
                <option value="Grocery">Grocery</option>
              </select>

              <div>
                <label className="block mb-2 font-medium">Old Images</label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {oldImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.url}
                        alt="old"
                        className="w-full h-24 object-cover rounded-lg border"
                      />

                      <button
                        type="button"
                        onClick={() => removeOldImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Add New Images</label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageChange}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              {newPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {newPreviews.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt="new"
                        className="w-full h-24 object-cover rounded-lg border"
                      />

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;