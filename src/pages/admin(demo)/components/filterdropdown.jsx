"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Funnel } from "lucide-react";

const columns = [
  { key: "productInfo", label: "ProductInfo" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "rating", label: "Rating" },
  { key: "created", label: "Created" },
  { key: "updated", label: "Updated" },
];

export default function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    productInfo: true,
    category: true,
    price: true,
    status: true,
    rating: true,
    created: true,
    updated: true,
  });

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md  border border-slate-100 hover:border-slate-200 bg-white px-3 py-2 text-sm font-medium text-gray-700  hover:bg-gray-100 focus:outline-none focus:ring-none focus:ring-slate-500"
      >
        <Funnel className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 md:top-10 top-10 z-50 mt-2 w-46 rounded-md border border-slate-100 bg-white shadow-lg">
          <div className="px-4 py-2 text-[12px] font-semibold text-slate-700">
            Toggle Columns
          </div>

          <div className="max-h-64 px-2 pb-2">
            {columns.map((col) => {
              const isVisible = visibleColumns[col.key];

              return (
                <div
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className="flex cursor-pointer items-center  gap-3 rounded-md px-2 py-2 text-sm hover:bg-gray-100"
                >
                  {isVisible && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="text-gray-700">{col.label}</span>

                  
                </div>
              );
            })}
          </div>
        </div>

      )}
    </div>
  );
}
