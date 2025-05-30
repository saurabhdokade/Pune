import React from "react";

// Demo data
const customer = {
  name: "Jane Cooper",
  gender: "Male",
  phone: "+919876543210",
  address: "4517 Washington Ave. Manchester, Kentucky 39495",
  img: "https://randomuser.me/api/portraits/men/1.jpg",
};

const previousOrders = [
  {
    date: "10/01/2025",
    product: "Whisper Ultra Soft",
    quantity: "10",
    price: "₹123",
    total: "₹1230 (Cash)",
  },
  {
    date: "27/10/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Online)",
  },
  {
    date: "17/03/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Cash)",
  },
  {
    date: "10/01/2025",
    product: "Whisper Ultra Soft",
    quantity: "10",
    price: "₹123",
    total: "₹1230 (Cash)",
  },
  {
    date: "27/10/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Online)",
  },
  {
    date: "17/03/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Cash)",
  },
  {
    date: "10/01/2025",
    product: "Whisper Ultra Soft",
    quantity: "10",
    price: "₹123",
    total: "₹1230 (Cash)",
  },
  {
    date: "27/10/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Online)",
  },
  {
    date: "17/03/2024",
    product: "Whisper Ultra Soft",
    quantity: "05",
    price: "₹123",
    total: "₹615 (Cash)",
  },
];

export default function ViewCustomerInfo() {
  return (
    <div className="min-h-screen bg-[#faf9fb] py-8 px-2 md:px-8 font-sans p-6 mb-4 mt-14 ">
      {/* <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 md:p-8"> */}
        <h2 className="text-pink-500 font-semibold text-xl md:text-2xl mb-10">
          View Customer Info
        </h2>
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12 mb-6">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-base md:text-lg">Full Name:</span>
              <span className="text-base">{customer.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-base md:text-lg">Gender</span>
              <span className="text-base">{customer.gender}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-base md:text-lg">Phone Number:</span>
              <span className="text-base">{customer.phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-base md:text-lg">Address:</span>
              <span className="text-base">{customer.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-6 md:mt-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-pink-200 flex items-center justify-center overflow-hidden shadow">
              <img
                src={customer.img}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-pink-500 font-semibold text-lg mb-4">
            Previous Order Details:
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden border border-pink-200 text-xs md:text-sm">
              <thead>
                <tr className="bg-pink-200 text-pink-700">
                  <th className="py-2 px-2 md:px-4 font-semibold">SL.No</th>
                  <th className="py-2 px-2 md:px-4 font-semibold">Date</th>
                  <th className="py-2 px-2 md:px-4 font-semibold">Product Name</th>
                  <th className="py-2 px-2 md:px-4 font-semibold">Quantity</th>
                  <th className="py-2 px-2 md:px-4 font-semibold">Price</th>
                  <th className="py-2 px-2 md:px-4 font-semibold">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {previousOrders.map((order, idx) => (
                  <tr key={idx} className="even:bg-pink-50">
                    <td className="py-2 px-2 md:px-4 text-center">{idx + 1}</td>
                    <td className="py-2 px-2 md:px-4">{order.date}</td>
                    <td className="py-2 px-2 md:px-4">{order.product}</td>
                    <td className="py-2 px-2 md:px-4">{order.quantity}</td>
                    <td className="py-2 px-2 md:px-4">{order.price}</td>
                    <td className="py-2 px-2 md:px-4">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    // </div>
  );
}