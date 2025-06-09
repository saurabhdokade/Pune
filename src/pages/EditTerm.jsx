import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; // Adjust path if needed
 
const EditTerms = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const accessToken = token || localStorage.getItem("access_token");
        const response = await axios.get(
          "https://api.citycentermall.com/api/v1/super-admin/getTermcondition",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data?.terms?.content) {
          setContent(response.data.terms.content);
        }
      } catch (err) {
        console.error("❌ Failed to fetch terms:", err.response?.data || err.message);
        alert("❌ Unable to load Terms & Conditions.");
      }
    };

    fetchTerms();
  }, [token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const accessToken = token || localStorage.getItem("access_token");
      await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/terms/condition",
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Terms & Conditions updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Failed to update terms:", err.response?.data || err.message);
      alert("❌ Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full pt-20 px-4 py-10 md:px-20">
      <div className="bg-white p-6 rounded-xl shadow-md mx-auto">
        <h1 className="text-center text-pink-600 text-2xl font-semibold mb-4">
          Edit Terms & Conditions
        </h1>
        <p className="text-pink-500 text-lg font-medium mb-2">Terms & Conditions</p>

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
          className={`bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};
 
export default EditTerms;