import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: null,
    userType: "",
  });
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      message: "",
      image: null,
      userType: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message || !formData.userType) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("message", formData.message);
      if (formData.image) {
        payload.append("image", formData.image);
      }
      payload.append("userType", formData.userType);

      const res = await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/super-admin/send",
        payload,
        {
          headers: {
            Authorization: storedToken ? `Bearer ${storedToken}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success("Notification sent successfully."); // <-- GREEN success message
        handleReset();
      } else {
        toast.success(res.data.message || "Failed to send notification.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "An error occurred while sending notification."
      );
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto p-6 pt-20 mt-12 bg-white rounded shadow">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-lg font-semibold text-pink-600 mb-6">Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Notification Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Notification Title"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Notification Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter Notification Message"
            className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-pink-600"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Image (Optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Select Users Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600"
            required
          >
            <option value="">Select</option>
            <option value="USER">User</option>
            <option value="VENDOR">Vendor</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white px-6 py-2 cursor-pointer rounded hover:bg-pink-700 transition duration-300"
          >
            {loading ? "Sending..." : "Send"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-6 cursor-pointer py-2 rounded hover:bg-gray-300 transition"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;