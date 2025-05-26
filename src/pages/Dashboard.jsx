import React from 'react';
import {
    PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Star, RefreshCw } from "lucide-react";
import pendingIcon from '../assets/b11069a4de6e255d90b4a00989a3ea8f73271f4c.png';
import userIcon from '../assets/1be661da7ec47814f43f5782f152a0db7d07ce14.png';

// DATA

const pieData = [
    { name: "Success Order", value: 60, color: "#23C16B" }, // green
    { name: "Pending Order", value: 25, color: "#FFC107" }, // yellow
    { name: "Failed Order", value: 15, color: "#F44336" },  // red
];

const lineData = [
    { name: "Week 1", customers: 400, orders: 240, delivery: 240, new: 240, returning: 120 },
    { name: "Week 2", customers: 300, orders: 139, delivery: 221, new: 160, returning: 100 },
    { name: "Week 3", customers: 200, orders: 980, delivery: 229, new: 300, returning: 200 },
    { name: "Week 4", customers: 278, orders: 390, delivery: 200, new: 400, returning: 220 },
    { name: "Week 5", customers: 189, orders: 480, delivery: 218, new: 260, returning: 180 },
];

const reviews = [
    { label: "Excellent", value: 80, color: "#23C16B" },   // green
    { label: "Good", value: 60, color: "#8DE18C" },        // light green
    { label: "Avarage", value: 40, color: "#FFC107" },     // yellow
    { label: "Avg-below", value: 20, color: "#FFA726" },   // orange
    { label: "Poor", value: 10, color: "#F44336" },        // red
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

// COMPONENTS

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 md:ml-64"></div>
            {/* Welcome Message */}
            <div className="bg-[#2F5383]  text-white p-6  mt-14 flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight">Hello! John Doe</h2>
                <p className="text-base font-normal">We are on a mission to help customer</p>
            </div>
            {/* Stats */}
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4">
  <StatCard
    title="Total Customer"
    value="30,0000"
    icon={
      <svg width="44" height="44" fill="none">
        <g>
          <circle cx="22" cy="22" r="22" fill="#E4FDE3" />
          <path
            d="M30 30v-2a4 4 0 0 0-4-4H18a4 4 0 0 0-4 4v2"
            stroke="#23C16B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="22"
            cy="18"
            r="4"
            stroke="#23C16B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    }
  />

  <StatCard
    title="Total Order"
    value="3200"
    icon={
      <svg width="44" height="44" fill="none">
        <g>
          <circle cx="22" cy="22" r="22" fill="#FFEAE4" />
          <path
            d="M29 17V15a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2"
            stroke="#FF7A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 17h10v10a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V17z"
            stroke="#FF7A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    }
  />

  <StatCard
    title="Total Branch"
    value="32450"
    icon={
      <svg width="44" height="44" fill="none">
        <g>
          <circle cx="22" cy="22" r="22" fill="#E6F2FF" />
          <path
            d="M22 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            stroke="#2D9CDB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 16v-2m0 14v-2m-6-6H8m28 0h-8"
            stroke="#2D9CDB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    }
  />

  <StatCard
    title="Total Delivery Boy"
    value="120"
    icon={
      <svg width="44" height="44" fill="none">
        <g>
          <circle cx="22" cy="22" r="22" fill="#FFF4E4" />
          <path
            d="M30 30v-2a4 4 0 0 0-4-4H18a4 4 0 0 0-4 4v2"
            stroke="#FF9800"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="22"
            cy="18"
            r="4"
            stroke="#FF9800"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    }
  />
  <StatCard
    title="Total Revenue"
    value="$450,000"
    icon={
      <svg width="44" height="44" fill="none">
        <g>
          <circle cx="22" cy="22" r="22" fill="#FFF0F6" />
          <path
            d="M16 22h12M22 16v12"
            stroke="#D63384"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 12a10 10 0 1 1-10 10"
            stroke="#D63384"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    }
  />
</div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Order Status Pie */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h4 className="font-semibold text-lg mb-1">Order Status</h4>
                    <p className="text-xs text-gray-400 mb-2">Total Earnings of the Month</p>
                    <div className="relative h-[180px]">
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
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-xs font-medium text-gray-700">Ratio</p>
                            <p className="text-xl font-bold text-black">100%</p>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col mt-3 space-y-1 text-sm">
                        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "#23C16B" }} />Success Order</div>
                        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "#FFC107" }} />Pending Order</div>
                        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: "#F44336" }} />Failed Order</div>
                    </div>
                </div>
                {/* Area Charts as in requested design */}
                <div className="flex flex-col gap-4">
                    {/* Customer Overview */}
                    <div className="bg-white rounded-xl shadow p-3 flex-1">
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
                    <div className="bg-white rounded-xl shadow p-3 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <UpArrow color="#5AA6FF" bg="#E4F3FF" />
                            <span className="font-semibold text-base">order overview</span>
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
                    <div className="bg-white rounded-xl shadow p-3 flex-1">
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
                {/* <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold mb-2 text-base">Reviews</h4>
                        <button className="rounded-full p-1 hover:bg-gray-100"><RefreshCw size={16} stroke="#23C16B" /></button>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                        {[...Array(4)].map((_, i) => (
                            <Star key={i} fill="#FFC107" size={18} stroke="#FFC107" />
                        ))}
                        <Star fill="none" size={18} stroke="#FFC107" />
                        <span className="ml-2 font-medium text-black text-sm">4.0 out of 5 star</span>
                    </div>
                    <div className="mt-2 space-y-2">
                        {reviews.map((r, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-20 text-xs">{r.label}</span>
                                <div className="w-full bg-[#F2F2F2] rounded-full">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${(r.value / maxReviewValue) * 100}%`,
                                            background: r.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
                {/* <div className="bg-white rounded-xl shadow p-4 flex flex-col min-w-[290px]">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-base">Reviews</h4>
                        <button className="rounded-full p-1 hover:bg-gray-100">
                            <RefreshCw size={18} stroke="#23C16B" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        {[...Array(4)].map((_, i) => (
                            <Star key={i} fill="#FFC107" size={22} stroke="#FFC107" />
                        ))}
                        <Star fill="none" size={22} stroke="#FFC107" />
                        <span className="ml-4 font-bold text-gray-900 text-lg">4.0</span>
                        <span className="ml-1 text-gray-500 text-sm font-medium">out of 5 star</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {reviews.map((r, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-20 min-w-[70px] text-sm text-gray-700">{r.label}</span>
                                <div className="flex-1 h-3 bg-[#f5f5f5] rounded-full overflow-hidden relative">
                                    <div
                                        className="h-3 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(r.value / maxReviewValue) * 100}%`,
                                            background: r.color,
                                        }}
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-3 w-full rounded-full"
                                        style={{
                                            background: r.bg,
                                            zIndex: -1,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col min-w-[320px] max-w-[500px] border border-[#F1F1F1]">
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
                        <div className="flex-1 h-3 rounded-full relative" style={{ background: r.bg }}>
                            <div
                                className="h-3 rounded-full absolute top-0 left-0 transition-all duration-500"
                                style={{
                                    width: `${r.value}%`,
                                    background: r.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
            </div>
            {/* Second Row: Visitor Performance & Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Visitor Performance */}
                <div className="bg-white rounded-xl shadow p-4 md:col-span-2">
                    <div className="flex items-center mb-2 gap-2">
                        <h4 className="font-semibold text-base">Visitor Performance</h4>
                        <span className="flex items-center gap-1 text-xs">
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
                <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <h4 className="text-base font-bold mb-4">Feeds</h4>
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
                        <p className="text-base font-medium">new user registered</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card
function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-4">
            <div>{icon}</div>
            <h4 className="mt-2 text-lg font-semibold">{title}</h4>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}