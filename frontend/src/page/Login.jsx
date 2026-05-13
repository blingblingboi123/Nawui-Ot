import React, { useState } from "react";
import { Button } from "@/components/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card";
import { Input } from "@/components/ui/ui/Input";
import { Label } from "@/components/ui/ui/Label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/config/api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { clearCart, setCart } from "@/redux/cartSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/api/v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        const token = res.data.accesstoken;
        const user = res.data.user;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(setUser(user));

        // clear previous account cart from Redux
        dispatch(clearCart());

        // fetch this logged-in user's cart
        const cartRes = await api.get("/api/v1/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cartRes.data.success) {
          dispatch(setCart(cartRes.data.cart));
        }

        toast.success(res.data.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>
          <CardDescription>Enter details to login your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="mm@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Password</Label>

                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="absolute right-3 top-2 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="absolute right-3 top-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 cursor-pointer">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;