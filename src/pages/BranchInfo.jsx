import React from "react";
import { useNavigate } from "react-router-dom";

const deliveryBoys = [
    {
        userId: "UK_RIDER",
        name: "Kamal Verma",
        email: "example@gmail.com",
        phone: "+919876543210",
        address: "4517 Washington Ave. Manchester, Kentucky 39495",
    },
    {
        userId: "B,_Kumar",
        name: "Bijak Kumar",
        email: "example@gmail.com",
        phone: "+919876543210",
        address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    },
    {
        userId: "Akash_s",
        name: "Akash Sharma",
        email: "example@gmail.com",
        phone: "+919876543210",
        address: "6391 Elgin St. Celina, Delaware 10299",
    },
];

const products = [
    {
        code: "WH8746",
        brand: "Whisper",
        name: "Whisper Ultra Soft",
        size: "XL",
        qty: 905,
        price: "₹123",
    },
    {
        code: "WH8745",
        brand: "Whisper",
        name: "Whisper Ultra Soft",
        size: "L",
        qty: 905,
        price: "₹123",
    },
    {
        code: "WH8747",
        brand: "Whisper",
        name: "Whisper Ultra Soft",
        size: "XXl",
        qty: 905,
        price: "₹123",
    },
];

const BranchInfo = () => {
    const navigate = useNavigate();

    return (
                <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-16">
            {/* <div className="w-full max-w-5xl"> */}
                <h2 className="text-center text-2xl font-semibold text-[#F25C7A] mb-8 border-b-2 border-b-gray-100 pb-2 tracking-wide">
                    <span className="font-bold" style={{ letterSpacing: 1 }}>View&nbsp; Branch Info</span>
                </h2>

                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
                    <span className="font-semibold text-lg">Phone Number:</span>
                    <span className="sm:ml-4 text-base mt-1 sm:mt-0">+919876543210</span>
                </div>

                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
                    <span className="font-semibold text-lg">Address:</span>
                    <span className="sm:ml-4 text-base mt-1 sm:mt-0">
                        4517 Washington Ave. Manchester, Kentucky 39495
                    </span>
                </div>

                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center">
                    <span className="font-semibold text-lg">Service Pin Code:</span>
                    <span className="sm:ml-4 text-base mt-1 sm:mt-0">39495, 32564, 54698, 48744</span>
                </div>

                {/* Delivery Boy Table */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">Available Delivery Boy:</span>
                        <button
                            onClick={() => navigate("/branchdeliveryboytable")}
                            className="text-[#F25C7A] text-sm cursor-pointer font-medium hover:underline"
                            type="button"
                        >
                            See all
                        </button>
                    </div>
                    {/* Table for md+ */}
                    <div className="overflow-x-auto rounded border border-gray-200 hidden md:block">
                        <table className="min-w-full bg-gray-50 text-sm">
                            <thead>
                                <tr className="bg-[#F25C7A] text-white">
                                    <th className="px-4 py-3 font-semibold text-left">Sr.No</th>
                                    <th className="px-4 py-3 font-semibold text-left">User ID</th>
                                    <th className="px-4 py-3 font-semibold text-left">Delivery Boy Name</th>
                                    <th className="px-4 py-3 font-semibold text-left">Email Address</th>
                                    <th className="px-4 py-3 font-semibold text-left">Phone Number</th>
                                    <th className="px-4 py-3 font-semibold text-left">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryBoys.map((row, i) => (
                                    <tr key={row.userId} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                                        <td className="px-4 py-3">{i + 1}</td>
                                        <td className="px-4 py-3">{row.userId}</td>
                                        <td className="px-4 py-3">{row.name}</td>
                                        <td className="px-4 py-3">{row.email}</td>
                                        <td className="px-4 py-3">{row.phone}</td>
                                        <td className="px-4 py-3 truncate max-w-[180px]">{row.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        {deliveryBoys.map((row, i) => (
                            <div
                                key={row.userId}
                                className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
                            >
                                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">{row.name}</div>
                                        <div className="text-xs text-gray-500">#{row.userId}</div>
                                    </div>
                                    <div className="ml-auto text-xs text-gray-500">{i + 1}</div>
                                </div>
                                <div className="px-4 pb-2 text-gray-700">
                                    <div>
                                        <span className="font-semibold">Email: </span>
                                        {row.email}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone: </span>
                                        {row.phone}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Address: </span>
                                        <span className="break-words">{row.address}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Details Table */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">Available Product Details:</span>
                        <button
                            onClick={() => navigate("/branchproduct")}
                            className="text-[#F25C7A]  cursor-pointer text-sm font-medium hover:underline"
                            type="button"
                        >
                            See all
                        </button>
                    </div>
                    {/* Table for md+ */}
                    <div className="overflow-x-auto rounded border border-gray-200 hidden md:block">
                        <table className="min-w-full bg-gray-50 text-sm">
                            <thead>
                                <tr className="bg-[#F25C7A] text-white">
                                    <th className="px-4 py-3 font-semibold text-left">Sr.No</th>
                                    <th className="px-4 py-3 font-semibold text-left">Product Code</th>
                                    <th className="px-4 py-3 font-semibold text-left">Brand</th>
                                    <th className="px-4 py-3 font-semibold text-left">Product Name</th>
                                    <th className="px-4 py-3 font-semibold text-left">Size</th>
                                    <th className="px-4 py-3 font-semibold text-left">Available Quantity</th>
                                    <th className="px-4 py-3 font-semibold text-left">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((row, i) => (
                                    <tr key={row.code} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                                        <td className="px-4 py-3">{i + 1}</td>
                                        <td className="px-4 py-3">{row.code}</td>
                                        <td className="px-4 py-3">{row.brand}</td>
                                        <td className="px-4 py-3">{row.name}</td>
                                        <td className="px-4 py-3">{row.size}</td>
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            {row.qty}
                                            <button className="ml-2 text-[#F25C7A] text-xs font-medium hover:underline focus:outline-none">
                                                + Add
                                            </button>
                                            <button className="ml-1 text-[#F25C7A] text-xs font-medium hover:underline focus:outline-none">
                                                - Remove
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{row.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        {products.map((row, i) => (
                            <div
                                key={row.code}
                                className="flex flex-col bg-white rounded-xl shadow mb-4 border border-pink-100"
                            >
                                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">{row.name}</div>
                                        <div className="text-xs text-gray-500">#{row.code}</div>
                                    </div>
                                    <div className="ml-auto text-xs text-gray-500">{i + 1}</div>
                                </div>
                                <div className="px-4 pb-2 text-gray-700">
                                    <div>
                                        <span className="font-semibold">Brand: </span>
                                        {row.brand}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Size: </span>
                                        {row.size}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Available Qty: </span>
                                        {row.qty}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Price: </span>
                                        {row.price}
                                    </div>
                                </div>
                                <div className="flex gap-4 px-4 pb-4 mt-2 text-[#F25C7A] text-base">
                                    <button className="font-semibold hover:underline focus:outline-none">
                                        + Add
                                    </button>
                                    <button className="font-semibold hover:underline focus:outline-none">
                                        - Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Footer */}
                <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
                    <div className="text-gray-500 text-sm mb-2 md:mb-0">
                        Showing 1 to {deliveryBoys.length} of {deliveryBoys.length} Delivery Boys &amp; 1 to {products.length} of {products.length} Products
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                            disabled
                        >
                            Previous
                        </button>
                        <span className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] bg-pink-50 text-sm">
                            1
                        </span>
                        <button
                            className="border border-pink-300 rounded px-3 py-1 text-[#EB627D] hover:bg-pink-50 transition text-sm"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            {/* </div> */}
        </div>
    );
};

export default BranchInfo;