import { Shield } from "lucide-react";
import React from "react";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineSupportAgent } from "react-icons/md";

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid md:grid-cols-3 gap-8 text-center">

          {/* Feature 1 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-orange-100 p-4 rounded-full flex items-center justify-center">
              <MdDeliveryDining className="text-2xl text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold">Free Delivery</h3>
            <p className="text-sm text-gray-600">
              On all orders over ₹500
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-orange-100 p-4 rounded-full flex items-center justify-center">
              <Shield className="text-2xl text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold">Secure Payment</h3>
            <p className="text-sm text-gray-600">
              100% secure payment processing
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-orange-100 p-4 rounded-full flex items-center justify-center">
              <MdOutlineSupportAgent className="text-2xl text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold">24/7 Support</h3>
            <p className="text-sm text-gray-600">
              We're here to help, anytime
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Features;