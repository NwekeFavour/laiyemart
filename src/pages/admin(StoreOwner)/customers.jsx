import React, { useEffect, useRef, useState } from "react";
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
  UserCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

import StoreOwnerLayout from "./layout";
import { useAuthStore } from "../../store/useAuthStore";

function CustomerList({ isDark, toggleDarkMode }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setFilterStatus] = useState('all');
  const { store } = useAuthStore.getState();
  const storeId = store?._id;
  // console.log(storeId);
  const [error, setError] = useState(null);
  const { token } = useAuthStore.getState();
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const borderColor = isDark ? "border-[#314158]" : "border-slate-100";
  const themeHeader = isDark
    ? "text-slate-400 bg-slate-800/50"
    : "text-gray-400 bg-white";
  const themeBody = isDark
    ? "bg-slate-950 text-slate-300"
    : "bg-white text-gray-700";
  const hoverRow = isDark ? "hover:bg-slate-800/40" : "hover:bg-gray-50";
  const secondaryBtn = `flex items-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-colors ${
    isDark
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
  }`;
  // Fetch data from your backend

  const handleSort = () => {
    
  }
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/stores/${storeId}/customers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        if (data.success) {
          setCustomers(data.customers);
        }
        // console.log(data)
      } catch (err) {
        setError("Failed to load customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchCustomers();
  }, [storeId]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer._id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const currentItems = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <StoreOwnerLayout isDark={isDark} toggleDarkMode={toggleDarkMode}>
      <div
        className={`p-2 md:p-4 min-h-screen ${
          isDark ? "bg-slate-950 text-slate-200" : " text-gray-900"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h1
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Customer List
            </h1>
            <p className="text-[13px] text-gray-500">
              {filteredCustomers.length} Customers found
            </p>
          </div>
        </div>
        {/* Header */}

        {/* Table Container */}
        <div
          className={`rounded-xl border ${borderColor} ${
            isDark ? "bg-slate-950" : "bg-white"
          } overflow-hidden`}
        >
          <div
            className={`${
              isDark ? "border-slate-700" : ""
            } sm:flex border-b justify-end border-slate-100 gap-2 items-center px-3 py-3`}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                placeholder="Search by ID or Name"
                className={`pl-9 pr-4 py-1.5 text-sm rounded-md border outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                }`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Export Button */}
              <button className={secondaryBtn}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          {/* Scrollable Table Body */}
          <div className={`w-full overflow-hidden   ${isDark ? "bg-slate-950!" : ""}`}>
            {/* 2. Scroll Container: 'hide-scrollbar' keeps it clean, 'w-full' ensures it fits parent */}
            <div className="overflow-x-auto hide-scrollbar">
              {/* 3. Table: Set a 'min-w' to prevent columns from collapsing on small screens */}
              <table className="w-full min-w-[1000px] text-left border-separate border-spacing-0">
                <thead>
                  <tr
                    className={`text-[12px] font-bold uppercase tracking-wider ${themeHeader}`}
                  >
                    <th
                      className={`px-6 py-4 w-10 border-b border-r ${borderColor} sticky left-0 z-10 ${
                        isDark ? "bg-slate-800/50" : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="rounded-sm accent-blue-600"
                      />
                    </th>

                    {["S/N", "Customer", "Orders", "Status", "Created At"].map(
                      (header) => (
                        <th
                          key={header}
                          className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            {header}
                            <HeaderDropdown
                              isDark={isDark}
                              onSortAsc={() => handleSort(header, "asc")}
                              onSortDesc={() => handleSort(header, "desc")}
                            />
                          </div>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className={isDark ? "bg-slate-900" : "bg-white"}>
                  {loading ? (
                    // 2. LOADING STATE
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td
                          colSpan={7}
                          className={`px-6 py-6 border-b ${borderColor}`}
                        >
                          <div
                            className={`h-4 w-full rounded ${
                              isDark ? "bg-slate-800" : "bg-gray-100"
                            }`}
                          />
                        </td>
                      </tr>
                    ))
                  ) : currentItems.length > 0 ? (
                    // 3. DATA STATE
                    currentItems.map((customer, idx) => (
                      <tr
                        key={customer._id}
                        className={`${themeBody} ${hoverRow} transition-colors group`}
                      >
                        {/* Ch eckbox Cell - Sticky for better mobile UX */}
                        <td
                          className={`px-6 py-4 border-b border-r ${borderColor} sticky left-0 z-10 ${
                            isDark ? "bg-slate-950" : "bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="rounded-sm accent-slate-600"
                          />
                        </td>

                        <td
                          className={`px-4 py-4 border-b border-r ${borderColor} ${
                            isDark ? "text-slate-300" : ""
                          } font-medium text-slate-600 whitespace-nowrap`}
                        >
                          {idx + 1}
                        </td>

                        <td
                          className={`px-6 py-4 border-b border-r ${borderColor} whitespace-nowrap`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="leading-tight">
                              <div
                                className={`font-bold ${
                                  isDark ? "text-slate-200" : "text-gray-900"
                                }`}
                              >
                                {customer.name}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          className={`px-4 py-4 border-b border-r ${borderColor} text-center font-semibold whitespace-nowrap`}
                        >
                          {customer.orders}
                        </td>
                        {/*             
                                    <td className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}>
                                    ₦{customer.avgSpent.toFixed(2)}
                                    </td> */}

                        <td
                          className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}
                        >
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              customer.status === "Active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>

                        <td
                          className={`px-4 py-4 border-b border-r ${borderColor} whitespace-nowrap`}
                        >
                          {customer.createdAt
                            ? new Date(customer.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div
                            className={`p-4 rounded-full ${
                              isDark ? "bg-slate-800" : "bg-gray-50"
                            }`}
                          >
                            <Search size={40} className="text-gray-400" />
                          </div>
                          <h3
                            className={`text-lg font-bold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {searchQuery
                              ? "No results found"
                              : "No customers yet"}
                          </h3>
                          <p className="text-sm text-gray-500 max-w-[250px]">
                            {searchQuery
                              ? `We couldn't find any customers matching "${searchQuery}"`
                              : "Start growing your business by adding your first customer manually or through orders."}
                          </p>
                          {!searchQuery && (
                            <button className="mt-2 text-blue-500 font-bold flex items-center gap-2 hover:underline">
                              <Plus size={16} /> Add your first customer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`px-6 py-4  flex justify-between items-center text-sm`}
          >
            <p className="text-gray-500">
              Showing {customers.length} customers
            </p>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded border text-xs font-bold ${
                    currentPage === i + 1
                      ? "bg-slate-800 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`p-1.5 rounded border ${borderColor} disabled:opacity-30`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </StoreOwnerLayout>
  );
}

const HeaderDropdown = ({ isDark, onSortAsc, onSortDesc }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px"
          aria-hidden="true"
        >
          <path d="m7 15 5 5 5-5"></path>
          <path d="m7 9 5-5 5 5"></path>
        </svg>
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded border shadow-lg py-1 z-50 ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-300"
              : "bg-white border-gray-200 text-gray-700"
          }`}
        >
          <button
            onClick={() => {
              onSortAsc();
              setOpen(false);
            }}
            className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}
          >
            <ArrowUp size={12} className="mr-2" /> Ascending
          </button>
          <button
            onClick={() => {
              onSortDesc();
              setOpen(false);
            }}
            className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}
          >
            <ArrowDown size={12} className="mr-2" /> Descending
          </button>
        </div>
      )}
    </div>
  );
};
export default CustomerList;
