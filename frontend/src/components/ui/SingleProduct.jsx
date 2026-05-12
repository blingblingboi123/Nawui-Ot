import React from "react";
import { useSelector } from "react-redux";
import ProductImg from "./ProductImg";
import ProductDesc from "./ProductDesc";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const { id } = useParams();

  const { products } = useSelector((store) => store.product);

  const product = products?.find((item) => item._id === id);

  if (!product) {
    return (
      <div className="pt-20 text-center text-lg font-semibold">
        Product not found or loading...
      </div>
    );
  }

  return (
    <div className="pt-10 py-5 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImg images={product.productImg || []} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;