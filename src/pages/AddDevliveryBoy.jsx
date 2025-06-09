import React, { useState } from "react";
import { useAuth } from "../components/AuthContext"; // Ensure this provides  token

export default function AddRunnerForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    isAvailable: true,
    current_location: { latitude: "", longitude: "" },
    state: "",
    pin_code: "",
    contact_no: "",
    vehicleType: "",
    vehicleNumber: "",
    drivingLicenseNo: "",
    aadharNumber: "",
    account_no: "",
    account_holder_name: "",
    bank_name: "",
    IFSC_code: "",
    branch_name: "",
    UPI_id: "",
  });

  // File inputs state
  const [licenseImage, setLicenseImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [personalImage, setPersonalImage] = useState(null);
  const [policeVerification, setPoliceVerification] = useState(null);

  // Get token from context or fallback to localStorage
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isAvailable") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "latitude" || name === "longitude") {
      setFormData({
        ...formData,
        current_location: {
          ...formData.current_location,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file input changes
  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send multipart/form-data
    const data = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "current_location") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    // Append files if they exist
    if (licenseImage) data.append("licenseImage", licenseImage);
    if (aadharImage) data.append("aadharImage", aadharImage);
    if (personalImage) data.append("personalImage", personalImage);
    if (policeVerification) data.append("policeVerification", policeVerification);

    try {
      const response = await fetch(
        "https://api.citycentermall.com/api/v1/super-admin/register/runner",
        {
          method: "POST",
          headers: {
            Authorization: storedToken ? `Bearer ${storedToken}` : undefined,
            // Do NOT set 'Content-Type' header for FormData! The browser will set it.
          },
          body: data,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Runner registered successfully!");
        // Reset form after success
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          address: "",
          city: "",
          isAvailable: true,
          current_location: { latitude: "", longitude: "" },
          state: "",
          pin_code: "",
          contact_no: "",
          vehicleType: "",
          vehicleNumber: "",
          drivingLicenseNo: "",
          aadharNumber: "",
          account_no: "",
          account_holder_name: "",
          bank_name: "",
          IFSC_code: "",
          branch_name: "",
          UPI_id: "",
        });
        setLicenseImage(null);
        setAadharImage(null);
        setPersonalImage(null);
        setPoliceVerification(null);
      } else {
        alert("Failed to register runner: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while registering runner.");
    }
  };
  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-16 ">
    <h2 className="text-center text-pink-600 font-semibold text-lg mb-8">Add Delivery Boy</h2>
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm font-medium mb-1">First Name *</label>
        <input name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter First Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Last Name *</label>
        <input name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Last Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Email" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address *</label>
        <input name="address" required value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Address" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City *</label>
        <input name="city" required value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter City" />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Is Available?</label>
        <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Current Location Latitude *</label>
        <input type="number" step="any" name="latitude" required value={formData.current_location.latitude} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Latitude" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Current Location Longitude *</label>
        <input type="number" step="any" name="longitude" required value={formData.current_location.longitude} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Longitude" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State *</label>
        <input name="state" required value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter State" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pin Code *</label>
        <input type="number" name="pin_code" required value={formData.pin_code} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Pin Code" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contact Number *</label>
        <input name="contact_no" required value={formData.contact_no} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Contact Number" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Vehicle Type *</label>
        <input name="vehicleType" required value={formData.vehicleType} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Vehicle Type" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Vehicle Number *</label>
        <input name="vehicleNumber" required value={formData.vehicleNumber} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Vehicle Number" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Driving License Number *</label>
        <input name="drivingLicenseNo" required value={formData.drivingLicenseNo} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter DL Number" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Aadhar Number *</label>
        <input name="aadharNumber" required value={formData.aadharNumber} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Aadhar Number" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bank Account Number *</label>
        <input name="account_no" required value={formData.account_no} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Account Number" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Account Holder Name *</label>
        <input name="account_holder_name" required value={formData.account_holder_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Holder Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bank Name *</label>
        <input name="bank_name" required value={formData.bank_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Bank Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">IFSC Code *</label>
        <input name="IFSC_code" required value={formData.IFSC_code} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter IFSC" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Branch Name *</label>
        <input name="branch_name" required value={formData.branch_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter Branch Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">UPI ID *</label>
        <input name="UPI_id" required value={formData.UPI_id} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none" placeholder="Enter UPI ID" />
      </div>

      {/* File Inputs */}
      <div>
        <label className="block text-sm font-medium mb-1">Driving License Image *</label>
        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setLicenseImage)} className="w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Aadhar Card Image *</label>
        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setAadharImage)} className="w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Personal Photo *</label>
        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPersonalImage)} className="w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Police Verification Certificate Image *</label>
        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPoliceVerification)} className="w-full" />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
        >
          Register Runner
        </button>
      </div>
    </form>
  </div>
);
}