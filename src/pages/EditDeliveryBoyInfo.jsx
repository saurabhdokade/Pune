import React, { useState } from "react";

export default function EditDeliveryBoyInfo() {
  const [deliveryBoy, setDeliveryBoy] = useState({
    fullName: "John",
    email: "Johnobel23@gmail.com",
    phone: "+98077658320",
    password: "jbm@123",
    address: "487 Washington Ave. Manchester, Kentucky 38495",
    branch: "Supply Wing",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryBoy((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDeliveryBoy((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send deliveryBoy object via API
    console.log("Form submitted:", deliveryBoy);
  };

  return (
                        <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-14">
                        {/* <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-14"> */}

      {/* <div className="w-full max-w-2xl mt-16 mb-8"> */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#EB627D] mb-6">
          Edit Delivery Boy Info
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-6"
        >
          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 border">
                No Image
              </div>
            )}
            <div className="w-full">
              <label className="block font-semibold mb-1">
                Upload Image (Optional)
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={deliveryBoy.fullName}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="off"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={deliveryBoy.email}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="off"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={deliveryBoy.phone}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={deliveryBoy.password}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                autoComplete="new-password"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block font-semibold mb-1">Select Branch</label>
              <select
                name="branch"
                value={deliveryBoy.branch}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Supply Wing">Supply Wing</option>
                <option value="North Branch">North Branch</option>
                <option value="South Branch">South Branch</option>
                <option value="East Branch">East Branch</option>
                <option value="West Branch">West Branch</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={deliveryBoy.address}
                onChange={handleChange}
                rows="3"
                className="border px-3 py-2 w-full rounded resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#EB627D] hover:bg-pink-600 text-white px-8 py-2 rounded font-medium shadow-md transition"
            >
              Save Info
            </button>
          </div>
        </form>
      {/* </div> */}
    </div>
  );
}