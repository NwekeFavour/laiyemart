import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Table,
  Sheet,
  Chip,
  IconButton,
  Checkbox,
  Link,
  Select,
  Option,
} from "@mui/joy";
import {
  Search,
  Filter,
  Edit3,
  X,
  Printer,
  ChevronDown,
  Loader2,
} from "lucide-react";
import StoreOwnerLayout from "./layout";
import useOrderStore from "../../../services/orderService";
import { toast } from "react-toastify";

export default function OrdersPage({ isDark, toggleDarkMode }) {
  // Mock Data
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showArrow, setShowArrow] = useState(true);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("all");
  const [loadingId, setLoadingId] = useState(null); // To track loading state for specific order
  const { fetchVendorOrders, orders, updateStatus, isLoading } =
    useOrderStore();

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);
  // console.log(orders);
  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o._id));
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditModalOpen(true);
  };

  const handleOpenDetails = (order) => {
    setViewingOrder(order);
    setDetailsModalOpen(true);
  };

const filteredOrders = orders.filter((order) => {
  const searchStr = searchTerm.toLowerCase();
  const orderId = order._id?.toLowerCase() || "";
  const customer = order.customerName?.toLowerCase() || "";
  
  // 1. Check if the order matches the search string
  const matchesSearch = orderId.includes(searchStr) || customer.includes(searchStr);

  // 2. Check if the order matches the active tab status
  // Handle "all" vs specific productStatus
  const matchesTab = activeTab === "all" || (order.productStatus?.toLowerCase() === activeTab.toLowerCase());

  return matchesSearch && matchesTab;
});

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "primary";
      case "Shipped":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "neutral";
    }
  };

  console.log(orders);
  const getCount = (status) => {
    if (status === "all") return orders.length;
    // Map "In Transit" tab to "shipped" productStatus from your data
    if (status === "shipped")
      return orders.filter((o) => o.productStatus === "shipped").length;
    return orders.filter((o) => o.productStatus === status).length;
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "processing", label: "Processing" }, // You can map "In Transit" to shipped
    { id: "shipped", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <StoreOwnerLayout isDark={isDark} toggleDarkMode={toggleDarkMode}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2 } }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              className={`${isDark ? "text-slate-200!" : ""}`}
              level="h2"
              sx={{ fontSize: "24px", fontWeight: 700 }}
            >
              Orders
            </Typography>
            <Typography
              className={`${isDark ? "text-slate-400!" : ""}`}
              level="body-sm"
              sx={{ color: "#64748b" }}
            >
              Manage and track your store sales
            </Typography>
          </Box>
        </Box>

        {/* Orders Table */}
        <div
          className={`w-full overflow-hidden rounded-xl border ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-100 bg-white"}`}
        >
          <Sheet
            className={` ${isDark ? "border-none!" : "border-slate-100!"} bg-transparent! justify-between!`}
            variant="outlined"
            sx={{
              pt: 2,
              px: 2,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div className="flex items-center gap-8  overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const count = getCount(tab.id);

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-4 flex items-center gap-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="text-sm font-medium">{tab.label}</span>

                    {/* The Pill Counter */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative py-2 flex items-center">
              {/* Search Icon */}

              <div className="absolute left-3 flex items-center pointer-events-none">
                <Search
                  size={18}
                  className={isDark ? "text-slate-500" : "text-slate-400"}
                />
              </div>

              {/* Normal Input Tag */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID or customer..."
                className={`
      h-10 w-62.5 pl-10 pr-4 rounded-lg outline-none transition-all border
      ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-blue-500/10"
          : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
      }
    `}
              />
            </div>

            {/* {selected.length === 1 && (
              <button
                onClick={() => {
                  const orderToEdit = orders.find((o) => o._id === selected[0]);
                  handleEditClick(orderToEdit);
                }}
                className={`${isDark ? "bg-slate-800/90" : "bg-slate-600"} flex items-center gap-2 px-4 h-10  text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-all animate-in fade-in zoom-in duration-200`}
              >
                <Edit3 size={16} />
                Edit Order
              </button>
            )} */}
          </Sheet>
          {filteredOrders.length === 0 ? (
            /* EMPTY STATE */
            <Box
              sx={{
                py: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#f1f5f9",
                }}
              >
                <Filter
                  size={22}
                  className={isDark ? "text-slate-400" : "text-slate-500"}
                />
              </Box>

              <Typography
                level="title-md"
                className={isDark ? "text-slate-200!" : ""}
              >
                {orders.length === 0 ? "No orders yet" : "No matches found"}
              </Typography>

              <Typography
                level="body-sm"
                sx={{ maxWidth: 360 }}
                className={isDark ? "text-slate-400!" : "text-slate-500"}
              >
                {orders.length === 0
                  ? "Orders will appear here once customers start purchasing from your store."
                  : `We couldn't find anything matching "${searchTerm}"`}
              </Typography>
            </Box>
          ) : (
            /* TABLE */
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-transparent">
                  <tr
                    className={`text-[13px] border-b ${isDark ? "border-slate-800 bg-slate-800/30 text-slate-400" : "border-slate-100  text-gray-600"}`}
                  >
                    <th
                      className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          selected.length > 0 &&
                          selected.length === orders.length
                        }
                        onChange={toggleAll}
                        className="rounded-sm accent-blue-600 cursor-pointer"
                      />
                    </th>

                    {[
                      { label: "Order ID", width: "w-[140px]" },
                      { label: "Date", width: "w-[120px]" },
                      { label: "Customer", width: "w-[200px]" },
                      { label: "Amount", width: "w-[130px]" },
                      { label: "Method", width: "w-[150px]" },
                      { label: "Status", width: "w-[100px]" },
                    ].map((head) => (
                      <th
                        key={head.label}
                        className={`${head.width} px-4 py-3 font-semibold border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{head.label}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-50"
                          >
                            <path d="m7 15 5 5 5-5" />
                            <path d="m7 9 5-5 5 5" />
                          </svg>
                        </div>
                      </th>
                    ))}

                    <th className="px-4 py-3 w-[140px] text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody
                  className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}
                >
                  {currentOrders.map((row, i) => {
                    const isThisRowLoading = loadingId === row._id;
                    return (
                      <tr
                        key={i}
                        className={`text-[13px] transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-gray-50/50"}`}
                      >
                        <td
                          className={`px-4 py-3 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(row._id)}
                            onChange={() => handleSelect(row._id)}
                            className="rounded-sm accent-blue-600 cursor-pointer"
                          />
                        </td>

                        <td
                          className={`px-4 py-3 border-r font-medium ${isDark ? "border-slate-800 text-slate-200" : "border-slate-100 text-slate-700"}`}
                        >
                          ORD - {row._id?.slice(-6).toUpperCase()}
                        </td>

                        <td
                          className={`px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}
                        >
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium">
                              {new Date(row.updatedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(row.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </td>

                        <td
                          className={`px-4 py-3 border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                        >
                          <span
                            className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-900"}`}
                          >
                            {row.customerName}
                          </span>
                        </td>

                        <td
                          className={`px-4 py-3 border-r font-bold ${isDark ? "border-slate-800 text-slate-200" : "border-slate-100 text-slate-900"}`}
                        >
                          {row.totalAmount}
                        </td>

                        <td
                          className={`px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"} capitalize`}
                        >
                          {row.paymentMethod || "Mastercard"}
                        </td>

                        <td
                          className={`px-4 py-3 border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                        >
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              row.status === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>

                        {/* ACTION COLUMN */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(row);
                              }}
                              className="text-slate-500 font-bold hover:underline"
                            >
                              Details
                            </button>

                            {/* FULFILLMENT UPDATE BUTTON */}
                            {!["delivered", "cancelled"].includes(
                              row.productStatus?.toLowerCase(),
                            ) && (
                              <button
                                disabled={loadingId !== null} // Disable all buttons if one is loading
                                onClick={async (e) => {
                                  e.stopPropagation();

                                  const nextStatusMap = {
                                    pending: "processing",
                                    processing: "shipped",
                                    shipped: "delivered",
                                  };

                                  const nextStatus =
                                    nextStatusMap[
                                      row.productStatus?.toLowerCase() ||
                                        "pending"
                                    ];
                                  if (!nextStatus) return;

                                  setLoadingId(row._id); // Set the specific ID being loaded
                                  try {
                                    const res = await updateStatus(
                                      row._id,
                                      nextStatus,
                                    );
                                    if (res.success) {
                                      toast.success(
                                        `Order updated to ${nextStatus}`,
                                        {
                                          containerId: "DASHBOARD_TOAST",
                                        },
                                      );
                                      // Call your data refresh function here
                                    }
                                  } finally {
                                    setLoadingId(null); // Reset after done
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center justify-center
                  ${loadingId !== null ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                  ${row.productStatus === "shipped" ? "bg-green-600 hover:bg-green-700" : "bg-slate-900 hover:bg-black"}
                  text-white`}
                              >
                                {isThisRowLoading ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <>
                                    {(row.productStatus === "pending" ||
                                      !row.productStatus) &&
                                      "Process"}
                                    {row.productStatus === "processing" &&
                                      "Ship"}
                                    {row.productStatus === "shipped" &&
                                      "Deliver"}
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* PAGINATION CONTROLS */}
              {filteredOrders.length > 0 && (
                <div
                  className={`flex flex-wrap items-center justify-between px-6 py-4 border-t ${isDark ? "border-slate-800" : "border-slate-100"}`}
                >
                  <Typography
                    level="body-sm"
                    className={isDark ? "text-slate-400!" : "text-slate-500"}
                  >
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </Typography>

                  <div className="flex gap-2 sm:mt-0 mt-3">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md border text-sm transition-all ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                          : "border-slate-200 hover:bg-gray-50 disabled:opacity-50 text-slate-600"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                          currentPage === i + 1
                            ? "bg-slate-800/90 text-white"
                            : isDark
                              ? "text-slate-400 hover:bg-slate-800"
                              : "text-slate-600 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md border text-sm transition-all ${
                        isDark
                          ? "border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                          : "border-slate-200 hover:bg-gray-50 disabled:opacity-50 text-slate-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {isEditModalOpen && editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              className={`w-full max-w-md p-6 rounded-xl shadow-xl ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Edit Order Status</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className={`${isDark ? "bg-slate-800/90" : "bg-slate-50 "} p-3 rounded-lg dark:bg-slate-800/50`}
                >
                  <p
                    className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs `}
                  >
                    Order ID
                  </p>
                  <p className="font-mono font-medium">
                    #{editingOrder._id.toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Customer</p>
                  <p
                    className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs `}
                  >
                    {editingOrder.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Current Status</p>
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 uppercase">
                    {editingOrder.status}
                  </span>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  {/* ✅ The "Mark as Shipped" Button */}
                  <button
                    disabled={
                      isLoading ||
                      ["delivered", "cancelled"].includes(
                        editingOrder.productStatus,
                      )
                    }
                    onClick={async () => {
                      const nextStatusMap = {
                        paid: "processing",
                        processing: "shipped",
                        shipped: "delivered",
                      };

                      const nextStatus =
                        nextStatusMap[editingOrder.productStatus];

                      const res = await updateStatus(
                        editingOrder._id,
                        nextStatus,
                      );

                      if (res.success) {
                        toast.success(`Status updated to ${nextStatus}`);
                        setEditModalOpen(false);
                        setSelected([]);
                      } else {
                        toast.error(res.message);
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    } ${
                      editingOrder.productStatus === "shipped"
                        ? "bg-green-600"
                        : "bg-slate-600"
                    }
                    ${isDark && editingOrder.productStatus === "shipped" && "bg-green-900"}
                    text-white`}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      <>
                        {editingOrder.productStatus === "paid" &&
                          "Start Processing"}
                        {editingOrder.productStatus === "processing" &&
                          "Mark as Shipped"}
                        {editingOrder.productStatus === "shipped" &&
                          "Confirm Delivery"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setEditModalOpen(false)}
                    className={`${isDark && "hover:text-slate-900"} w-full py-2.5 bg-transparent border border-slate-200 rounded-lg font-medium hover:bg-slate-50`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDetailsModalOpen && viewingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className={`w-full h-120! hide-scrollbar max-w-lg overflow-scroll rounded-2xl shadow-2xl transition-all ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white text-slate-900"}`}
            >
              {/* Receipt Header */}
              <div
                className={`p-6 text-center border-b border-dashed ${isDark ? "border-slate-800" : "border-slate-200"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                  >
                    Order Receipt
                  </span>
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter mb-1">
                  YOUR STORE
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {viewingOrder.paymentReference || viewingOrder._id}
                </p>
              </div>

              {/* Customer & Info Section */}
              <div className="p-6 grid grid-cols-2 gap-4 text-sm border-b border-dashed border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Customer
                  </p>
                  <p className="font-semibold">{viewingOrder.customerName}</p>
                  <p className="text-xs text-slate-500">
                    {viewingOrder.customerEmail}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Date
                  </p>
                  <p className="font-semibold">
                    {new Date(viewingOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(viewingOrder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-6">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">
                  Purchased Items
                </p>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {viewingOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex gap-2">
                        <span className="text-slate-400 font-mono">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">
                          {item.product?.name || "Product Name"}
                        </span>
                      </div>
                      <span className="font-mono">
                        ₦{item.product?.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total Section */}
              <div
                className={`p-6 space-y-3 ${isDark ? "bg-slate-800/30" : "bg-slate-50"}`}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono">
                    ₦{viewingOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-medium capitalize">
                    {viewingOrder.paymentMethod || "Card"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-black text-blue-500">
                    ₦{viewingOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add this inside your Receipt Modal */}
              <div
                className={`${viewingOrder.productstatusHistory.length < 0 ? "block" : "hidden"} p-6 border-t border-dashed border-slate-200 dark:border-slate-800`}
              >
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-4 tracking-widest">
                  Status History
                </p>
                <div className={`space-y-4`}>
                  {viewingOrder.productstatusHistory?.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {i !== viewingOrder.productstatusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                      <div className="flex flex-col -mt-1 pb-4">
                        <span className="text-xs font-bold capitalize">
                          {step.state}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewingOrder.productstatusHistory > 0 && showArrow && (
                <div className="absolute bottom-6 end-0 -translate-x-1/2 pointer-events-none transition-opacity duration-300">
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-1.5 rounded-full animate-bounce ${
                        isDark
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={18} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Reference */}
              <div className="p-4 text-center">
                <p className="text-[10px] text-slate-400 mb-3 italic">
                  Ref: {viewingOrder.paymentReference || "N/A"}
                </p>
                <button
                  onClick={() => window.print()}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <Printer size={12} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </StoreOwnerLayout>
  );
}
