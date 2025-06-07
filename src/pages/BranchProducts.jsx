import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // <-- Import your auth context

export default function BranchProductDetailsPage() {
  const { sellerId } = useParams(); // expect route as /branchproduct/:sellerId
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // For pagination display
  const [total, setTotal] = useState(0);

  // Get token from context or localStorage
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        // Fetch seller info for products
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/super-admin/getsellerinfo/${sellerId}`,
          {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
          }
        );
        const storeProducts = res.data?.data?.store?.products || [];
        // Map products to table fields with fallbacks
        const mapped =
          storeProducts.length > 0
            ? storeProducts.map((prod, i) => ({
                code: prod.code || prod.id || `P${i + 1}`,
                brand: prod.brand || "N/A",
                name: prod.name || "N/A",
                size: prod.size || "N/A",
                qty: prod.product_stock ?? 0,
                price: prod.product_selling_price
                  ? `₹${prod.product_selling_price}`
                  : "N/A",
              }))
            : [];
        setProducts(mapped);
        setTotal(mapped.length);
        if (storeProducts.length === 0) {
          setError("Product not found.");
        }
      } catch (e) {
        setError("Could not fetch product details.");
        setProducts([]);
        setTotal(0);
      }
      setLoading(false);
    }
    if (sellerId) fetchProducts();
    else {
      setProducts([]);
      setTotal(0);
      setLoading(false);
    }
  }, [sellerId, storedToken]);

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans p-6 mb-4 mt-16">
      <Navbar />
      <h2 className="text-center text-2xl font-semibold text-[#F25C7A] mb-8 border-b-2 border-b-gray-100 pb-2 tracking-wide">
        <span className="font-bold" style={{ letterSpacing: 1 }}>
          View&nbsp; Branch Info
        </span>
      </h2>
      <div className="mb-4 text-[18px] text-[#F25C7A] font-medium">
        Available Product Details:
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error && products.length === 0 ? (
        <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-red-500 font-semibold">
          Product not found.
        </div>
      ) : (
        <>
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
                      <span className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline cursor-pointer">- Remove</span>
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
              Showing 1 to {products.length} of {total} Entries
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
        </>
      )}
    </div>
  );
}