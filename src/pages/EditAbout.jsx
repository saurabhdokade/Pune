import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Adjust path if needed

const EditAboutUs = () => {
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [images, setImages] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState(""); // Store the existing image URL

  // Fetch existing About Us content and image on mount
  useEffect(() => {
    const fetchAboutUs = async () => {
      setLoading(true);
      setError("");
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
        if (res.data?.about) {
          setContent(res.data.about.content || "");
          setExistingImageUrl(res.data.about.imageUrl || "");
        }
      } catch (err) {
        console.error("Error loading About Us:", err.response?.data || err.message);
        setError("Failed to load About Us. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
    // eslint-disable-next-line
  }, [token]);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleAddImage = () => {
    setImages([...images, null]);
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const accessToken = token || localStorage.getItem("access_token");
      if (!accessToken) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("content", content);

      // Only send first non-null image (your original logic)
      const firstImage = images.find(img => img !== null);
      if (firstImage) {
        formData.append("image", firstImage);
      } else if (!existingImageUrl) {
        // If existing image was removed and no new image, send removeImage flag
        formData.append("removeImage", "true");
      }

      const res = await axios.post(
        "https://api.citycentermall.com/api/v1/super-admin/aboutUs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if ((res.status === 201 || res.status === 200) && res.data.about) {
        setContent(res.data.about.content || content);
        setExistingImageUrl(res.data.about.imageUrl || "");
        setSuccess("About Us updated successfully!");
        setIsEditing(false);
        setImages([null]);
      } else {
        setError("Failed to update About Us");
      }
    } catch (err) {
      console.error("Error updating About Us:", err.response?.data || err.message);
      setError("Failed to update About Us. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-20 bg-gray-50 px-4 py-10 md:px-20">
      <div className="bg-white p-6 rounded-xl shadow-md mx-auto max-w-4xl">
        <h1 className="text-center text-pink-600 text-2xl font-semibold mb-4">
          Edit About Us
        </h1>
        <p className="text-pink-500 text-lg font-medium mb-2">About Us</p>

        {loading && <p className="text-blue-600 mb-2">Saving changes...</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

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

        {/* Show existing image if present */}
        {isEditing && existingImageUrl && (
          <div className="mb-2 flex items-center">
            <img
              src={existingImageUrl}
              alt="About Us"
              className="max-h-24 rounded border mr-4"
              style={{ maxWidth: "180px" }}
            />
            <button
              type="button"
              onClick={handleRemoveExistingImage}
              className="text-red-500 text-sm font-medium hover:underline"
              disabled={loading}
            >
              Remove Image
            </button>
          </div>
        )}

        {/* Show existing image in view mode */}
        {!isEditing && existingImageUrl && (
          <img
            src={existingImageUrl}
            alt="About Us"
            className="mt-4 max-w-xs rounded"
          />
        )}

        {isEditing && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold mb-2">Image (Optional)</p>
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(idx, e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                  disabled={loading}
                />
                {img && (
                  <span className="text-sm ml-2 text-green-600">✔ {img.name}</span>
                )}
              </div>
            ))}
            <button
              onClick={handleAddImage}
              className="text-pink-500 text-sm font-medium hover:underline"
              disabled={loading}
            >
              +Add More Image
            </button>
          </div>
        )}

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200"
          disabled={loading}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default EditAboutUs;