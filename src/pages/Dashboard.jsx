import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Star, RefreshCw } from "lucide-react";
import pendingIcon from '../assets/b11069a4de6e255d90b4a00989a3ea8f73271f4c.png';
import userIcon from '../assets/1be661da7ec47814f43f5782f152a0db7d07ce14.png';
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

// PieChart status colors
const STATUS_COLORS = {
    delivered: "#23C16B",
    pending: "#FFC107",
    cancelled: "#F44336",
    processing: "#2196F3"
};

// Stat Cards Icons (SVG)
const cardIcons = [
    // Customers
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#E4FDE3" />
        <g>
            <circle cx="16" cy="21" r="4" fill="#23C16B" />
            <circle cx="32" cy="21" r="4" fill="#23C16B" />
            <circle cx="24" cy="17" r="6" fill="#23C16B" />
            <rect x="12" y="29" width="24" height="6" rx="3" fill="#23C16B" opacity="0.15" />
        </g>
    </svg>,
    // Orders
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#FFEAE4" />
        <g>
            <rect x="14" y="16" width="20" height="16" rx="4" fill="#FF7A59" />
            <rect x="18" y="24" width="12" height="4" rx="2" fill="#fff" opacity="0.5" />
        </g>
    </svg>,
    // Branch
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#E6F2FF" />
        <g>
            <circle cx="24" cy="22" r="7" fill="#5AA6FF" />
            <rect x="18" y="31" width="12" height="4" rx="2" fill="#5AA6FF" opacity="0.15" />
            <text x="24" y="26" fontSize="12" textAnchor="middle" fill="#fff" fontWeight="bold">$</text>
        </g>
    </svg>,
    // Delivery Boy
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#FFF4E4" />
        <g>
            <rect x="17" y="16" width="14" height="16" rx="4" fill="#FF9800" />
            <rect x="21" y="24" width="6" height="4" rx="2" fill="#fff" opacity="0.5" />
            <polyline points="24,20 28,16 32,20" stroke="#FF9800" strokeWidth="2" fill="none" />
        </g>
    </svg>,
    // Revenue
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#FFF0F6" />
        <g>
            <rect x="18" y="22" width="4" height="10" rx="2" fill="#D63384" />
            <rect x="24" y="18" width="4" height="14" rx="2" fill="#D63384" />
            <rect x="30" y="26" width="4" height="6" rx="2" fill="#D63384" />
        </g>
    </svg>
];

// Reviews data and max value
const reviews = [
    { label: "Excellent", value: 80, color: "#23C16B" },
    { label: "Good", value: 60, color: "#8DE18C" },
    { label: "Avarage", value: 40, color: "#FFC107" },
    { label: "Avg-below", value: 20, color: "#FFA726" },
    { label: "Poor", value: 10, color: "#F44336" },
];
const maxReviewValue = Math.max(...reviews.map(r => r.value));

// Up arrow (circle background)
const UpArrow = ({ color = "#7C5AFF", bg = "#ECEAFF" }) => (
    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full" style={{ background: bg, marginRight: 8 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill={color} />
            <path d="M10 14V6M10 6l-3 3M10 6l3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    </span>
);

