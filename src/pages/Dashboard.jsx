import React from "react";
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

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Product"
          className="border rounded-full px-4 py-2 w-1/3"
        />
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5" />
          <UserCircle className="w-6 h-6" />
          <span className="font-medium">John Doe</span>
        </div>
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
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-2">Order Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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
                    style={{ width: `${r.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feeds */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="font-semibold mb-2">Feeds</h4>
          <ul className="space-y-2 text-sm">
            <li>📦 You have 4 pending orders</li>
            <li>🆕 New user registered</li>
          </ul>
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
