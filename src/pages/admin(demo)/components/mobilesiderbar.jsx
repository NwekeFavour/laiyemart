// MobileSidebar.js
import { LayoutGrid, Boxes, Package, Layers, ShoppingCart, Users, Settings, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

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
        <ChevronDown size={16} className={`transition-transform ease-out ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`ml-6 overflow-hidden transition-all duration-300 ease-out
          ${open ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
      >
        <div className={`space-y-1 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          {children}
        </div>
      </div>
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

export default function MobileSidebar({ isDark, collapsed: parentCollapsed, demo, setDemo, setCollapsed, mobileOpen, setMobileOpen, activePage, setActivePage }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsedState] = useState(false);

  const handleSelect = (page) => {
    setActivePage(page);      // update parent activePage
    setMobileOpen(false);     // close drawer
  };

  const handleDemoToggle = () => setDemo(!demo);
    useEffect(() => {
      setCollapsedState(parentCollapsed);
  }, [parentCollapsed]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  

  return (
    <>
      {/* Overlay */}
    <div 
        className={`fixed inset-0 bg-black/50 z-1 transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setMobileOpen(false)} 
      />
      {/* Sidebar drawer */}
      <aside
        className={`fixed lg:hidden block top-0 left-0 h-screen w-64 z-50 flex flex-col
          transform transition-transform duration-300 ease-out
          ${mounted ? "transition-transform duration-300 ease-out" : ""}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-gray-900"}
          shadow-lg`}
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

        <div className=" flex items-end justify-end me-5 mt-3">
          <button
            className="bg-slate-400  cursor-pointer! text-white text-xs px-3 py-2 rounded-lg shadow-md hover:bg-slate-600 transition whitespace-nowrap"
            onClick={() => {
            handleDemoToggle();
            }}
          >
            {demo ? 'Go Back to Store' : 'Online Store'}
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


          <SimpleMenuItem
            icon={Layers}
            label="All Categories"
            isDark={isDark}
            active={activePage === "categories"}
            onClick={() => handleSelect("categories")}
          />

          <SimpleMenuItem 
            icon={ShoppingCart} 
            label="Orders"  
            isDark={isDark} 
            active={activePage === "orders"} 
            onClick={() => handleSelect("orders")} />

          <SimpleMenuItem icon={Users} label="Customers"  isDark={isDark} active={activePage === "customers"} onClick={() => handleSelect("customers")} />

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
