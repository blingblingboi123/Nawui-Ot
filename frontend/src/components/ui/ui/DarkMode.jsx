import React, { useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700
      hover:scale-110 transition duration-200"
    >
      {darkMode ? (
        <MdLightMode className="text-2xl text-yellow-400" />
      ) : (
        <MdDarkMode className="text-2xl text-gray-800" />
      )}
    </button>
  );
};

export default DarkMode;