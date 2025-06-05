import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseurl = import.meta.env.REACT_APP_BASE_URL || "https://api.citycentermall.com";

const branches = [
  { value: "supply", label: "Supply Wing" },
  { value: "sales", label: "Sales Wing" },
];

const PAGE_SIZE = 10;

const BranchList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("supply");
  const [sortAsc, setSortAsc] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleting, setDeleting] = useState(null);

  // Delete confirm popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);

  // Fetch sellers from API
  useEffect(() => {
    fetchSellers();
    // eslint-disable-next-line
  }, [page, branch, sortAsc, search]);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(
        `${baseurl}/api/v1/super-admin/getallseller`, {
          params: {
            page,
            limit: PAGE_SIZE,
            branch,
            search
          }
        }
      );
      const { data, total } = response.data;
      setSellers(data || []);
      setTotalRecords(total || 0);
    } catch (error) {
      setSellers([]);
      setTotalRecords(0);
      toast.error("Error fetching sellers");
    }
  };

  // Show popup for delete confirmation
  const handleDeleteClick = (vendorId) => {
    setSellerToDelete(vendorId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!sellerToDelete) return;
    setDeleting(sellerToDelete);
    try {
      const res = await axios.delete(
        `${baseurl}/api/v1/super-admin/delete-seller/${sellerToDelete}`
      );
      toast.success(
        res.data && res.data.message
          ? res.data.message
          : "Seller deleted successfully"
      );
      setShowDeletePopup(false);
      setSellerToDelete(null);
      fetchSellers();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Delete failed";
      toast.error(errMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSellerToDelete(null);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const handleRedirect = () => navigate("/addbranch");

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Table Row numbering
  const rowNumber = (i) => String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0");

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-14 relative">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar />

      {/* Delete Confirmation Popup - NO Black background, just centered box */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div className="relative z-10 bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center border">
            <h4 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Are you sure you want to delete this seller?
            </h4>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-red-600 text-white cursor-pointer px-6 py-2 rounded font-semibold hover:bg-red-700"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="bg-gray-200 cursor-pointer text-gray-800 px-6 py-2 rounded font-semibold hover:bg-gray-300"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8 mt-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Seller List
          </h2>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
              className="bg-[#EB627D] cursor-pointer hover:bg-[#d9506d] text-white font-medium rounded-md px-8 py-2 text-base"
            >
              + Add
            </button>
          </div>
          <select
            value={branch}
            onChange={(e) => { setBranch(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white mt-2"
          >
            {branches.map((b) => (
              <option value={b.value} key={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seller Table Desktop */}
        <div className="rounded-xll shadow bg-white overflow-x-auto hidden md:block">
          <table className="min-w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-[#EB627D] text-white">
                <th className="font-semibold py-3 px-4 rounded-tll-xll">Sr. No.</th>
                <th className="font-semibold py-3 px-4 flex items-center gap-2">
                  Full Name
                  <button
                    onClick={() => { setSortAsc((prev) => !prev); setPage(1); }}
                    className="text-white"
                    aria-label="Sort"
                    type="button"
                  >
                    {sortAsc ? "↑" : "↓"}
                  </button>
                </th>
                <th className="font-semibold py-3 px-4">Email</th>
                <th className="font-semibold py-3 px-4">Phone</th>
                <th className="font-semibold py-3 px-4 text-left rounded-tr-xll ">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.length > 0 ? (
                sellers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}
                  >
                    <td className="py-3 px-4 text-center font-semibold">
                      {rowNumber(i)}
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
                      <button
                        className="text-red-500 cursor-pointer"
                        type="button"
                        title="Delete"
                        onClick={() => handleDeleteClick(c.id)}
                        disabled={deleting === c.id}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Seller List Mobile */}
        <div className="block md:hidden">
          {sellers.length > 0 ? (
            sellers.map((c, i) => (
              <div
                key={c.id}
                className="bg-white rounded-xl mb-4 shadow border border-pink-100 p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-pink-400">
                    #{rowNumber(i)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 cursor-pointer"
                      onClick={() => navigate(`/view-branch-info/${c.id}`)}
                      title="View"
                      type="button"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => navigate(`/editbranch/${c.id}`)}
                      title="Edit"
                      type="button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 cursor-pointer"
                      type="button"
                      title="Delete"
                      onClick={() => handleDeleteClick(c.id)}
                      disabled={deleting === c.id}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-700">{c.name || "N/A"}</span>
                  <span className="block text-xs text-gray-400">{c.email || "N/A"}</span>
                  <span className="block text-xs text-gray-400">{c.mobile_no || "N/A"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">No sellers found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">
            Showing {totalRecords === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, totalRecords)} of {totalRecords} Entries
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
  );
};

export default BranchList;