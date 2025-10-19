import React from "react";
import { XCircle, Search } from "lucide-react";

const EmptyState = ({ message, isError = false }) => {
  return (
    <div className="text-center my-12 py-12 px-6 bg-white rounded-2xl border-2 border-dashed">
      <div
        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
          isError ? "bg-red-100" : "bg-gray-100"
        }`}
      >
        {isError ? (
          <XCircle className="w-8 h-8 text-red-500" />
        ) : (
          <Search className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
    </div>
  );
};

export default EmptyState;
