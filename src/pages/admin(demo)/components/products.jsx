"use client";

import React, { useMemo, useState } from "react";
import {
  Checkbox,
  IconButton,
} from "@mui/joy";
import {
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ChevronUp,
} from "lucide-react";
import FilterDropdown from "./filterdropdown";

/* ------------------ DATA ------------------ */
const allProducts = [
  { id: 1, name: "Gabriela Cashmere Blazer", sku: "SKU 11456", price: 113990, stock: 1113, status: "Active", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80",   created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-02-01T14:20:00Z", },
  { id: 2, name: "Loewe Hooded Jacket", sku: "SKU 11457", price: 85500, stock: 721, status: "Active", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&q=80",   created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-02-02T20:20:00Z", },
  { id: 3, name: "Sandro Jacket - Black", sku: "SKU 11458", price: 113990, stock: 407, status: "Active", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=80",   created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-06-01T14:30:00Z", },
  { id: 4, name: "Prada Leather Coat", sku: "SKU 11459", price: 299990, stock: 312, status: "Active", img: "https://images.unsplash.com/photo-1521225091412-40344ed46614?w=200&q=80",   created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-02-01T14:00:00Z", },
  { id: 5, name: "Balenciaga Hoodie", sku: "SKU 11460", price: 199990, stock: 523, status: "Active", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",   created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-02-03T24:20:00Z", },
];

/* ------------------ BADGE ------------------ */
const StatusBadge = ({ status, isDark }) => {
  const styles = {
    Active: isDark
      ? "bg-emerald-800/20 text-emerald-400"
      : "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

/* ------------------ HEADER DROPDOWN ------------------ */
/* ------------------ REFINED HEADER DROPDOWN ------------------ */
const HeaderDropdown = ({ onSortAsc, onSortDesc, isDark }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnClass = "flex w-full items-center gap-3 px-4 py-2 text-[13px] transition-colors";
  const activeHover = isDark ? "hover:bg-slate-800" : "hover:bg-gray-50";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px" aria-hidden="true"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>      
      </button>

      {open && (
        <div className={`absolute left-0 mt-2 w-48 rounded-lg border shadow-xl py-1 z-50 
          ${isDark ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-gray-200 text-gray-700"}`}>
          
          {/* Sorting Group */}
          <button onClick={() => { onSortAsc(); setOpen(false); }} className={`${btnClass} ${activeHover}`}>
            <ArrowUp size={16} className="text-gray-400" /> Asc
          </button>
          <button onClick={() => { onSortDesc(); setOpen(false); }} className={`${btnClass} ${activeHover}`}>
            <ArrowDown size={16} className="text-gray-400" /> Desc
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

          {/* Pinning Group */}
          <button className={`${btnClass} ${activeHover}`}>
            <div className="rotate-90"><ArrowDown size={16} className="text-gray-400" /></div> Pin to left
          </button>
          <button className={`${btnClass} ${activeHover}`}>
            <div className="-rotate-90"><ArrowDown size={16} className="text-gray-400" /></div> Pin to right
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

          {/* Movement Group (Disabled look to match screenshot) */}
          <button className={`${btnClass} text-gray-300 cursor-not-allowed`}>
            <ChevronLeft size={16} /> Move to Left
          </button>
          <button className={`${btnClass} text-gray-300 cursor-not-allowed`}>
            <ChevronRight size={16} /> Move to Right
          </button>
        </div>
      )}
    </div>
  );
};

/* ------------------ MAIN TABLE ------------------ */
export default function ProductsTable({ isDark }) {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);

  const itemsPerPage = 5;

  const sortedProducts = useMemo(() => {
    if (!sortConfig) return allProducts;

    return [...allProducts].sort((a, b) => {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-100';

  const toggleItem = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected(selected.length === currentProducts.length ? [] : currentProducts.map((p) => p.id));

  const border = isDark ? "border-slate-700" : "border-gray-200";

  return (
    <div>
      <div className="flex mb-4 items-center flex-wrap dap-2.5 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Product List</h1>
          <span className="text-sm text-muted-foreground">1424 products found. 83% are active.</span>
        </div>
        <div className="flex items-center gap-3">
          <button data-slot="button" className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&amp;_svg]:shrink-0 bg-background text-accent-foreground border border-slate-100 hover:bg-accent data-[state=open]:bg-accent h-8.5 rounded-md px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&amp;_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&amp;_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60 shadow-xs shadow-black/5 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload h-4 w-4" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>Import
          </button>
          <button data-slot="button" className="cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&amp;_svg]:shrink-0 bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black hover:bg-zinc-950/90 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90 h-8.5 rounded-md px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&amp;_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-xs shadow-black/5 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Add Product
          </button>
        </div>
      </div>



      <div className={`rounded-lg border ${border} ${isDark ? "bg-slate-900 text-slate-200" : "bg-white text-gray-900"}`}>
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Product Inventory</h1>
            <p className="text-sm text-muted-foreground">1424 products found. 83% active.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                placeholder="Search products..."
                className={`pl-9 pr-4 py-1.5 text-sm rounded-md border outline-none
                ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
              />
            </div>
            <FilterDropdown />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className={`w-full text-left border-collapse border-t ${borderColor}`}>
            <thead>
              <tr
                className={`text-[13px] border-b ${borderColor} ${
                  isDark ? "text-slate-400 bg-slate-800" : "text-gray-600 bg-white"
                }`}
              >
                <th className={`px-4 py-3 border-r ${borderColor} w-10 text-center`}>
                  <Checkbox
                    size="sm"
                    checked={selected.length === currentProducts.length}
                    onChange={toggleAll}
                  />
                </th>

                {[
                  { label: "Product", key: "name" },
                  { label: "Price", key: "price" },
                  { label: "Stock", key: "stock" },
                  { label: "Status", key: "status" },
                  { label: "Created", key: "created_at" },
                  { label: "Updated", key: "updated_at" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 border-r ${borderColor} font-semibold whitespace-nowrap`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <HeaderDropdown
                        isDark={isDark}
                        onSortAsc={() => setSortConfig({ key: col.key, direction: "asc" })}
                        onSortDesc={() => setSortConfig({ key: col.key, direction: "desc" })}
                        onReset={() => setSortConfig(null)}
                      />
                    </div>
                  </th>
                ))}

                <th className="px-4 py-3 text-center whitespace-nowrap"></th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`text-[13px] ${
                    isDark ? "text-slate-200 hover:bg-slate-800/60" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <td className={`px-4 py-3 border-r ${borderColor} text-center`}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleItem(product.id)}
                    />
                  </td>

                  <td className={`px-4 py-3 border-r ${borderColor}`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.img}
                        className="w-9 h-9 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-[11px] opacity-60">{product.sku}</p>
                      </div>
                    </div>
                  </td>

                  <td className={`px-4 py-3 border-r ${borderColor} font-medium`}>
                    ₦{product.price.toLocaleString()}
                  </td>

                  <td className={`px-4 py-3 border-r ${borderColor}`}>
                    {product.stock} units
                  </td>

                  <td className={`px-4 py-3 border-r ${borderColor}`}>
                    <StatusBadge status={product.status} isDark={isDark} />
                  </td>
                  <td className={`px-4 py-3 border-r ${borderColor} text-[12px]`}>
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>

                  <td className={`px-4 py-3 border-r ${borderColor} text-[12px]`}>
                    {new Date(product.updated_at).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        className={`font-semibold hover:underline border-b border-dotted ${
                          isDark
                            ? "text-blue-400 border-blue-400"
                            : "text-blue-500 border-blue-500"
                        }`}
                      >
                        Edit
                      </button>

                      <IconButton size="sm" color="danger" variant="plain">
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Pagination */}
        <div className={`p-4 flex justify-between items-center border-t ${border}`}>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft />
            </button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
