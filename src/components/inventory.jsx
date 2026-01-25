import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export function InventoryCard({ isDark, products = [] }) {
  // 1. Calculate Statistics dynamically
  const stats = useMemo(() => {
    const total = products.length || 1; // Avoid division by zero
    const available = products.filter(p => p.inventory > 5).length;
    const lowStock = products.filter(p => p.inventory > 0 && p.inventory <= 5);
    const outOfStock = products.filter(p => p.inventory === 0 && p.isUnlimited !== true).length;    
    const assetValue = products.reduce((acc, p) => acc + (p.price * p.inventory), 0);

    return {
      total,
      availableCount: available,
      lowStockItems: lowStock,
      outOfStockCount: outOfStock,
      assetValue: assetValue.toLocaleString(),
      // Percentages for the progress bar
      pAvailable: (available / total) * 100,
      pLow: (lowStock.length / total) * 100,
      pOut: (outOfStock / total) * 100
    };
  }, [products]);

  return (
    <div className={`rounded-xl min-h-80 border flex flex-col transition-all
      ${isDark ? "bg-slate-950 border-slate-700 text-slate-200" : "bg-white border-slate-100 text-gray-900"}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 border-b px-3 py-4
        ${isDark ? "border-slate-700" : "border-slate-100"}`}>
        <h3 className="font-semibold">Inventory Summary</h3>
        
        <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-slate-100  rounded-md text-slate-500">
                {products.length} Items
            </span>
            <Link to={'/dashboard/products'} className="text-blue-500 hover:underline capitalize">see all</Link>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className={`${isDark ? "text-slate-400" : "text-gray-500"} text-sm mb-1`}>Total Asset Value</p>
        <div className="text-2xl font-bold mb-4">₦{stats.assetValue}</div>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-3 h-2 w-full bg-slate-100  rounded-full overflow-hidden">
        {/* Available (Green) */}
        {stats.availableCount > 0 && (
            <div 
            className="bg-green-500 transition-all duration-500" 
            style={{ flex: stats.availableCount }} 
            />
        )}
        {/* Low Stock (Yellow) */}
        {stats.lowStockItems.length > 0 && (
            <div 
            className="bg-yellow-400 transition-all duration-500" 
            style={{ flex: stats.lowStockItems.length }} 
            />
        )}
        {/* Out of Stock (Red) */}
        {stats.outOfStockCount > 0 && (
            <div 
            className="bg-red-500 transition-all duration-500" 
            style={{ flex: stats.outOfStockCount }} 
            />
        )}
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap gap-x-4 gap-y-2 text-[11px] mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" /> {stats.availableCount} Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" /> {stats.lowStockItems.length} Low stock
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full" /> {stats.outOfStockCount} Out of stock
          </span>
        </div>

        {/* Low Stock List */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Restock Alerts</span>
          <button className="text-blue-500 hover:text-blue-400 text-xs font-semibold">View Reports</button>
        </div>

        <ul className="space-y-2 text-sm overflow-y-auto max-h-[180px] pr-1 custom-scrollbar">
          {stats.lowStockItems.length > 0 ? (
            stats.lowStockItems.slice(0, 4).map((product) => (
              <li
                key={product._id}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 border
                  ${isDark ? "bg-slate-900/50 border-slate-800 text-slate-200" : "bg-gray-50 border-gray-100 text-gray-900"}`}
              >
                <div className="flex flex-col">
                    <span className="font-medium truncate w-32">{product.name}</span>
                    <span className="text-[10px] text-orange-500 font-bold uppercase">Only {product.inventory} left</span>
                </div>
                <button className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors
                    ${isDark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                    Restock
                </button>
              </li>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs italic border-2 border-dashed border-slate-800 rounded-xl">
                No low stock alerts
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}