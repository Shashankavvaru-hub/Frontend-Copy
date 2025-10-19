import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-12 h-12 border-4 border-t-kalaa-orange border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
