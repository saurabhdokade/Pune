import React from "react";

const products = [
  { code: "WH8746", brand: "Whisper", name: "Whisper Ultra Soft", size: "XL", qty: 905, price: "₹123" },
  { code: "WH8745", brand: "Whisper", name: "Whisper Ultra Soft", size: "L", qty: 905, price: "₹123" },
  { code: "WH8747", brand: "Whisper", name: "Whisper Ultra Soft", size: "XXl", qty: 905, price: "₹123" },
  { code: "WH8745", brand: "Whisper", name: "Whisper Ultra Soft", size: "L", qty: 905, price: "₹123" },
  { code: "WH8747", brand: "Whisper", name: "Whisper Ultra Soft", size: "XXl", qty: 905, price: "₹123" },
  { code: "WH8745", brand: "Whisper", name: "Whisper Ultra Soft", size: "L", qty: 905, price: "₹123" },
  { code: "WH8747", brand: "Whisper", name: "Whisper Ultra Soft", size: "XXl", qty: 905, price: "₹123" },
  { code: "WH8745", brand: "Whisper", name: "Whisper Ultra Soft", size: "L", qty: 905, price: "₹123" },
  { code: "WH8747", brand: "Whisper", name: "Whisper Ultra Soft", size: "XXl", qty: 905, price: "₹123" },
  { code: "WH8745", brand: "Whisper", name: "Whisper Ultra Soft", size: "L", qty: 905, price: "₹123" },
];

export default function BranchProductDetailsPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-16">
      {/* <div className="w-full max-w-5xl"> */}
        <h2 className="text-center text-2xl font-semibold text-[#F25C7A] mb-8 border-b-2 border-b-gray-100 pb-2 tracking-wide">
          <span className="font-bold" style={{ letterSpacing: 1 }}>View&nbsp; Branch Info</span>
        </h2>
        <div className="mb-4 text-[18px] text-[#F25C7A] font-medium">
          Available Product Details:
        </div>
        {/* Desktop Table */}
        <div className="overflow-x-auto rounded border border-gray-200 mb-6 bg-white hidden md:block">
          <table className="min-w-full bg-gray-50">
            <thead>
              <tr className="bg-gray-200 text-sm text-gray-700">
                <th className="px-3 py-2 font-semibold text-left">Sr.No</th>
                <th className="px-3 py-2 font-semibold text-left">Product Code</th>
                <th className="px-3 py-2 font-semibold text-left">Brand</th>
                <th className="px-3 py-2 font-semibold text-left">Product Name</th>
                <th className="px-3 py-2 font-semibold text-left">Size</th>
                <th className="px-3 py-2 font-semibold text-left">Available Quantity</th>
                <th className="px-3 py-2 font-semibold text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((row, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-[#FFF5F7]"
                  } text-sm border-t`}
                >
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{row.code}</td>
                  <td className="px-3 py-2">{row.brand}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.size}</td>
                  <td className="px-3 py-2">
                    {row.qty}
                    <span className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline cursor-pointer">+ Add</span>
                    <span className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline cursor-pointer">-Remove</span>
                  </td>
                  <td className="px-3 py-2">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden mb-6">
          {products.map((row, i) => (
            <div
              key={i}
              className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
            >
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <div>
                  <div className="font-semibold text-gray-900">{row.name}</div>
                  <div className="text-xs text-gray-500">#{row.code}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">{i + 1}</div>
              </div>
              <div className="px-4 pb-2 text-gray-700">
                <div>
                  <span className="font-semibold">Brand: </span>
                  {row.brand}
                </div>
                <div>
                  <span className="font-semibold">Size: </span>
                  {row.size}
                </div>
                <div>
                  <span className="font-semibold">Available Qty: </span>
                  {row.qty}
                </div>
                <div>
                  <span className="font-semibold">Price: </span>
                  {row.price}
                </div>
              </div>
              <div className="flex gap-4 px-4 pb-4 mt-2 text-[#F25C7A] text-base">
                <button className="font-semibold hover:underline focus:outline-none">
                  + Add
                </button>
                <button className="font-semibold hover:underline focus:outline-none">
                  - Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination and Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
          <div className="text-gray-500 text-sm">
            Showing 1 to 10 of 10 Entries
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled
            >
              Previous
            </button>
            <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
              1
            </span>
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}