// MobileSidebar.js
import { LayoutGrid, Boxes, Package, Layers, ShoppingCart, Users, Settings, ChevronDown, X } from "lucide-react";
import { useState } from "react";

// Collapsible menu for submenus
const MenuItem = ({ icon: Icon, label, children, isDark }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
          ${isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-gray-100 text-gray-900"}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className="font-medium">{label}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`ml-6 mt-1 space-y-1 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// Simple menu item
const SimpleMenuItem = ({ icon: Icon, label, isDark, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
      ${active ? (isDark ? "bg-slate-700" : "bg-gray-200") : ""}
      ${isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-gray-100 text-gray-900"}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default function MobileSidebar({ isDark, mobileOpen, setMobileOpen, activePage, setActivePage }) {
  if (!mobileOpen) return null;

  const handleSelect = (page) => {
    setActivePage(page);      // update parent activePage
    setMobileOpen(false);     // close drawer
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-50 flex flex-col
          ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-gray-900"} shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span  className={`font-bold text text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`}>LAIYEMART</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700">
            <X size={20} className={isDark ? "text-slate-200" : "text-gray-900"} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
          <SimpleMenuItem
            icon={LayoutGrid}
            label="Dashboard"
            isDark={isDark}
            active={activePage === "dashboard"}
            onClick={() => handleSelect("dashboard")}
          />

          <SimpleMenuItem
            icon={Package}
            label="Products"
            isDark={isDark}
            active={activePage === "products"}
            onClick={() => handleSelect("products")}
          />


          <MenuItem icon={Layers} label="Categories" isDark={isDark}>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("categories")}
            >
              All Categories
            </button>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("createCategory")}
            >
              Create Category
            </button>
          </MenuItem>

          <MenuItem icon={ShoppingCart} label="Orders" isDark={isDark}>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("orders")}
            >
              Order List
            </button>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("orderDetails")}
            >
              Order Details
            </button>
          </MenuItem>

          <MenuItem icon={Users} label="Customer" isDark={isDark}>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("customers")}
            >
              Customers
            </button>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("customerDetails")}
            >
              Customer Details
            </button>
          </MenuItem>

          <MenuItem icon={Settings} label="Settings" isDark={isDark}>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("settings")}
            >
              General
            </button>
            <button
              className="block hover:text-blue-400 w-full text-left"
              onClick={() => handleSelect("security")}
            >
              Security
            </button>
          </MenuItem>
        </nav>
      </aside>
    </>
  );
}
