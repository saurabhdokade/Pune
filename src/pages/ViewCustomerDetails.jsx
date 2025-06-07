import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // <-- Import Auth context

// Placeholder for Previous Orders (since API does not provide orders for customer)
const previousOrders = [
  {
    date: "10/01/2025",
    product: "Whisper Ultra Soft",
    quantity: "10",
    price: "₹123",
    total: "₹1230 (Cash)",
  },
  {
    date: "27/10/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Online)",
  },
  {
    date: "17/03/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Cash)",
  },
];

export default function ViewCustomerInfo() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get token from context or localStorage
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/super-admin/customers/${id}`,
          {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
          }
        );
        setCustomer(res.data?.data || res.data);
      } catch (e) {
        setCustomer(null);
      }
      setLoading(false);
    }
    if (id) fetchCustomer();
  }, [id, storedToken]);

  return (
    <div className="min-h-screen bg-[#faf9fb] py-8 px-2 md:px-8 font-sans p-6 mb-4 mt-14 ">
      <h2 className="text-pink-500 font-semibold text-xl md:text-2xl mb-10">
        View Customer Info
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : customer ? (
        <>
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 mb-6">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Full Name:</span>
                <span className="text-base">{customer.name || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Email:</span>
                <span className="text-base">{customer.email || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Phone Number:</span>
                <span className="text-base">{customer.mobile_no || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Address:</span>
                <span className="text-base">{customer.location || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Verified:</span>
                <span className="text-base">
                  {customer.is_verified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold text-base md:text-lg">Role:</span>
                <span className="text-base">{customer.role || "-"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-pink-200 flex items-center justify-center overflow-hidden shadow">
                <img
                  // No image in API, fallback to random avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    customer.name || "User"
                  )}&background=EB627D&color=fff`}
                  alt={customer.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* Previous Orders (Replace with real data if API available) */}
          <div className="mt-10">
            <h3 className="text-pink-500 font-semibold text-lg mb-4">
              Previous Order Details:
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden border border-pink-200 text-xs md:text-sm">
                <thead>
                  <tr className="bg-pink-200 text-pink-700">
                    <th className="py-2 px-2 md:px-4 font-semibold">SL.No</th>
                    <th className="py-2 px-2 md:px-4 font-semibold">Date</th>
                    <th className="py-2 px-2 md:px-4 font-semibold">Product Name</th>
                    <th className="py-2 px-2 md:px-4 font-semibold">Quantity</th>
                    <th className="py-2 px-2 md:px-4 font-semibold">Price</th>
                    <th className="py-2 px-2 md:px-4 font-semibold">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {previousOrders.map((order, idx) => (
                    <tr key={idx} className="even:bg-pink-50">
                      <td className="py-2 px-2 md:px-4 text-center">{idx + 1}</td>
                      <td className="py-2 px-2 md:px-4 text-center">{order.date}</td>
                      <td className="py-2 px-2 md:px-4 text-center">{order.product}</td>
                      <td className="py-2 px-2 md:px-4 text-center">{order.quantity}</td>
                      <td className="py-2 px-2 md:px-4 text-center">{order.price}</td>
                      <td className="py-2 px-2 md:px-4 text-center">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-400 py-10">Customer not found.</div>
      )}
    </div>
  );
}