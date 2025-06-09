import React from "react";

const ProductQuantityModal = ({ isOpen, onClose, type, quantity, onConfirm }) => {
  if (!isOpen) return null;

  const isAdd = type === "add";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-center text-pink-600 font-semibold text-lg mb-4">
          {isAdd ? "Add Product Quantity" : "Remove Product Quantity"}
        </h2>

        <div className="flex items-center justify-between mb-4 text-sm font-medium">
          <span>Available Product Quantity:</span>
          <span>{quantity}</span>
          <span className="text-xl font-bold">{isAdd ? "+" : "-"}</span>
          <input
            type="number"
            placeholder="Enter Qn"
            className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            {isAdd ? "Add" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductQuantityModal;