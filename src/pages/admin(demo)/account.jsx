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
import { ArrowLeftFromLine, ExternalLink, Plus } from "lucide-react";
import { Box, Button, Typography } from "@mui/joy";

export default function Account() {
  const [isDark, setIsDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [demo, setDemo] = useState(false); // ✅ FIX: missing state

  return (
    <div className="min-h-screen ">
      {/* Demo overlay */}
      {demo && (
        <div className=" my-2 shadow-lg" >
          <div className="flex items-center gap-2 mb-2 ms-3" >
            <button
              onClick={() => setDemo(false)}
            >
              {demo && <ArrowLeftFromLine size={20} className="inline-block me-2" />}
            </button>
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span className={`font-bold text text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`}>LAYEMART ONLINE STORE</span>
          </div>
          <DemoHome />
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
