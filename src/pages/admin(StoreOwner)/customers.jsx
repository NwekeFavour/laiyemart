import React, { useEffect, useState } from 'react';
import {
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Mail,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  LineChart,
  UserCircle
} from "lucide-react";

import StoreOwnerLayout from './layout';
import { useAuthStore } from '../../store/useAuthStore';

function CustomerList({storeId, isDark}) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuthStore.getState()

    const borderColor = isDark ? 'border-slate-700' : 'border-slate-100';
    const themeHeader = isDark ? 'text-slate-400 bg-slate-800' : 'text-gray-400 bg-white';
    const themeBody = isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700';
    const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';
    const secondaryBtn = `flex items-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-colors ${
    isDark 
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" 
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
  }`;
    // Fetch data from your backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stores/${storeId}/customers`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setCustomers(data.customers);
        }
      } catch (err) {
        setError("Failed to load customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchCustomers();
  }, [storeId]);
    return (
        <StoreOwnerLayout>
                <div className={`p-2 md:p-2 min-h-screen ${isDark ? "bg-slate-950 text-slate-200" : " text-gray-900"}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div>
                      <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Customer List
                      </h1>
                      <p className={` text-[13px] text-gray-500 dark:text-slate-400`}>
                        23,456 Customers found. <span className={`${isDark ? "text-slate-300" : ""}  font-medium text-blue-500`}>83% are active</span>
                      </p>
                    </div>
            
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Export Button */}
                      <button className={secondaryBtn}>
                        <Download size={16} /> Export
                      </button>
            
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowMore(!showMore)}
                          className={secondaryBtn}
                        >
                          More Actions <ChevronDown size={14} />
                        </button>
            
                        {showMore && (
                          <div className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-50 overflow-hidden ${
                            isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"
                          }`}>
                            <div className="py-1">
                              <button className={`w-full flex items-center gap-3 px-2 py-2 text-sm ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-50 text-gray-700"}`}>
                                <LineChart size={14} /> Customer Tracking
                              </button>
                              <button className={`w-full flex items-center gap-3 px-2 py-2 text-sm ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-50 text-gray-700"}`}>
                                <UserCircle size={14} /> View Customer Profile
                              </button>
                              <div className={`h-px my-1 ${isDark ? "bg-slate-800" : "bg-gray-100"}`} />
                              <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                <Trash2 size={14} /> Delete Selected
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
            
                      {/* Primary Action */}
                      <button className={`${isDark ? "bg-slate-900! hover:bg-slate-800! border-none" : "hover:bg-slate-50"} cursor-pointer group focus-visible:outline-hidden flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&amp;_svg]:shrink-0 bg-zinc-950 text-white  hover:bg-zinc-950 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90 h-8.5 rounded-md px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&amp;_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-xs shadow-black/5 gap-2`}>
                        <Plus size={18} /> New Customer
                      </button>
                    </div>
                  </div>
                  {/* Header */}
            
            
                  {/* Table Container */}
                  <div className={`rounded-xl border ${borderColor} ${isDark ? 'bg-slate-900' : 'bg-white'} overflow-hidden`}>
                    <div className={`${isDark ? "border-slate-700" : ""} sm:flex border-b border-slate-100 justify-between items-center px-3 py-3  `}>
                        <h1 className="lg:text-[20px] text-[17px] font-bold">Customers</h1>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400" size={16} />
                                <input
                                    placeholder="Search by ID or Name" 
                                    className={`pl-9 pr-4 py-1.5 text-sm rounded-md border outline-none
                                    ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Scrollable Table Body */}
                    <div className="w-full overflow-hidden   dark:border-slate-700">
                    
                        {/* 2. Scroll Container: 'hide-scrollbar' keeps it clean, 'w-full' ensures it fits parent */}
                        <div className="overflow-x-auto hide-scrollbar">
                            
                            {/* 3. Table: Set a 'min-w' to prevent columns from collapsing on small screens */}
                            <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0">
                            <thead>
                                <tr className={`text-[12px] font-bold uppercase tracking-wider ${themeHeader}`}>
                                <th className={`px-6 py-4 w-10 border-b border-r ${borderColor} sticky left-0 z-10 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                                    <input type="checkbox" className="rounded-sm accent-blue-600" />
                                </th>
                                
                                {[
                                    "User ID", "Customer", "Orders", 
                                     "Avg. Spent", "Status", "Last Order"
                                ].map((header) => (
                                    <th 
                                    key={header} 
                                    className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}
                                    >
                                    <div className="flex items-center justify-between gap-2">
                                        {header}
                                        <HeaderDropdown isDark={isDark}  onSortAsc={() => handleSort(header, "asc")} onSortDesc={() => handleSort(header, "desc")} />
                                    </div>
                                    </th>
                                ))}
                                <th className={`px-4 py-4 border-b ${borderColor} text-right pr-6 whitespace-nowrap`}>Actions</th>
                                </tr>
                            </thead>
                            
                            <tbody className={isDark ? 'bg-slate-900' : 'bg-white'}>
                                {customers.map((customer) => (
                                <tr key={customer.id} className={`${themeBody} ${hoverRow}  transition-colors group`}>
                                    {/* Ch eckbox Cell - Sticky for better mobile UX */}
                                    <td className={`px-6 py-4 border-b border-r ${borderColor} sticky left-0 z-10 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                                    <input type="checkbox" className="rounded-sm accent-slate-600" />
                                    </td>
                                    
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} ${isDark ? "text-slate-300" : ""} font-medium text-slate-600 whitespace-nowrap`}>
                                    {customer.id}
                                    </td>
            
                                    <td className={`px-6 py-4 border-b border-r ${borderColor} whitespace-nowrap`}>
                                    <div className="flex items-center gap-3">
                                        <img src={customer.image} className="w-8 h-8 rounded-full border border-gray-200" alt="" />
                                        <div className="leading-tight">
                                        <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{customer.name}</div>
                                        <div className="text-[11px] text-gray-500">{customer.email}</div>
                                        </div>
                                    </div>
                                    </td>                                   
            
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} text-center font-semibold whitespace-nowrap`}>
                                    {customer.orders}
                                    </td>
            
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}>
                                    ₦{customer.avgSpent.toFixed(2)}
                                    </td>
            
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}>
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                        customer.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                    }`}>
                                        {customer.status}
                                    </span>
                                    </td>
            
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}>
                                    {customer.lastOrder}
                                    </td>
            
                                    <td className={`px-4 py-4 border-b ${borderColor} text-right pr-6`}>
                                    <div className="flex justify-end gap-3 text-gray-400">
                                        <Eye size={16} className="cursor-pointer hover:text-blue-500" />
                                        <Edit2 size={16} className="cursor-pointer hover:text-amber-500" />
                                        <Trash2 size={16} className="cursor-pointer hover:text-red-500" />
                                    </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
            
                    {/* Footer */}
                    <div className={`px-6 py-4 border-t ${borderColor} flex justify-between items-center text-sm`}>
                      <p className="text-gray-500">Showing {customers.length} customers</p>
                      <div className="flex gap-1">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}><ChevronLeft size={16} /></button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded border text-xs font-bold ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>{i + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}><ChevronRight size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
        </StoreOwnerLayout>
    );
}

export default CustomerList;