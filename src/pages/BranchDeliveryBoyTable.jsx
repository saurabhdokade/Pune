import React from "react";

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
    ...Array(8).fill({
        userId: "Akash_s",
        name: "Akash Sharma",
        email: "example@gmail.com",
        phone: "+919876543210",
        address: "6391 Elgin St. Celina, Delaware 10299",
    }),
];

export default function BranchDeliveryBoyTable() {
    return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans  p-6 mb-4 mt-16">
            {/* <div className="w-full max-w-5xl"> */}
                <h2 className="text-center text-2xl font-semibold text-[#F25C7A] mb-8 border-b-2 border-b-gray-100 pb-2 tracking-wide">
                    <span className="font-bold" style={{ letterSpacing: 1 }}>View&nbsp; Branch Info</span>
                </h2>
                <div className="mb-4 text-[18px] text-[#F25C7A] font-medium">
                    Available Delivery Boy:
                </div>
                {/* Desktop Table */}
                <div className="overflow-x-auto rounded border border-gray-200 mb-6 bg-white hidden md:block">
                    <table className="min-w-full bg-gray-50">
                        <thead>
                            <tr className="bg-gray-200 text-sm text-gray-700">
                                <th className="px-3 py-2 font-semibold text-left">Sr.No</th>
                                <th className="px-3 py-2 font-semibold text-left">User ID</th>
                                <th className="px-3 py-2 font-semibold text-left">Delivery Boy Name</th>
                                <th className="px-3 py-2 font-semibold text-left">Email Address</th>
                                <th className="px-3 py-2 font-semibold text-left">Phone Number</th>
                                <th className="px-3 py-2 font-semibold text-left">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryBoys.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#FFF5F7]"} text-sm border-t`}
                                >
                                    <td className="px-3 py-2">{i + 1}</td>
                                    <td className="px-3 py-2">{row.userId}</td>
                                    <td className="px-3 py-2">{row.name}</td>
                                    <td className="px-3 py-2">{row.email}</td>
                                    <td className="px-3 py-2">{row.phone}</td>
                                    <td className="px-3 py-2 truncate max-w-[180px]">{row.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden mb-6">
                    {deliveryBoys.map((row, i) => (
                        <div
                            key={i}
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
                {/* Pagination and Info */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
                    <div className="text-gray-500 text-sm">
                        Showing 1 to 10 of 10 Entries
                    </div>
                    <div className="flex items-center gap-2">
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
}