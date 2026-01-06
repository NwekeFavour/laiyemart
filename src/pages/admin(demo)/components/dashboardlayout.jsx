import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import MobileSidebar from "./mobilesiderbar";
import PurchaseButton from "./purchaseButton";

export default function DashboardLayout({ children, activePage, setActivePage, demo, setDemo }) {
  const contentRef = useRef(null);

  // Sidebar state
  const [collapsed, setCollapsed] = useState(false);  // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile toggle

  const [isDark, setIsDark] = useState(false); // Dark mode state
  const toggleDarkMode = () => setIsDark(prev => !prev, localStorage.removeItem("theme"));

  useEffect(() => {
    if(localStorage.getItem("theme") === "dark"){
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [isDark]);
  return (
    <div className={`flex h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-gray-900"}`}>
      
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onSelect={page => {
          setActivePage(page);
          setMobileOpen(false);
        }}
        demo={demo}
        setDemo={setDemo}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isDark={isDark}
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        setMobileOpen={setMobileOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        setCollapsed={setCollapsed}
        demo={demo}
        setDemo={setDemo}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          scrollRef={contentRef}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          setSidebarOpen={setMobileOpen}
          demo={demo}           
          setDemo={setDemo}    
        />

        <PurchaseButton isDark={isDark} onClick={() => console.log("Purchase clicked")} />


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
