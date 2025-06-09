import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // adjust path if needed
 
const PrivacyCard = () => {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
 
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const accessToken = token || localStorage.getItem("access_token");
 
        const res = await axios.get(
          "https://api.citycentermall.com/api/v1/super-admin/getprivacypolicy",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
 
        setPolicy(res.data?.policy?.content || "");
      } catch (err) {
        console.error("Failed to fetch policy:", err.response?.data || err.message);
        setError("Failed to load privacy policy. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchPolicy();
  }, [token]);
 
  return (
    <div className="bg-white p-6 rounded shadow-sm border mb-6 min-h-[200px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Privacy Policy</h2>
 
      {loading ? (
        <p className="text-sm text-gray-500">Loading privacy policy...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div
          className="text-sm text-gray-600 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: policy }}
        />
      )}
 
      <button
        onClick={() => navigate("/editprivacy")}
        className="mt-4 border border-pink-500 text-pink-600 px-6 py-2 rounded hover:bg-pink-50 transition"
      >
        Edit
      </button>
    </div>
  );
};
 
export default PrivacyCard;