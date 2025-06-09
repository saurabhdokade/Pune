import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // adjust path if needed
 
const AboutCard = () => {
  const navigate = useNavigate();
  const [aboutContent, setAboutContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
 
  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const accessToken = token || localStorage.getItem("access_token");
 
        if (!accessToken) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
 
        const res = await axios.get(
          "https://api.citycentermall.com/api/v1/super-admin/aboutUs",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
 
        if (res.data.success && res.data.about) {
          setAboutContent(res.data.about.content || "");
          setImageUrl(res.data.about.imageUrl || "");
        } else {
          setError("Failed to load About Us content");
        }
      } catch (err) {
        console.error("Failed to fetch About Us:", err.response?.data || err.message);
        setError("Failed to load About Us. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchAboutUs();
  }, [token]);
 
  return (
    <div className="bg-white p-6 rounded shadow-sm border mb-6 min-h-[200px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">About Us</h2>
 
      {loading ? (
        <p className="text-sm text-gray-500">Loading About Us...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          <div
            className="text-sm text-gray-600 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="About Us"
              className="mt-4 max-w-xs rounded"
            />
          )}
        </>
      )}
 
      <button
        onClick={() => navigate("/editabout")}
        className="mt-4 border border-pink-500 text-pink-600 px-6 py-2 rounded hover:bg-pink-50 transition"
      >
        Edit
      </button>
    </div>
  );
};
 
export default AboutCard;
 