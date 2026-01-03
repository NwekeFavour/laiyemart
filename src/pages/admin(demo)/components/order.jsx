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
        <div className="flex-1 flex items-end">
          <svg viewBox="0 0 300 120" className="w-full h-32" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 60 L30 50 L60 70 L90 45 L120 80 L150 40 L180 75 L210 55 L240 65 L270 50 L300 55 L300 120 L0 120 Z"
              fill="url(#areaGradient)"
            />
            <path
              d="M0 60 L30 50 L60 70 L90 45 L120 80 L150 40 L180 75 L210 55 L240 65 L270 50 L300 55"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>Sep 8</span>
          <span>Sep 23</span>
        </div>
      </div>
    </div>
  );
}
