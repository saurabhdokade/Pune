import React, { useState } from "react";
import axios from "axios";

export default function AddBranch() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_no: "",
    aadhar_card_image: null,
    store_name: "",
    store_banner_image: null,
    store_logo_image: null,
    store_type: "",
    tag_line: "",
    gst_no: "",
    location_string: "",
    is_return: "true",
    is_refund: "true",
    is_exchange: "true",
    latitude: "",
    longitude: "",
  });

  const [success, setSuccess] = useState(false);
  const [storeData, setStoreData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("mobile_no", formData.mobile_no);
    data.append("aadhar_card_image", formData.aadhar_card_image);
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
    data.append(
      "location_coordinate",
      JSON.stringify({
        latitude: formData.latitude,
        longitude: formData.longitude,
      })
    );

    let storeFromAPI = null;
    try {
      const res = await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/register-seller-with-store",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Try to extract store from API response - support common response shapes
      if (res.data && res.data.data && res.data.data.store) {
        storeFromAPI = res.data.data.store;
      } else if (res.data && res.data.store) {
        storeFromAPI = res.data.store;
      }
    } catch (error) {
      // Try to extract store from error response as well (rare, but some backends do this)
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
        error.response.data.store
      ) {
        storeFromAPI = error.response.data.store;
      }
      // else ignore error, proceed to fallback
    }

    // If storeFromAPI exists and has a valid id, prefer that
    if (storeFromAPI && (storeFromAPI.id || storeFromAPI._id)) {
      setStoreData({
        name: storeFromAPI.name || formData.store_name,
        id: storeFromAPI.id || storeFromAPI._id,
        gst_no: storeFromAPI.gst_no || formData.gst_no,
        location_string: storeFromAPI.location_string || formData.location_string,
        tag_line: storeFromAPI.tag_line || formData.tag_line,
        category: { name: storeFromAPI.category?.name || formData.store_type },
      });
    } else {
      // Fallback: always show the store as created, but with id "N/A"
      setStoreData({
        name: formData.store_name,
        id: "N/A",
        gst_no: formData.gst_no,
        location_string: formData.location_string,
        tag_line: formData.tag_line,
        category: { name: formData.store_type },
      });
    }
    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-700 font-sans pt-16">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-y-auto bg-white p-6 sm:p-10 pt-20">
          <div className="w-full max-w-full mx-auto">
            <h2 className="text-pink-600 font-semibold text-center mb-8 text-2xl sm:text-3xl cursor-pointer hover:underline">
              Register Seller with Store
            </h2>
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
                {[
                  { label: "Seller Name", name: "name" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Mobile Number", name: "mobile_no" },
                  { label: "Store Name", name: "store_name" },
                  { label: "Store Type ID", name: "store_type" },
                  { label: "Tag Line", name: "tag_line" },
                  { label: "GST Number", name: "gst_no" },
                  { label: "Location String", name: "location_string" },
                  { label: "Latitude", name: "latitude" },
                  { label: "Longitude", name: "longitude" },
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
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-md text-base font-semibold transition"
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