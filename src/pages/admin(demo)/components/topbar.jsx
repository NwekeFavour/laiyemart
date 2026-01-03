// Topbar.js
import React, { useState } from "react";
import { Bell, User2, Moon, Settings, BellRing, Laptop, Gift, Download, HelpCircle, LogOut } from "lucide-react";
import { Menu, MenuItem, Avatar, Switch, IconButton } from "@mui/material";
import { Divider } from "@mui/joy";

export default function Topbar({ scrollRef, isDark, toggleDarkMode, setSidebarOpen }) {
  const [profileAnchor, setProfileAnchor] = useState(null);

  return (
    <header className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 transition
      ${isDark ? "bg-slate-950 border-slate-700" : "bg-white border-gray-200"} border-b`}>
      
      {/* Hamburger for mobile */}
      <button className="lg:hidden mr-2 p-1 rounded hover:bg-gray-200" onClick={() => setSidebarOpen(prev => !prev)}>
        <svg className="w-6 h-6" fill="none" stroke={isDark ? "white" : "black"} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className={`flex items-center gap-2 sm:gap-3 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
        <span className="hidden sm:inline">Dashboards</span>
        <span className="hidden sm:inline">›</span>
        <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Default</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <input
          placeholder="Search shop"
          className={`hidden sm:block border rounded-lg px-3 py-2 text-sm focus:outline-none
            ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-gray-200 bg-white text-gray-900"}
            w-40 md:w-64`}
        />

        {/* Notification */}
        <IconButton className={`w-9 h-9 rounded-full ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
          <Bell size={20} className={isDark ? "text-slate-400" : "text-gray-600"} />
        </IconButton>

        {/* Profile */}
        <IconButton className={`w-9 h-9 rounded-full ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`} onClick={e => setProfileAnchor(e.currentTarget)}>
          <User2 size={20} className={isDark ? "text-slate-400" : "text-gray-600"} />
        </IconButton>

        {/* Profile Menu */}
            <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            slotProps={{
                paper: {
                className: `mt-2 w-64 rounded-xl shadow-xl border 
                    ${isDark ? "border-slate-700! bg-slate-900! text-slate-200!" : "border-gray-100 bg-white text-gray-900"}`
                }
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
            {/* Header with Avatar */}
            <div className="px-4 py-3 flex items-center gap-3">
                <div className="relative">
                <Avatar src="https://i.pravatar.cc/150?u=sean" sx={{ width: 40, height: 40 }} />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 
                    border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                <p className={`text-sm font-bold ${isDark ? "text-white" : ""}`}>Sean</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Online</p>
                </div>
            </div>

            {/* Set Status Button */}
            <div className="px-3 pb-2">
                <button className={`w-full text-left px-3 py-1.5 text-xs border rounded-lg flex items-center gap-2
                ${isDark ? "border-slate-700 text-slate-400 hover:bg-slate-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                <span className="opacity-50 text-base">🕒</span> Set status
                </button>
            </div>

            <Divider className={isDark ? "border-slate-700" : ""} />

            {/* Menu Items */}
            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <User2 size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Profile
            </MenuItem>
            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <Settings size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Settings
            </MenuItem>
            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <BellRing size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Notification settings
            </MenuItem>

            <Divider className={isDark ? "border-slate-700" : ""} />

            {/* Dark Mode Toggle */}
            <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                <Moon size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Dark mode
                </div>
                <Switch 
                size="small"
                checked={isDark} 
                onChange={toggleDarkMode}
                sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b82f6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3b82f6' },
                }}
                />
            </div>

            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <Laptop size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Keyboard shortcuts
            </MenuItem>

            <MenuItem className={`gap-3 py-2.5 text-sm justify-between ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <div className="flex items-center gap-3">
                <Gift size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Referrals
                </div>
                <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">New</span>
            </MenuItem>

            <Divider className={isDark ? "border-slate-700" : ""} />

            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <Download size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Download apps
            </MenuItem>
            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <HelpCircle size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Help
            </MenuItem>

            <Divider className={isDark ? "border-slate-700" : ""} />

            <MenuItem className={`gap-3 py-2.5 text-sm font-medium text-red-500`} onClick={() => setProfileAnchor(null)}>
                <LogOut size={18} className={isDark ? "text-red-400" : "text-red-500"} /> Log out
            </MenuItem>
            </Menu>

      </div>
    </header>
  );
}
