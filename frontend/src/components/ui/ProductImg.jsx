import React, { useState, useEffect } from "react";

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState(null);

  useEffect(() => {
    if (images?.length > 0 && images[0]?.url) {
      setMainImg(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      
      {/* Main Image */}
      {mainImg && (
        <img
          src={mainImg}
          alt="main product"
          className="w-[400px] h-[400px] object-cover rounded-xl shadow-md"
        />
      )}

      {/* Thumbnail Images */}
      <div className="flex gap-4 flex-wrap justify-center">
        {images.map((img, index) => (
          <img
            key={index}
            src={img?.url || "https://via.placeholder.com/100"}
            alt="product"
            onMouseEnter={() => setMainImg(img.url)}
            className={`cursor-pointer w-20 h-20 border rounded-md object-cover transition 
              ${mainImg === img.url ? "border-orange-500 scale-105" : "hover:scale-105"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImg;