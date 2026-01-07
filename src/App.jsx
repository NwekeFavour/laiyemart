import { useState } from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/home'
import LoginPage from './pages/auth/login'
import SignUpPage from './pages/auth/register'
import SuperAdminDashboard from './pages/admin/admin'



function App() {
  return (
    <div className='hide-scrollbar'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/auth/sign-in' element={<LoginPage/>}/>
        <Route path='/auth/sign-up' element={<SignUpPage/>}/>
        <Route path='/dashboard' element={<SuperAdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App
