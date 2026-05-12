import FilterSideBar from "@/components/ui/ui/FilterSideBar";
import ProductCard from "@/components/ui/ui/ProductCard";
import React, { useEffect, useState } from "react";
import api from "@/config/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/ProductSlice";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [allProduct, setAllProducts] = useState([]);
  const [categories, setCategories] = useState("All");
  const [loading, setLoading] = useState(false);

  const getAllProducts = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/v1/product/getallproducts")
      if (response.data.success) {
        setAllProducts(response.data.products || []);
        dispatch(setProducts(response.data.products || []));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const filteredProducts = allProduct.filter((product) => {
    const matchesCategory =
      categories === "All" || product.category === categories;

    const matchesSearch =
      !search ||
      product.productName?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-3 px-6">
      <div className="max-w-7xl mx-auto flex gap-7">
        <FilterSideBar
          allProduct={allProduct}
          categories={categories}
          setCategories={setCategories}
        />

        <div className="flex-1">
          {search && (
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Search results for:{" "}
              <span className="text-orange-500">{search}</span>
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <ProductCard key={index} loading={true} />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={false}
                />
              ))
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;