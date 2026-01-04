import React, { useRef, useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import MobileSidebar from "./mobilesiderbar";

export default function DashboardLayout({ children,  activePage, setActivePage }) {
  const contentRef = useRef(null);

  // Sidebar state
  const [collapsed, setCollapsed] = useState(false);  // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile toggle

  const [isDark, setIsDark] = useState(false); // Dark mode state
  // Dark mode toggle
  const toggleDarkMode = () => setIsDark(prev => !prev);

  return (
    <div className={`flex h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-gray-900"}`}>
      
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onSelect={page => {
          setActivePage(page); // update from Account
          setMobileOpen(false);
        }}
      />

      {/* Mobile Sidebar */}
    <MobileSidebar
        isDark={isDark}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activePage={activePage}          // pass activePage
        setActivePage={setActivePage}    // pass setter!
      />


      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          scrollRef={contentRef}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          setSidebarOpen={setMobileOpen} // mobile hamburger
        />


        {/* Scrollable Content */}
        <main ref={contentRef} className="flex-1 hide-scrollbar overflow-y-auto p-5 md:p-6">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { isDark, activePage })
              : child
          )}
        </main>
      </div>
    </div>
  );
}
