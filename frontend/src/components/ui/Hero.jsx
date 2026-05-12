import React from "react";
import veg from "../../assets/veg.jpg";
import { useNavigate } from "react-router-dom"; // ✅ add this

const Hero = () => {
  const navigate = useNavigate(); // ✅ create navigate

  return (
    <section className="bg-gradient-to-r from-orange-400 to-green-400 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to NawuiOt
            </h1>

            <p className="text-lg mb-6">
              Discover the best products at unbeatable prices. 
              Shop now and experience the difference!
            </p>

            <button
              onClick={() => navigate("/products")} // ✅ navigate here
              className="bg-white text-orange-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Shop Now
            </button>
          </div>

          <div>
            <img
              src={veg}
              alt="Hero Image"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;