import React from "react";
import Lottie from "react-lottie";
import loadingData from "../../assets/lottie/loader.json";
import { FiLoader } from "react-icons/fi";
const AnimatedLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
    </div>
  );
};

export default AnimatedLoader;
