import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function OrderList({ isDark }) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
  const INITIAL_ORDERS = [
  { id: "ORD-7291", date: "Dec 01, 2025", customer: "Amaka Chen", total: 125.50, payment: "Paid", items: 3, delivery: "Delivered", carrier: "FedEx" },
  { id: "ORD-8820", date: "Dec 05, 2025", customer: "John Doe", total: 450.00, payment: "Pending", items: 1, delivery: "In Transit", carrier: "DHL Express" },
  { id: "ORD-1033", date: "Dec 12, 2025", customer: "Sarah Smith", total: 89.99, payment: "Paid", items: 5, delivery: "Delivered", carrier: "UPS" },
  { id: "ORD-4412", date: "Dec 15, 2025", customer: "Michael Obi", total: 210.00, payment: "Canceled", items: 2, delivery: "Canceled", carrier: "Standard" },
  { id: "ORD-9901", date: "Dec 20, 2025", customer: "Elena Rodriguez", total: 1250.00, payment: "Paid", items: 12, delivery: "In Transit", carrier: "DHL Express" },
  { id: "ORD-2234", date: "Dec 28, 2025", customer: "David Kwesi", total: 55.20, payment: "Pending", items: 2, delivery: "Returns", carrier: "Standard" },
  { id: "ORD-5567", date: "Jan 02, 2026", customer: "Linda Ikeji", total: 340.00, payment: "Paid", items: 4, delivery: "Delivered", carrier: "FedEx" },
  { id: "ORD-6678", date: "Jan 03, 2026", customer: "Kevin Hart", total: 120.00, payment: "Paid", items: 2, delivery: "In Transit", carrier: "UPS" },
];
  // --- Theme Variables (Matching CategoriesTable) ---
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-100';
  const themeHeader = isDark ? 'text-slate-400 bg-slate-800' : 'text-gray-400 bg-white';
  const themeBody = isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700';
  const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';
  const inputBase = `text-sm rounded-md border outline-none transition-all ${
    isDark ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-200" : "bg-white border-gray-200 focus:border-blue-400"
  }`;

  // Status Badge Styles
  const statusStyles = {
    Paid: "bg-green-500/10 text-green-500",
    Pending: "bg-amber-500/10 text-amber-500",
    Delivered: "bg-blue-500/10 text-blue-500",
    Canceled: "bg-red-500/10 text-red-500",
    "In Transit": "bg-purple-500/10 text-purple-500",
  };

  // 1. Filter orders based on the tab
  const filteredOrders = INITIAL_ORDERS.filter(order => {
    if (activeTab === "All") return true;
    return order.delivery === activeTab;
  }) || []; // Fallback to empty array

  // 2. Calculate Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  
  // 3. Slice data for the current page
  const currentData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || []; // Fallback to empty array

  // Reset page when tab changes to avoid empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab])

  return (
    <div className={`p-2 md:p-6 min-h-screen ${isDark ? "bg-slate-950 text-slate-200" : " text-gray-900"}`}>
      
      {/* Header Section */}
      <div className="md:flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order List</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredOrders.length} orders found. <span className={`${isDark ? "text-slate-200" : "text-gray-900"} font-medium`}>62 orders need your attention.</span>
          </p>
        </div>
        <div className="md:flex md:mt-0 mt-3 gap-3">
          <button className={`${inputBase} px-3 py-1.5 flex items-center gap-2 font-medium`}>
            <Calendar size={16} className="opacity-60" />
            <span>Dec 05 - Jan 04, 2026</span>
          </button>
          <button className={`${inputBase} md:mt-0 mt-2 px-3 py-1.5 flex items-center gap-2 font-medium`}>
            <Download size={16} className="opacity-60" /> Export
          </button>
          <button className={`${isDark ? "bg-slate-900! hover:bg-slate-800! border-none" : "hover:bg-slate-950"} cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap font-medium transition-all bg-zinc-950 text-white h-8.5 rounded-md px-3 text-[0.8125rem] shadow-black/5 md:mt-0 mt-2 gap-2`}>
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className={`rounded-xl border ${borderColor} ${isDark ? 'bg-slate-900' : 'bg-white'} overflow-hidden shadow-sm`}>
        
        {/* Tabs and Search Header */}
        <div className={`lg:flex justify-between items-center px-4 py-3 border-b ${borderColor} ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
          <div className="flex gap-6">
            {["All", "In Transit", "Delivered", "Returns", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-3 -mb-3 transition-colors relative ${
                  activeTab === tab 
                    ? "text-blue-500" 
                    : isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab 
                    ? "bg-blue-500/10 text-blue-500" 
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-gray-100 text-gray-400"
                }`}>
                  {tab === "All" ? filteredOrders.length : 49}
                </span>
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
            ))}
          </div>
          <div className="flex lg:mt-0 mt-6 gap-3">
            <button className={`${inputBase} px-3 py-1.5 font-medium`}>View Order Details</button>
            <button className={`${isDark ? "bg-slate-900! hover:bg-slate-800! border-none" : "hover:bg-slate-950"} cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap font-medium transition-all bg-zinc-950 text-white h-8.5 rounded-md px-3 text-[0.8125rem] shadow-black/5 gap-2`}>Stock Planner</button>
          </div>
        </div>

        {/* Scrollable Table Body */}
        <div className="overflow-x-auto hide-scrollbar w-full">
          <div className="max-w-[1400px] mx-auto w-full">
            <table className={`w-full text-left border-collapse`}>
              <thead>
                <tr className={`text-[12px] font-bold uppercase tracking-wider border-b ${borderColor} ${themeHeader}`}>
                  <th className={`px-6 py-4 w-10 border-r ${borderColor}`}>
                    <input type="checkbox" className="rounded-sm accent-blue-600" />
                  </th>
                  {[
                    {label: "OrderId", key: "id"},
                    {label: "Date", key: "date"},
                    {label: "Customer", key: "customer"},
                    {label: "Total", key: "total"},
                    {label: "Payment Status", key: "payment"},
                    {label: "Items", key: "items"},
                    {label: "Delivery Status", key: "delivery"},
                    {label: "Carrier", key: "carrier"}
                  ].map((col) => (
                    <th key={col.key} className={`px-4 py-4 border-r ${borderColor} whitespace-nowrap`}>
                      <div className="flex items-center justify-between gap-2">
                        {col.label}
                        <HeaderDropdown isDark={isDark} />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {currentData.map((order) => (
                  <tr key={order.id} className={`text-[13px] ${themeBody} ${hoverRow} transition-colors border-b ${borderColor}`}>
                    <td className={`px-6 py-4 border-r ${borderColor}`}>
                      <input type="checkbox" className="rounded-sm accent-blue-600" />
                    </td>
                    <td className={`px-4 py-4 border-r ${borderColor} font-semibold text-blue-500`}>
                      {order.id}
                    </td>
                    <td className={`px-4 py-4 border-r ${borderColor}`}>{order.date}</td>
                    <td className={`px-4 py-4 border-r ${borderColor} font-medium`}>{order.customer}</td>
                    <td className={`px-4 py-4 border-r ${borderColor} font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                      ${order.total.toFixed(2)}
                    </td>
                    <td className={`px-4 py-4 border-r ${borderColor}`}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusStyles[order.payment] || "bg-gray-100 text-gray-600"}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className={`px-4 py-4 border-r ${borderColor}`}>{order.items} items</td>
                    <td className={`px-4 py-4 border-r ${borderColor}`}>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusStyles[order.delivery] || "bg-gray-100 text-gray-600"}`}>
                        {order.delivery}
                      </span>
                    </td>
                    <td className={`px-4 py-4 border-r ${borderColor}`}>
                      <div className={`flex items-center gap-2 text-[11px] font-semibold px-2 py-1 border rounded-lg w-fit ${isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-100 bg-gray-50'}`}>
                        <div className="w-3 h-3 bg-amber-400 rounded-full" /> {order.carrier}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <PlusSquare size={16} className="text-gray-400 cursor-pointer hover:text-blue-500" />
                        <MoreHorizontal size={18} className="text-gray-400 cursor-pointer hover:text-blue-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className={`px-6 py-4 border-t ${borderColor} flex justify-between items-center text-sm ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-gray-500'}`}>
          <p>Showing 1 to {currentData.length} of {filteredOrders.length} orders</p>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded border text-xs font-bold transition-all ${
                  currentPage === i + 1 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reuse your HeaderDropdown component logic here...
const HeaderDropdown = ({ isDark }) => {
  return (
    <button className="text-gray-400 hover:text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down mt-px"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
    </button>
  );
};