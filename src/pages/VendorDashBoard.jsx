import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Navbar from '../components/Navbar';
import { AuthContext } from '../components/AuthContext'; // Only import AuthContext, not AuthProvider or useAuth here
import { useNavigate, useParams } from 'react-router-dom';
import { useYearMonthList } from '../components/useYearMonthList'; // Make sure file name is correct: useYearMonthList

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title as ChartTitle
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseurl = import.meta.env.REACT_APP_BASE_URL || "https://api.citycentermall.com";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ChartTitle
);

function isYearOption(val) {
  return typeof val === "number" && val >= 2000;
}

export default function VendorDashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const [storeId, setStoreId] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [currentMonthDeliveredRevenue, setCurrentMonthDeliveredRevenue] = useState(0);
  const [currentMonthTarget, setCurrentMonthTarget] = useState(0);
  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [momGrowth, setMoMGrowth] = useState('0');
  const [orderStatus, setOrderStatus] = useState({ Delivered: 0, Pending: 0, Failed: 0 });
  const [orders, setOrders] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const latestOrderIdRef = useRef(null);

  // Dynamic months and years for dropdown
  const { yearMonthList, loading: dropdownLoading } = useYearMonthList({ sellerId, token });

  // Dropdown state
  const [selectedChartMonth, setSelectedChartMonth] = useState(dayjs().month() + 1);
  const [selectedStatusMonth, setSelectedStatusMonth] = useState(dayjs().month() + 1);

  // For force update of donut chart animation
  const [doughnutKey, setDoughnutKey] = useState(0);

  // 5-day interval graph data (for delivered orders only)
  const [chartIntervalData, setChartIntervalData] = useState({ labels: [], values: [], counts: [] });

  const statsPollingRef = useRef();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    // If you want to check if sellerId matches the token, do it here
  }, [token, navigate, sellerId]);

  useEffect(() => {
    const fetchStore = async () => {
      if (!sellerId || !token) return;
      try {
        const response = await axios.get(
          `${baseurl}/api/v1/store/seller/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const storeData = response.data.store;
        setStoreId(storeData._id || storeData.id);
      } catch (err) {
        toast.error("Unable to load store info");
      }
    };
    fetchStore();
  }, [sellerId, token]);

  // Fetch stats and build 5-5 din interval chart (delivered orders only)
  useEffect(() => {
    if (!storeId || !token || !sellerId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${baseurl}/api/v1/store/${storeId}/dashboard-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const store = res.data.data;

        setCurrentMonthTarget(store?.totalRevenue?.currentMonthTarge || 0);
        setCurrentMonthOrders(store?.totalOrders?.currentMonthOrders || 0);
        setMoMGrowth(store?.totalOrders?.MoMGrowth || '0');
        setPendingDeliveries(store?.pendingDeliveries || 0);

        // Fetch orders for month or year
        let orderRes;
        let filterMonth = !isYearOption(selectedChartMonth);
        if (filterMonth) {
          orderRes = await axios.get(
            `${baseurl}/api/v1/orders/seller/${sellerId}?month=${selectedChartMonth}&year=${dayjs().year()}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          orderRes = await axios.get(
            `${baseurl}/api/v1/orders/seller/${sellerId}?year=${selectedChartMonth}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        let ordersList = orderRes.data.data || [];
        let deliveredOrders = ordersList.filter(o =>
          (o.status || '').toLowerCase() === 'delivered'
        );

        const deliveredRevenueTotal = deliveredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        setCurrentMonthDeliveredRevenue(deliveredRevenueTotal);

        setStats([
          {
            title: 'Delivered Revenue',
            subtitle: `Target: ₹${Number(store?.totalRevenue?.currentMonthTarge || 0).toLocaleString()}`,
            value: `₹${Number(deliveredRevenueTotal).toLocaleString()}`,
            icon: '📊',
            bg: '#e0e7ff'
          },
          {
            title: 'Total Orders',
            subtitle: `MoM Growth: ${store?.totalOrders?.MoMGrowth || '0'}%`,
            value: `${store?.totalOrders?.currentMonthOrders || 0}`,
            icon: '🛒',
            bg: '#cffafe'
          },
          {
            title: 'Pending Delivery',
            subtitle: 'Current',
            value: `${store?.pendingDeliveries || 0}`,
            icon: '📦',
            bg: '#fed7aa'
          },
          {
            title: 'Total Customers',
            subtitle: 'Active Users',
            value: store.totalCustomers || '0',
            icon: '👥',
            bg: '#fef9c3'
          }
        ]);

        // Chart Building: handle month vs year
        let labels = [], values = [], counts = [];
        if (filterMonth) {
          let daysInMonth = dayjs().month(selectedChartMonth - 1).daysInMonth();
          let currentDay = 1;
          while (currentDay <= daysInMonth) {
            let endDay = Math.min(currentDay + 4, daysInMonth);
            const mLabel = yearMonthList.find(m => m.value === selectedChartMonth && m.type === 'month')?.label || '';
            labels.push(`${currentDay}-${endDay} ${mLabel}`);
            let intervalOrders = deliveredOrders.filter(ord => {
              let d = dayjs(ord.date_added);
              return d.month() + 1 === selectedChartMonth && d.date() >= currentDay && d.date() <= endDay;
            });
            let intervalRevenue = intervalOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            values.push(intervalRevenue);
            counts.push(intervalOrders.length);
            currentDay += 5;
          }
        } else {
          for (let m = 1; m <= 12; m++) {
            const mLabel = yearMonthList.find(mm => mm.value === m && mm.type === 'month')?.label || '';
            labels.push(mLabel);
            let intervalOrders = deliveredOrders.filter(ord => {
              let d = dayjs(ord.date_added);
              return d.year() === selectedChartMonth && (d.month() + 1) === m;
            });
            let intervalRevenue = intervalOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            values.push(intervalRevenue);
            counts.push(intervalOrders.length);
          }
        }
        if (deliveredOrders.length === 0) {
          values = Array(labels.length).fill(0);
          counts = Array(labels.length).fill(0);
        }
        setChartIntervalData({ labels, values, counts });
      } catch (err) {
        setError('Failed to load dashboard stats');
        toast.error('Error loading dashboard stats!');
        let labels = [];
        if (!isYearOption(selectedChartMonth)) {
          let daysInMonth = dayjs().month(selectedChartMonth - 1).daysInMonth();
          let currentDay = 1;
          while (currentDay <= daysInMonth) {
            let endDay = Math.min(currentDay + 4, daysInMonth);
            const mLabel = yearMonthList.find(m => m.value === selectedChartMonth && m.type === 'month')?.label || '';
            labels.push(`${currentDay}-${endDay} ${mLabel}`);
            currentDay += 5;
          }
        } else {
          for (let m = 1; m <= 12; m++) {
            const mLabel = yearMonthList.find(mm => mm.value === m && mm.type === 'month')?.label || '';
            labels.push(mLabel);
          }
        }
        setChartIntervalData({ labels, values: Array(labels.length).fill(0), counts: Array(labels.length).fill(0) });
        setCurrentMonthDeliveredRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    if (statsPollingRef.current) clearInterval(statsPollingRef.current);
    statsPollingRef.current = setInterval(fetchStats, 20000);

    return () => {
      if (statsPollingRef.current) clearInterval(statsPollingRef.current);
    };
  }, [storeId, token, selectedChartMonth, sellerId, yearMonthList]);

  // Order status for donut chart (by selectedStatusMonth)
  useEffect(() => {
    if (!storeId || !token || !sellerId) return;
    const fetchOrderStatus = async () => {
      try {
        let filterMonth = !isYearOption(selectedStatusMonth);
        let orderRes;
        if (filterMonth) {
          orderRes = await axios.get(
            `${baseurl}/api/v1/orders/seller/${sellerId}?month=${selectedStatusMonth}&year=${dayjs().year()}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          orderRes = await axios.get(
            `${baseurl}/api/v1/orders/seller/${sellerId}?year=${selectedStatusMonth}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        let ordersList = orderRes.data.data || [];
        if (filterMonth) {
          ordersList = ordersList.filter(o => {
            const d = dayjs(o.date_added);
            return d.year() === dayjs().year() && (d.month() + 1) === selectedStatusMonth;
          });
        } else {
          ordersList = ordersList.filter(o => {
            const d = dayjs(o.date_added);
            return d.year() === selectedStatusMonth;
          });
        }
        const delivered = ordersList.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
        const pending = ordersList.filter(o => (o.status || '').toLowerCase() === 'pending').length;
        const failed = ordersList.filter(o => (o.status || '').toLowerCase() === 'failed').length;
        setOrderStatus({
          Delivered: delivered,
          Pending: pending,
          Failed: failed
        });
        setDoughnutKey(prev => prev + 1);
      } catch (err) {
        setOrderStatus({ Delivered: 0, Pending: 0, Failed: 0 });
        setDoughnutKey(prev => prev + 1);
      }
    };
    fetchOrderStatus();
  }, [storeId, token, selectedStatusMonth, sellerId, yearMonthList]);

  useEffect(() => {
    if (!storeId || !sellerId || !token) return;
    let polling = null;
    const fetchRecentOrders = async (updateFeeds = false) => {
      try {
        const res = await axios.get(
          `${baseurl}/api/v1/orders/seller/${sellerId}?page=1&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.data || [];
        setOrders(data);

        if (updateFeeds && data.length > 0) {
          const latestOrder = data[0];
          if (latestOrder.id !== latestOrderIdRef.current) {
            setFeeds([
              {
                id: latestOrder.id,
                type: "new-order",
                text: "New order recieved",
                img: "../../public/images/neworders.png",
                time: latestOrder.date_added || new Date().toISOString()
              }
            ]);
            latestOrderIdRef.current = latestOrder.id;
          }
        }
      } catch (error) {
        toast.error("Failed to load recent orders");
      }
    };

    fetchRecentOrders(true);
    polling = setInterval(() => {
      fetchRecentOrders(true);
    }, 20000);

    return () => polling && clearInterval(polling);
  }, [storeId, sellerId, token]);

  const intervalChartData = {
    labels: chartIntervalData.labels,
    datasets: [
      {
        label: isYearOption(selectedChartMonth)
          ? "Delivered Revenue (Monthly)"
          : `Delivered Revenue (5 din ka interval)`,
        data: chartIntervalData.values,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        borderColor: '#10b981',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const intervalChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          afterBody: function (context) {
            const idx = context[0].dataIndex;
            return `Delivered Count: ${chartIntervalData.counts[idx] || 0}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₹${value.toLocaleString()}`
        }
      }
    }
  };

  const donutData = {
    labels: ['Delivered', 'Pending', 'Failed'],
    datasets: [
      {
        label: 'Order Status',
        data: [
          orderStatus.Delivered,
          orderStatus.Pending,
          orderStatus.Failed
        ],
        backgroundColor: ['#10b981', '#facc15', '#ef4444'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-4 font-sans p-6 mb-4 mt-14">
      <ToastContainer />
      <div className="fixed top-0 left-0 right-0 z-30 md:ml-64">
        <Navbar screenName="Vendor Dashboard" />
      </div>
  
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 gap-4">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
              <div className="text-3xl p-3 rounded-full" style={{ backgroundColor: item.bg || '#f3f4f6' }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.title}</p>
                <h4 className="text-lg font-bold">{item.value}</h4>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 5 din interval Line Chart - with month/year dropdown */}
          <div className="bg-white rounded-xl shadow-md p-4 h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sales Chart</h3>
              <select
                className="border p-1 rounded text-sm"
                value={selectedChartMonth}
                onChange={e => setSelectedChartMonth(Number(e.target.value))}
                disabled={dropdownLoading}
              >
                {yearMonthList.map(m => (
                  <option key={m.type + '-' + m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Line data={intervalChartData} options={intervalChartOptions} height={180} />
            </div>
          </div>

          {/* Order Status Donut Chart - with month/year dropdown */}
          <div className="bg-white rounded-xl shadow-md p-4 h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">Order Status</h3>
              <select
                className="border p-1 rounded text-sm"
                value={selectedStatusMonth}
                onChange={e => setSelectedStatusMonth(Number(e.target.value))}
                disabled={dropdownLoading}
              >
                {yearMonthList.map(m => (
                  <option key={m.type + '-' + m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Orders in {yearMonthList.find(m => m.value === selectedStatusMonth)?.label || selectedStatusMonth}
            </p>
            <div className="flex items-center justify-center flex-1">
              <div className="w-[100px] h-[100px]">
                <Doughnut key={doughnutKey} data={donutData} options={{
                  plugins: { legend: { display: false } }, cutout: '90%'
                }} />
              </div>
              <div className="text-xs space-y-1 ml-4">
                <div>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Delivered: {orderStatus.Delivered}
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  Pending: {orderStatus.Pending}
                </div>
                <div>
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Failed: {orderStatus.Failed}
                </div>
              </div>
            </div>
          </div>

          {/* Feeds */}
          <div className="bg-white rounded-xl shadow-md p-4 h-[300px] flex flex-col overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Feeds</h3>
            <div className="space-y-3 flex-1">
              <div className="pb-2 border-b text-sm flex items-center gap-2">
                {pendingDeliveries > 0 ? (
                  <>
                    <img
                      src="../../public/images/pending.png"
                      alt="Pending Deliveries"
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <span>
                      You have {pendingDeliveries} pending deliver
                      {pendingDeliveries > 1 ? 'ies' : 'y'}
                    </span>
                  </>
                ) : (
                  'No pending deliveries'
                )}
                <div className="text-xs text-gray-500 ml-auto">
                  Last updated: {dayjs().format('h:mm:ss A')}
                </div>
              </div>
              {feeds.map(feed => (
                <div key={feed.id} className="flex items-center pb-2 border-b last:border-b-0">
                  <img
                    src={feed.img}
                    alt="New Order"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    style={{ border: 'none', background: 'none' }}
                  />
                  <div className="flex-1">
                    <span className="text-base font-medium">{feed.text}</span>
                  </div>
                  <span className="text-xs text-gray-400">{dayjs(feed.time).fromNow()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto hidden md:block">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="p-2">Customer</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">User ID</th>
                  <th className="p-2">Order Placed</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      {loading ? 'Loading orders...' : 'No recent orders available'}
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={order.id || idx} className="border-b hover:bg-gray-50">
                      <td className="p-2 flex items-center space-x-2">
                        {order.user?.name || order.user?.username || order.mobile || 'N/A'}
                      </td>
                      <td className="px-4 py-2">
                        {order.order_item && order.order_item.length > 0
                          ? order.order_item.map((item, i) => (
                            <div key={i}>
                              {item.product_name || item.variant_name || 'Unnamed Product'}
                            </div>
                          ))
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-2">{order.user_id || 'N/A'}</td>
                      <td className="px-4 py-2">
                        {order.date_added ? dayjs(order.date_added).format('MMM D, YYYY h:mm A') : 'N/A'}
                      </td>
                      <td className="px-4 py-2">₹{Number(order.total).toLocaleString() || 0}</td>
                      <td className="px-4 py-2 capitalize">{order.status || 'Pending'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}