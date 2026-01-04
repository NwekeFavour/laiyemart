// Topbar.js
import React, { useState } from "react";
import { Bell, User2, Moon, Settings, BellRing, Laptop, Gift, Download, HelpCircle, LogOut, X } from "lucide-react";
import { Menu, MenuItem, Avatar, Switch, IconButton, Popover } from "@mui/material";
import { Divider } from "@mui/joy";
import { Link } from "react-router-dom";

export default function Topbar({ scrollRef, isDark, toggleDarkMode, setSidebarOpen, demo, setDemo }) {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 transition
      ${isDark ? "bg-slate-950 border-slate-700" : "bg-white border-gray-200"} border-b`}
    >
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden mr-2 p-1 rounded hover:bg-gray-200"
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        <svg className="w-6 h-6" fill="none" stroke={isDark ? "white" : "black"} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Left: Store Front / Demo Toggle */}
      <div className="flex items-center gap-3">
        <Link  onClick={() => setDemo(!demo)}  className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}>
          Store Front
        </Link>

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
        <div
          onClick={handleOpen}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors 
            ${open ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
        >
          <Bell size={20} className={isDark ? "text-slate-400" : "text-gray-600"} />
        </div>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            className: "mt-2 w-[360px] rounded-xl shadow-2xl border border-gray-100 overflow-hidden bg-white",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200">
            <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
            <X
              size={16}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={handleClose}
            />
          </div>

          {/* Filters */}
          <div className="flex px-3 border-b border-slate-100 text-xs font-medium">
            <button className="px-3 py-2 border-b-2 border-blue-500 text-blue-600">All</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Mentions</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Team</button>
            <button className="ml-auto px-2 text-gray-400 hover:text-gray-600">
              <Settings size={14} />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-105 overflow-y-auto divide-y">
            <div className="px-4 border-b border-slate-100 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer">
              <div className="relative">
                <Avatar sx={{ width: 34, height: 34, fontSize: 12 }}>JL</Avatar>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-700 leading-snug">
                  <span className="font-semibold text-gray-900">Joe Lincoln</span>{" "}
                  mentioned you in <span className="text-blue-600">Latest Trends</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">18 minutes ago</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 flex justify-between text-xs font-medium">
            <button className="text-gray-500 hover:text-gray-700">Mark all as read</button>
            <button className="text-blue-600 hover:text-blue-700">View all</button>
          </div>
        </Popover>

        {/* Profile */}
        <IconButton
          className={`w-9 h-9 rounded-full ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          <User2 size={20} className={isDark ? "text-slate-400" : "text-gray-600"} />
        </IconButton>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          slotProps={{
            paper: {
              className: `mt-2 w-64 rounded-xl shadow-xl border 
                ${isDark ? "border-slate-700 bg-slate-900 text-slate-200" : "border-gray-100 bg-white text-gray-900"}`
            }
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {/* Header with Avatar */}
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <Avatar src="https://i.pravatar.cc/150?u=sean" sx={{ width: 40, height: 40 }} />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? "text-white" : ""}`}>Sean</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Online</p>
            </div>
          </div>

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

          <Divider className={isDark ? "border-slate-700" : ""} />

          <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
            <LogOut size={18} className={isDark ? "text-red-400" : "text-red-500"} /> Log out
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
}
