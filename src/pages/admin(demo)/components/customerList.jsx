import React, { useState, useEffect, useRef } from "react";
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

export default function CustomerList({ isDark }) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const itemsPerPage = 8;
    const INITIAL_CUSTOMERS = [
    { id: "671452-VN", name: "Davis", email: "olivia.davis@canadamail.ca",  orders: 732, totalSpent: 123808.00, avgSpent: 169.00, status: "Active", lastOrder: "29 Mar, 2025",  },
    { id: "564738-PQ", name: "Emily Rodriguez", email: "emily.rodriguez@yahoo.com", orders: 12, totalSpent: 1680.00, avgSpent: 140.00, status: "Active", lastOrder: "28 Oct, 2024", },
    { id: "912048-MF", name: "Sophia Patel", email: "sophia.patel@indiamail.in", orders: 105, totalSpent: 24150.00, avgSpent: 230.00, status: "Active", lastOrder: "28 Apr, 2025",  },
    { id: "567890-ZA", name: "Hiroshi Tanaka", email: "hiroshi.tanaka@yahoo.co.jp",  orders: 156, totalSpent: 18750.00, avgSpent: 120.00, status: "Active", lastOrder: "25 May, 2024", },
    { id: "750163-DP", name: "Ethan Wilson", email: "ethan.wilson@usmail.com",  orders: 97, totalSpent: 4753.00, avgSpent: 49.00, status: "Inactive", lastOrder: "22 Jul, 2025", },
    { id: "508234-WS", name: "James Liu", email: "HC-9031", orders: 49, totalSpent: 4116.00, avgSpent: 84.00, status: "Active", lastOrder: "22 Jul, 2025", },
    { id:  "456789-EF", name: "Priya Sharma", email: "priya.sharma@rediffmail.com",  orders: 203, totalSpent: 24360.00, avgSpent: 120.00, status: "Active", lastOrder: "22 Feb, 2024",  },
    { id: "104761-BQ", name: "Liam Brown", email: "liam.brown@ukrmail.ua", orders: 35, totalSpent: 3465.00, avgSpent: 99.00, status: "Inactive", lastOrder: "20 Jan, 2025", },
    { id: "104761-BQ", name: "Liam Brown", email: "liam.brown@ukrmail.ua",  orders: 35, totalSpent: 3465.00, avgSpent: 99.00, status: "Inactive", lastOrder: "20 Jan, 2025"},
  ];
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

const columnMapping = {
    "User ID": "id",
    "Customer": "name",
    "Country": "country",
    "Orders": "orders",
    "Total Spent": "totalSpent",
    "Avg. Spent": "avgSpent",
    "Status": "status",
    "Last Order": "lastOrder"
  };

  // --- Theme Variables ---
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-100';
  const themeHeader = isDark ? 'text-slate-400 bg-slate-800' : 'text-gray-400 bg-white';
  const themeBody = isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-gray-700';
  const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';
  const inputBase = `text-sm rounded-md border outline-none transition-all ${
    isDark ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-slate-200" : "bg-white border-gray-200 focus:border-blue-400"
  }`;

  const secondaryBtn = `flex items-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-colors ${
    isDark 
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" 
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
  }`;

  // Filtering Logic
    const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "All") return matchesSearch;
    return matchesSearch && customer.status === activeTab;
    });

    const handleSort = (key, direction) => {
    const dataKey = columnMapping[key];
    if (!dataKey) return;

    const sorted = [...customers].sort((a, b) => {
        let valA = a[dataKey];
        let valB = b[dataKey];

        // Null checks
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "string") {
        return direction === "asc" 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        return direction === "asc" ? valA - valB : valB - valA;
    });

    setCustomers(sorted);
    };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const currentData = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  return (
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
                    
                    </tr>
                </thead>
                
                <tbody className={isDark ? 'bg-slate-900' : 'bg-white'}>
                    {currentData.map((customer) => (
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

                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${borderColor} flex justify-between items-center text-sm`}>
          <p className="text-gray-500">Showing {currentData.length} customers</p>
          <div className="flex gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}><ChevronLeft size={16} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8  rounded border text-xs font-bold ${currentPage === i + 1 ? "bg-slate-800! text-white" : "hover:bg-gray-100"}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}


const HeaderDropdown = ({ isDark, onSortAsc, onSortDesc }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px" aria-hidden="true"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
        </button>

        {open && (
            <div className={`absolute right-0 mt-2 w-40 rounded border shadow-lg py-1 z-50 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}`}>
            <button onClick={() => { onSortAsc(); setOpen(false); }} className={`flex w-full items-center px-3 py-2 text-xs hover:bg-slate-600 hover:text-white`}>
                <ArrowUp size={12} className="mr-2" /> Ascending
            </button>
            <button onClick={() => { onSortDesc(); setOpen(false); }} className={`flex w-full items-center px-3 py-2 text-xs hover:bg-slate-600 hover:text-white`}>
                <ArrowDown size={12} className="mr-2" /> Descending
            </button>
            </div>
        )}
    </div>
  );
};