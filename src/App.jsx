import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
// 1. Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/home'
import LoginPage from './pages/auth/login'
import SignUpPage from './pages/auth/register'
import SuperAdminDashboard from './pages/admin/admin'
import StoreOwnerTrialDashboard from './pages/admin(StoreOwner)/admin'
import Unauthorized from './components/unauthorized';
import ProtectedRoute from '../ProtectedRoute';
import RoleRedirect from './components/redirect';
import OrdersPage from './pages/admin(StoreOwner)/orders';
import ProductsPage from './pages/admin(StoreOwner)/products';
import SettingsPage from './pages/admin(StoreOwner)/settings';
import DemoHome from './pages/(demo)/home';
import AuthPage from './pages/admin(StoreOwner)/auth/login';
import PaymentSuccess from './pages/paymentSuccess';
import CustomerSignUp from './pages/admin(StoreOwner)/auth/register';
import StoreResolver, { getSubdomain } from '../storeResolver';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import CategoriesTable from './pages/admin(StoreOwner)/category';
import VerifyStore from './pages/verifyStore';


function App() {
  const subdomain = getSubdomain();
  if (subdomain) {
    return (
      <div className='hide-scrollbar'>
        <Routes>
          {/* All store-front related routes go here */}
          <Route path='/' element={<DemoHome storeSlug={subdomain}/>}/>
          <Route path='/login' element={<AuthPage/>}/>
          <Route path='/register' element={<CustomerSignUp/>}/>
          <Route path='*' element={<div>Store Page Not Found</div>}/>
        </Routes>
        <ToastContainer theme="colored" />
      </div>
    );
  }
  return (
    <div className='hide-scrollbar'>

      
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/sign-in' element={<LoginPage/>}/>
        <Route path='/auth/sign-up' element={<SignUpPage/>}/>
        <Route path='/auth/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path="/auth/redirect" element={<RoleRedirect />} />
        <Route path='/payment/success' element={<PaymentSuccess/>}/>
        {/* Super Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path='/dashboard' element={<SuperAdminDashboard/>}/>
        </Route>

        {/* Store Owners Only */}
        <Route element={<ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']} />}>
          <Route path='/dashboard/beta' element={<StoreOwnerTrialDashboard/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']} />}>
          <Route path='/dashboard/orders' element={<OrdersPage/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']} />}>
          <Route path='/dashboard/products' element={<ProductsPage/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']} />}>
          <Route path='/dashboard/settings' element={<SettingsPage/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']} />}>
          <Route path='/dashboard/categories' element={<CategoriesTable/>}/>
        </Route>
        <Route path='/verify-store-email/:token' element={<VerifyStore/>}/>
        <Route path='*' element={<div className='flex items-center justify-center h-screen text-3xl font-semibold'>404 - Page Not Found</div>}/>
      </Routes>
      {/* 2. Add ToastContainer with a clean, modern config */}
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // or "light" if you prefer a cleaner look
      />
    </div>
  )
}

export default App;