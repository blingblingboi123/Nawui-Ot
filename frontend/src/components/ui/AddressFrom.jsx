import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Label } from "./ui/Label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "@/redux/cartSlice";
import { API_URL, authHeaders } from "@/config/api";

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") return null;
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = getStoredUser();
  const userId = user?._id || user?.id;

  const { cart } = useSelector((store) => store.cart);

  const storageKey = userId ? `addresses_${userId}` : "addresses_guest";

  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState(null);
  const [showForm, setShowForm] = React.useState(true);

  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  React.useEffect(() => {
    if (!userId) return;

    const savedAddresses = JSON.parse(localStorage.getItem(storageKey)) || [];
    setAddresses(savedAddresses);
    setShowForm(savedAddresses.length === 0);
    setSelectedAddressIndex(null);
  }, [userId, storageKey]);

  const saveAddressesToStorage = (updatedAddresses) => {
    localStorage.setItem(storageKey, JSON.stringify(updatedAddresses));
    setAddresses(updatedAddresses);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!userId) return toast.error("Please login first");

    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "zip",
    ];

    const missing = requiredFields.some((field) => !formData[field]?.trim());

    if (missing) {
      return toast.error("Please fill all address fields");
    }

    const updatedAddresses = [...addresses, formData];

    saveAddressesToStorage(updatedAddresses);

    setFormData({
      fullName: "",
      phone: "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      zip: "",
    });

    setShowForm(false);
    setSelectedAddressIndex(updatedAddresses.length - 1);

    toast.success("Address saved");
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);

    saveAddressesToStorage(updatedAddresses);

    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
    }

    if (updatedAddresses.length === 0) {
      setShowForm(true);
    }

    toast.success("Address deleted");
  };

  const cartItems = cart?.items || [];

  const subtotal =
    cart?.totalPrice ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharges = subtotal > 500 ? 0 : 50;
  const totalPrice = subtotal + deliveryCharges;

  const handlePayment = async () => {
    try {
      if (!cartItems.length) {
        return toast.error("Your cart is empty");
      }

      if (selectedAddressIndex === null || selectedAddressIndex === undefined) {
        return toast.error("Please select an address");
      }

      if (!window.Razorpay) {
        return toast.error("Razorpay script not loaded. Check index.html");
      }

      const selectedAddress = addresses[selectedAddressIndex];

      const { data } = await axios.post(
        `${API_URL}/order/create-order`,
        {
          products: cartItems.map((item) => ({
            productId: item.productId?._id || item.productId,
            quantity: item.quantity,
          })),
          amount: totalPrice,
          delivery: selectedAddress,
        },
        {
          headers: authHeaders(),
        }
      );

      if (!data.success) {
        return toast.error(data.message || "Failed to create order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Nawui Ot",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/order/verify-payment`,
              response,
              {
                headers: authHeaders(),
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful");
              dispatch(clearCart());
              navigate("/order-success");
            } else {
              toast.error(
                verifyRes.data.message || "Payment verification failed"
              );
            }
          } catch (err) {
            console.error(err);
            toast.error("Verification error");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },

        prefill: {
          name: selectedAddress?.fullName,
          email: selectedAddress?.email,
          contact: selectedAddress?.phone,
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid md:grid-cols-2 gap-10 w-full">
        <div className="bg-white p-5 rounded-lg shadow-md">
          {showForm ? (
            <>
              <h2 className="text-xl font-bold mb-4">Add Address</h2>

              {[
                "fullName",
                "phone",
                "email",
                "address",
                "city",
                "state",
                "zip",
              ].map((field) => (
                <div className="mb-3" key={field}>
                  <Label>{field}</Label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 mt-1"
                  />
                </div>
              ))}

              <Button onClick={handleSave} className="w-full mt-4">
                Save Address
              </Button>

              {addresses.length > 0 && (
                <Button
                  onClick={() => setShowForm(false)}
                  className="w-full mt-2 bg-gray-500"
                >
                  Cancel
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Saved Address</h2>

              {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAddressIndex(index)}
                  className={`border p-4 rounded-md cursor-pointer relative ${
                    selectedAddressIndex === index
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                  </p>

                  {selectedAddressIndex === index && (
                    <p className="text-green-600 text-sm font-medium mt-2">
                      Selected
                    </p>
                  )}

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(index);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1"
                  >
                    Delete
                  </Button>
                </div>
              ))}

              <Button onClick={() => setShowForm(true)} className="w-full">
                Add New Address
              </Button>

              <Button
                onClick={handlePayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Proceed To Payment
              </Button>
            </div>
          )}
        </div>

        <div>
          <Card className="p-5 shadow-md">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length})</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{deliveryCharges}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-3">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;