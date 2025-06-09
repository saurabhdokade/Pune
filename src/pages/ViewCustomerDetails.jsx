import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { FaEye } from "react-icons/fa";

// Helper to format date
const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};
const toRupees = (val) => (val == null ? "-" : `₹${val}`);

export default function ViewCustomerInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Get previous orders from customer object if available
  const previousOrders = customer?.orders?.length
    ? customer.orders.map((order) => {
        // Get first item of order_item for product info
        const item = order.order_item?.[0] || {};
        const product = item.product || {};
        return {
          orderId: order.id, // Added orderId field here
          date: formatDate(order.date_added),
          product: item.product_name || product.name || "-",
          quantity: item.quantity || "-",
          price: toRupees(item.price),
          total: toRupees(order.total) + ` (${order.payment_method || "-"})`,
          status: order.status || "-",
          productImage:
            product.product_images && product.product_images.length
              ? product.product_images[0]
              : null,
        };
      })
    : [];

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
          {/* Previous Orders */}
          <div className="mt-10">
            <h3 className="text-pink-500 font-semibold text-lg mb-4">
              Previous Order Details:
            </h3>
            {previousOrders.length === 0 ? (
              <div className="text-gray-400">No previous orders found.</div>
            ) : (
              <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-800 hidden md:table">
                  <thead>
                    <tr className="bg-pink-200 text-pink-700">
                      <th className="py-2 px-2 md:px-4 font-semibold">SL.No</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Order ID</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Date</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Product Image</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Product Name</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Quantity</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Price</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Total Price</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Status</th>
                      <th className="py-2 px-2 md:px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousOrders.map((order, idx) => (
                      <tr key={idx} className="even:bg-pink-50">
                        <td className="py-2 px-2 md:px-4 text-center">{idx + 1}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.orderId || "-"}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.date}</td>
                        <td className="py-2 px-2 md:px-4 text-center">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt={order.product}
                              className="w-12 h-12 object-contain rounded mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.product}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.quantity}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.price}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.total}</td>
                        <td className="py-2 px-2 md:px-4 text-center">{order.status}</td>
                        <td className="py-2 px-2 md:px-4 text-center">
                          <button
                            onClick={() => navigate(`/vieworderdetails/${order.orderId}`)}
                            className="text-pink-600 cursor-pointer hover:text-pink-800 transition"
                            title="View Order Details"
                          >
                            <FaEye className="inline-block text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-400 py-10">Customer not found.</div>
      )}
    </div>
  );
}