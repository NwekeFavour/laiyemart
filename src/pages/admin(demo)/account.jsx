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
import { ArrowLeftFromLine } from "lucide-react";

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
      <Analytics isDark={isDark} />
      <SalesActivity isDark={isDark} />
      <RecentOrders isDark={isDark} />
    </div>
  );
}
