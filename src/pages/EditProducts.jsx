import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseurl = import.meta.env.REACT_APP_BASE_URL || "https://api.citycentermall.com";

const EditProduct = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState({
    brands: false,
    categories: false,
    subcategories: false,
    product: false,
  });
  const prevCategoryRef = useRef(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    offerTitle: "",
    discount: "",
    shortDescription: "",
    detailedDescription: "",
    regularPrice: "",
    basePrice: "",
    discountPrice: "",
    stockQuantity: "",
    store_id: "",
    images: [],
    existingImages: [],
  });

  // Fetch dropdown data
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        setLoading((prev) => ({ ...prev, brands: true, categories: true }));
        const brandsResponse = await axios.get(`${baseurl}/api/v1/product-brand`);
        const brandData = brandsResponse?.data?.data || brandsResponse?.data;
        if (isMounted) setBrands(Array.isArray(brandData) ? brandData : []);

        const categoriesResponse = await axios.get(`${baseurl}/api/v1/product-categories`);
        const categoryData = categoriesResponse?.data?.data || categoriesResponse?.data;
        if (isMounted) setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch {
        toast.error("Failed to load dropdown data. Please try again.");
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, brands: false, categories: false }));
        }
      }
    };
    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.category || formData.category === prevCategoryRef.current) return;
      prevCategoryRef.current = formData.category;
      try {
        setLoading((prev) => ({ ...prev, subcategories: true }));
        setSubcategories([]);
        const response = await axios.get(
          `${baseurl}/api/v1/product-subcategory/category/${formData.category}`
        );
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.subcategories)
          ? response.data.subcategories
          : Array.isArray(response.data)
          ? response.data
          : [];
        setSubcategories(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load subcategories. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, subcategories: false }));
      }
    };
    if (formData.category) fetchSubcategories();
  }, [formData.category]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading((prev) => ({ ...prev, product: true }));
      try {
        const res = await axios.get(`${baseurl}/api/v1/product/${id}`);
        const prod = res.data.data || res.data.product || res.data;
        setFormData((prev) => ({
          ...prev,
          name: prod.name || "",
          brand: prod.product_brand_id || prod.brand?.id || prod.brand || "",
          category: prod.category_id || prod.category?.id || prod.category || "",
          subcategory: prod.subcategory_id || prod.subcategory?.id || prod.subcategory || "",
          offerTitle: prod.offer_title || prod.offerTitle || "",
          discount: prod.discount || "",
          shortDescription: prod.product_bullets || prod.shortDescription || "",
          detailedDescription: prod.product_description || prod.detailedDescription || prod.description || "",
          regularPrice: prod.product_base_price || prod.regularPrice || prod.price || prod.product_selling_price || "",
          basePrice: prod.basePrice || prod.product_base_price || "",
          discountPrice: prod.product_selling_price || prod.discountPrice || "",
          stockQuantity: prod.product_stock || prod.stockQuantity || "",
          store_id: prod.creator_store_id || prod.store_id || prev.store_id,
          images: [],
          existingImages: Array.isArray(prod.product_images)
            ? prod.product_images.filter(Boolean)
            : Array.isArray(prod.images)
            ? prod.images.map((img) =>
                typeof img === "string" ? img : img.url || img.path || ""
              ).filter(Boolean)
            : [],
        }));
      } catch {
        toast.error("Failed to load product details.");
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "category") updated.subcategory = "";
      return updated;
    });
  };

  // Remove new image (not uploaded)
  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Remove existing image (already uploaded)
  const handleRemoveExistingImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "brand",
      "category",
      "subcategory",
      "basePrice",
      "discountPrice",
      "stockQuantity",
      "store_id",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    if (
      (!formData.images || formData.images.length === 0) &&
      (!formData.existingImages || formData.existingImages.length === 0)
    ) {
      toast.error("Please select at least one product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("basePrice", Number(formData.basePrice));
      data.append("discountPrice", Number(formData.discountPrice));
      data.append("stockQuantity", Number(formData.stockQuantity));
      data.append("store_id", formData.store_id);
      if (formData.regularPrice) data.append("regularPrice", Number(formData.regularPrice));
      if (formData.offerTitle) data.append("offerTitle", formData.offerTitle);
      if (formData.discount) data.append("discount", Number(formData.discount));
      if (formData.shortDescription) data.append("shortDescription", formData.shortDescription);
      if (formData.detailedDescription) data.append("detailedDescription", formData.detailedDescription);

      // Append new images
      formData.images.forEach((img) => {
        data.append("images", img);
      });
      // Append existing image URLs
      formData.existingImages.forEach((imgUrl) => {
        data.append("existingImages", imgUrl);
      });

      const response = await axios.put(
        `${baseurl}/api/v1/product/${id}/update-product`,
        data,
        {
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data.success === true ||
        response.data.message === "Product updated successfully"
      ) {
        toast.success("Product updated successfully!");
        navigate("/productList");
      } else {
        const msg =
          typeof response.data.message === "string"
            ? response.data.message
            : "Failed to update product.";
        toast.error(msg);
      }
    } catch (error) {
      let errorMessage = "Failed to update product";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server responded with ${error.response.status}`;
        if (error.response.data?.errors) {
          const errorList = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          errorMessage += `\nValidation errors:\n${errorList}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Check your connection.";
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setFormData((prev) => ({
      ...prev,
      name: "",
      category: "",
      subcategory: "",
      brand: "",
      offerTitle: "",
      discount: "",
      shortDescription: "",
      detailedDescription: "",
      regularPrice: "",
      basePrice: "",
      discountPrice: "",
      stockQuantity: "",
      images: [],
      existingImages: [],
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    prevCategoryRef.current = null;
  };

  // Render images (existing and new uploads)
  function renderImagePreview() {
    return (
      <div className="flex gap-2 overflow-x-auto w-full h-full">
        {/* Existing images */}
        {formData.existingImages &&
          formData.existingImages.map((imgUrl, idx) => (
            <div key={"ex-" + idx} className="relative h-full flex items-center">
              <img
                src={imgUrl}
                alt={`Existing Product ${idx}`}
                className="object-cover w-52 h-32 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        {/* New images */}
        {formData.images &&
          formData.images.map((img, idx) => (
            <div key={idx} className="relative h-full flex items-center">
              <img
                src={URL.createObjectURL(img)}
                alt={`Product ${idx}`}
                className="object-cover w-52 h-32 rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-18 relative">
      <div className="fixed top-0 left-0 right-0 z-30 md:ml-64">
        <Navbar screenName="Edit Product" />
      </div>
      <h1 className="text-2xl font-bold text-[#2F5383] mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Basic Information</h2>
            <input
              name="name"
              type="text"
              placeholder="Product name*"
              className="input-field mb-3 w-full p-2 border border-gray-300 rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="mb-3 bg-white text-black">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand*
              </label>
              <select
                name="brand"
                className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white"
                value={formData.brand}
                onChange={handleChange}
                required
                disabled={loading.brands}
              >
                <option value="" className="text-gray-400">
                  Select Brand
                </option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id} className="text-black">
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              {loading.brands && (
                <p className="text-xs text-gray-500 mt-1">Loading brands...</p>
              )}
            </div>
            <textarea
              name="shortDescription"
              placeholder="Short description"
              className="w-full p-2 border border-gray-300 rounded h-20 mb-3"
              value={formData.shortDescription}
              onChange={handleChange}
            />
            <textarea
              name="detailedDescription"
              placeholder="Detailed description"
              className="w-full p-2 border border-gray-300 rounded h-24"
              value={formData.detailedDescription}
              onChange={handleChange}
            />
          </div>
          {/* Product Images */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Product Images</h2>
            <label className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center h-40 cursor-pointer">
              <input
                type="file"
                name="images"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                multiple
              />
              {renderImagePreview()}
            </label>
          </div>
        </div>
        {/* Pricing */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="font-semibold mb-2">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base price*</label>
              <input
                name="basePrice"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.basePrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular price</label>
              <input
                name="regularPrice"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.regularPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount price</label>
              <input
                name="discountPrice"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.discountPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">stockQuantity</label>
              <input
                name="stockQuantity"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.stockQuantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                name="discount"
                type="number"
                min={0}
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Categories */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="font-semibold mb-2">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                name="category"
                className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading.categories}
              >
                <option value="" className="text-gray-400 bg-white">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-gray-700">
                    {category.category}
                  </option>
                ))}
              </select>
              {loading.categories && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading categories...
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                name="subcategory"
                className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={!formData.category || loading.subcategories}
              >
                <option value="" className="text-gray-400">
                  Select Subcategory
                </option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id} className="text-gray-700">
                    {sub.name}
                  </option>
                ))}
              </select>
              {loading.subcategories && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading subcategories...
                </p>
              )}
              {formData.category && subcategories.length === 0 && !loading.subcategories && (
                <p className="text-xs text-gray-500 mt-1">
                  No subcategories available
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer title</label>
              <input
                name="offerTitle"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.offerTitle}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="bg-[#2F5383] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#2F5383] disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          <button
            onClick={handleDiscard}
            className="border px-4 py-2  cursor-pointer rounded text-red-600 hover:bg-red-50"
            type="button"
          >
            Discard
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EditProduct;