import React from "react";

export function InventoryCard({ isDark }) {
  return (
    <div className={`rounded-xl border flex flex-col
      ${isDark ? "bg-slate-950 border-[#E5E7EB] text-slate-200" : "bg-white border-slate-100 text-gray-900"}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 border-b px-3 py-4
        ${isDark ? "border-[#E5E7EB]" : "border-slate-100"}`}>
        <h3 className="font-semibold">Products</h3>
        <button className={`${isDark ? "text-blue-400" : "text-blue-600"} text-sm`}>See All</button>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm mb-1`}>Total Asset Value</p>
        <div className="text-2xl font-bold mb-4">₦329.7k</div>

        {/* Progress */}
        <div className="flex gap-2 mb-3">
          <div className="h-2 rounded-full bg-green-500 w-[55%]" />
          <div className="h-2 rounded-full bg-yellow-400 w-[30%]" />
          <div className="h-2 rounded-full bg-red-500 w-[15%]" />
        </div>

        {/* Legend */}
        <div className={`flex gap-4 text-xs mb-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" /> Low stock
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of stock
          </span>
        </div>

        {/* Low Stock List */}
        <div className="flex items-center justify-between mb-2">
          <span className={`${isDark ? "text-slate-200" : ""} text-sm font-medium`}>Low stock</span>
          <button className={`${isDark ? "text-blue-400" : "text-blue-600"} text-sm`}>See All</button>
        </div>

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
