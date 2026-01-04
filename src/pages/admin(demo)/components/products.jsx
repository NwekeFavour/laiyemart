"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Checkbox,
  IconButton,
  Option,
  Select,
  Switch,
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
import { KeyboardArrowDown } from "@mui/icons-material";

/*  DATA  */
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
    updated_at: "2025-02-10T14:00:00Z", },
];

/*  BADGE  */
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

const CreateProductModal = ({ isOpen, onClose, isDark }) => {
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
const intervalsRef = useRef({});
  if (!isOpen) return null;

  // --- Image Upload Logic ---
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (images.length + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        const fileId = Math.random().toString(36).substr(2, 9);
        
        const newFile = { 
          id: fileId, 
          name: file.name, 
          size: (file.size / 1024).toFixed(1) + " KB", 
          progress: 0, 
          url: null 
        };

        setImages((prev) => [...prev, newFile]);

        reader.onloadstart = () => {
          let prog = 0;
          const interval = setInterval(() => {
            prog += 10;
            setImages((prev) =>
              prev.map((img) =>
                img.id === fileId ? { ...img, progress: Math.min(prog, 100) } : img
              )
            );
            if (prog >= 100) clearInterval(interval);
          }, 100);
        };

        reader.onloadend = () => {
          // Clear the interval early if file loads fast
          clearInterval(intervalsRef.current[fileId]);
          
          setImages((prev) =>
            prev.map((img) =>
              img.id === fileId 
                ? { ...img, url: reader.result, progress: 100 } 
                : img
            )
          );
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleBrowseClick = () => fileInputRef.current.click();

  // --- Dynamic Theme Classes ---
  const panelBg = isDark ? "bg-[#0f172a] text-slate-100" : "bg-white text-gray-900";
  const sectionBg = isDark ? "bg-[#1e293b]/30" : "bg-gray-50";
  const cardBg = isDark ? "bg-[#1e293b] border-slate-700 shadow-none" : "bg-white border-slate-100 shadow-sm";
  const headerBg = isDark ? "bg-slate-800/50" : "bg-slate-200/30";
  const borderColor = isDark ? "border-slate-700" : "border-slate-100";
  
  const inputBase = `w-full px-3 py-2 text-sm rounded-md border outline-none transition-all ${
    isDark 
      ? "bg-slate-900 border-slate-700 focus:border-blue-500 text-slate-200 placeholder:text-slate-500" 
      : "bg-white border-gray-200 focus:border-blue-400 text-gray-900 placeholder:text-gray-400"
  }`;

  const labelStyle = `block text-[12px] font-bold uppercase tracking-wider mb-1.5 ${
    isDark ? "text-slate-400" : "text-gray-500"
  }`;

  // MUI Select Styles
  const selectSx = {
    width: '100%',
    backgroundColor: isDark ? '#0f172a' : '#fff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f1f5f9' : '#1e293b',
    fontSize: '0.875rem',
    '&:hover': {
      borderColor: isDark ? '#475569' : '#cbd5e1',
      backgroundColor: isDark ? '#0f172a' : '#fff',
    },
  };

  return (
    <div 
      className="fixed inset-0 z-[100] p-4 md:p-10 flex justify-end bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`relative h-full w-full max-w-[1100px] shadow-2xl flex flex-col rounded-xl overflow-hidden
          animate-in slide-in-from-right duration-300 ease-in-out ${panelBg} border-l ${borderColor}`}
      >
        
        {/* Top Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${borderColor}`}>
          <h2 className="font-bold text-[16px]">Create New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Action Bar */}
        <div className={`px-6 py-4 md:flex justify-between items-center border-b ${borderColor} ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
          <div className="w-48">
             <select className={inputBase}>
                <option>Select Status</option>
                <option>Active</option>
                <option>Draft</option>
             </select>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm mt-4 md:mt-0">
             <span className="text-gray-500">Read about <a href="#" className="text-blue-500 hover:underline">How to Create Product</a></span>
             <button onClick={onClose} className={`px-4 py-1.5 border rounded-md font-medium transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'hover:bg-gray-50'}`}>Cancel</button>
             <button className={`px-4 py-1.5 rounded-md font-medium transition-colors ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-zinc-800'}`}>Create</button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 md:p-8 md:flex gap-8 ${sectionBg}`}>
          
          <div className="flex-1 space-y-6">
            {/* Basic Info Card */}
            <div className={`rounded-lg border overflow-hidden ${cardBg}`}>
              <div className={`flex justify-between items-center px-4 py-3 border-b ${headerBg} ${borderColor}`}>
                <h3 className="font-bold text-sm">Basic Info</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Featured</span>
                  <Switch
                    color="neutral"
                    sx={{
                      '--Switch-trackBackground': isDark ? '#334155' : '#cbd5e1',
                      '&.Mui-checked': {
                        '--Switch-trackBackground': isDark ? '#3b82f6' : '#000',
                      },
                    }}
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={labelStyle}>Product Name</label>
                  <input placeholder="e.g. Air Jordan 1" className={inputBase} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>SKU</label>
                    <input placeholder="SKU-882" className={inputBase} />
                  </div>
                  <div>
                    <label className={labelStyle}>Barcode</label>
                    <input placeholder="001234567" className={inputBase} />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Product Description</label>
                  <textarea rows={5} placeholder="Write something about the product..." className={inputBase} />
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className={`rounded-lg border overflow-hidden ${cardBg}`}>
              <div className={`px-4 py-3 border-b ${headerBg} ${borderColor}`}>
                <h3 className="font-bold text-sm">Category & Brand</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelStyle}>Product Category</label>
                  <Select placeholder="Select Category" indicator={<KeyboardArrowDown />} sx={selectSx}>
                    <Option value="sneakers">Sneakers</Option>
                    <Option value="apparel">Apparel</Option>
                  </Select>
                </div>
                <div>
                  <label className={labelStyle}>Product Brand</label>
                  <Select placeholder="Select Brand" indicator={<KeyboardArrowDown />} sx={selectSx}>
                    <Option value="nike">Nike</Option>
                    <Option value="adidas">Adidas</Option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Variant Form Section */}
            <div className={`rounded-lg border-2 border-dashed p-8 text-center ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-gray-200 bg-white'}`}>
              {!showVariantForm ? (
                <div className="animate-in fade-in zoom-in-95">
                  <p className="font-bold text-sm mb-1">No variants to display</p>
                  <p className="text-xs text-gray-500 mb-6">Set up different colors or sizes</p>
                  <button 
                    onClick={() => setShowVariantForm(true)}
                    className={`px-6 py-2 rounded-md text-xs font-bold flex items-center gap-2 mx-auto ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7v14"/></svg>
                    Add Variant
                  </button>
                </div>
              ) : (
                <div className="text-left space-y-4 animate-in slide-in-from-top-2">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Price (₦)</label>
                        <input type="number" placeholder="0.00" className={inputBase} />
                      </div>
                      <div>
                        <label className={labelStyle}>Stock</label>
                        <input type="number" placeholder="0" className={inputBase} />
                      </div>
                   </div>
                   <button onClick={() => setShowVariantForm(false)} className="text-xs font-bold text-red-500 hover:underline">Remove Variant</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:w-[320px] space-y-6 mt-6 md:mt-0">
            {/* Upload Area */}
            <div 
              className={`p-6 rounded-lg border-2 border-dashed transition-all text-center ${
                isDark ? "bg-slate-800 border-slate-700 hover:border-blue-500" : "bg-white border-gray-300 hover:border-blue-400"
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-[13px] font-bold">Upload product images</p>
              <p className="text-[11px] text-gray-400 mb-4">PNG, JPG up to 5 images</p>
              <button onClick={handleBrowseClick} className={`px-4 py-1.5 border rounded-md text-[12px] font-bold ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'hover:bg-gray-50'}`}>Browse Files</button>
            </div>

            {/* Image Progress List */}
            <div className="space-y-3">
              {images.map((img) => (
                <div key={img.id} className={`p-3 rounded-xl border flex items-center gap-3 ${cardBg} animate-in fade-in slide-in-from-right-4`}>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0">
                    {img.url ? <img src={img.url} className="w-full h-full object-cover" alt="preview" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold truncate pr-4">{img.name}</p>
                      <button onClick={() => removeImage(img.id)} className="text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{img.size}</span>
                      <div className={`flex-1 h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
                        <div className={`h-full transition-all duration-300 ${isDark ? 'bg-blue-500' : 'bg-black'}`} style={{ width: `${img.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags Input */}
            <div className={`p-6 rounded-lg border ${cardBg}`}>
              <label className={labelStyle}>Product Tags</label>
              <input placeholder="Add tags..." className={`${inputBase} h-11`} />
            </div>
          </div>
          
        </div>

        {/* Static Footer */}
        <div className={`px-6 py-4 border-t flex justify-between items-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
           <div className="hidden sm:block w-48">
              <select className={inputBase}><option>Draft</option><option>Active</option></select>
           </div>
           <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={onClose} className={`flex-1 sm:flex-none px-8 py-2 border rounded-md font-bold text-sm ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'hover:bg-gray-50'}`}>Cancel</button>
              <button className={`flex-1 sm:flex-none px-8 py-2 rounded-md font-bold text-sm ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-zinc-800'}`}>Create Product</button>
           </div>
        </div>
      </div>
    </div>
  );
};

/*  REFINED HEADER DROPDOWN  */
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

/*  MAIN TABLE  */
export default function ProductsTable({ isDark }) {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 1. FILTERING LOGIC
  // This runs whenever 'search' or 'allProducts' changes
  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allProducts;

    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.status.toLowerCase().includes(q)
    );
  }, [search]);

  // 2. SORTING LOGIC
  // We now sort the ALREADY filtered data
  const sortedProducts = useMemo(() => {
    let items = [...filteredData];
    if (!sortConfig) return items;

    items.sort((a, b) => {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return items;
  }, [filteredData, sortConfig]);

  // 3. PAGINATION LOGIC
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Helper for UI
  const borderColor = isDark ? "border-slate-700" : "border-slate-100";
  const border = isDark ? "border-slate-700" : "border-gray-200";

  const toggleItem = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected(selected.length === currentProducts.length ? [] : currentProducts.map((p) => p.id));

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div>
      {/* Header Section... (Omitted for brevity, keep your existing header) */}

      <div className="flex mb-4 items-center flex-wrap dap-2.5 justify-between">

        <div className="flex flex-col gap-1">

          <h1 className="md:text-[20px] text-[17px] font-bold text-foreground">Product List</h1>

          <span className="text-sm text-muted-foreground">1424 products found. 83% are active.</span>

        </div>

        <div className="flex items-center gap-3 md:mt-0 mt-3 ">

          <button data-slot="button" className={`${isDark ? "bg-slate-900 hover:bg-slate-800 border-none" : "hover:bg-slate-50"} cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&amp;_svg]:shrink-0 bg-background text-accent-foreground border border-slate-100 hover:bg-accent data-[state=open]:bg-accent h-8.5 rounded-md px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&amp;_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&amp;_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60 shadow-xs shadow-black/5 gap-2`}>

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload h-4 w-4" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>Import

          </button>

          <button 
            onClick={() => setIsModalOpen(true)} 
            data-slot="button" 
            className={`${isDark ? "bg-slate-900! hover:bg-slate-800! border-none" : "hover:bg-slate-950"} cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap font-medium transition-all bg-zinc-950 text-white h-8.5 rounded-md px-3 text-[0.8125rem] shadow-black/5 gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Add Product
          </button>

        </div>

      </div>


      <div className={`rounded-lg border ${border} ${isDark ? "bg-slate-900 text-slate-200" : "bg-white text-gray-900"}`}>
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold">Product Inventory</h1>
            <p className="text-sm text-muted-foreground">
              {filteredData.length} products found.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)} // UPDATED: Bind value and onChange
                placeholder="Search products..."
                className={`pl-9 pr-4 py-1.5 text-sm rounded-md border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all
                ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
              />
            </div>
            <FilterDropdown />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className={`w-full min-w-[1000px] text-left border-collapse border-t ${borderColor}`}>
            <thead>
              <tr className={`text-[13px] border-b ${borderColor} ${isDark ? "text-slate-400 bg-slate-800" : "text-gray-600 bg-white"}`}>
                <th className={`px-4 py-3 border-r ${borderColor} w-10 text-center`}>
                  <Checkbox
                    size="sm"
                    checked={currentProducts.length > 0 && selected.length === currentProducts.length}
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
                  <th key={col.key} className={`px-4 py-3 border-r ${borderColor} font-semibold whitespace-nowrap`}>
                    <div className="flex items-center justify-between gap-1">
                      {col.label}
                      <HeaderDropdown
                        isDark={isDark}
                        onSortAsc={() => setSortConfig({ key: col.key, direction: "asc" })}
                        onSortDesc={() => setSortConfig({ key: col.key, direction: "desc" })}
                      />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className={`text-[13px] ${isDark ? "text-slate-200 hover:bg-slate-800/60" : "text-gray-700 hover:bg-gray-50"}`}>
                    <td className={`px-4 py-3 border-r ${borderColor} text-center`}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(product.id)}
                        onChange={() => toggleItem(product.id)}
                      />
                    </td>
                    {/* ... rest of your row cells remain the same ... */}
                    <td className={`px-4 py-3 border-r ${borderColor}`}>
                      <div className="flex items-center gap-3">
                        <img src={product.img} className="w-9 h-9 rounded-md object-cover" alt="" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-[11px] opacity-60">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 border-r ${borderColor} font-medium`}>₦{product.price.toLocaleString()}</td>
                    <td className={`px-4 py-3 border-r ${borderColor}`}>{product.stock} units</td>
                    <td className={`px-4 py-3 border-r ${borderColor}`}>
                      <StatusBadge status={product.status} isDark={isDark} />
                    </td>
                    <td className={`px-4 py-3 border-r ${borderColor} text-[12px]`}>{new Date(product.created_at).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 border-r ${borderColor} text-[12px]`}>{new Date(product.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button className={`font-semibold hover:underline border-b border-dotted ${isDark ? "text-blue-400 border-blue-400" : "text-blue-500 border-blue-500"}`}>
                          Edit
                        </button>
                        <IconButton size="sm" color="danger" variant="plain"><Trash2 size={16} /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No products found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-4 flex justify-between items-center border-t ${border}`}>
          <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button 
              className="p-1 disabled:opacity-30" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="p-1 disabled:opacity-30" 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isDark={isDark} 
      />
    </div>
  );
}