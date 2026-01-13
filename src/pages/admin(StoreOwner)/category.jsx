import { useEffect, useRef, useState } from "react";
import { useCategoryStore } from "../../../services/categoryService";
import { ChevronLeft, ChevronRight, Plus, Search, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Option, Select } from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";
import StoreOwnerLayout from "./layout";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

/* ------------------ MODAL COMPONENT ------------------ */
const AddCategoryModal = ({ isOpen, onClose, isDark }) => {
  const { createCategory, loading } = useCategoryStore();
  const {store} = useAuthStore()
  // Replace 'YOUR_STORE_ID' with the actual ID from your Auth or Params
  const storeId = store?._id; 
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimate, setIsAnimate] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

    const handleSubmit = async () => {
    // 1. Basic Validation
    if (!name.trim()) {
        return toast.error("Please enter a category name");
    }

    try {
        // 2. The API Call
        await createCategory({
        storeId,
        name,
        image: imageFile,
        isFeatured
        });

        // 3. Success Feedback
        toast.success("Category created successfully!");

        // 4. Reset state
        setName("");
        setImageFile(null);
        setImagePreview(null);
        setIsFeatured(false);
        
        // 5. Close Modal/Drawer
        onClose();

    } catch (err) {
        // 6. Detailed Error Handling
        console.error("Failed to create category:", err);
        
        // Try to extract the backend message, otherwise use a fallback
        const errorMessage = err.response?.data?.message || err.message || "Failed to create category";
        toast.error(errorMessage);
        
    }
    };

  if (!shouldRender) return null;

  const inputBase = `w-full px-3 py-2 text-sm rounded-md border outline-none transition-all ${
    isDark ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-white" : "bg-white border-gray-300 focus:border-blue-400 text-gray-900"
  }`;
  const labelStyle = "block text-[13px] font-semibold mb-1.5 text-gray-700 dark:text-slate-300";

  return (
    <div 
      className={`fixed inset-0 z-[110] flex justify-end bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 ${isAnimate ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`relative h-full w-full max-w-md shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isDark ? "bg-[#0f172a]" : "bg-white"
        } ${isAnimate ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          <div>
            <h2 className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Create Category</h2>
            <p className="text-xs text-slate-500">Add a new group for your products</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className={isDark ? "text-slate-400" : "text-gray-500"} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className={labelStyle}>Category Thumbnail</label>
            <div className={`aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
                isDark ? "border-slate-700 bg-slate-800/40 hover:border-slate-500" : "border-gray-200 bg-gray-50 hover:border-blue-300"
            }`}>
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <Search size={20} className="mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium opacity-60">Click to upload image</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            </div>
          </div>

          <div>
              <label className={labelStyle}>Category Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Winter Collection" 
                className={inputBase} 
              />
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? "bg-slate-800/30 border-slate-700" : "bg-blue-50/50 border-blue-100"}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-black dark:accent-white" 
              />
              <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>Feature this category on homepage</span>
            </label>
          </div>
        </div>

        <div className={`p-6 border-t flex items-center gap-3 ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-gray-50/50"}`}>
          <button onClick={onClose} className={`flex-1 px-4 py-2.5 text-sm font-bold border rounded-lg transition-all ${isDark ? "border-slate-700 text-white hover:bg-slate-800" : "border-slate-200 text-gray-700 hover:bg-slate-100"}`}>
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !name}
            className="flex-[2] px-4 py-2.5 bg-slate-900/90 text-white dark:bg-white dark:text-black rounded-lg font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------ TABLE PAGE ------------------ */
export default function CategoriesTable({ isDark = false }) {
  const { categories, getCategories } = useCategoryStore();
  const {store} = useAuthStore()
  const storeId = store?._id
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); 
  const rowsPerPage = 6;
    const thStyle = `px-4 py-3 font-semibold border-r ${isDark ? "border-slate-800" : "border-slate-100"}`;
    const tdStyle = `px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-gray-700"}`;
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
    };

  useEffect(() => {
    if (storeId) {
      getCategories(storeId);
    }
  }, [storeId, getCategories]);
  console.log(categories)
  // Search Logic
    const filteredData = (categories || [])
    .filter(cat =>
        cat.name?.toLowerCase().includes(search.toLowerCase()) || 
        cat._id?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;

        if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
        } else {
        return aValue < bValue ? 1 : -1;
        }
    });

