import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Adjust path if needed

const EditPrivacy = () => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Fetch existing privacy policy on mount
  useEffect(() => {
    const fetchPrivacy = async () => {
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
        if (res.data?.policy?.content) {
          setContent(res.data.policy.content);
        }
      } catch (err) {
        console.error("Failed to fetch privacy policy:", err.response?.data || err.message);
        alert("Error loading Privacy Policy.");
      }
    };
    fetchPrivacy();
  }, [token]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const accessToken = token || localStorage.getItem("access_token");

      const res = await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/privacy-policy/upsert",
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Saved Privacy Policy:", res.data);
      alert("Privacy Policy updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save privacy policy:", err.response?.data || err.message);
      alert("Error updating Privacy Policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-20 bg-gray-50 px-4 py-10 md:px-20">
      <div className="bg-white p-6 rounded-xl shadow-md mx-auto">
        <h1 className="text-center text-pink-600 text-2xl font-semibold mb-4">
          Edit Privacy Policy
        </h1>
        <p className="text-pink-500 text-lg font-medium mb-2">Privacy Policy</p>

        {isEditing ? (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="mb-6 bg-white"
          />
        ) : (
          <div
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EditPrivacy;