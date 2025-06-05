import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import Navbar from "../components/Navbar";

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

const dummyOrders = [
  { id: "9B76HD545E1884", date: "10/03/2025", status: "Delivered" },
  { id: "9B76HD545E1883", date: "28/02/2025", status: "In Process" },
  { id: "9B76HD545E1882", date: "20/02/2025", status: "Cancelled" },
  { id: "9B76HD545E1881", date: "15/02/2025", status: "Delivered" },
  { id: "9B76HD545E1880", date: "10/02/2025", status: "In Process" },
  { id: "9B76HD545E1879", date: "05/02/2025", status: "Delivered" },
  { id: "9B76HD545E1878", date: "01/02/2025", status: "Cancelled" },
  { id: "9B76HD545E1877", date: "28/01/2025", status: "Delivered" },
  { id: "9B76HD545E1876", date: "20/01/2025", status: "In Process" },
  { id: "9B76HD545E1875", date: "15/01/2025", status: "Cancelled" },
  { id: "9B76HD545E1874", date: "10/01/2025", status: "Delivered" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "text-green-500";
    case "In Process":
      return "text-yellow-500";
    case "Cancelled":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const PAGE_SIZE = 10;

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = dummyOrders
    .filter((order) =>
      order.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.date.split("/").reverse().join("/")) -
          new Date(b.date.split("/").reverse().join("/"))
        : new Date(b.date.split("/").reverse().join("/")) -
          new Date(a.date.split("/").reverse().join("/"))
    );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedFiltered = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans p-6 mb-4 mt-14">
      <Navbar />
      <div className="mx-auto w-full">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-[#EB627D] font-semibold text-xl">Order List</h2>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white text-sm"
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
        {/* Branch Filter */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Branch
          </label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
          >
            {branches.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table for Desktop */}
        <div className="rounded-xll shadow bg-white border hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead>
                <tr className="bg-pink-600 text-white">
                  <th className="font-semibold py-3 px-4 bg-[#EB627D] rounded-tll-xll">Sr. No.</th>
                  <th className="font-semibold py-3 bg-[#EB627D] px-4 rounded-tll-xll">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSortAsc(!sortAsc)}
                    >
                      Date <span>{sortAsc ? "↑" : "↓"}</span>
                    </div>
                  </th>
                  <th className="font-semibold py-3 bg-[#EB627D] px-4 text-center">Order ID</th>
                  <th className="font-semibold py-3 bg-[#EB627D] px-4">Order Status</th>
                  <th className="font-semibold py-3 bg-[#EB627D] px-4 rounded-tr-xll">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedFiltered.map((order, index) => (
                  <tr
                    key={order.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-pink-50"}
                  >
                    <td className="py-3 px-4 text-center font-semibold">
                      {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4 text-center">{order.id}</td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-pink-500">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
                {pagedFiltered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
            <div className="text-gray-500 text-sm mb-2 md:mb-0">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Entries
            </div>
            <div className="flex gap-2">
              <button
                className="border border-pink-300 cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                disabled={page === 1}
                onClick={handlePrev}
              >
                Previous
              </button>
              <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
                {page}
              </span>
              <button
                className="border border-pink-300 cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {pagedFiltered.length === 0 && (
            <div className="text-center text-gray-500 py-6">No orders found.</div>
          )}
          {pagedFiltered.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-xl mb-4 shadow border border-pink-100 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-pink-400">
                  #{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                </span>
                <button className="text-pink-500" title="View">
                  <FaEye />
                </button>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-base">{order.date}</div>
                <div className="text-xs text-gray-500">{order.id}</div>
                <div className={`font-medium mt-1 text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
            <div className="text-gray-500 text-sm mb-2 md:mb-0">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Entries
            </div>
            <div className="flex gap-2">
              <button
                className="border border-pink-300 cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                disabled={page === 1}
                onClick={handlePrev}
              >
                Previous
              </button>
              <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
                {page}
              </span>
              <button
                className="border border-pink-300 cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={handleNext}
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

export default OrderList;