// Pagination Logic - Ensure totalPages is at least 1 to avoid division by zero errors
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleAll = () => setSelected(
    selected.length === filteredData.length && filteredData.length > 0 
      ? [] 
      : filteredData.map(c => c._id)
  );

  return (
    <StoreOwnerLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>Inventory Categories</h1>
            <p className="text-sm text-slate-500 font-medium">Manage how your products are grouped and displayed.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className={`px-4 py-2 text-sm font-bold border rounded-lg transition-all ${isDark ? "border-slate-700 text-white hover:bg-slate-800" : "border-slate-200 text-gray-700 hover:bg-slate-50"}`}>
              Export CSV
            </button>
            <button 
              onClick={() => setIsCategoryOpen(true)}
              className="px-5 py-2 bg-slate-900/90 0f172a text-white hover:bg-slate-800/90 hover:text-white rounded-lg font-bold text-sm shadow-lg hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={18} />
              New Category
            </button>
          </div>
        </div>

        <div className={`rounded-xl border  bg-white overflow-hidden shadow-sm ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <div className="overflow-x-auto hide-scrollbar"> {/* This allows horizontal scrolling on mobile */}
                <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                    <input
                    placeholder="Search categories..."
                    className="pl-9 pr-4 py-1.5 text-sm rounded-md border border-gray-200 bg-white outline-none focus:border-slate-200 w-full sm:w-64"
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                </div>
                
                {/* Set a min-width (min-w-[800px]) to ensure the columns don't collapse on small screens */}
                <table className="w-full text-left border-collapse border-t border-slate-100 min-w-[800px]">
                <thead className="bg-transparent">
                    <tr className={`text-[13px] border-b ${isDark ? "border-slate-800 bg-slate-800/50 text-slate-400" : "border-slate-100  text-gray-600"}`}>
                    <th className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        <input 
                            type="checkbox" 
                            checked={selected.length > 0 && selected.length === filteredData.length} 
                            onChange={toggleAll} 
                            className="rounded-sm accent-blue-600" 
                        />
                    </th>

                    <th className={`w-[250px] ${thStyle}`}>
                        <div className="flex items-center justify-between">
                            <span>Category</span>
                            <HeaderDropdown 
                            isDark={isDark} 
                            onSortAsc={() => handleSort('name', 'asc')} 
                            onSortDesc={() => handleSort('name', 'desc')} 
                            />
                        </div>
                    </th>

                    <th className={`w-[120px] ${thStyle}`}>
                        <div className="flex items-center justify-between">
                            <span>Products</span>
                            <HeaderDropdown 
                            isDark={isDark} 
                            onSortAsc={() => handleSort('productsCount', 'asc')} 
                            onSortDesc={() => handleSort('productsCount', 'desc')} 
                            />
                        </div>
                    </th>

                    <th className={`w-[150px] ${thStyle}`}>
                        <div className="flex items-center justify-between">
                            <span>Earnings</span>
                            <HeaderDropdown 
                            isDark={isDark} 
                            onSortAsc={() => handleSort('products.price', 'asc')} 
                            onSortDesc={() => handleSort('products.price', 'desc')} 
                            />
                        </div>
                    </th>

                    <th className={`w-[120px] ${thStyle}`}>Status</th>
                    
                    <th className={`w-[100px] ${thStyle}`}>Featured</th>

                    <th className="px-4 py-3 w-[120px] text-center font-semibold">
                        Actions
                    </th>
                    </tr>
                </thead>
                
                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
                    {paginatedData.length > 0 ? (
                    paginatedData.map((cat) => (
                        <tr key={cat._id} className={`text-[13px] transition-colors hover:bg-gray-50 ${isDark ? "hover:bg-slate-800/40" : ""}`}>
                        <td className={`px-4 py-3 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                            <input type="checkbox" checked={selected.includes(cat._id)} onChange={() => {}} className="rounded-sm accent-blue-600" />
                        </td>
                        
                        <td className={` border-r! ${tdStyle}`}>
                            <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border overflow-hidden bg-gray-100 shrink-0">
                                {cat.image ? <img src={cat.image} className="w-full border-none h-full object-cover" alt="" /> : <div className="flex items-center justify-center h-full">📦</div>}
                            </div>
                            <span className={`font-medium truncate ${isDark ? "text-slate-200" : "text-gray-900"}`}>{cat.name}</span>
                            </div>
                        </td>
                        
                        <td  className={tdStyle}>
                          {cat.products?.length || 0}</td>
                        <td className={`${tdStyle} font-medium`}>
                        ₦
                        {cat.products && cat.products.length > 0
                        ? cat.products
                            .reduce((total, product) => total + (Number(product.price) || 0), 0)
                            .toLocaleString()
                        : "0"}
                        </td>
                        <td className={tdStyle}>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${cat.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {cat.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className={tdStyle}>
                            <input type="checkbox" checked={cat.isFeatured} readOnly className="accent-blue-600" />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-3">
                            <button className="text-blue-500 font-semibold hover:underline">Edit</button>
                            <button className="text-red-500 font-semibold hover:underline">Delete</button>
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="7" className="px-4 py-12 text-center text-gray-500">No categories found</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-xs text-gray-600">
                <span>Showing {paginatedData.length} of {filteredData.length}</span>
                <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1 border rounded disabled:opacity-30"><ChevronLeft size={14}/></button>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 border rounded disabled:opacity-30"><ChevronRight size={14}/></button>
                </div>
            </div>
        </div>

        <AddCategoryModal isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} isDark={isDark} />
      </div>
    </StoreOwnerLayout>
  );
}

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