import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/Navbar";
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Verify from "./page/Verify";
import VerifyEmail from "./page/VerifyEmail";
import Profile from "./page/Profile";
import Products from "./page/Products";
import Cart from "./page/Cart";
import Dashboard from "./page/Dashboard";

import AdminSales from "./components/ui/ui/Admin/AdminSales";
import AddProduct from "./components/ui/ui/Admin/AddProduct";
import AdminOrders from "./components/ui/ui/Admin/AdminOrders";
import AdminUser from "./components/ui/ui/Admin/AdminUser";
import ShowUserOrders from "./components/ui/ui/Admin/ShowUserOrders";
import UserInfo from "./components/ui/ui/Admin/UserInfo";
import AdminProducts from "./components/ui/ui/Admin/AdminProducts";

import ProtectedRoute from "./components/ui/ProtectedRoute";
import SingleProduct from "./components/ui/SingleProduct";
import AddressForm from "./components/ui/AddressFrom";
import OrderSuccess from "./page/OrderSuccess";
import MyOrders from "./page/MyOrders";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSales />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="user-orders/:userId" element={<ShowUserOrders />} />
          <Route path="user/:id" element={<UserInfo />} />
        </Route>
        <Route path="/products/:id" element={< SingleProduct />} />
         <Route path="/address" element={<AddressForm />} />
         <Route path="/order-success" element={<OrderSuccess />} />
         <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
       
      
    </>
  );
}

export default App; 