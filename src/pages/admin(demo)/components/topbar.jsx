// Topbar.js
import React, { useState } from "react";
import { Bell, User2, Moon, Settings, BellRing, Laptop, Gift, Download, HelpCircle, LogOut, X, ImageIcon} from "lucide-react";
import { Menu, MenuItem, Avatar, Switch, IconButton, Popover } from "@mui/material";
import { Divider } from "@mui/joy";
import { Link } from "react-router-dom";

export default function Topbar({ scrollRef, isDark, toggleDarkMode, setSidebarOpen }) {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if(isDark){
    localStorage.setItem("theme", "dark");
  }
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null); 
  return (
    <header className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 transition
      ${isDark ? "bg-slate-950 border-[#E5E7EB]" : "bg-white border-gray-200"} border-b`}>
      
      {/* Hamburger for mobile */}
      <button className={`lg:hidden mr-2 p-1 rounded hover:bg-gray-200 `} onClick={() => setSidebarOpen(true)}>
        <svg className="w-6 h-6" fill="none" stroke={isDark ? "white" : "black"} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <div>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <input
          placeholder="Search shop"
          className={`hidden sm:block border rounded-lg px-3 py-2 text-sm focus:outline-none
            ${isDark ? "border-[#E5E7EB] bg-slate-800 text-white" : "border-gray-200 bg-white text-gray-900"}
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
            className: `mt-2 w-[360px] rounded-xl shadow-2xl border overflow-hidden transition-colors duration-200
              ${isDark 
                ? "bg-slate-900 border-[#E5E7EB] shadow-black/50" 
                : "bg-white border-gray-100 shadow-2xl"
              }`,
          }}
        >
          {/* Header */}
          <div className={`px-4 py-3 flex items-center justify-between border-b 
            ${isDark ? " bg-slate-950" : "border-slate-200"}`}>
            <h2 className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Notifications
            </h2>
            <X
              size={16}
              className={`cursor-pointer transition-colors 
                ${isDark ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"}`}
              onClick={handleClose}
            />
          </div>

          {/* Filters */}
          <div className={`flex px-3 border-b text-xs font-medium 
            ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-100"}`}>
            <button className={`px-3 py-2 border-b-2 transition-colors
              ${isDark ? "border-blue-500 text-blue-400" : "border-blue-500 text-blue-600"}`}>
              All
            </button>
            <button className={`px-3 py-2 transition-colors
              ${isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"}`}>
              Mentions
            </button>
            <button className={`px-3 py-2 transition-colors
              ${isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"}`}>
              Team
            </button>
            <button className={`ml-auto px-2 transition-colors
              ${isDark ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"}`}>
              <Settings size={14} />
            </button>
          </div>

          {/* Notification List */}
          <div className={`max-h-105 overflow-y-auto divide-y ${isDark ? "divide-slate-800 border-b border-slate-800 bg-slate-950" : "divide-gray-100"}`}>
            {/* Notification Item */}
            <div className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors
              ${isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50"}`}>
              <div className="relative">
                <Avatar sx={{ 
                  width: 34, 
                  height: 34, 
                  fontSize: 12,
                  bgcolor: isDark ? '#334155' : '#e2e8f0', // slate-700 or slate-200
                  color: isDark ? '#f1f5f9' : '#475569' 
                }}>JL</Avatar>
                <span className={`absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full border 
                  ${isDark ? "border-slate-900" : "border-white"}`} />
              </div>

              <div className="flex-1">
                <p className={`text-[13px] leading-snug ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  <span className={`font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Joe Lincoln</span>{" "}
                  mentioned you in{" "}
                  <span className="text-blue-500 font-medium">Latest Trends</span>
                </p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  18 minutes ago
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-4 py-3 border-slate-200 border-t  flex justify-between text-xs font-medium 
            ${isDark ? "bg-slate-950 border-none" : "bg-white"}`}>
            <button className={`transition-colors 
              ${isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"}`}>
              Mark all as read
            </button>
            <button className={`transition-colors 
              ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
              View all
            </button>
          </div>
        </Popover>


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
                    ${isDark ? "border-[#E5E7EB]! bg-slate-900! text-slate-200!" : "border-gray-100 bg-white text-gray-900"}`
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
                ${isDark ? "border-[#E5E7EB] text-slate-400 hover:bg-slate-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                <span className="opacity-50 text-base">🕒</span> Set status
                </button>
            </div>

            <Divider className={isDark ? "border-[#E5E7EB]" : ""} />

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

            <Divider className={isDark ? "border-[#E5E7EB]" : ""} />

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

            <Divider className={isDark ? "border-[#E5E7EB]" : ""} />

            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <Download size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Download apps
            </MenuItem>
            <MenuItem className={`gap-3 py-2.5 text-sm ${isDark ? "text-slate-200" : ""}`} onClick={() => setProfileAnchor(null)}>
                <HelpCircle size={18} className={isDark ? "text-slate-400" : "text-gray-400"} /> Help
            </MenuItem>

            <Divider className={isDark ? "border-[#E5E7EB]" : ""} />

            <MenuItem className={`gap-3 py-2.5 text-sm font-medium text-red-500`} onClick={() => setProfileAnchor(null)}>
                <LogOut size={18} className={isDark ? "text-red-400" : "text-red-500"} /> Log out
            </MenuItem>
            </Menu>

      </div>
    </header>
  );
}
