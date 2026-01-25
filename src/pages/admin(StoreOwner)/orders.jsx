import React, { useState } from "react";
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
import { Search, Filter } from "lucide-react";
import StoreOwnerLayout from "./layout";

export default function OrdersPage({ isDark, toggleDarkMode }) {
  // Mock Data
  const [selected, setSelected] = useState([]);
  const orders = [];

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o._id));
    }
  };
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
            className={` ${isDark ? "border-none!" : "border-slate-100!"} bg-transparent! justify-end!`}
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div className="relative flex items-center">
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
                placeholder="Search by order ID or customer..."
                className={`
      h-10 w-[250px] pl-10 pr-4 rounded-lg outline-none transition-all border
      ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-blue-500/10"
          : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
      }
    `}
              />
            </div>
            <Button
              className={` ${isDark ? "bg-slate-900!  text-slate-200!" : "bg-transparent! text-slate-900/80!"}  border! border-slate-900/30! `}
              startDecorator={<Filter size={18} />}
              variant="soft"
              color="neutral"
              sx={{ borderRadius: "lg" }}
            >
              Filters
            </Button>
          </Sheet>
          {orders.length === 0 ? (
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
                No orders yet
              </Typography>

              <Typography
                level="body-sm"
                sx={{ maxWidth: 360 }}
                className={isDark ? "text-slate-400!" : "text-slate-500"}
              >
                Orders will appear here once customers start purchasing from
                your store.
              </Typography>

              <Button
                variant="soft"
                color="primary"
                sx={{ mt: 1, borderRadius: "lg" }}
              >
                View Products
              </Button>
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
                      { label: "Status", width: "w-[140px]" },
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

                    <th className="px-4 py-3 w-[100px] text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody
                  className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}
                >
                  {orders.map((row) => (
                    <tr
                      key={row.id}
                      className={`text-[13px] transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-gray-50/50"}`}
                    >
                      <td
                        className={`px-4 py-3 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(row.id)}
                          onChange={() => handleSelect(row.id)}
                          className="rounded-sm accent-blue-600 cursor-pointer"
                        />
                      </td>

                      <td
                        className={`px-4 py-3 border-r font-medium ${isDark ? "border-slate-800 text-slate-200" : "border-slate-100 text-slate-700"}`}
                      >
                        {row.id}
                      </td>

                      <td
                        className={`px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}
                      >
                        {row.date}
                      </td>

                      <td
                        className={`px-4 py-3 border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <span
                          className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-900"}`}
                        >
                          {row.customer}
                        </span>
                      </td>

                      <td
                        className={`px-4 py-3 border-r font-bold ${isDark ? "border-slate-800 text-slate-200" : "border-slate-100 text-slate-900"}`}
                      >
                        {row.total}
                      </td>

                      <td
                        className={`px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}
                      >
                        {row.method || "Mastercard"}
                      </td>

                      <td
                        className={`px-4 py-3 border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            row.status === "Delivered"
                              ? "bg-green-100 text-green-600"
                              : row.status === "Cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-500 font-bold hover:underline">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Box>
    </StoreOwnerLayout>
  );
}
