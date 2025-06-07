import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    location: "",
    mobile_no: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/super-admin/customers/${id}`
        );
        const data = res.data?.data || res.data;
        setCustomer({
          name: data.name || "",
          location: data.location || "",
          mobile_no: data.mobile_no || "",
        });
        setError("");
      } catch (e) {
        setError("Could not fetch customer details.");
        console.error(e);
      }
      setLoading(false);
    }
    if (id) fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setCustomer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Only send the relevant fields as JSON!
      const data = {
        name: customer.name,
        location: customer.location,
        mobile_no: customer.mobile_no,
      };

      // DEBUG: log data before sending
      console.log("Submitting data:", data);

      // Use PUT or PATCH based on backend requirement (try PUT first if your API says so)
      const res = await axios.put(
        `https://api.citycentermall.com/api/v1/super-admin/customers/${id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Update response:", res);

      setSaving(false);
      navigate("/customers");
    } catch (err) {
      setSaving(false);
      setError(
        err.response?.data?.message ||
        "Failed to update customer. Please try again."
      );
      console.error("Update error:", err.response || err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans p-6 mb-4 mt-14">
      <Navbar />
      <div className="flex items-center mb-6">
        <button
          className="mr-2 cursor-pointer text-2xl text-gray-600 hover:text-pink-500"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          ←
        </button>
        <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
          Edit Customer Info
        </h2>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md py-2 px-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              name="location"
              value={customer.location}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md py-2 px-4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="mobile_no"
              value={customer.mobile_no}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md py-2 px-4"
              required
            />
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#fa6788] cursor-pointer hover:bg-pink-600 px-6 py-2 text-white rounded-md font-semibold transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}