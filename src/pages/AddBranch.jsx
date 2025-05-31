//branch info
 
 
import React, { useState } from "react";
 
export default function AddBranch() {
  const [formData, setFormData] = useState({
    branchName: "",
    managerName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Submit formData to your backend here
  };
 
  return (
    <div className="flex min-h-screen bg-white text-gray-700 font-sans pt-16">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-y-auto bg-white p-6 sm:p-10 pt-20">
          <div className="w-full max-w-full mx-auto">
            <h2 className="text-pink-600 font-semibold text-center mb-8 text-2xl sm:text-3xl cursor-pointer hover:underline">
              Add Branch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div>
                <label className="block text-sm font-medium mb-2">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  placeholder="Enter Branch Name"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Branch Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  placeholder="Enter Branch Manager Name"
                  value={formData.managerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium mb-2">Full Address</label>
                <textarea
                  name="address"
                  placeholder="Enter Full Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
 
              <div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-md text-base font-semibold transition"
                >
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}