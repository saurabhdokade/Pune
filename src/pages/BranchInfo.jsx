import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// Dummy delivery boys
const deliveryBoys = [
  {
    userId: "UK_RIDER",
    name: "Kamal Verma",
    email: "example@gmail.com",
    phone: "+919876543210",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
  },
  {
    userId: "B,_Kumar",
    name: "Bijak Kumar",
    email: "example@gmail.com",
    phone: "+919876543210",
    address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
  },
  {
    userId: "Akash_s",
    name: "Akash Sharma",
    email: "example@gmail.com",
    phone: "+919876543210",
    address: "6391 Elgin St. Celina, Delaware 10299",
  },
];

export default function BranchInfo() {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [branchProducts, setBranchProducts] = useState([]);
  const [productError, setProductError] = useState("");

  // Fetch seller info and products
  useEffect(() => {
    async function fetchSeller() {
      setLoading(true);
      setError("");
      setProductError("");
      try {
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/super-admin/getsellerinfo/${sellerId}`
        );
        const info = res.data?.data || null;
        setSellerInfo(info);

        // Map products from API, or show product not found if none
        const products =
          info?.store?.products && info.store.products.length > 0
            ? info.store.products.map((p, i) => ({
                id: p.id || `P${i + 1}`,
                code: p.id ? p.id.slice(-6).toUpperCase() : `P${i + 1}`,
                brand: "Brand",
                name: p.name || "N/A",
                size: "N/A",
                qty: p.product_stock ?? 0,
                price: p.product_selling_price
                  ? `₹${p.product_selling_price}`
                  : "N/A",
                offer_title: p.offer_title || "N/A",
                discount: p.discount || 0,
                image: Array.isArray(p.product_images) ? p.product_images[0] : "",
              }))
            : [];
        setBranchProducts(products);
        if (!products.length) setProductError("Product not found.");
      } catch (err) {
        setError("Could not fetch branch info.");
        setSellerInfo(null);
        setBranchProducts([]);
        setProductError("Product not found.");
      }
      setLoading(false);
    }
    if (sellerId) fetchSeller();
    else {
      setSellerInfo(null);
      setBranchProducts([]);
      setProductError("Product not found.");
      setLoading(false);
    }
  }, [sellerId]);

  // Handler for vendor dashboard navigation
  const handleVendorDashboard = () => {
    // Replace '/vendordashboard' with your vendor dashboard route, and pass the sellerId in the URL
    navigate(`/vendordashboard/${sellerId}`);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-16">
      <Navbar />
      <div className="flex justify-end mb-4">
        <button
          className="bg-[#EB627D] cursor-pointer hover:bg-[#d9506d] text-white font-medium rounded-md px-6 py-2 text-base"
          onClick={handleVendorDashboard}
        >
         View More Info-(Dashboard)
        </button>
      </div>
      <h2 className="text-center text-2xl font-semibold text-[#F25C7A] mb-8 border-b-2 border-b-gray-100 pb-2 tracking-wide">
        <span className="font-bold" style={{ letterSpacing: 1 }}>
          View&nbsp; Branch Info
        </span>
      </h2>

      {/* Seller & Store Info */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="text-center text-red-500 py-2 font-semibold">{error}</div>
          )}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Seller Name:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.seller?.name || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Seller Email:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.seller?.email || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Seller Phone:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.seller?.mobile_no || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Store Name:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.store?.name || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Store Category:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.store?.category?.name || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">GST No:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.store?.gst_no || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Store Address:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              {sellerInfo?.store?.location_string || "N/A"}
            </span>
          </div>
          {/* Dummy Pin Codes */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="font-semibold text-lg">Service Pin Code:</span>
            <span className="sm:ml-4 text-base mt-1 sm:mt-0">
              39495, 32564, 54698, 48744
            </span>
          </div>

          {/* Delivery Boy Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">Available Delivery Boy:</span>
              <button
                onClick={() => navigate("/branchdeliveryboytable")}
                className="text-[#F25C7A] text-sm cursor-pointer font-medium hover:underline"
                type="button"
              >
                See all
              </button>
            </div>
            {/* Table for md+ */}
            <div className="overflow-x-auto rounded border border-gray-200 hidden md:block">
              <table className="min-w-full bg-gray-50 text-sm">
                <thead>
                  <tr className="bg-[#F25C7A] text-white">
                    <th className="px-4 py-3 font-semibold text-left">Sr.No</th>
                    <th className="px-4 py-3 font-semibold text-left">User ID</th>
                    <th className="px-4 py-3 font-semibold text-left">Delivery Boy Name</th>
                    <th className="px-4 py-3 font-semibold text-left">Email Address</th>
                    <th className="px-4 py-3 font-semibold text-left">Phone Number</th>
                    <th className="px-4 py-3 font-semibold text-left">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryBoys.map((row, i) => (
                    <tr key={row.userId} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{row.userId}</td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.phone}</td>
                      <td className="px-4 py-3 truncate max-w-[180px]">{row.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden">
              {deliveryBoys.map((row, i) => (
                <div
                  key={row.userId}
                  className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
                >
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{row.name}</div>
                      <div className="text-xs text-gray-500">#{row.userId}</div>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">{i + 1}</div>
                  </div>
                  <div className="px-4 pb-2 text-gray-700">
                    <div>
                      <span className="font-semibold">Email: </span>
                      {row.email}
                    </div>
                    <div>
                      <span className="font-semibold">Phone: </span>
                      {row.phone}
                    </div>
                    <div>
                      <span className="font-semibold">Address: </span>
                      <span className="break-words">{row.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">Available Product Details:</span>
              <button
                onClick={() => navigate(`/branchproduct/${sellerId}`)}
                className="text-[#F25C7A]  cursor-pointer text-sm font-medium hover:underline"
                type="button"
              >
                See all
              </button>
            </div>
            {productError && (
              <div className="text-red-500 font-semibold py-5 text-center">{productError}</div>
            )}
            {/* Table for md+ */}
            {branchProducts.length > 0 && (
              <div className="overflow-x-auto rounded border border-gray-200 mb-6 bg-white hidden md:block">
                <table className="min-w-full bg-gray-50 text-sm">
                  <thead>
                    <tr className="bg-[#F25C7A] text-white">
                      <th className="px-4 py-3 font-semibold text-left">Sr.No</th>
                      <th className="px-4 py-3 font-semibold text-left">Product Code</th>
                      <th className="px-4 py-3 font-semibold text-left">Brand</th>
                      <th className="px-4 py-3 font-semibold text-left">Product Name</th>
                      <th className="px-4 py-3 font-semibold text-left">Size</th>
                      <th className="px-4 py-3 font-semibold text-left">Available Quantity</th>
                      <th className="px-4 py-3 font-semibold text-left">Price</th>
                      <th className="px-4 py-3 font-semibold text-left">Offer Title</th>
                      <th className="px-4 py-3 font-semibold text-left">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchProducts.map((row, i) => (
                      <tr key={row.code || row.id || i} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">{row.code}</td>
                        <td className="px-4 py-3">{row.brand}</td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.size}</td>
                        <td className="px-3 py-2">
                          {row.qty}
                          <span className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline cursor-pointer">+ Add</span>
                          <span className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline cursor-pointer">-Remove</span>
                        </td>
                        <td className="px-4 py-3">{row.price}</td>
                        <td className="px-4 py-3">{row.offer_title}</td>
                        <td className="px-4 py-3">{row.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Mobile Card View */}
            {branchProducts.length > 0 && (
              <div className="md:hidden">
                {branchProducts.map((row, i) => (
                  <div
                    key={row.code || row.id || i}
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
                      <div>
                        <span className="font-semibold">Offer: </span>
                        {row.offer_title}
                      </div>
                      <div>
                        <span className="font-semibold">Discount: </span>
                        {row.discount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
            <div className="text-gray-500 text-sm mb-2 md:mb-0">
              Showing 1 to {deliveryBoys.length} of {deliveryBoys.length} Delivery Boys &amp; 1 to {branchProducts.length} of {branchProducts.length} Products
            </div>
            <div className="flex gap-2">
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