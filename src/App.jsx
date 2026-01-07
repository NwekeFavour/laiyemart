import { useState } from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/home'
import LoginPage from './pages/auth/login'
import SignUpPage from './pages/auth/register'
import SuperAdminDashboard from './pages/admin/admin'
import StoreOwnerTrialDashboard from './pages/admin(StoreOwner)/admin'



function App() {
  return (
    <div className='hide-scrollbar'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/auth/sign-in' element={<LoginPage/>}/>
        <Route path='/auth/sign-up' element={<SignUpPage/>}/>
        <Route path='/dashboard' element={<SuperAdminDashboard/>}/>
        <Route path='*' element={<div className='flex items-center justify-center h-screen text-3xl font-semibold'>404 - Page Not Found</div>}/>
        <Route path='/dashboard/beta' element={<StoreOwnerTrialDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App
