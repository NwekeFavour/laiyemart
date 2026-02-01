import { useEffect, useRef, useState } from "react";
import { useCategoryStore } from "../../../services/categoryService";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  AspectRatio,
  Box,
  Button,
  DialogContent,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { KeyboardArrowDown } from "@mui/icons-material";
import StoreOwnerLayout from "./layout";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

/* ------------------ MODAL COMPONENT ------------------ */
const AddCategoryModal = ({ isOpen, onClose, isDark }) => {
  const { createCategory } = useCategoryStore();
  const { store } = useAuthStore();
  const [loadingc, setLoadingc] = useState(false)
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
    setLoadingc(true)
    if (!name.trim()) {
      return toast.error("Please enter a category name");
    }

    try {
      // 2. The API Call
      await createCategory({
        storeId,
        name,
        image: imageFile,
        isFeatured,
      });

      // 3. Success Feedback
      toast.success("Category created successfully!");

      // 4. Reset state
      setName("");
      setImageFile(null);
      setImagePreview(null);
      setIsFeatured(false);
      setLoadingc(false)
      // 5. Close Modal/Drawer
      onClose();
    } catch (err) {
      // 6. Detailed Error Handling
      console.error("Failed to create category:", err);

      // Try to extract the backend message, otherwise use a fallback
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create category";
      toast.error(errorMessage);
    }
  };

  if (!shouldRender) return null;

  const inputBase = `w-full px-3 py-2 text-sm rounded-md border outline-none transition-all ${
    isDark
      ? "bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
      : "bg-white border-gray-300 focus:border-blue-400 text-gray-900"
  }`;
  const labelStyle =
    ` ${isDark ? "text-slate-400" : "text-gray-700 "} block text-[13px] font-semibold mb-1.5 dark:text-slate-300`;

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
        <div
          className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? "border-slate-800" : "border-slate-100"}`}
        >
          <div>
            <h2
              className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Create Category
            </h2>
            <p className="text-xs text-slate-500">
              Add a new group for your products
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X
              size={20}
              className={isDark ? "text-slate-400" : "text-gray-500"}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className={labelStyle}>Category Thumbnail</label>
            <div
              className={`aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
                isDark
                  ? "border-slate-700 bg-slate-800/40 hover:border-slate-500"
                  : "border-gray-200 bg-gray-50 hover:border-blue-300"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="text-center p-4">
                  <Search size={20} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium opacity-60">
                    Click to upload image
                  </p>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
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

          {/* <div
            className={`p-4 rounded-lg border ${isDark ? "bg-slate-800/30 border-slate-700" : "bg-blue-50/50 border-blue-100"}`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-black dark:accent-white"
              />
              <span
                className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}
              >
                Feature this category on homepage
              </span>
            </label>
          </div> */}
        </div>

        <div
          className={`p-6 border-t flex items-center gap-3 ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-gray-50/50"}`}
        >
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 text-sm font-bold border rounded-lg transition-all ${isDark ? "border-slate-700 text-white hover:bg-slate-800" : "border-slate-200 text-gray-700 hover:bg-slate-100"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loadingc || !name}
            className={`${isDark ? "bg-slate-100/20 text-slate-100" : "bg-slate-900/90 text-white"} flex-[2] px-4 py-2.5   dark:bg-white dark:text-black rounded-lg font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
          >
            {loadingc && <Loader2 size={16} className="animate-spin" />}
            {loadingc ? "Creating..." : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------ TABLE PAGE ------------------ */
export default function CategoriesTable({ isDark, toggleDarkMode }) {
  const {
    categories,
    getCategories,
    submitting,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();
  const { store } = useAuthStore();
  // const storeId = store?._id
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [id, setId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const rowsPerPage = 6;
  const thStyle = `px-4 py-3 font-semibold border-r ${isDark ? "border-slate-800" : "border-slate-100"}`;
  const tdStyle = `px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-gray-700"}`;
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || "");
      setIsFeatured(selectedCategory.isFeatured || false);
      setPreview(selectedCategory.image || "");
      setImage(null); // Clear any pending file uploads from previous edits
    }
  }, [selectedCategory]);

  const handleEditOpen = (selectedCategory) => {
    if (selectedCategory) {
      setName(selectedCategory.name);
      setIsFeatured(selectedCategory.isFeatured);
      setId(selectedCategory.id);
      setPreview(selectedCategory.image); // URL from backend
      setImage(null); // Reset file upload
      setIsEditOpen(true);
      // console.log(selectedCategory)
    }
  };
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  // console.log(categories)
  // Search Logic
  const filteredData = (categories || [])
    .filter(
      (cat) =>
        cat.name?.toLowerCase().includes(search.toLowerCase()) ||
        cat._id?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination Logic - Ensure totalPages is at least 1 to avoid division by zero errors
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const toggleAll = () =>
    setSelected(
      selected.length === filteredData.length && filteredData.length > 0
        ? []
        : filteredData.map((c) => c._id),
    );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (id) => {
    // if (!selectedCategory?._id) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("isFeatured", isFeatured);
    if (image) formData.append("image", image);
    const result = await updateCategory(id, formData);
    if (result.success) {
      setIsEditOpen(false);
    } else {
      toast.error(result.error);
    }
  };
  const handleDelete = async (categoryId) => {
    // Confirmation is now handled by the UI Modal, so we just call the API
    const result = await deleteCategory(categoryId);
    if (result.success) {
      toast.success("Category deleted successfully");
      if (selectedCategory?._id === categoryId) {
        setIsEditOpen(false);
        setSelectedCategory(null);
      }
    } else {
      toast.error(result.error || "Delete failed");
    }
  };

  return (
    <StoreOwnerLayout isDark={isDark} toggleDarkMode={toggleDarkMode}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1
              className={`text-2xl font-bold! tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Inventory Categories
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage how your products are grouped and displayed.
            </p>
          </div>
        </div>

        <div
          className={`rounded-xl border  bg-white overflow-hidden shadow-sm ${isDark ? "border-slate-800 bg-slate-950!" : "border-slate-200"}`}
        >
          <div className="overflow-x-auto hide-scrollbar">
            {" "}
            {/* This allows horizontal scrolling on mobile */}
            <div className="p-4 flex flex-col sm:flex-row justify-end gap-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  placeholder="Search categories..."
                  className={`${isDark ? "bg-[#020618] border-slate-800" : "bg-white border-gray-200"} pl-9 pr-4 py-1.5 text-sm rounded-md border   outline-none w-full sm:w-64`}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCategoryOpen(true)}
                  className="px-5 py-2 bg-slate-900/90 0f172a text-white hover:bg-slate-800/90 hover:text-white rounded-lg font-bold text-sm shadow-lg hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Category
                </button>
              </div>
            </div>
            {/* Set a min-width (min-w-[800px]) to ensure the columns don't collapse on small screens */}
            <table
              className={`${isDark ? "border-[#314158]" : "border-slate-100"} w-full text-left border-collapse border-t  min-w-200`}
            >
              <thead className="bg-transparent">
                <tr
                  className={`text-[13px] border-b ${isDark ? "border-slate-800 bg-slate-800/50 text-slate-400" : "border-slate-100  text-gray-600"}`}
                >
                  <th
                    className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                  >
                    S/N
                  </th>

                  <th className={`w-[250px] ${thStyle}`}>
                    <div className="flex items-center justify-between">
                      <span>Category</span>
                      <HeaderDropdown
                        isDark={isDark}
                        onSortAsc={() => handleSort("name", "asc")}
                        onSortDesc={() => handleSort("name", "desc")}
                      />
                    </div>
                  </th>

                  <th className={`w-[120px] ${thStyle}`}>
                    <div className="flex items-center justify-between">
                      <span>Products</span>
                      <HeaderDropdown
                        isDark={isDark}
                        onSortAsc={() => handleSort("productsCount", "asc")}
                        onSortDesc={() => handleSort("productsCount", "desc")}
                      />
                    </div>
                  </th>

                  <th className={`w-[120px] ${thStyle}`}>Status</th>

                  {/* <th className={`w-[100px] ${thStyle}`}>Featured</th> */}

                  <th className="px-4 py-3 w-[120px] text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody
                className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}
              >
                {paginatedData.length > 0 ? (
                  paginatedData.map((cat, i) => (
                    <tr
                      key={i}
                      className={`text-[13px] transition-colors hover:bg-gray-50 ${isDark ? "hover:bg-slate-800/40" : ""}`}
                    >
                      <td
                        className={`px-4 py-3 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        {i + 1}
                      </td>

                      <td className={` border-r! ${tdStyle}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded border overflow-hidden bg-gray-100 shrink-0">
                            {cat.image ? (
                              <img
                                src={cat.image}
                                className="w-full border-none h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                📦
                              </div>
                            )}
                          </div>
                          <span
                            className={`font-medium truncate ${isDark ? "text-slate-200" : "text-gray-900"}`}
                          >
                            {cat.name}
                          </span>
                        </div>
                      </td>

                      <td className={tdStyle}>{cat.products?.length || 0}</td>                      
                      <td className={tdStyle}>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${cat.isActive !== false ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {cat.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* <td className={tdStyle}>
                        <input
                          type="checkbox"
                          checked={cat.isFeatured}
                          readOnly
                          className="accent-blue-600"
                        />
                      </td> */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <IconButton
                            className={`${isDark ? "text-slate-200!" : ""}`}
                            size="sm"
                            variant="plain"
                            onClick={() => {
                              setSelectedCategory(cat); // Store the category object
                              handleEditOpen(cat); // Open modal
                            }}
                          >
                            Edit
                          </IconButton>
                          <button
                            onClick={() => {
                              setSelectedCategory(cat); // 1. Set the category context
                              setIsDeleteModalOpen(true); // 2. Then open the modal
                            }}
                            className="text-red-500 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className={` ${isDark ? "border-[#314158]" : "border-gray-200"} flex items-center justify-between px-4 py-3 border-t  text-xs text-gray-600`}
          >
            <span>
              Showing {paginatedData.length} of {filteredData.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 border rounded disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1 border rounded disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <AddCategoryModal
          isOpen={isCategoryOpen}
          onClose={() => setIsCategoryOpen(false)}
          isDark={isDark}
        />
        <Drawer
          anchor="right"
          open={isEditOpen}
          onClose={() => !submitting && setIsEditOpen(false)}
          slotProps={{
            content: {
              sx: {
                width: { xs: "100%", sm: 450 },
                p: 0,
                // ✅ Background adjusts to slate-950 in dark mode
                bgcolor: isDark ? "#0f172a" : "background.surface",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              bgcolor: "inherit",
              color: isDark ? "#f1f5f9" : "inherit",
            }}
          >
            {/* HEADER SECTION */}
            <Box
              sx={{
                p: 2.5,
                px: 3,
                borderBottom: "1px solid",
                borderColor: isDark ? "#1e293b" : "#eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography level="h4" sx={{ fontWeight: 800, color: "inherit" }}>
                Edit Category
              </Typography>

              {/* ✅ CLOSE BUTTON */}
              <IconButton
                variant="plain"
                color="neutral"
                onClick={() => setIsEditOpen(false)}
                sx={{
                  color: isDark ? "#94a3b8" : "inherit",
                  "&:hover": {
                    bgcolor: isDark ? "#1e293b" : "background.level1",
                  },
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* IMAGE UPLOAD SECTION */}
                <FormControl>
                  <FormLabel
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: isDark ? "#94a3b8" : "inherit",
                    }}
                  >
                    Category Image
                  </FormLabel>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "xl",
                      border: "2px dashed",
                      borderColor: isDark ? "#334155" : "#cbd5e1",
                      overflow: "hidden",
                      bgcolor: isDark ? "#0f172a" : "transparent",
                    }}
                  >
                    <AspectRatio ratio="16/9">
                      {preview ? (
                        <img
                          src={preview}
                          style={{ objectFit: "cover" }}
                          alt="Preview"
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UploadCloud
                            size={32}
                            color={isDark ? "#475569" : "#64748b"}
                          />
                          <Typography
                            level="body-xs"
                            sx={{ color: isDark ? "#64748b" : "inherit" }}
                          >
                            Upload Image
                          </Typography>
                        </Box>
                      )}
                    </AspectRatio>

                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp, .avif"
                      onChange={handleFileChange}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    />

                    {preview && (
                      <IconButton
                        size="sm"
                        color="danger"
                        variant="solid"
                        onClick={() => {
                          setPreview("");
                          setImage(null);
                        }}
                        sx={{ position: "absolute", top: 10, right: 10 }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    )}
                  </Box>
                </FormControl>

                {/* NAME SECTION */}
                <FormControl required>
                  <FormLabel sx={{ color: isDark ? "#94a3b8" : "inherit" }}>
                    Category Name
                  </FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="soft"
                    sx={{
                      borderRadius: "lg",
                      bgcolor: isDark ? "#1e293b" : "neutral.softBg",
                      color: isDark ? "white" : "inherit",
                      "&:focus-within": {
                        outline: "2px solid",
                        outlineColor: "primary.500",
                      },
                    }}
                  />
                </FormControl>

                {/* FEATURED TOGGLE
                <FormControl
                  orientation="horizontal"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: "lg",
                    bgcolor: isDark ? "#0f172a" : "transparent",
                    border: isDark ? "1px solid #1e293b" : "none",
                  }}
                >
                  <FormLabel
                    sx={{
                      fontWeight: 600,
                      color: isDark ? "#cbd5e1" : "inherit",
                      mb: 0,
                    }}
                  >
                    Featured Category
                  </FormLabel>
                  <Switch
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    color={isFeatured ? "success" : "neutral"}
                    variant={isDark ? "solid" : "soft"}
                  />
                </FormControl> */}
              </Stack>
            </DialogContent>

            {/* FOOTER SECTION */}
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid",
                borderColor: isDark ? "#1e293b" : "#eee",
              }}
            >
              <Button
                className={
                  isDark
                    ? "bg-slate-900/90! hover:bg-slate-800/90!"
                    : "bg-slate-900/90! hover:bg-slate-800!"
                }
                fullWidth
                size="lg"
                loading={submitting}
                onClick={() => handleUpdate(id)}
                sx={{ borderRadius: "xl", height: 50 }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Drawer>
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <ModalDialog
            variant="outlined"
            role="alertdialog"
            sx={{ borderRadius: "xl", maxWidth: 400 }}
          >
            <Typography level="h4" startDecorator={<Trash2 color="red" />}>
              Confirm Deletion
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography level="body-md" sx={{ color: "neutral.700" }}>
              Are you sure you want to delete <b>{selectedCategory?.name}</b>?
              This action cannot be undone.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 3,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="danger"
                loading={submitting}
                onClick={async () => {
                  if (selectedCategory?._id) {
                    await handleDelete(selectedCategory._id);
                    setIsDeleteModalOpen(false);
                  }
                }}
                sx={{ borderRadius: "lg" }}
              >
                Delete Category
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </div>
    </StoreOwnerLayout>
  );
}

const HeaderDropdown = ({ isDark, onSortAsc, onSortDesc }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px"
          aria-hidden="true"
        >
          <path d="m7 15 5 5 5-5"></path>
          <path d="m7 9 5-5 5 5"></path>
        </svg>
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded border shadow-lg py-1 z-50 ${isDark ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-gray-200 text-gray-700"}`}
        >
          <button
            onClick={() => {
              onSortAsc();
              setOpen(false);
            }}
            className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}
          >
            <ArrowUp size={12} className="mr-2" /> Ascending
          </button>
          <button
            onClick={() => {
              onSortDesc();
              setOpen(false);
            }}
            className={`flex w-full items-center px-3 py-2 text-xs hover:bg-blue-600 hover:text-white`}
          >
            <ArrowDown size={12} className="mr-2" /> Descending
          </button>
        </div>
      )}
    </div>
  );
};
