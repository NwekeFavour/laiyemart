import { LayoutGrid, Boxes, Package, Layers, ShoppingCart, Users, Settings, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ icon: Icon, label, collapsed, children, isDark }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg
          transition-colors ${isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-gray-100 text-gray-900"}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {!collapsed && <span className="font-medium">{label}</span>}
        </div>
        {!collapsed && <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {!collapsed && open && (
        <div className={`ml-8 mt-1 space-y-1 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          {children}
        </div>
      )}
    </div>
  );
};

const SimpleMenuItem = ({ icon: Icon, label, collapsed, isDark, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium
      ${isDark ? "hover:bg-slate-700 text-slate-200" : "hover:bg-gray-100 hover:text-blue-600 text-gray-900"}`}
  >
    <Icon size={18} />
    {!collapsed && <span>{label}</span>}
  </button>
);

export default function Sidebar({ isDark, collapsed: parentCollapsed, setCollapsed, mobileOpen, setMobileOpen, onSelect, demo, setDemo }) {
  const [collapsed, setCollapsedState] = useState(false);

  // Toggle demo mode
  const handleDemoToggle = () => setDemo(!demo);
  useEffect(() => {
    setCollapsedState(parentCollapsed);
  }, [parentCollapsed]);

  return (
    <aside
      onMouseEnter={() => {
        if (!mobileOpen) setCollapsedState(false);
      }}
      onMouseLeave={() => {
        if (!mobileOpen) setCollapsedState(true);
      }}
      className={`
        relative  
        h-screen lg:block hidden flex-col z-24 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} 
        ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-r border-gray-300"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-0 px-4 py-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span className={`font-bold text text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`}>LAYEMART</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsedState(prev => !prev)}
            className={`p-1 rounded-lg ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"} hidden lg:inline-flex`}
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${collapsed ? "rotate-180" : ""} ${isDark ? "text-slate-200" : "text-gray-900"}`}
            />
          </button>

                {/* Demo toggle button */}
          <div className="absolute top-4   left-full ml-2">
            <button
              className="bg-slate-700 z-90!  cursor-pointer! text-white text-xs px-3 py-2 rounded-lg shadow-md hover:bg-slate-600 transition whitespace-nowrap"
              onClick={() => {
                handleDemoToggle();
              }}
            >
              {demo ? 'Go Back to Store' : 'Online Store'}
            </button>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`p-1 rounded-lg ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"} md:inline-flex lg:hidden`}
          >
            <X size={18} className={isDark ? "text-slate-200" : "text-gray-900"} />
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="pt-5 px-3 space-y-3 text-sm">
        <SimpleMenuItem icon={LayoutGrid} label="Dashboard" collapsed={collapsed} isDark={isDark} onClick={() => onSelect("dashboard")} />


        <SimpleMenuItem icon={Package} label="Products" collapsed={collapsed} isDark={isDark} onClick={() => onSelect("products")} />

        <SimpleMenuItem icon={Layers} label="All Categories" collapsed={collapsed} isDark={isDark} onClick={() => onSelect("categories")} />

        <SimpleMenuItem icon={ShoppingCart} label="Orders" collapsed={collapsed} isDark={isDark} onClick={() => onSelect("orders")} />

        <SimpleMenuItem icon={Users} label="Customers" collapsed={collapsed} isDark={isDark} onClick={() => onSelect("customers")} />

        <MenuItem icon={Settings} label="Settings" collapsed={collapsed} isDark={isDark}>
          <div onClick={() => onSelect("settings")} className="py-1 cursor-pointer hover:text-blue-400">General</div>
          <div onClick={() => onSelect("security")} className="py-1 cursor-pointer hover:text-blue-400">Security</div>
        </MenuItem>
      </nav>
    </aside>
  );
}
