import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

// Pagination settings
const PAGE_SIZE = 10;

const CustomerList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.citycentermall.com/api/v1/super-admin/customers"
        );
        let customerData = [];
        if (Array.isArray(response.data)) {
          customerData = response.data;
        } else if (Array.isArray(response.data.data)) {
          customerData = response.data.data;
        } else if (
          response.data.customers &&
          Array.isArray(response.data.customers)
        ) {
          customerData = response.data.customers;
        }
        setCustomers(customerData);
      } catch (error) {
        setCustomers([]);
        toast.error("Failed to load customers. Please try again.");
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setDeletingId(id);
    try {
      await axios.delete(
        `https://api.citycentermall.com/api/v1/super-admin/customers/${id}`
      );
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer. Please try again."
      );
    }
    setDeletingId(null);
  };

  // Filtered and sorted data
  const filtered = customers
    .filter((c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedFiltered = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Ensure current page is valid when filtering/searching
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
      <ToastContainer position="top-right" autoClose={2000} />
      <Navbar />
      <div className="max-w-6xl mx-auto w-full">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8 mt-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Customer List
          </h2>
          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
          <label className="block text-gray-700 font-medium mb-2">
            Select Branch
          </label>
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
          </div>
        </div>
        {/* Responsive Table */}
        <div className="rounded-xll shadow bg-white overflow-x-auto">
          {loading ? (
            <div className="py-6 text-center text-gray-400">
              Loading customers...
            </div>
          ) : (
            <>
              {/* Table for md+ */}
              <table className="min-w-full text-sm text-gray-800 hidden md:table">
                <thead>
                  <tr className="bg-[#EB627D] text-white">
                    <th className="font-semibold py-3 px-4 rounded-tl-xll">
                      Sr. No.
                    </th>
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
                    <th className="font-semibold py-3 px-4">Email</th>
                    <th className="font-semibold py-3 px-4">Phone Number</th>
                    <th className="font-semibold py-3 px-4">Address</th>
                    <th className="font-semibold py-3 px-4 rounded-tr-xll text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedFiltered.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-pink-50"}`}
                    >
                      <td className="py-3 px-4 text-center font-semibold text-gray-700">
                        {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3 px-4 flex items-center gap-3 font-medium">
                        <img
                          src={`https://randomuser.me/api/portraits/men/${((page - 1) * PAGE_SIZE + i) % 5 + 1}.jpg`}
                          alt={c.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        {c.name || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">{c.email || "-"}</td>
                      <td className="py-3 px-4 text-center">{c.mobile_no || "-"}</td>
                      <td className="py-3 px-4 truncate max-w-xs text-center">
                        {c.location || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-3 text-[#EB627D] text-lg">
                          <button
                            title="View"
                            className="cursor-pointer"
                            onClick={() => navigate(`/viewdetails/${c.id}`)}
                          >
                            <FaEye />
                          </button>
                          <button
                            title="Edit"
                            className="cursor-pointer"
                            onClick={() => navigate(`/editcustomers/${c.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            title="Delete"
                            className="cursor-pointer"
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                          >
                            {deletingId === c.id ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pagedFiltered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Mobile Card View */}
              <div className="md:hidden">
                {pagedFiltered.length === 0 && (
                  <div className="py-6 text-center text-gray-400">
                    No customers found.
                  </div>
                )}
                {pagedFiltered.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
                  >
                    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                      <img
                        src={`https://randomuser.me/api/portraits/men/${((page - 1) * PAGE_SIZE + i) % 5 + 1}.jpg`}
                        alt={c.name || "User"}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {c.name || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-2 text-gray-700">
                      <div>
                        <span className="font-semibold">Email: </span>
                        {c.email || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Phone: </span>
                        {c.mobile_no || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Address: </span>
                        <span className="break-words">{c.location || "-"}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 px-4 pb-4 mt-2 text-[#EB627D] text-xl">
                      <button
                        title="View"
                        onClick={() => navigate(`/viewdetails/${c.id}`)}
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => navigate(`/editcustomers/${c.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Footer */}
        <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Entries
          </div>
          <div className="flex gap-2">
            <button
              className="border border-pink-300  cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled={page === 1}
              onClick={handlePrev}
            >
              Previous
            </button>
            <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
              {page}
            </span>
            <button
              className="border border-pink-300  cursor-pointer rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={handleNext}
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