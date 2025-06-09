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

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide sidebar/navbar for auth routes
  const hideSidebarAndNavbar = [
    '/login',
    '/login/',
    '/signup',
    '/addstore',
    '/register',
    '/',
  ].includes(location.pathname);

  // Close sidebar automatically on route change (for mobile UX)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Open Icon Button (→) - only visible if sidebar is closed and not hidden */}
      {!hideSidebarAndNavbar && !sidebarOpen && (
        <button
          className="fixed top-1 left-2 z-[1002] p-2 rounded-md shadow md:hidden bg-white"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          {/* Right Arrow Icon (→) */}
          <span style={{ fontSize: 24, color: '#7c3aed', fontWeight: 'bold' }}>{'→'}</span>
        </button>
      )}

      {/* Desktop Sidebar */}
      {!hideSidebarAndNavbar && (
        <div className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-50">
          <Sidebar isOpen={true} toggleSidebar={setSidebarOpen} />
        </div>
      )}

      {/* Mobile Sidebar & Overlay */}
      {!hideSidebarAndNavbar && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-[1000]  bg-opacity-50 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-[#2F5383] text-white z-[1001] overflow-hidden
              transform transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Icon (←) - show only if sidebar is open */}
            {sidebarOpen && (
              <button
                className="absolute top-4 right-4 text-white bg-pink-500 rounded-full p-2 z-[1003] md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                {/* Left Arrow Icon (←) */}
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>{'←'}</span>
              </button>
            )}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {!hideSidebarAndNavbar && (
          <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        )}
        <div className="flex-1 p-1 overflow-y-auto bg-gray min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
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
            <Route path='/productdetails' element={
              <ProtectedRoute>
                <ViewProductDetails />
              </ProtectedRoute>
            } />
            {/* Add more protected routes here */}
            {/* Optional: Catch-all route */}
            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
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