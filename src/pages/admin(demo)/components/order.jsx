import React from "react";

export function OrdersCard({ isDark }) {
  return (
    <div className={`rounded-xl border flex flex-col
      ${isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-100 text-gray-900"}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 border-b px-3 py-4
        ${isDark ? "border-slate-700" : "border-slate-100"}`}>
        <h3 className="font-semibold">Orders</h3>
        <button className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>
          See All
        </button>
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {["1H", "1D", "14D", "1M", "3M", "1Y", "All"].map((item) => (
            <button
              key={item}
              className={`px-3 py-1 border rounded-md hover:bg-gray-100
                ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-100"}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="text-2xl font-bold">₦9,395.72</div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            +4.7%
          </span>
        </div>

        {/* Dummy Chart */}
        <ul className="space-y-2 text-sm">
          {[
            ["Nike Shift Runner", 4],
            ["Puma Wace Strike", 7],
            ["Adidas Xtreme High", 1],
          ].map(([name, qty]) => (
            <li
              key={name}
              className={`flex items-center justify-between rounded-lg px-3 py-2
                ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-gray-900"}`}
            >
              <span>{name}</span>
              <span className={`${isDark ? "text-slate-400" : "text-gray-500"}`}>
                Qty: {qty} · <button className={`${isDark ? "text-blue-400" : "text-blue-600"}`}>Order</button>
              </span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
