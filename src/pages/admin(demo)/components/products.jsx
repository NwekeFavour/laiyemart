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
  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Limit to 5 images total
    if (images.length + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        
        // Create a temporary object for the "uploading" state
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
          // Simulate progress bar filling up
          let prog = 0;
          const interval = setInterval(() => {
            prog += 10;
            setImages((prev) =>
              prev.map((img) =>
                img.id === fileId ? { ...img, progress: prog } : img
              )
            );
            if (prog >= 100) clearInterval(interval);
          }, 100);
        };

        reader.onloadend = () => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === fileId ? { ...img, url: reader.result, progress: 100 } : img
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

  // Theme-based classes
  const panelBg = isDark ? "bg-[#1e293b] text-slate-200" : "bg-white text-gray-900";
  const sectionBg = isDark ? "bg-[#0f172a]/50" : "bg-gray-50/50";
  const inputBase = `w-full px-3 py-2 text-sm rounded-md border outline-none transition-all ${
    isDark ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-white border-gray-200 focus:border-blue-400"
  }`;
  const labelStyle = "block text-[13px] font-semibold mb-1.5 text-gray-700 dark:text-slate-300";

  return (
    <div 
      className="fixed inset-0 z-100 p-10 flex justify-end bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Slide-in Panel from Right */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`relative h-full w-full max-w-250 shadow-2xl flex flex-col 
          animate-in slide-in-from-right duration-300 ease-in-out ${panelBg}`}
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
          <h2 className="font-bold text-[16px]">Create New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Sub-Header (Select Status & Read About) */}
        <div className="px-6 py-4 md:flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="w-48">
             <select className={inputBase}>
                <option>Select Status</option>
                <option>Active</option>
                <option>Draft</option>
             </select>
          </div>
          <div className="md:flex md:space-x-0 space-x-2  items-center gap-4 text-sm">
             <span className="text-gray-500">Read about <a href="#" className="text-blue-500 hover:underline">How to Create Product</a></span>
             <button onClick={onClose} className="px-4 md:mt-0 mt-4 py-1.5 border rounded-md font-medium hover:bg-gray-50 dark:border-slate-700">Cancel</button>
             <button className="px-4 py-1.5 bg-black text-white md:mt-0 mt-4 rounded-md font-medium dark:bg-white dark:text-black">Create</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto p-8 md:flex gap-8 ${sectionBg}`}>
          
          {/* Left Column (Form Fields) */}
          <div className="flex-1 space-y-6">
            <div className="bg-white border-slate-100 dark:bg-slate-800  rounded-lg border dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center  bg-slate-200/30 px-4 pt-3 border-b border-slate-100 pb-4 dark:border-slate-700">
                <h3 className="font-bold text-sm">Basic Info</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Featured</span>
                  <Switch
                    color="neutral"
                    sx={{
                      '--Switch-trackBackground': '#475569', // slate-600
                      '--Switch-thumbBackground': '#e5e7eb', // slate-200
                      '&.Mui-checked': {
                        '--Switch-trackBackground': '#000', // slate-700
                      },
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <label className={labelStyle}>Product Name</label>
                  <input placeholder="Product Name" className={inputBase} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>SKU</label>
                    <input placeholder="SKU" className={inputBase} />
                  </div>
                  <div>
                    <label className={labelStyle}>Barcode</label>
                    <input placeholder="Barcode" className={inputBase} />
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Product Description</label>
                  <textarea rows={6} placeholder="Product Description" className={inputBase} />
                </div>
              </div>
            </div>
            
            <div className="bg-white border-slate-100 dark:bg-slate-800  rounded-lg border dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center  bg-slate-200/30 px-4 pt-3 border-b border-slate-100 pb-4 dark:border-slate-700">
                <h3 className="font-bold text-sm">Category & Brand</h3>
              </div>
              <div className="space-y-4 p-6 ">
                <div className="space-y-4">
                  
                  {/* Product Category */}
                  <div>
                    <label className={labelStyle}>Product Category</label>
                    <Select
                      placeholder="Select Category"
                      indicator={<KeyboardArrowDown />}
                      sx={{
                        width: '100%',
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: isDark ? '#475569' : '#cbd5e1',
                        },
                      }}
                    >
                      <Option value="sneakers">Sneakers</Option>
                      <Option value="apparel">Apparel</Option>
                      <Option value="accessories">Accessories</Option>
                    </Select>
                  </div>

                  {/* Product Brand */}
                  <div>
                    <label className={labelStyle}>Product Brand</label>
                    <Select
                      placeholder="Select Brand"
                      indicator={<KeyboardArrowDown />}
                      sx={{
                        width: '100%',
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        fontSize: '0.875rem',
                        '&:hover': {
                          borderColor: isDark ? '#475569' : '#cbd5e1',
                        },
                      }}
                    >
                      <Option value="nike">Nike</Option>
                      <Option value="adidas">Adidas</Option>
                      <Option value="puma">Puma</Option>
                      <Option value="reebok">Reebok</Option>
                    </Select>
                  </div>

                </div>
              </div>
            </div>

            {!showVariantForm ? (
                 <div className="py-10 text-center">
                    <p className="font-bold text-sm mb-1">No variants to display</p>
                    <p className="text-xs text-gray-500 mb-6">Set up different options for this product</p>
                    <button 
                      onClick={() => setShowVariantForm(true)}
                      className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 mx-auto"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7v14"/></svg>
                       Add Variant
                    </button>
                 </div>
               ) : (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className={labelStyle}>Variant Price (₦)</label>
                          <input type="number" placeholder="0.00" className={inputBase} />
                       </div>
                       <div>
                          <label className={labelStyle}>Stock Quantity</label>
                          <input type="number" placeholder="0" className={inputBase} />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className={labelStyle}>Color</label>
                          <input placeholder="e.g. Red" className={inputBase} />
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowVariantForm(false)}
                      className="text-xs underline text-red-500 font-bold hover:underline"
                    >
                      Remove Variant
                    </button>
                 </div>
              )}  
          </div>

          {/* Right Column (Upload & Tags) */}
          <div className="md:w-[320px] space-y-6">
            <div className="md:w-[320px] space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple // Allow selecting multiple files
                className="hidden"
              />

              {/* Upload Dropzone */}
              <div 
                className={`bg-white dark:bg-slate-800 p-6 rounded-lg border-2 border-dashed transition-all ${
                  isDark ? "border-slate-600 hover:border-blue-500" : "border-gray-300 hover:border-blue-400"
                } text-center`}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[13px] font-bold dark:text-slate-200">Choose files or drag & drop here.</p>
                <p className="text-[11px] text-gray-400 mb-4">JPEG, PNG, up to 5 images.</p>
                <button 
                  onClick={handleBrowseClick}
                  type="button"
                  disabled={images.length >= 5}
                  className="px-4 py-1.5 border rounded-md text-[12px] font-bold dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Browse Files
                </button>
              </div>

              {/* Progress List Section (Matches your screenshot) */}
              <div className="space-y-3">
                {images.map((img) => (
                  <div key={img.id} className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      {/* Icon / Preview Thumbnail */}
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {img.url ? (
                          <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        )}
                      </div>

                      {/* File Info & Progress */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium truncate pr-2 dark:text-slate-200">{img.name}</p>
                          <button onClick={() => removeImage(img.id)} className="text-gray-400 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 tabular-nums">{img.size}</span>
                          {/* Progress Bar Container */}
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black dark:bg-white transition-all duration-300 ease-out" 
                              style={{ width: `${img.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

             {/* Tags Box */}
            <div>
              <label className={labelStyle}>Tags</label>
              <input placeholder="Add tags (press Enter or comma)" className={`${inputBase} h-11`} />
            </div>
          </div>
          
        </div>
        {/* Bottom Footer (Static) */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white dark:bg-slate-900 dark:border-slate-800">
           <div className="w-48">
              <select className={inputBase}>
                 <option>Select Status</option>
              </select>
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2 border rounded-md font-bold text-sm hover:bg-gray-50 dark:border-slate-700">Cancel</button>
              <button className="px-6 py-2 bg-black text-white rounded-md font-bold text-sm dark:bg-white dark:text-black">Create</button>
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

          <h1 className="text-xl font-bold text-foreground">Product List</h1>

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