import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../components/AuthContext"; // <-- Import Auth context

const PAGE_SIZE = 10;

const DriverList = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDriver, setExpandedDriver] = useState({});
  const navigate = useNavigate();

  // Get token
  const { token } = useAuth();
  const storedToken = token || localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://api.citycentermall.com/api/v1/super-admin/runners",
          {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
          }
        );
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (res.data.drivers && Array.isArray(res.data.drivers)) {
          data = res.data.drivers;
        }
        setDrivers(data);
      } catch (err) {
        toast.error("Failed to fetch drivers");
        setDrivers([]);
      }
      setLoading(false);
    };
    fetchDrivers();
  }, [storedToken]);

  // Expand row and fetch driver info if needed
  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    if (!expandedDriver[id]) {
      try {
        const res = await axios.get(
          `https://api.citycentermall.com/api/v1/super-admin/runnerinfo/${id}`,
          {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
          }
        );
        setExpandedDriver((prev) => ({
          ...prev,
          [id]: res.data?.data || res.data,
        }));
      } catch {
        toast.error("Failed to load driver details.");
        setExpandedDriver((prev) => ({
          ...prev,
          [id]: null,
        }));
      }
    }
    setExpandedId(id);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    setDeletingId(id);
    try {
      await axios.delete(
        `https://api.citycentermall.com/api/v1/super-admin/runnerinfo/${id}`,
        {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
        }
      );
      setDrivers((prev) => prev.filter((d) => d._id.$oid !== id));
      toast.success("Driver deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete driver. Please try again."
      );
    }
    setDeletingId(null);
  };

  // Filter and sort
  const filtered = drivers
    .filter((d) => {
      const fullName = `${d.firstName || ""} ${d.lastName || ""}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aName = `${a.firstName || ""} ${a.lastName || ""}`;
      const bName = `${b.firstName || ""} ${b.lastName || ""}`;
      return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  // Pagination logic
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

  // MOBILE CARD EXPANDED DETAILS
  const renderMobileDetails = (driver) => {
    const info = expandedDriver[driver._id.$oid];
    if (info === undefined) return <span className="text-gray-400">Loading...</span>;
    if (info === null) return <span className="text-red-500">Failed to load details.</span>;
    return (
      <div className="mt-2 mb-2">
        <div className="grid grid-cols-1 gap-1 text-[15px]">
          <span><b>Email:</b> {info.email || "-"}</span>
          <span><b>Contact:</b> {info.contact_no || "-"}</span>
          <span><b>Address:</b> {info.address || "-"}</span>
          <span><b>City:</b> {info.city || "-"}</span>
          <span><b>State:</b> {info.state || "-"}</span>
          <span><b>Pin Code:</b> {info.pin_code || "-"}</span>
          <span><b>Vehicle ID:</b> {info.vehicleId?.$oid || "-"}</span>
          <span><b>Bank Details ID:</b> {info.bankDetailsId?.$oid || "-"}</span>
          <span><b>Location:</b> {info.current_location?.coordinates?.join(", ") || "-"}</span>
          <span><b>Created At:</b> {info.createdAt?.$date ? new Date(info.createdAt.$date).toLocaleString() : "-"}</span>
          <span><b>Updated At:</b> {info.updatedAt?.$date ? new Date(info.updatedAt.$date).toLocaleString() : "-"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-14 relative">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* <div className="max-w-6xl mx-auto w-full"> */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8 mt-6">
          <h2 className="text-pink-600 font-semibold text-xl md:text-2xl">
            Driver List
          </h2>
          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#EB627D] bg-white text-sm"
              placeholder="Search driver..."
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
        <div className="mb-4 flex md:justify-end">
          <button
            className="bg-[#EB627D] hover:bg-[#EB627D] cursor-pointer transition text-white font-medium rounded-md px-8 py-2 text-base"
            onClick={() => navigate(`/adddeliveryboy/`)}
          >
            + Add
          </button>
        </div>

        {/* Desktop Table */}
        <div className="rounded-xll shadow bg-white border rounded-tl-xll hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800 table-auto rounded-tl-xll">
              <thead>
                <tr className="bg-[#EB627D]  text-white text-left rounded-tl-xll">
                  <th className="font-semibold py-1 px-6 rounded-tl-xll">Sr. No.</th>
                  <th className="font-semibold py-1 px-6 cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <span>Full Name</span>
                      <button
                        onClick={() => setSortAsc((v) => !v)}
                        className="ml-1 text-white"
                        aria-label="Sort Name"
                      >
                        <span className="inline-block align-middle">↑↓</span>
                      </button>
                    </div>
                  </th>
                  <th className="font-semibold py-1 px-6">Email</th>
                  <th className="font-semibold py-1 px-6">Contact No.</th>
                  <th className="font-semibold py-1 px-6">City</th>
                  <th className="font-semibold py-1 px-6 rounded-tr-xll">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedFiltered.map((d, i) => (
                  <React.Fragment key={d._id?.$oid}>
                    <tr className={`${i % 2 === 0 ? "bg-white" : "bg-pink-50"}`}>
                      <td className="py-3 px-6 text-center items-center text-center font-semibold text-gray-700 align-middle">
                        {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent((d.firstName || "") + " " + (d.lastName || ""))}&background=EB627D&color=fff`}
                            alt={d.firstName}
                            className="w-10 h-10 rounded-full object-cover text-center border border-gray-200"
                          />
                          <span className="font-medium">{`${d.firstName || ""} ${d.lastName || ""}`}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 align-middle">{d.email}</td>
                      <td className="py-3 px-6 align-middle">{d.contact_no}</td>
                      <td className="py-3 px-6 align-middle">{d.address}</td>
                      <td className="py-3 px-6 align-middle">
                        <div className="flex gap-3 text-[#EB627D] text-lg">
                          <button
                            className="cursor-pointer"
                            title="View"
                            onClick={() => toggleExpand(d._id.$oid)}
                          >
                            
                            <FaEye />
                          </button>
                          <button
                            title="Edit"
                            className="cursor-pointer"
                            onClick={() => navigate(`/editdeliveryboy/${d._id.$oid}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            title="Delete"
                            className="cursor-pointer"
                            onClick={() => handleDelete(d._id.$oid)}
                            disabled={deletingId === d._id.$oid}
                          >
                            {deletingId === d._id.$oid ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Row */}
                    {expandedId === d._id.$oid && (
                      <tr>
                        <td colSpan={6} className="bg-pink-100 pl-[265px] py-5 px-6 text-gray-700">
                          {expandedDriver[d._id.$oid] === undefined ? (
                            <span>Loading...</span>
                          ) : expandedDriver[d._id.$oid] === null ? (
                            <span className="text-red-500">Failed to load details.</span>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <p><strong>Full Name:</strong> {`${expandedDriver[d._id.$oid]?.firstName || ""} ${expandedDriver[d._id.$oid]?.lastName || ""}`}</p>
                              <p><strong>Email:</strong> {expandedDriver[d._id.$oid]?.email || "-"}</p>
                              <p><strong>Contact No.:</strong> {expandedDriver[d._id.$oid]?.contact_no || "-"}</p>
                              <p><strong>Address:</strong> {expandedDriver[d._id.$oid]?.address || "-"}</p>
                              <p><strong>City:</strong> {expandedDriver[d._id.$oid]?.city || "-"}</p>
                              <p><strong>State:</strong> {expandedDriver[d._id.$oid]?.state || "-"}</p>
                              <p><strong>Pin Code:</strong> {expandedDriver[d._id.$oid]?.pin_code || "-"}</p>
                              <p><strong>Vehicle ID:</strong> {expandedDriver[d._id.$oid]?.vehicleId?.$oid || "-"}</p>
                              <p><strong>Bank Details ID:</strong> {expandedDriver[d._id.$oid]?.bankDetailsId?.$oid || "-"}</p>
                              <p className="md:col-span-2">
                                <strong>Location:</strong> {expandedDriver[d._id.$oid]?.current_location?.coordinates?.join(", ") || "-"}
                              </p>
                              <p><strong>Created At:</strong> {expandedDriver[d._id.$oid]?.createdAt?.$date ? new Date(expandedDriver[d._id.$oid]?.createdAt.$date).toLocaleString() : "-"}</p>
                              <p><strong>Updated At:</strong> {expandedDriver[d._id.$oid]?.updatedAt?.$date ? new Date(expandedDriver[d._id.$oid]?.updatedAt.$date).toLocaleString() : "-"}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {pagedFiltered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-400">
                      No drivers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* MOBILE CARD LIST */}
        <div className="md:hidden">
          {pagedFiltered.length === 0 && (
            <div className="py-6 text-center text-gray-400">No drivers found.</div>
          )}
          {pagedFiltered.map((d, i) => (
            <div
              key={d._id?.$oid}
              className="bg-white rounded-xl mb-4 shadow border border-pink-100 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent((d.firstName || "") + " " + (d.lastName || ""))}&background=EB627D&color=fff`}
                    alt={d.firstName}
                    className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                  />
                  <div>
                    <span className="block font-semibold text-gray-900 text-base">
                      {(d.firstName || "") + " " + (d.lastName || "")}
                    </span>
                    <span className="block text-xs text-gray-500">
                      #{String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 text-xl text-[#EB627D]">
                  <button
                    className="cursor-pointer"
                    title="View"
                    onClick={() => toggleExpand(d._id.$oid)}
                  >
                    <FaEye />
                  </button>
                  <button
                    title="Edit"
                    className="cursor-pointer"
                    onClick={() => navigate(`/editdeliveryboy/${d._id.$oid}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete"
                    className="cursor-pointer"
                    onClick={() => handleDelete(d._id.$oid)}
                    disabled={deletingId === d._id.$oid}
                  >
                    {deletingId === d._id.$oid ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-gray-700 text-sm mt-2">
                <div>
                  <b>Email:</b> {d.email || "-"}
                </div>
                <div>
                  <b>Contact No.:</b> {d.contact_no || "-"}
                </div>
                <div>
                  <b>City:</b> {d.address || "-"}
                </div>
              </div>
              {/* Expandable details */}
              {expandedId === d._id.$oid && (
                <div className="bg-pink-50 rounded-lg p-3 mt-2 border border-pink-200">
                  {renderMobileDetails(d)}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Entries
          </div>
          <div className="flex gap-2">
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled={page === 1}
              onClick={handlePrev}
            >
              Previous
            </button>
            <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
              {page}
            </span>
            <button
              className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default DriverList;