import React, { useState } from 'react';
import { Box, Typography, Checkbox, IconButton, Button } from "@mui/joy";
import { Trash2, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

const allProducts = [
  { id: 1, name: "Gabriela Cashmere Blazer", sku: "SKU 11456", price: "₦113,990", stock: "1113", status: "Active", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80" },
  { id: 2, name: "Loewe Hooded Jacket", sku: "SKU 11457", price: "₦85,500", stock: "721", status: "Active", img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&q=80" },
  { id: 3, name: "Sandro Jacket - Black", sku: "SKU 11458", price: "₦113,990", stock: "407", status: "Active", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=80" },
  { id: 4, name: "Prada Leather Coat", sku: "SKU 11459", price: "₦299,990", stock: "312", status: "Active", img: "https://images.unsplash.com/photo-1521225091412-40344ed46614?w=200&q=80" },
  { id: 5, name: "Balenciaga Hoodie", sku: "SKU 11460", price: "₦199,990", stock: "523", status: "Active", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80" },
];

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    Active: isDark ? 'bg-emerald-800/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    Inactive: isDark ? 'bg-red-800/20 text-red-400' : 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function ProductsTable({ isDark }) {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const toggleItem = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === currentProducts.length ? [] : currentProducts.map(p => p.id));

  const borderColor = isDark ? 'border-slate-700' : 'border-gray-100';
  const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50/50';

  return (
    <div className={`w-full rounded-lg border overflow-hidden font-sans ${isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-900"}`}>
      
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Product Inventory</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className={`pl-9 pr-4 py-1.5 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60
                ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-900'}`}
            />
          </div>
          <Button size="sm" variant="outlined" className={isDark ? "border-slate-700 text-slate-200" : "border-gray-200"}>Export</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full text-left border-collapse border-t ${borderColor}`}>
          <thead>
            <tr className={`text-[13px] font-semibold border-b ${borderColor} ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
              <th className={`px-4 py-3 border-r ${borderColor} w-12 text-center`}>
                <Checkbox size="sm" checked={selected.length === currentProducts.length} onChange={toggleAll} />
              </th>
              {['Product', 'Price', 'Stock', 'Status', 'Action'].map((col, idx) => (
                <th key={idx} className={`px-4 py-3 border-r ${borderColor} whitespace-nowrap`}>
                  {col} <ChevronDown className="inline w-3 h-3 ml-1 opacity-50" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
            {currentProducts.map((product) => (
              <tr key={product.id} className={`text-[13px] ${hoverRow} ${selected.includes(product.id) ? (isDark ? 'bg-slate-800/60' : 'bg-blue-50/30') : ''}`}>
                <td className={`px-4 py-3 border-r ${borderColor} text-center`}>
                  <Checkbox size="sm" checked={selected.includes(product.id)} onChange={() => toggleItem(product.id)} />
                </td>
                {/* Fixed Image Logic */}
                <td className={`px-4 py-3 border-r ${borderColor} flex items-center gap-3`}>
                  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-slate-700">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold truncate max-w-[150px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-800'}`}>{product.name}</p>
                    <p className="text-[11px] text-gray-400">{product.sku}</p>
                  </div>
                </td>
                <td className={`px-4 py-3 border-r ${borderColor} font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.price}</td>
                <td className={`px-4 py-3 border-r ${borderColor} font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{product.stock} units</td>
                <td className={`px-4 py-3 border-r ${borderColor}`}><StatusBadge status={product.status} isDark={isDark} /></td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="text-blue-500 font-bold hover:underline decoration-dotted underline-offset-4">Edit</button>
                    <IconButton size="sm" color="danger" variant="plain"><Trash2 size={16} /></IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={`p-4 flex items-center justify-between text-[13px] ${isDark ? 'bg-slate-900 border-t border-slate-700' : 'bg-white border-t border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Rows per page:</span>
          <select className={`bg-transparent outline-none font-medium ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
            <option>5</option>
            <option>10</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-1">
            <button 
              className={`p-1.5 rounded-md border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'} disabled:opacity-30`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-md border ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'} disabled:opacity-30`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}