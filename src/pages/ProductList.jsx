import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

// Helper to decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

const PAGE_SIZE = 10; // Number of products per page

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]); // for search
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    } else {
      const storedToken = token || localStorage.getItem("access_token");
      if (storedToken) {
        const payload = decodeJWT(storedToken);
        setUserName(
          payload.name ||
          payload.fullName ||
          payload.username ||
          payload.mobile_no ||
          "Admin"
        );
      } else {
        setUserName("Admin");
      }
    }
  }, [user, token]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const storedToken = token || localStorage.getItem("access_token");
        const res = await axios.get("https://api.citycentermall.com/api/v1/super-admin/all-products",
          {
            headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
          }
        );
        if (res.data.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Filter by search
  useEffect(() => {
    let list = products;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = products.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(s)) ||
          (p.brand?.brand_name && p.brand.brand_name.toLowerCase().includes(s)) ||
          (p.category?.category && p.category.category.toLowerCase().includes(s)) ||
          (p.subcategory?.name && p.subcategory.name.toLowerCase().includes(s))
      );
    }
    setFiltered(list);
    setPage(1); // reset to first page on filter change
  }, [search, products]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleOpenModal = (index, type) => {
    setSelectedProductIndex(index + (page - 1) * PAGE_SIZE);
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductIndex(null);
  };

  const handleConfirm = () => {
    // Add logic to update the quantity in backend
    handleCloseModal();
  };

  // Helper: get main image
  const getProductImage = (product) => {
    if (Array.isArray(product.product_images) && product.product_images.length > 0) {
      return product.product_images[0];
    }
    if (typeof product.image === "string") return product.image;
    return "https://via.placeholder.com/64x64.png?text=No+Image";
  };

  // Paginate products for current page
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Responsive: Table for md+ and Card for mobile
  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-16 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-[#EB627D] text-xl font-bold">Product List</h2>
        <div className="flex gap-2 items-center w-full sm:max-w-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
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
          <button className="bg-[#EB627D] text-white px-4 py-2 cursor-pointer rounded">+ADD</button>
        </div>
      </div>

      {/* Table for md+ */}
      <div className="overflow-x-auto rounded-xll shadow bg-white border hidden md:block">
        {loading ? (
          <div className="text-center p-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">{error}</div>
        ) : (
          <>
            <table className="min-w-full text-sm text-gray-800">
              <thead>
                <tr className="bg-[#EB627D] text-white text-left">
                  <th className="py-3 px-2 sm:px-4">Sr. No.</th>
                  <th className="py-3 px-2 sm:px-4">Image</th>
                  <th className="py-3 px-2 sm:px-4">Product Name</th>
                  <th className="py-3 px-2 sm:px-4">Brand</th>
                  <th className="py-3 px-2 sm:px-4">Category</th>
                  <th className="py-3 px-2 sm:px-4">Subcategory</th>
                  <th className="py-3 px-2 sm:px-4">Qty</th>
                  <th className="py-3 px-2 sm:px-4">Base Price</th>
                  <th className="py-3 px-2 sm:px-4">Selling Price</th>
                  <th className="py-3 px-2 sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, index) => (
                  <tr key={item.id || index} className={index % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                    <td className="py-3 px-2 sm:px-4 font-semibold text-center">
                      {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-2 sm:px-4">{item.name}</td>
                    <td className="py-3 px-2 sm:px-4">{item.brand?.brand_name || "--"}</td>
                    <td className="py-3 px-2 sm:px-4">{item.category?.category || "--"}</td>
                    <td className="py-3 px-2 sm:px-4">{item.subcategory?.name || "--"}</td>
                    <td className="py-3 px-2 sm:px-4 flex items-center gap-2">
                      {item.product_stock}
                      <span
                        className="text-green-600 text-xl font-bold cursor-pointer"
                        onClick={() => handleOpenModal(index, "add")}
                      >
                        +
                      </span>
                      <span
                        className="text-red-600 text-xl font-bold cursor-pointer"
                        onClick={() => handleOpenModal(index, "remove")}
                      >
                        -
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-4">{item.basePrice || item.product_base_price || "--"}</td>
                    <td className="py-3 px-2 sm:px-4">{item.product_selling_price || "--"}</td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      <div className="flex gap-2 sm:gap-3 text-[#EB627D] text-lg">
                        <button
                          title="View"
                          className="cursor-pointer"
                          onClick={() => navigate(`/productdetails/${item.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          title="Edit"
                          className="cursor-pointer"
                          onClick={() => navigate(`/editproduct/${item.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Delete"
                          className="cursor-pointer"
                        // onClick={() => ...}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center p-4">
              <div className="text-gray-500 text-sm mb-2 sm:mb-0">
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
          </>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center p-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">{error}</div>
        ) : (
          paginated.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
            >
              <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">#{item.id}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">{(page - 1) * PAGE_SIZE + index + 1}</div>
              </div>
              <div className="px-4 pb-2 text-gray-700">
                <div>
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded border mb-2"
                  />
                </div>
                <div>
                  <span className="font-semibold">Brand: </span>
                  {item.brand?.brand_name || "--"}
                </div>
                <div>
                  <span className="font-semibold">Category: </span>
                  {item.category?.category || "--"}
                </div>
                <div>
                  <span className="font-semibold">Subcategory: </span>
                  {item.subcategory?.name || "--"}
                </div>
                <div>
                  <span className="font-semibold">Available Qty: </span>
                  {item.product_stock}
                </div>
                <div>
                  <span className="font-semibold">Base Price: </span>
                  {item.basePrice || item.product_base_price || "--"}
                </div>
                <div>
                  <span className="font-semibold">Selling Price: </span>
                  {item.product_selling_price || "--"}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    title="View"
                    className="cursor-pointer text-[#EB627D] text-lg"
                    onClick={() => navigate(`/productdetails/${item.id}`)}
                  >
                    <FaEye />
                  </button>
                  <button
                    title="Edit"
                    className="cursor-pointer text-[#EB627D] text-lg"
                    onClick={() => navigate(`/editproduct/${item.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete"
                    className="cursor-pointer text-[#EB627D] text-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <span
                    className="text-green-600 text-xl font-bold cursor-pointer"
                    onClick={() => handleOpenModal(index, "add")}
                  >
                    +
                  </span>
                  <span
                    className="text-red-600 text-xl font-bold cursor-pointer"
                    onClick={() => handleOpenModal(index, "remove")}
                  >
                    -
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[90vw] sm:min-w-[300px] max-w-[95vw]">
            <h3 className="text-lg font-bold mb-2">
              {modalType === "add" ? "Add Quantity" : "Remove Quantity"}
            </h3>
            <p className="mb-4">
              Update quantity for product: <strong>{filtered[selectedProductIndex]?.name}</strong>
            </p>
            {/* Add your form elements here */}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={handleCloseModal}
              >Cancel</button>
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded"
                onClick={handleConfirm}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;