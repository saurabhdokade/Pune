import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

// Util: Format ISO date to dd/mm/yyyy hh:mm
const formatDate = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const toRupees = (val) => (val == null ? "N/A" : `₹${val}`);

// Utility for brand name
const getBrandName = (product) => {
  if (product?.brand?.brand_name) return product.brand.brand_name;
  if (product?.brand_name) return product.brand_name;
  if (product?.product_brand?.brand_name) return product.product_brand.brand_name;
  if (product?.product_brand_id?.brand_name) return product.product_brand_id.brand_name;
  return "N/A";
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(
        `https://api.citycentermall.com/api/v1/super-admin/productdetails/${id}`,
        {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        }
      )
      .then((res) => {
        if (res.data?.product) setProduct(res.data.product);
        else setError("Product not found.");
      })
      .catch(() => setError("An error occurred while fetching product details."))
      .finally(() => setLoading(false));
  }, [id, storedToken]);

  // Helper: get main image
  const getProductImage = (p) => {
    if (p?.product_images && p.product_images.length > 0) return p.product_images[0];
    return "https://via.placeholder.com/300x300.png?text=No+Image";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
        <div className="text-pink-600 text-lg font-semibold">Loading...</div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
        <div className="text-red-600 text-lg">{error || "No product found."}</div>
        <div className="mt-8">
          <button
            className="px-4 cursor-pointer py-2 bg-pink-500 text-white rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Product info
  const brand = getBrandName(product);
  const productDescription =
    product.product_description ||
    product.description ||
    product.product_bullets ||
    "N/A";
  const productSubType =
    product.variant_name ||
    product.subcategory?.name ||
    "N/A";
  const productImage = getProductImage(product);

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-18 relative">
      <h1 className="text-center text-pink-600 font-bold text-2xl mb-8">
        View Product Details
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 bg-white rounded-xl shadow p-6">
        {/* Details */}
        <div className="space-y-6 text-gray-800 text-sm">
          <div>
            <span className="font-semibold">Product ID:</span> {product.id || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Product Name:</span> {product.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Brand:</span> {brand}
          </div>
          <div>
            <span className="font-semibold">Category:</span> {product.category?.category || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Subcategory:</span> {product.subcategory?.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Product Sub Type:</span> {productSubType}
          </div>
          <div>
            <span className="font-semibold">Product Description:</span>
            <p className="mt-1 text-justify text-gray-700">
              {productDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="font-semibold">Size:</span> N/A
            </div>
            <div>
              <span className="font-semibold">Quantity in Each Pack:</span> N/A
            </div>
            <div>
              <span className="font-semibold">Base Price:</span> {toRupees(product.basePrice || product.product_base_price)}
            </div>
            <div>
              <span className="font-semibold">Selling Price:</span> {toRupees(product.product_selling_price)}
            </div>
            <div>
              <span className="font-semibold">Available Product Quantity:</span> {product.product_stock ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">Created At:</span> {formatDate(product.created_at)}
            </div>
            <div>
              <span className="font-semibold">Updated At:</span> {formatDate(product.updated_at)}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {product.status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Discount:</span> {product.discount ? product.discount + "%" : "N/A"}
            </div>
          </div>
        </div>
        {/* Product Image in right extra space */}
        <div className="flex flex-col items-center justify-start md:justify-top">
          <img
            src={productImage}
            alt="Product"
            style={{ background: "#f5f5f5", maxHeight: 260 }}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="px-4 cursor-pointer py-2 bg-pink-500 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;