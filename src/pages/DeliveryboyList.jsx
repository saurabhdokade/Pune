import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const deliveryBoys = [
  {
    id: 1,
    name: "Amit Singh",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 2,
    name: "Vishal",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 3,
    name: "Anil Pabbi Ap",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    id: 4,
    name: "Ramapati Tiwari",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    id: 5,
    name: "Ramapati Tiwari",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

const DeliveryBoyList = () => {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [page] = useState(1);

  const filtered = deliveryBoys
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    
    <div className="min-h-screen bg-[#faf9fb] py-8 px-2 md:px-8 font-sans p-6 mb-4 mt-14 ">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Delivery Boy List
          </h2>
          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white text-sm"
                placeholder="Search here..."
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={8} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
              </svg>
            </div>
            <button className="bg-pink-400 hover:bg-pink-500 transition text-white font-medium rounded-md px-8 py-2 text-base mt-2 md:mt-0">
              + Add
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Branch
          </label>
          <div className="relative w-full md:w-80">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white"
            >
              {branches.map((b) => (
                <option value={b.value} key={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="rounded-xl shadow bg-white border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead>
                <tr className="bg-pink-400 text-white">
                  <th className="font-semibold py-3 px-4 rounded-tl-xl">Sr. No.</th>
                  <th className="font-semibold py-3 px-4 cursor-pointer select-none flex items-center gap-2">
                    <span>Full Name</span>
                    <button
                      onClick={() => setSortAsc((v) => !v)}
                      className="ml-1 text-white"
                      aria-label="Sort Name"
                    >
                      <span className="inline-block align-middle">
                        ↑↓
                      </span>
                    </button>
                  </th>
                  <th className="font-semibold py-3 px-4">Email Address</th>
                  <th className="font-semibold py-3 px-4">Phone Number</th>
                  <th className="font-semibold py-3 px-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-pink-50"}`}
                  >
                    <td className="py-3 px-4 text-center font-semibold text-gray-700">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-3 font-medium">
                      <img
                        src={d.img}
                        alt={d.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      {d.name}
                    </td>
                    <td className="py-3 px-4">{d.email}</td>
                    <td className="py-3 px-4">{d.phone}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-3 text-pink-400 text-lg">
                        <button title="View">
                          <FaEye />
                        </button>
                        <button title="Edit">
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      No delivery boys found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
            <div className="text-gray-500 text-sm mb-2 md:mb-0">
              Showing 1 to {filtered.length} of {filtered.length} Entries
            </div>
            <div className="flex gap-2">
              <button
                className="border border-pink-300 rounded px-3 py-1 text-pink-400 hover:bg-pink-50 transition text-sm"
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="border border-pink-300 rounded px-3 py-1 text-pink-400 bg-pink-50 text-sm">
                {page}
              </span>
              <button
                className="border border-pink-300 rounded px-3 py-1 text-pink-400 hover:bg-pink-50 transition text-sm"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyList;