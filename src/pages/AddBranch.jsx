import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseurl = import.meta.env.REACT_APP_BASE_URL || "https://api.citycentermall.com";

import { useAuth } from "../components/AuthContext";
// Helper to decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}
export default function AddBranch() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_no: "",
    aadhar_card_image: null,
    location_coordinate: "",
    store_name: "",
    store_banner_image: null,
    store_logo_image: null,
    store_type: "",
    tag_line: "",
    gst_no: "",
    location_string: "",
    is_return: "true",
    is_refund: "true",
    is_exchange: "true"
  });

  // Category dropdown
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Error & success
  const [success, setSuccess] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState("");

  const { user, token } = useAuth();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    } else {
      const storedToken = token || localStorage.getItem("access_token");
      if (storedToken) {
        const payload = decodeJWT(storedToken);
        setUserName(
          payload.name ||
          payload.fullName ||
          payload.username ||
          payload.mobile_no ||
          "Admin"
        );
      } else {
        setUserName("Admin");
      }
    }
  }, [user, token]);


  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const storedToken = token || localStorage.getItem("access_token");

        const res = await axios.get(`${baseurl}/api/v1/store-category`,
           {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
          }
        );
        let cats = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(cats);
      } catch {
        setCategories([]);
      }
      setCategoriesLoading(false);
    };
    fetchCategories();
  }, [token]);

  // Get location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setFormData(prev => ({
          ...prev,
          location_coordinate: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        }));
        toast.success("Location coordinates filled!");
      },
      () => {
        toast.error("Unable to retrieve your location.");
      }
    );
  };

  // Input/file change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate required fields
    const requiredFields = [
      "name", "email", "password", "mobile_no", "aadhar_card_image",
      "location_coordinate", "store_name", "store_banner_image", "store_logo_image",
      "store_type", "tag_line", "gst_no", "location_string", "is_return", "is_refund", "is_exchange"
    ];
    for (let field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) {
        setError(`Please fill all fields. Missing: ${field.replace(/_/g, " ")}`);
        toast.error(`Please fill all fields. Missing: ${field.replace(/_/g, " ")}`);
        return;
      }
    }

    // Prepare form data for API
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("mobile_no", formData.mobile_no);
    data.append("aadhar_card_image", formData.aadhar_card_image);
    data.append("location_coordinate", formData.location_coordinate);
    data.append("store_name", formData.store_name);
    data.append("store_banner_image", formData.store_banner_image);
    data.append("store_logo_image", formData.store_logo_image);
    data.append("store_type", formData.store_type);
    data.append("tag_line", formData.tag_line);
    data.append("gst_no", formData.gst_no);
    data.append("location_string", formData.location_string);
    data.append("is_return", formData.is_return);
    data.append("is_refund", formData.is_refund);
    data.append("is_exchange", formData.is_exchange);

    let storeFromAPI = null;
    let errorApiMsg = "";
    try {
      const res = await axios.post(
        `${baseurl}/api/v1/super-admin/register-seller-with-store`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data && res.data.data && res.data.data.store) {
        storeFromAPI = res.data.data.store;
      } else if (res.data && res.data.store) {
        storeFromAPI = res.data.store;
      } else if (res.data && res.data.message) {
        errorApiMsg = res.data.message;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.data &&
        error.response.data.data.store
      ) {
        storeFromAPI = error.response.data.data.store;
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorApiMsg = error.response.data.message;
      } else {
        errorApiMsg = "Unknown error occurred.";
      }
    }

    if (storeFromAPI && (storeFromAPI.id || storeFromAPI._id)) {
      setStoreData({
        name: storeFromAPI.name || formData.store_name,
        id: storeFromAPI.id || storeFromAPI._id,
        gst_no: storeFromAPI.gst_no || formData.gst_no,
        location_string: storeFromAPI.location_string || formData.location_string,
        tag_line: storeFromAPI.tag_line || formData.tag_line,
        category: {
          name:
            (storeFromAPI.category && storeFromAPI.category.name) ||
            (categories.find((cat) => String(cat.id) === String(formData.store_type))?.name || formData.store_type),
        },
      });
      setSuccess(true);
      toast.success("Seller & Store registered successfully!");
    } else {
      setError(errorApiMsg || "Store not created. Please check all fields and try again.");
      toast.error(errorApiMsg || "Store not created. Please check all fields and try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-700 font-sans pt-16">
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-y-auto bg-white p-6 sm:p-10 pt-20">
          <div className="w-full max-w-full mx-auto">
            <h2 className="text-pink-600 font-semibold text-center mb-8 text-2xl sm:text-3xl cursor-pointer hover:underline">
              Register Seller with Store
            </h2>
            {/* Error message */}
            {error && (
              <div className="text-red-600 font-medium text-sm mb-4 text-center">{error}</div>
            )}
            {success ? (
              <div className="mb-8">
                <div className="text-green-600 font-semibold text-center mb-4 text-xl">
                  Seller registered successfully!
                </div>
                <div className="border border-green-200 bg-green-50 rounded-md p-4 max-w-xl mx-auto">
                  <div className="font-semibold text-lg mb-2 text-green-800">Store Details:</div>
                  <div className="mb-1"><span className="font-bold">Store Name:</span> {storeData?.name || ""}</div>
                  <div className="mb-1"><span className="font-bold">Store ID:</span> {storeData?.id || "N/A"}</div>
                  <div className="mb-1"><span className="font-bold">GST No:</span> {storeData?.gst_no || ""}</div>
                  <div className="mb-1"><span className="font-bold">Location:</span> {storeData?.location_string || ""}</div>
                  <div className="mb-1"><span className="font-bold">Tag Line:</span> {storeData?.tag_line || ""}</div>
                  <div className="mb-1"><span className="font-bold">Category:</span> {storeData?.category?.name || storeData?.category || ""}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">

                {/* Use Current Location */}
                <div className="mb-4 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCurrentLocation}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded shadow"
                  >
                    Use Current Location
                  </button>
                  <input
                    type="text"
                    name="location_coordinate"
                    value={formData.location_coordinate}
                    onChange={handleChange}
                    placeholder='{"latitude":28.123,"longitude":77.456}'
                    required
                    className="border border-gray-300 rounded-md px-4 py-2 text-sm flex-1"
                  />
                </div>

                {/* Seller Fields */}
                {[
                  { label: "Seller Name", name: "name" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Mobile Number", name: "mobile_no" },
                  { label: "Store Name", name: "store_name" },
                  { label: "Tag Line", name: "tag_line" },
                  { label: "GST Number", name: "gst_no" },
                  { label: "Location String", name: "location_string" },
                ].map(({ label, name, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                ))}

                {/* Store Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Store Type</label>
                  {categoriesLoading ? (
                    <div className="text-sm text-gray-400">Loading categories...</div>
                  ) : (
                    <select
                      name="store_type"
                      value={formData.store_type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
                    >
                      <option value="">Select Store Type</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* File Uploads */}
                {[
                  { label: "Aadhar Card Image", name: "aadhar_card_image" },
                  { label: "Store Banner Image", name: "store_banner_image" },
                  { label: "Store Logo Image", name: "store_logo_image" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <input
                      type="file"
                      name={name}
                      onChange={handleChange}
                      accept="image/*"
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    />
                  </div>
                ))}

                {/* Boolean Options */}
                {[
                  { label: "Allow Return", name: "is_return" },
                  { label: "Allow Refund", name: "is_refund" },
                  { label: "Allow Exchange", name: "is_exchange" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                ))}

                <div>
                  <button
                    type="submit"
                    className="w-full cursor-pointer  bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-md text-base font-semibold transition"
                  >
                    Register Seller
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}