// Stat Card
function StatCard({ title, value, icon }) {
    // Mobile: fixed width, centered; Desktop: square aspect and grid
    return (
        <div
            className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-4 sm:p-6 min-h-[110px] border border-gray-100 w-[90vw] max-w-xs md:min-w-[140px] md:max-w-[200px]"
            style={{
                aspectRatio: '1 / 1',
                boxShadow: '0 2px 12px 0 rgba(44,62,80,.04)'
            }}>
            <div className="mb-2">{icon}</div>
            <h4 className="text-sm sm:text-lg font-semibold mb-1 text-gray-700 text-center">{title}</h4>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [statCards, setStatCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pieData, setPieData] = useState([]);
    const [orderStatusLoading, setOrderStatusLoading] = useState(false);
    const [lineData, setLineData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2025");
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const totalOrders = pieData.reduce((sum, item) => sum + item.value, 0);

    // Get the user from AuthContext, but fallback to token decode if not available
    const { user, token } = useAuth();
    const [userName, setUserName] = useState("");

    // Get user name from context or decode from token
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

    // Fetch all dashboard data EXCEPT order status (that's separated for refresh)
    useEffect(() => {
        async function fetchDashboard() {
            setLoading(true);
            setError(null);
            try {
                const storedToken = token || localStorage.getItem("access_token");
                const res = await axios.get(
                    `https://api.citycentermall.com/api/v1/super-admin/dashboard?year=${selectedYear}`,
                    {
                        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
                    }
                );
                const data = res.data;

                // Stat cards data
                const cards = [
                    { title: "Total Customer", value: data.totalCustomers, icon: cardIcons[0] },
                    { title: "Total Order", value: data.totalOrders, icon: cardIcons[1] },
                    { title: "Total Branch", value: data.totalVendors, icon: cardIcons[2] },
                    { title: "Total Delivery Boy", value: data.totalRunners, icon: cardIcons[3] },
                    { title: "Total Revenue", value: data.totalRevenue, icon: cardIcons[4] },
                ];
                setStatCards(cards);

                // Line chart data
                const monthlyCounts = data.customerOverview.monthlyCounts;
                const lineChartData = monthlyCounts.map((item, index) => ({
                    name: item.month,
                    customers: item.count,
                    orders: data.orderOverview?.monthlyCounts?.[index]?.count || 0,
                    delivery: data.runnerOverview?.monthlyCounts?.[index]?.count || 0,
                    new: data.customerOverview?.monthlyNewCounts?.[index]?.count || 0,
                    returning: data.customerOverview?.monthlyReturningCounts?.[index]?.count || 0,
                }));
                setLineData(lineChartData);

                // Get order status data for pie chart
                if (data.orderStatus) {
                    setPieData([
                        { name: "Delivered Orders", value: data.orderStatus.delivered, color: STATUS_COLORS.delivered },
                        { name: "Pending Orders", value: data.orderStatus.pending, color: STATUS_COLORS.pending },
                        { name: "Cancelled Orders", value: data.orderStatus.cancelled, color: STATUS_COLORS.cancelled },
                        { name: "Processing Orders", value: data.orderStatus.processing, color: STATUS_COLORS.processing }
                    ]);
                    setPendingOrdersCount(data.orderStatus.pending);
                } else {
                    setPieData([]);
                    setPendingOrdersCount(0);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to load dashboard data.");
                setLoading(false);
            }
        }
        fetchDashboard();
    }, [selectedYear, token]);

    // Separate fetch for order status (for refresh)
    const fetchOrderStatus = useCallback(async () => {
        setOrderStatusLoading(true);
        try {
            const storedToken = token || localStorage.getItem("access_token");
            // You may want to use a dedicated endpoint for just order status if your API supports it,
            // for now, reusing the dashboard endpoint and only updating orderStatus data
            const res = await axios.get(
                `https://api.citycentermall.com/api/v1/super-admin/dashboard?year=${selectedYear}`,
                {
                    headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
                }
            );
            const orderStatus = res.data.orderStatus;
            setPieData([
                { name: "Delivered Orders", value: orderStatus.delivered, color: STATUS_COLORS.delivered },
                { name: "Pending Orders", value: orderStatus.pending, color: STATUS_COLORS.pending },
                { name: "Cancelled Orders", value: orderStatus.cancelled, color: STATUS_COLORS.cancelled },
                { name: "Processing Orders", value: orderStatus.processing, color: STATUS_COLORS.processing }
            ]);
            setPendingOrdersCount(orderStatus.pending);
        } catch {
            // Optionally show toast/error
        } finally {
            setOrderStatusLoading(false);
        }
    }, [selectedYear, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-[#F6F8FB] font-sans flex flex-col">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="-mx-4 sm:-mx-1 bg-[#2F5383] px-4 sm:px-10 pt-5 pb-15 font-sans mb-3 mt-14 flex items-center justify-between" style={{ minHeight: 120 }}>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-white mb-1">
                            Hello! {userName}
                        </h2>
                        <p className="text-base font-normal text-white opacity-80">We are on a mission to help customer</p>
                    </div>
                </div>

                {/* Cards Row */}
                <div className="relative -mt-10 z-10 px-2 sm:px-4 md:px-8 mb-2">
                    <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6">
                        {statCards.map((card, i) =>
                            <StatCard key={i} title={card.title} value={card.value} icon={card.icon} />
                        )}
                    </div>
                </div>
                {/* Main Grid */}
                <div className="px-2 sm:px-4 md:px-8 pb-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Status Pie */}
                        <div className="bg-white rounded-xl shadow p-5">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">Order Status</h4>
                                <button
                                    onClick={fetchOrderStatus}
                                    disabled={orderStatusLoading}
                                    className="focus:outline-none"
                                    title="Refresh Order Status"
                                >
                                    <RefreshCw
                                        size={18}
                                        stroke="#23C16B"
                                        className={`opacity-80  cursor-pointer transition-transform ${orderStatusLoading ? "animate-spin" : ""}`}
                                    />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">Total Earnings of the Month</p>
                            <div className="relative h-[180px]">
                                {orderStatusLoading ? (
                                    <div className="text-center py-8">Refreshing...</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <p className="text-xs font-medium text-gray-700">Ratio</p>
                                    <p className="text-xl font-bold text-black">100%</p>
                                </div>
                            </div>
                            <div className="flex flex-col mt-3 space-y-1 text-sm">
                                <div className="space-y-2 text-sm text-gray-700">
                                    {[
                                        { label: "Delivered Orders", color: "#23C16B" },
                                        { label: "Pending Orders", color: "#FFC107" },
                                        { label: "Processing Orders", color: "#2196F3" },
                                        { label: "Cancelled Orders", color: "#F44336" },
                                    ].map(({ label, color }) => {
                                        const value = pieData.find((item) => item.name === label)?.value ?? 0;
                                        const percentage = totalOrders > 0 ? ((value / totalOrders) * 100).toFixed(1) : 0;

                                        return (
                                            <div className="flex items-center gap-2" key={label}>
                                                <span className="h-3 w-3 rounded-full" style={{ background: color }} />
                                                <span>{value} {label} ({percentage}%)</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Legend with matching colors */}
                            {/* <div className="flex flex-col mt-3 space-y-1 text-sm">
                                {pieData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                                        {item.value ?? 0} {item.name}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                        {/* Area Charts */}
                        <div className="relative flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
                            <div className="absolute top-4 right-4">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="border border-gray-300 rounded-md p-1"
                                >
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>

                            {/* Customer Overview */}
                            <div className="bg-white rounded-xl shadow p-4 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <UpArrow color="#7C5AFF" bg="#ECEAFF" />
                                    <span className="font-semibold text-base">Customer overview</span>
                                </div>
                                <ResponsiveContainer width="100%" height={60}>
                                    <AreaChart data={lineData}>
                                        <defs>
                                            <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#7C5AFF" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#7C5AFF" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="customers"
                                            stroke="#7C5AFF"
                                            fill="url(#customerGradient)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Order Overview */}
                            <div className="bg-white rounded-xl shadow p-4 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <UpArrow color="#5AA6FF" bg="#E4F3FF" />
                                    <span className="font-semibold text-base">Order overview</span>
                                </div>
                                <ResponsiveContainer width="100%" height={60}>
                                    <AreaChart data={lineData}>
                                        <defs>
                                            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#5AA6FF" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#5AA6FF" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#5AA6FF"
                                            fill="url(#orderGradient)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Delivery Boy Overview */}
                            <div className="bg-white rounded-xl shadow p-4 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <UpArrow color="#23C16B" bg="#E4FDE3" />
                                    <span className="font-semibold text-base">Delivery Boy overview</span>
                                </div>
                                <ResponsiveContainer width="100%" height={60}>
                                    <AreaChart data={lineData}>
                                        <defs>
                                            <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#23C16B" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#23C16B" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="delivery"
                                            stroke="#23C16B"
                                            fill="url(#deliveryGradient)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Reviews */}
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-w-[220px] sm:min-w-[320px] max-w-full border border-[#F1F1F1]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">Reviews</h4>
                                <button className="rounded-full p-1 hover:bg-gray-100">
                                    <RefreshCw size={20} stroke="#23C16B" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-5">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} fill="#FFC107" size={24} stroke="#FFC107" />
                                ))}
                                <Star fill="none" size={24} stroke="#FFC107" />
                                <span className="ml-4 font-bold text-gray-900 text-xl">4.0</span>
                                <span className="ml-1 text-gray-500 text-base font-medium">out of 5 star</span>
                            </div>
                            <div className="flex flex-col gap-5">
                                {reviews.map((r, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-20 min-w-[75px] text-base text-gray-700">{r.label}</span>
                                        <div className="flex-1 h-3 rounded-full relative bg-gray-100">
                                            <div
                                                className="h-3 rounded-full absolute top-0 left-0 transition-all duration-500"
                                                style={{
                                                    width: `${(r.value / maxReviewValue) * 100}%`,
                                                    background: r.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Visitor Performance & Feeds */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Visitor Performance */}
                        <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
                            <div className="flex items-center mb-2 gap-2">
                                <h4 className="font-semibold text-base">Visitor Performance</h4>
                                <span className="flex items-center gap-1 text-xs ml-4">
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]"></span> New
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#A855F7] ml-2"></span> Returning
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={lineData}>
                                    <defs>
                                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="new" stroke="#3B82F6" fill="url(#colorNew)" strokeWidth={2} dot />
                                    <Area type="monotone" dataKey="returning" stroke="#A855F7" fill="url(#colorReturning)" strokeWidth={2} dot />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Feeds */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <h4 className="text-base font-bold mb-4">Feeds</h4>
                            <div className="flex items-center space-x-3 mb-4">
                                <img
                                    src={pendingIcon}
                                    alt="Pending Orders"
                                    className="w-12 h-12 rounded-full bg-blue-100 p-2"
                                />
                                <p className="text-base font-medium">
                                    You have {pendingOrdersCount} pending {pendingOrdersCount === 1 ? "order" : "orders"}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={userIcon}
                                    alt="New User"
                                    onClick={() => navigate(`/addbranch`)}

                                    className="w-12 h-12 cursor-pointer rounded-full bg-orange-100 p-2"
                                />
                                <p className="text-base font-medium">New vendor registered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}