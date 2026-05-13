import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { clearCart } from "@/redux/cartSlice";
import api from "@/config/api";
import Account from "../../page/Account";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  // unique item count
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isAdmin = user?.role === "admin";

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/products?search=${search.trim()}`);
    setSearch("");
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await api.post(
        "/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      dispatch(clearCart());
      dispatch(setUser(null));

      setShowDropdown(false);
      setShowMobileMenu(false);

      navigate("/");
      window.location.reload();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="NawuiOt Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden sm:block text-2xl font-bold text-orange-500">
              NawuiOt
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button type="submit">
              <IoMdSearch className="absolute right-3 top-2.5 text-xl text-gray-500" />
            </button>
          </form>

          <div className="hidden md:flex items-center gap-5">
            {isAdmin && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-sm transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-orange-500"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-3 -right-4 bg-pink-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <Button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 flex items-center gap-2 rounded-xl"
                  >
                    <CgProfile size={18} />
                    <span className="text-sm font-medium">Account</span>
                    <ChevronDown size={16} />
                  </Button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 z-50">
                      <Account
                        logoutHandler={logoutHandler}
                        closeDropdown={() => setShowDropdown(false)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative text-gray-700">
              <ShoppingCart size={24} />
              <span className="absolute -top-3 -right-4 bg-pink-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button type="submit">
              <IoMdSearch className="absolute right-3 top-2.5 text-xl text-gray-500" />
            </button>
          </form>
        </div>

        {showMobileMenu && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/products"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
            >
              Products
            </Link>

            {isAdmin && (
              <Link
                to="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={logoutHandler}
                className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-3 rounded-xl bg-orange-500 text-white font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;