import React from "react";
import Navbar from "../components/Navbar";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Star, Bell, Search, UserCircle } from "lucide-react";
import pendingIcon from '../assets/b11069a4de6e255d90b4a00989a3ea8f73271f4c.png'; // Replace with actual path
import userIcon from '../assets/1be661da7ec47814f43f5782f152a0db7d07ce14.png';
// Calculate max value dynamically
// const maxReviewValue = Math.max(...reviews.map(r => r.value));

const pieData = [
    { name: "Success Order", value: 60, color: "#2ecc71" },
    { name: "Pending Order", value: 25, color: "#f1c40f" },
    { name: "Failed Order", value: 15, color: "#e74c3c" },
];

const lineData = [
    { name: "Week 1", customers: 400, orders: 240, delivery: 240 },
    { name: "Week 2", customers: 300, orders: 139, delivery: 221 },
    { name: "Week 3", customers: 200, orders: 980, delivery: 229 },
    { name: "Week 4", customers: 278, orders: 390, delivery: 200 },
    { name: "Week 5", customers: 189, orders: 480, delivery: 218 },
];

const reviews = [
    { label: "Excellent", value: 80, color: "bg-green-500" },
    { label: "Good", value: 60, color: "bg-green-400" },
    { label: "Average", value: 40, color: "bg-yellow-400" },
    { label: "Avg-below", value: 20, color: "bg-orange-400" },
    { label: "Poor", value: 10, color: "bg-red-500" },
];
const maxReviewValue = Math.max(...reviews.map(r => r.value));

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans">
            <div className="fixed top-0 left-0 right-0 z-30 md:ml-64">
            </div>

            {/* Welcome Message */}
            <div className="bg-indigo-600 text-white p-6 rounded-xl mt-4">
                <h2 className="text-2xl font-semibold">Hello! John Doe</h2>
                <p>We are on a mission to help customer</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <StatCard title="Total Customer" value="30,0000" icon="👥" />
                <StatCard title="Total Order" value="3200" icon="🛍️" />
                <StatCard title="Total Branch" value="32450" icon="💰" />
                <StatCard title="Total Delivery Boy" value="120" icon="📦" />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">


                <div className="bg-white rounded-xl shadow-md p-4">
                    {/* Pie Chart Card */}
                    <div className="bg-white rounded-xl shadow-md p-4 relative">
                        <h4 className="font-semibold text-lg mb-1">Order Status</h4>
                        <p className="text-xs text-gray-400 mb-2">Total Earnings of the Month</p>

                        {/* Pie Chart */}
                        <div className="relative h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-sm font-medium text-gray-700">Ratio</p>
                                <p className="text-lg font-semibold">100%</p>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="flex flex-col mt-3 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#00C49F]" />
                                <span className="text-sm text-gray-600">Success Order</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#FFBB28]" />
                                <span className="text-sm text-gray-600">Pending Order</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#FF4C4C]" />
                                <span className="text-sm text-gray-600">Failed Order</span>
                            </div>
                        </div>
                    </div>




                </div>


                {/* Line Charts */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="font-semibold mb-2">Customer Overview</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={lineData}>
                            <Line type="monotone" dataKey="customers" stroke="#8884d8" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="font-semibold mb-2">Order Overview</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={lineData}>
                            <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Delivery Boy Overview */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="font-semibold mb-2">Delivery Boy Overview</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={lineData}>
                            <Line type="monotone" dataKey="delivery" stroke="#2ecc71" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Reviews */}
                {/* <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="font-semibold mb-2">Reviews</h4>
                    <div className="flex items-center gap-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} fill="#facc15" />
                        ))}
                        <span className="ml-2 font-medium text-black">4.0 out of 5 star</span>
                    </div>
                    <div className="mt-4 space-y-2">
                        {reviews.map((r, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-20 text-sm">{r.label}</span>
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div
                                        className={`${r.color} h-3 rounded-full`}
                                        style={{ width: `${r.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="font-semibold mb-2">Reviews</h4>
                    <div className="flex items-center gap-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} fill="#facc15" />
                        ))}
                        <span className="ml-2 font-medium text-black">4.0 out of 5 star</span>
                    </div>

                    <div className="mt-4 space-y-2">
                        {reviews.map((r, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-20 text-sm">{r.label}</span>
                                <div className="w-full bg-gray-200 rounded-full">
                                    <div
                                        className={`${r.color} h-3 rounded-full`}
                                        style={{
                                            width: `${(r.value / maxReviewValue) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Feeds */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h4 className="text-lg font-bold mb-4">Feeds</h4>

                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={pendingIcon}
                            alt="Pending Orders"
                            className="w-12 h-12 rounded-full bg-blue-100 p-2"
                        />
                        <p className="text-base font-medium">You Have 4 pending orders</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <img
                            src={userIcon}
                            alt="New User"
                            className="w-12 h-12 rounded-full bg-orange-100 p-2"
                        />
                        <p className="text-base font-medium">New user registered</p>
                    </div>
                </div>
            </div>

            {/* Visitor Performance */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-4">
                <h4 className="font-semibold mb-2">Visitor Performance</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
                        <Line type="monotone" dataKey="customers" stroke="#3b82f6" />
                        <Line type="monotone" dataKey="orders" stroke="#ef4444" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
            <div className="text-4xl">{icon}</div>
            <h4 className="mt-2 text-lg font-semibold">{title}</h4>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
