import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

const BranchList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line
  }, [page, limit]);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(
        `https://api.citycentermall.com/api/v1/super-admin/getallseller?page=${page}&limit=${limit}`
      );
      const { data, totalPages } = response.data;
      setSellers(data || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const filtered = sellers
    .filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a.name?.localeCompare(b.name) : b.name?.localeCompare(a.name)
    );

  const handleRedirect = () => {
    navigate("/addbranch");
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    // Only increment if not on last page
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  // Show branch filter but do not filter API, just demo
  // You can filter sellers by branch if your API supports it

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-14">
      <Navbar />
      <div className=" mx-auto w-full">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8 mt-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Seller List
          </h2>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white text-sm"
              placeholder="Search sellers..."
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

        {/* Branch Filter Dropdown */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 font-medium mb-1">
              Select Branch
            </label>
            <button
              onClick={handleRedirect}
              className="bg-[#EB627D] hover:bg-[#d9506d] text-white font-medium rounded-md px-8 py-2 text-base"
            >
              + Add
            </button>
          </div>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border border-gray-200 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white mt-2"
          >
            {branches.map((b) => (
              <option value={b.value} key={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seller Table */}
        <div className="rounded-xl shadow bg-white overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800 hidden md:table">
            <thead>
              <tr className="bg-[#EB627D] text-white">
                <th className="font-semibold py-3 px-4 rounded-tl-xl">Sr. No.</th>
                <th className="font-semibold py-3 px-4 flex items-center gap-2">
                  Full Name
                  <button
                    onClick={() => setSortAsc((prev) => !prev)}
                    className="text-white"
                    aria-label="Sort"
                    type="button"
                  >
                    {sortAsc ? "↑" : "↓"}
                  </button>
                </th>
                <th className="font-semibold py-3 px-4">Email</th>
                <th className="font-semibold py-3 px-4">Phone</th>
                <th className="font-semibold py-3 px-4 rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}
                >
                  <td className="py-3 px-4 text-center font-semibold">
                    {String((page - 1) * limit + i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4 font-medium">{c.name || "N/A"}</td>
                  <td className="py-3 px-4 text-center">{c.email || "N/A"}</td>
                  <td className="py-3 px-4 text-center">{c.mobile_no || "N/A"}</td>
                  <td className="py-3 px-4 text-left flex gap-2">
                    <button
                      className="text-blue-500  cursor-pointer"
                      onClick={() => navigate(`/view-branch-info/${c.id}`)}
                      title="View"
                      type="button"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-yellow-500  cursor-pointer"
                      onClick={() => navigate(`/editbranch/${c.id}`)}
                      title="Edit"
                      type="button"
                    >
                      <FaEdit />
                    </button>
                    <button className="text-red-500  cursor-pointer" type="button" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300  cursor-pointer rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300  cursor-pointer rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchList;