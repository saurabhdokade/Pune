import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './components/AuthContext';
import CustomerList from './pages/CustomerList';
import ViewCustomerInfo from './pages/ViewCustomerDetails';
import DeliveryBoyList from './pages/DeliveryboyList';
import BranchDeliveryBoyTable from './pages/BranchDeliveryBoyTable';
import BranchInfo from './pages/BranchInfo';
import ViewDeliveryBoyInfo from './pages/ViewDeliveryBoyInfo';
import EditDeliveryBoyInfo from './pages/EditDeliveryBoyInfo';
import AddDeliveryBoy from './pages/AddDevliveryBoy';
import AddBranch from './pages/AddBranch';
import BranchProductDetailsPage from './pages/BranchProducts';
import EditCustomer from './pages/EditCustomer';
import EditBranch from './pages/EditBranch';
import BranchList from './pages/BranchList';
import OrderList from './pages/OrderList';
import OrderDetails from './pages/ViewOrderDetails';
import VendorDashboard from './pages/VendorDashBoard';
import ViewProductDetails from './pages/ViewProductDetails';
import ProductList from './pages/ProductList';
import NotificationForm from './pages/AddNotification';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProducts';
import { FaBars } from 'react-icons/fa';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(true);
  const location = useLocation();

  const hideSidebarAndNavbar = [
    '/login',
    '/login/',
    '/signup',
    '/addstore',
    '/register',
    '/',
  ].includes(location.pathname);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleNavbar = () => setNavbarOpen(prev => !prev);

  return (
    <div className="flex min-h-screen">
      {!hideSidebarAndNavbar && !sidebarOpen && (
        <button
          className="md:hidden mr-4 text-white p-2 rounded-lg hover:bg-[#3b5a89] focus:outline-none fixed top-3 left-3 z-[1002] bg-[#2F5383]"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          type="button"
        >
          <FaBars size={22} />
        </button>
      )}
      {!hideSidebarAndNavbar && (
        <div className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-50">
          <Sidebar isOpen={true} toggleSidebar={setSidebarOpen} />
        </div>
      )}
      {!hideSidebarAndNavbar && (
        <div className="md:hidden">
          <div
            className={`fixed inset-0 z-[1000]  bg-opacity-50 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            onClick={toggleSidebar}
          />
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-[1001] overflow-hidden
              transform transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            onClick={e => e.stopPropagation()}
          >
            {sidebarOpen && (
              <button
                className="absolute top-4 right-4 text-white bg-pink-500 rounded-full p-2 z-[1003] md:hidden"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>{'←'}</span>
              </button>
            )}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {!hideSidebarAndNavbar && navbarOpen && (
          <Navbar toggleSidebar={toggleSidebar} />
        )}
        <div className="flex-1 p-1 overflow-y-auto bg-gray min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            } />
            <Route path='/viewdetails/:id' element={
              <ProtectedRoute>
                <ViewCustomerInfo />
              </ProtectedRoute>
            } />
            <Route path='/deliveryboys' element={
              <ProtectedRoute>
                <DeliveryBoyList />
              </ProtectedRoute>
            } />
            <Route path='/deliveryboyinfo/:runnerId' element={
              <ProtectedRoute>
                <ViewDeliveryBoyInfo />
              </ProtectedRoute>
            } />
            <Route path='/editcustomers/:id' element={
              <ProtectedRoute>
                <EditCustomer />
              </ProtectedRoute>
            } />
            <Route path='/editdeliveryboy/:id' element={
              <ProtectedRoute>
                <EditDeliveryBoyInfo />
              </ProtectedRoute>
            } />
            <Route path='/adddeliveryboy' element={
              <ProtectedRoute>
                <AddDeliveryBoy />
              </ProtectedRoute>
            } />
            <Route path='/branchdeliveryboytable' element={
              <ProtectedRoute>
                <BranchDeliveryBoyTable />
              </ProtectedRoute>
            } />
            <Route path='/branchproduct/:sellerId' element={
              <ProtectedRoute>
                <BranchProductDetailsPage />
              </ProtectedRoute>
            } />
            <Route path='/addbranch' element={
              <ProtectedRoute>
                <AddBranch />
              </ProtectedRoute>
            } />
            <Route path='/view-branch-info/:sellerId' element={
              <ProtectedRoute>
                <BranchInfo />
              </ProtectedRoute>
            } />
            <Route path='/branchlist' element={
              <ProtectedRoute>
                <BranchList />
              </ProtectedRoute>
            } />
            <Route path='/editbranch/:sellerId' element={
              <ProtectedRoute>
                <EditBranch />
              </ProtectedRoute>
            } />
            <Route path='/orders' element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            } />
            <Route path='/vieworderdetails/:orderId' element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path='/vendordashboard/:sellerId' element={
              <ProtectedRoute>
                <VendorDashboard />
              </ProtectedRoute>
            } />
            <Route path='/productdetails/:id' element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            } />
            <Route path='/productList' element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path='/editproduct/:id' element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } />
            <Route path='/notifications' element={
              <ProtectedRoute>
                <NotificationForm/>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;