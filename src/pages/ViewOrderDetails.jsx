import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const formatDate = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()} ${d.getHours()}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

const toRupees = (val) => (val == null ? "N/A" : `₹${val}`);

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get token from context or localStorage
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.citycentermall.com/api/v1/super-admin/getorderdetails/${orderId}`,
        {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        }
      )
      .then((res) => {
        if (res.data?.order) {
          setOrder(res.data.order);
        } else if (Array.isArray(res.data?.orders)) {
          setOrder(res.data.orders[0] || null);
        } else {
          setOrder(null);
        }
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, storedToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9fb] py-8 px-2 md:px-8 font-sans p-6 mb-4 mt-14">
        <h1 className="text-center text-pink-600 font-bold text-2xl mb-8">
          View Order Details
        </h1>
        <div className="text-center py-8 text-gray-400">
          Loading order details...
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf9fb] py-8 px-2 md:px-8 font-sans p-6 mb-4 mt-14">
        <h1 className="text-center text-pink-600 font-bold text-2xl mb-8">
          View Order Details
        </h1>
        <div className="text-center py-8 text-red-400">Order not found.</div>
        <div className="text-center">
          <button
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
            onClick={() => navigate(-1)}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // User Data
  const user = order.user || {};
  // Vendor Data
  const vendor = order.vendor || {};
  // Address Data
  const address = order.address || {};
  // First Order Item
  const item = order.order_item && order.order_item.length
    ? order.order_item[0]
    : {};

  // Product Data
  const product = item.product || {};

  // Brand, Subtype, Description
  const productBrand =
    product.product_brand_id ||
    product.brand ||
    (product.product_brand ? product.product_brand.name : "") ||
    "N/A";
  const productDescription =
    product.product_description ||
    product.description ||
    product.product_bullets ||
    item.product_description ||
    "N/A";
  const productSubType =
    item.variant_name ||
    product.variant_name ||
    "N/A";

  // Product Image
  const productImage =
    (product.product_images && product.product_images.length
      ? product.product_images[0]
      : null) ||
    "https://cdn.pixabay.com/photo/2016/12/06/18/27/bag-1883177_1280.jpg";

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-18 relative">
      <h1 className="text-center text-pink-600 font-bold text-2xl mb-8">
        View Order Details
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 bg-white rounded-xl shadow p-6">
        {/* Details */}
        <div className="space-y-6 text-gray-800 text-sm">
          <div>
            <span className="font-semibold">Order ID:</span> {order.id || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Date Added:</span>{" "}
            {formatDate(order.date_added)}
          </div>
          <div>
            <span className="font-semibold">Order Status:</span>{" "}
            {order.status || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Payment Status:</span>{" "}
            {order.payment_status || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Customer Info:</span>
            <div className="ml-4 mt-1">
              Name: {user.name || "N/A"}
              <br />
              Mobile: {user.mobile_no || order.mobile || "N/A"}
              <br />
              Email: {user.email || order.email || "N/A"}
              <br />
              Address:{" "}
              {address.address || address.location || user.location || "N/A"}
            </div>
          </div>
          <div>
            <span className="font-semibold">Branch Info:</span>
            <div className="ml-4 mt-1">
              Name: {vendor.name || "N/A"}
              <br />
              Mobile: {vendor.mobile_no || "N/A"}
              <br />
              Email: {vendor.email || "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Product Code:</span>{" "}
              {item.product_id || product.id || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Product Brand:</span>{" "}
              {productBrand}
            </div>
            <div>
              <span className="font-semibold">Product Name:</span>{" "}
              {item.product_name || product.name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Product Sub Type:</span>{" "}
              {productSubType}
            </div>
          </div>
          <div>
            <span className="font-semibold">Product Description:</span>
            <p className="mt-1 text-justify text-gray-700">
              {productDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="font-semibold">Size:</span>{" "}
              {item.size || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Order Quantity:</span>{" "}
              {item.quantity || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Price:</span>{" "}
              {toRupees(item.price)}
            </div>
            <div>
              <span className="font-semibold">Delivery Type:</span>{" "}
              {order.delivery_type || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Grand Total:</span>{" "}
              {toRupees(order.total)}
            </div>
            <div>
              <span className="font-semibold">Order Status:</span>{" "}
              {order.status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Payment Mode:</span>{" "}
              {order.payment_method || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Reason:</span>{" "}
              {order.reason || "N/A"}
            </div>
          </div>
        </div>
        {/* Product Image in right extra space */}
        <div className="flex flex-col items-center justify-start md:justify-top">
          <img
            src={productImage}
            alt="Product"
            // className="w-full max-w-xs rounded shadow object-contain"
            style={{ background: "#f5f5f5", maxHeight: 260 }}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="px-4 cursor-pointer py-2 bg-pink-500 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;

