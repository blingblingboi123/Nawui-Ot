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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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
      "/api/v1/user/register",
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data.success) {
      localStorage.setItem("verifyEmail", formData.email);
      toast.success(res.data.message || "Account created successfully");
      navigate("/verify");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter details to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
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
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="absolute right-3 top-1 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="absolute right-3 top-1 cursor-pointer"
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
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 cursor-pointer">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;