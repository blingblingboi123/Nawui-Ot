import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Account = ({ logoutHandler, closeDropdown }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  const profileHandler = () => {
    if (!user?.id) {
      console.log("User not found:", user);
      return;
    }

    navigate(`/profile/${user.id}`);
    closeDropdown?.();
  };

  return (
    <div className="w-60 p-4 bg-white shadow-lg rounded-md border text-black">
      <h2 className="text-lg font-semibold mb-2">My Account</h2>

      <ul className="space-y-2 text-sm">
        <li
          onClick={profileHandler}
          className="cursor-pointer hover:text-blue-500"
        >
          Profile
        </li>

        <li onClick={() => navigate("/my-orders")} className="cursor-pointer hover:text-blue-500" >
          Orders
        </li>

        <li
          onClick={logoutHandler}
          className="cursor-pointer text-red-500 hover:text-red-600 pt-2 border-t"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Account;