import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const customers = [
  {
    id: 1,
    name: "Jacob Jones",
    email: "example@gmail.com",
    phone: "+919876543210",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Esther Howard",
    phone: "+919876555210",
    email: "example@gmail.com",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Cody Fisher",
    phone: "+916276543210",
    email: "example@gmail.com",
    img: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Darrell Steward",
    phone: "+919876003210",
    email: "example@gmail.com",
    img: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Dianne Russell",
    phone: "+919876567710",
    email: "example@gmail.com",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

const CustomerList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [page] = useState(1);

  // Filtered and sorted data
  const filtered = customers
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    // <div className="min-h-screen bg-[#F6F8FB] p-2 md:p-4 font-sans p-6 mb-4 mt-14 ">
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-14">

      <Navbar />
      <div className="max-w-6xl mx-auto w-full">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8 mt-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Delivery Boy List

          </h2>
          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white text-sm"
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
        </div>
        {/* Branch Select */}
        <div className="mb-4">
          <div className="mb-1">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 font-medium mb-1">
                Select Branch
              </label>
              <button className="bg-[#EB627D] hover:bg-[#EB627D] transition text-white font-medium rounded-md px-8 py-2 text-base mt-2 md:mt-0">
                + Add
              </button>
            </div>
          </div>
          <div className="relative w-full md:w-288">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white"
            >
              {branches.map((b) => (
                <option value={b.value} key={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {/* <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg> */}
          </div>
        </div>
        {/* Responsive Table */}
        <div className="rounded-xll shadow bg-white overflow-x-auto">
          {/* Table for md+ */}
          <table className="min-w-full text-sm text-gray-800 hidden md:table">
            <thead>
              <tr className="bg-[#EB627D] text-white">
                <th className="font-semibold py-3 px-4 rounded-tl-xll">Sr. No.</th>
                <th className="font-semibold py-3 px-4 cursor-pointer select-none flex items-center gap-2">
                  <span>Full Name</span>
                  <button
                    onClick={() => setSortAsc((v) => !v)}
                    className="ml-1 text-white"
                    aria-label="Sort Name"
                  >
                    <span className="inline-block align-middle">↑↓</span>
                  </button>
                </th>
                <th className="font-semibold py-3 px-4">Email Address</th>
                  <th className="font-semibold py-3 px-4">Phone Number</th>
                <th className="font-semibold py-3 px-4 rounded-tr-xll text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-pink-50"}`}
                >
                  <td className="py-3 px-4 text-center font-semibold text-gray-700">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3 font-medium">
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    {c.name}
                  </td>
                  <td className="py-3 px-4 text-center">{c.email}</td>
                  <td className="py-3 px-4 truncate max-w-xs text-center">{c.phone}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-3 text-[#EB627D] text-lg">
                      <button
                        title="View"
                        onClick={() => navigate(`/viewdetails/`)}
                      >
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
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filtered.length === 0 && (
              <div className="py-6 text-center text-gray-400">
                No customers found.
              </div>
            )}
            {filtered.map((c, i) => (
              <div
                key={c.id}
                className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
              >
                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">#{String(i + 1).padStart(2, "0")}</div>
                  </div>
                </div>
                <div className="px-4 pb-2 text-gray-700">
                  <div>
                    <span className="font-semibold">Phone: </span>
                    {c.phone}
                  </div>
                  <div>
                    <span className="font-semibold">Address: </span>
                    <span className="break-words">{c.address}</span>
                  </div>
                </div>
                <div className="flex gap-4 px-4 pb-4 mt-2 text-[#EB627D] text-xl">
                  <button
                    title="View"
                    onClick={() => navigate(`/viewdetails/`)}
                  >
                    <FaEye />
                  </button>
                  <button title="Edit">
                    <FaEdit />
                  </button>
                  <button title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">
            Showing 1 to {filtered.length} of {filtered.length} Entries
          </div>
          <div className="flex gap-2">
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
              {page}
            </span>
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;