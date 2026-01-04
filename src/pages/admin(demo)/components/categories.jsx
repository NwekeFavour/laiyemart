import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Option, Select } from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";

/* ------------------ CATEGORIES DATA ------------------ */
const categoriesData = [
  { id: "WM-8421", name: "Running Shoes", qty: 120, earnings: 2583, status: "Active", featured: true, icon: "👟" },
  { id: "UC-3990", name: "Flip-flops", qty: 245, earnings: 10110, status: "Active", featured: false, icon: "🩴" },
  { id: "KB-8820", name: "Slip-on-shoe", qty: 560, earnings: 59476.5, status: "Inactive", featured: false, icon: "👞" },
  { id: "LS-1033", name: "Sport Sneakers", qty: 98, earnings: 102369.99, status: "Active", featured: true, icon: "👟" },
];


const AddCategoryModal = ({ isOpen, onClose, isDark }) => {
  // Always call hooks at the top
  const [isMounted, setIsMounted] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the DOM has rendered the initial state
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const panelBg = isDark ? "bg-[#1e293b] text-slate-200" : "bg-white text-gray-900";
  const inputBase = `w-full px-3 py-2 text-sm rounded-md border outline-none transition-all ${
    isDark ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-400"
  }`;
  const labelStyle = "block text-[13px] font-semibold mb-1.5 text-gray-700 dark:text-slate-300";

  return (
    <div 
      className="fixed inset-0 z-110 p-6 flex justify-end bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`relative h-full rounded-2xl w-full max-w-md shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${panelBg} ${
          isMounted ? "translate-x-0" : "translate-x-[-1]"
        }`}
      >
        {/* Header */}
        <div className={`${isDark ? "border-slate-700": ""} px-6 py-4 border-b border-slate-100 flex justify-between items-center dark:border-slate-700`}>
          <h2 className="font-bold text-[16px]">Add Category</h2>
        </div>

        <div className="flex-1 overflow-y-auto  p-6 space-y-6">
        {/* Image Upload Area */}
        <div 
            className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-colors ${
            isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-gray-50"
            }`}
        >
            {categoryImage ? (
            <img src={categoryImage} className="w-full h-full object-cover" alt="Category" />
            ) : (
            <div className="text-center">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                className={isDark ? "text-slate-600" : "text-gray-400"}
                >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
            </div>
            )}
            <button className={`absolute bottom-4 right-4 text-xs font-bold px-4 py-1.5 border rounded-md shadow-sm transition-colors ${
            isDark 
                ? "bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600" 
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}>
            Upload
            </button>
        </div>

        {/* Category Name */}
        <div>
            <label className={labelStyle}>Category Name</label>
            <input 
            placeholder="e.g. Running Shoes" 
            className={inputBase} 
            />
        </div>

        {/* Status Select (Joy UI with Dark Mode SX) */}
        <div>
            <label className={labelStyle}>Status</label>
            <Select 
            placeholder="Select Status" 
            indicator={<KeyboardArrowDown className={isDark ? "text-slate-400" : "text-gray-500"} />}
            sx={{ 
                width: '100%', 
                height: '40px',
                // Dynamic Dark Mode Styles
                backgroundColor: isDark ? '#1e293b' : '#fff', 
                color: isDark ? '#cbd5e1' : '#1f2937',
                borderColor: isDark ? '#334155' : '#d1d5db',
                '&:hover': {
                backgroundColor: isDark ? '#334155' : '#f9fafb',
                borderColor: isDark ? '#475569' : '#9ca3af',
                },
                '& .MuiSelect-listbox': {
                backgroundColor: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#cbd5e1' : '#1f2937',
                }
            }}
            >
            <Option value="active" sx={isDark ? { '&:hover': { bgcolor: '#334155' } } : {}}>Active</Option>
            <Option value="inactive" sx={isDark ? { '&:hover': { bgcolor: '#334155' } } : {}}>Inactive</Option>
            </Select>
        </div>

        {/* Description */}
        <div>
            <label className={labelStyle}>Description</label>
            <textarea 
            rows={4} 
            placeholder="Describe this category..."
            className={`${inputBase} resize-none`} 
            />
        </div>
        </div>

        {/* Footer */}
        <div className="p-6  border-slate-100 flex justify-end gap-3 dark:border-slate-700">
          <button onClick={onClose} className={` ${isDark ? "hover:bg-slate-700" : ""} px-6 py-2 text-sm font-bold hover:bg-slate-200 rounded-md transition-colors`}>Close</button>
          <button className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">Create</button>
        </div>
      </div>
    </div>
  );
};
/* ------------------ TABLE COMPONENT ------------------ */
export default function CategoriesTable({ isDark = false }) {
  const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [data, setData] = useState(categoriesData);
    const [filteredData, setFilteredData] = useState(categoriesData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;
    const [isCategoryOpen, setIsCategoryOpen] = useState(false); 


    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    useEffect(() => {
    setCurrentPage(1);
    }, [search]);
    useEffect(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
        setFilteredData(data);
        return;
    }

    setFilteredData(
        data.filter(cat =>
        cat.name.toLowerCase().includes(q) ||
        cat.id.toLowerCase().includes(q) ||
        cat.status.toLowerCase().includes(q)
        )
    );
    }, [search, data]);

  const toggleAll = () =>
    setSelected(selected.length === filteredData.length ? [] : filteredData.map((c) => c.id));

  const handleSort = (key, direction) => {
    const sorted = [...filteredData].sort((a, b) => {
      if (typeof a[key] === "string") {
        return direction === "asc" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
    setData(sorted);
  };

  // Border and Theme Variables to match your reference
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-100';
  const themeHeader = isDark ? 'text-slate-400 bg-slate-800' : 'text-gray-600 bg-white';
  const hoverRow = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50';

  return (
    <div>
        <div className="flex mb-4 items-center flex-wrap dap-2.5  justify-between">

            <div className="flex flex-col gap-1">

            <h1 className="text-xl font-bold text-foreground">Category List</h1>

            <span className="text-sm text-muted-foreground">84 categories found. 12% needs your attention.</span>

            </div>

            <div className="flex items-center gap-3 md:mt-0 mt-3 ">

                <button onClick={() => setIsCategoryOpen(true)} data-slot="button" className={`${isDark ? "bg-slate-900! hover:bg-slate-800! border-none" : "hover:bg-slate-50"} cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&amp;_svg]:shrink-0 bg-zinc-950 text-white  hover:bg-zinc-950 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90 h-8.5 rounded-md px-3 text-[0.8125rem] leading-(--text-sm--line-height) [&amp;_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-xs shadow-black/5 gap-2`}>

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Add Category
                </button>


                <AddCategoryModal
                    isOpen={isCategoryOpen} 
                    onClose={() => setIsCategoryOpen(false)} 
                    isDark={isDark} 
                />
            </div>

        </div>



        <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden`}>
            
            <div className="overflow-x-auto hide-scrollbar">
                <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-2">
                        <div className="relative flex items-center">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        <input
                            placeholder="Search..."
                            className={`pl-9 pr-4 py-1.5 text-sm rounded-md border outline-none
                            ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                            onChange={(e) => setSearch(e.target.value)}

                        />
                        </div>
                    </div>
                </div>
                <table className={`w-full text-left border-collapse border-t ${borderColor}`}>
                <thead>
                    <tr className={`text-[13px] border-b ${borderColor} ${themeHeader}`}>
                    <th className={`px-4 py-3 border-r ${borderColor} w-10 text-center`}>
                        <input 
                        type="checkbox" 
                        checked={selected.length > 0 && selected.length === data.length} 
                        onChange={toggleAll}
                        className="rounded-sm accent-blue-600" 
                        />
                    </th>
                    {[
                        { label: "Category", key: "name" },
                        { label: "Products QTY", key: "qty" },
                        { label: "Total Earnings", key: "earnings" },
                        { label: "Status", key: "status" },
                        { label: "Featured", key: "featured" },
                    ].map((col) => (
                        <th key={col.key} className={`px-4 py-3 border-r ${borderColor} font-semibold text-[13px] whitespace-nowrap`}>
                        <div className="flex items-center justify-between gap-2">
                            {col.label}
                            <HeaderDropdown 
                            isDark={isDark} 
                            onSortAsc={() => handleSort(col.key, "asc")}
                            onSortDesc={() => handleSort(col.key, "desc")}
                            />
                        </div>
                        </th>
                    ))}
                    <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                    {paginatedData.map((cat) => (
                    <tr key={cat.id} className={`text-[13px] ${isDark ? 'text-slate-200' : 'text-gray-700'} ${hoverRow}`}>
                        <td className={`px-4 py-3 border-r ${borderColor} text-center`}>
                        <input 
                            type="checkbox" 
                            checked={selected.includes(cat.id)} 
                            onChange={() => setSelected(prev => prev.includes(cat.id) ? prev.filter(i => i !== cat.id) : [...prev, cat.id])}
                            className="rounded-sm accent-blue-600" 
                        />
                        </td>
                        
                        {/* Category Info Cell */}
                        <td className={`px-4 py-3 border-r ${borderColor}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                            {cat.icon}
                            </div>
                            <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{cat.id}</p>
                            </div>
                        </div>
                        </td>

                        <td className={`px-4 py-3 border-r ${borderColor}`}>{cat.qty}</td>
                        
                        <td className={`px-4 py-3 border-r ${borderColor} font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                        ₦{cat.earnings.toLocaleString()}
                        </td>

                        <td className={`px-4 py-3 border-r ${borderColor}`}>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            cat.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                            {cat.status}
                        </span>
                        </td>

                        <td className={`px-4 py-3 border-r ${borderColor}`}>
                        <input type="checkbox" checked={cat.featured} readOnly className="accent-blue-600" />
                        </td>

                        <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">
                            <button className={`font-semibold text-[12px] hover:underline border-b border-dotted ${isDark ? 'text-blue-400 border-blue-400' : 'text-blue-500 border-blue-500'}`}>
                            Edit
                            </button>
                            <button className={`font-semibold text-[12px] hover:underline border-b border-dotted ${isDark ? 'text-red-400 border-red-400' : 'text-red-500 border-red-500'}`}>
                            Delete
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

            </div>
            <div
                className={`flex items-center justify-between px-4 py-3 border-t text-xs
                ${isDark ? "border-slate-800 text-slate-400" : "border-gray-200 text-gray-600"}`}
            >
                <span>
                    Showing {(currentPage - 1) * rowsPerPage + 1}–
                    {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
                    {filteredData.length}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded border disabled:opacity-50"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-2 py-1 rounded border text-xs font-medium
                            ${
                                currentPage === i + 1
                                ? "bg-blue-600 text-white border-blue-600"
                                : isDark
                                ? "border-slate-700 hover:bg-slate-800"
                                : "border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded border disabled:opacity-50"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  
  );
}

/* ------------------ HEADER DROPDOWN (Matches Reference) ------------------ */
const HeaderDropdown = ({ isDark, onSortAsc, onSortDesc }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px" aria-hidden="true"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>
        </button>

        {open && (
            <div className={`absolute right-0 mt-2 w-40 rounded border shadow-lg py-1 z-50 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-700'}`}>
            <button onClick={() => { onSortAsc(); setOpen(false); }} className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}>
                <ArrowUp size={12} className="mr-2" /> Ascending
            </button>
            <button onClick={() => { onSortDesc(); setOpen(false); }} className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}>
                <ArrowDown size={12} className="mr-2" /> Descending
            </button>
            </div>
        )}
    </div>
  );
};