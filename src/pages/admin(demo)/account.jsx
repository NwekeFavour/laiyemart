import React, { useState } from "react";
import DashboardLayout from "./components/dashboardlayout";
import SalesActivity from "./components/sales";
import RecentOrders from "./components/order-table";
import ProductsTable from "./components/products";
import Analytics from "./components/analytics";
import CategoriesTable from "./components/categories";
import OrderListComponent from "./components/orderComp";
import DemoHome from "../(demo)/home";
import CustomerList from "./components/customerList";
import { ArrowLeftFromLine, ExternalLink, Monitor, Plus, Smartphone } from "lucide-react";
import { Box, Button, Typography } from "@mui/joy";

export default function Account() {
  const [isDark, setIsDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [demo, setDemo] = useState(false); // ✅ FIX: missing state

  return (
    <div className="min-h-screen ">
      {/* Demo overlay */}
      {demo && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-50 dark:bg-[#020617] animate-in fade-in duration-300">
          {/* Top Navigation Bar / Browser Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-gray-200"}`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDemo(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold 
                  ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-100 text-gray-600"}`}
              >
                <ArrowLeftFromLine size={18} />
                <span>Exit Preview</span>
              </button>
              
              <div className={`h-6 w-[1px] ${isDark ? "bg-slate-800" : "bg-gray-200"}`} />
              
              <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className={`text-[12px] font-bold tracking-tight uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  Live Demo: <span className={isDark ? "text-white" : "text-black"}>LAYEMART ONLINE STORE</span>
                </span>
              </div>
            </div>

            {/* Device Toggle Toggles (Aesthetic only) */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex p-1 bg-slate-100 dark:bg-slate-800 rounded-md gap-1">
                <div className="p-1 rounded bg-white dark:bg-slate-700 shadow-sm"><Monitor size={14} className="text-slate-600 dark:text-slate-200" /></div>
              </div>
            </div>
          </div>

          {/* The actual store content */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950">
            <div className="max-w-[1440px] mx-auto shadow-2xl min-h-full">
              <DemoHome />
            </div>
          </div>
        </div>
      )}

      {/* Normal dashboard */}
      {!demo && (
        <DashboardLayout
          demo={demo}
          setDemo={setDemo}
          activePage={activePage}
          setActivePage={setActivePage}
        >
          {activePage === "dashboard" && <DashboardAnalytics isDark={isDark} />}
          {activePage === "products" && <ProductsTable isDark={isDark} />}
          {activePage === "categories" && <CategoriesTable isDark={isDark} />}
          {activePage === "orders" && <OrderListComponent isDark={isDark} />}
          {activePage === "customers" && <CustomerList isDark={isDark} /> }
        </DashboardLayout>
      )}


      {demo  && (
        <div>
          <div className="fixed bottom-3 left-2  z-20 lg:block hidden">
            <button
              onClick={() => setDemo(false)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-slate-600"
            >
              {demo ? 'Go Back to Dashboard' : 'Store Front'}
            </button>
          </div>
          <div className="fixed bottom-3 left-2  z-20 lg:hidden! block!">
            <button
              onClick={() => setDemo(false)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-slate-600"
            >
              {demo ? 'Dashboard' : 'Store Front'}
            </button>
          </div>
        </div>

    )}
    </div>
  );
}

/* ✅ Renamed for clarity */
function DashboardAnalytics({ isDark }) {
  return (
    <div
      className={` mb-6 rounded-lg ${
        isDark ? " text-slate-200" : "bg-white text-gray-900"
      }`}
    >
      <Box className={`${isDark ? "text-white!": ""} flex! flex-wrap! `} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography className={`${isDark ? "text-slate-100!": ""}  lg:text-[30px]! md:text-[24px]! text-[22px]!`} level="h2" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Welcome, Store Owner!
          </Typography>
          <div className={`  flex items-center gap-2 mt-1 flex-wrap`}>
            <Typography className={`${isDark ? "text-slate-200!": ""}`} level="body-md" sx={{ color: 'neutral.500' }}>Your store is currently live at:</Typography>
            <Typography  sx={{ color: 'blue.600', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <a 
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isDark ? "text-slate-100!": ""} flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:underline transition-colors`}
              >
                {`mystore.layemart.com` }
                <ExternalLink size={14} className="mb-0.5" />
              </a>
            </Typography>
          </div>
        </Box>
      </Box>
      <Analytics isDark={isDark} />
      <SalesActivity isDark={isDark} />
      <RecentOrders isDark={isDark} />
    </div>
  );
}
