import React from "react";
 
const deliveryBoy = {
  fullName: "John",
  email: "Johndoel23@gmail.com",
  phone: "+919776583210",
  userId: "john_12345",
  password: "john@123",
  address: "4517 Washington Ave. Manchester, Kentucky 39495",
  branch: "Supply Wing",
  img: "https://randomuser.me/api/portraits/men/1.jpg",
};
 
export default function ViewDeliveryBoyInfo() {
  return (
    <div className="min-h-screen bg-[#faf9fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-pink-600 text-center mb-8">
          Delivery Boy Information
        </h2>
 
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-pink-300 overflow-hidden shadow-lg">
              <img
                src={deliveryBoy.img}
                alt={deliveryBoy.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
 
          {/* Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <InfoItem label="Full Name" value={deliveryBoy.fullName} />
            <InfoItem label="Email" value={deliveryBoy.email} />
            <InfoItem label="Phone Number" value={deliveryBoy.phone} />
            <InfoItem label="User ID" value={deliveryBoy.userId} />
            <InfoItem label="Password" value={deliveryBoy.password} />
            <InfoItem label="Branch" value={deliveryBoy.branch} />
            <div className="sm:col-span-2">
              <InfoItem label="Address" value={deliveryBoy.address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}