import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Sheet,
  Table,
  Checkbox,
  Chip,
  Link,
  IconButton,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  ListDivider,
  Drawer,
  ModalClose,
  FormControl,
  FormLabel,
  Modal,
  ModalDialog,
  Divider,
  DialogContent,
  Stack,
  AspectRatio,
  Textarea,
  Grid,
  Select,
  Option,
} from "@mui/joy";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X,
  AlertCircle
} from "lucide-react";
import StoreOwnerLayout from "./layout";
import { useProductStore } from "../../../services/productService";
import { useCategoryStore } from "../../../services/categoryService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const fileInputRef = useRef(null);
  const { products, createProduct, fetchMyProducts, loading, updateProduct, deleteProduct } =
    useProductStore();
  const { categories, getCategories, createCategory } = useCategoryStore();
  const [error, setError] = useState(null);
  const { store } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const storeId = store?._id;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]); // This fixes the "images is not defined" error
  const [submitting, setSubmitting] = useState(false); // This fixes the button loading error
      const MAX_IMAGES = 4;
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [category, setCategory] = useState("");
  const [showQuickCategory, setShowQuickCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    // You can trigger your API fetch here or sort 'products' locally
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a unique local ID for the new image
      const localId = Math.random().toString(36).substr(2, 9);
      const newImage = {
        id: localId,
        url: URL.createObjectURL(file),
        file: file,
        isExisting: false,
      };
      setImages((prev) => [...prev, newImage]);

      // Reset the input so the same file can be selected again if deleted
      e.target.value = null;
    }
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleQuickCategorySubmit = async () => {
  if (!newCatName.trim()) return toast.error("Enter a category name");
  setIsCreatingCat(true);
  try {
    await createCategory({
      storeId: store?._id,
      name: newCatName,
      isFeatured: false
    });
    toast.success("Category created!");
    setNewCatName("");
    setShowQuickCategory(false); // Hide the section after success
  } catch (err) {
    toast.error(err.message || "Failed to create category");
  } finally {
    setIsCreatingCat(false);
  }
};
  // console.log(products)
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };
  const handleEditOpen = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setInventory(product.inventory);
    setCategory(product.category);
    // Convert existing image URLs to your state format if needed
    setImages(
      product.images.map((img) => ({
        id: img._id,
        url: img.url,
        isExisting: true,
      })),
    );
    setIsEditOpen(true);
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  // console.log(categories)

      const handleMultiFileChange = (event) => {
          const files = Array.from(event.target.files);
          const remainingSlots = MAX_IMAGES - images.length;
          
          // Only take what we have room for
          files.slice(0, remainingSlots).forEach((file) => {
              const newImage = {
              id: Math.random().toString(36),
              url: URL.createObjectURL(file),
              file,
              progress: 0,
              isUploading: true
              };
              
              setImages(prev => [...prev, newImage]);
              simulateUpload(newImage.id);
          });
      };
  
      const simulateUpload = (id) => {
      let progress = 0;
      const interval = setInterval(() => {
          progress += 10;
          setImages(prev => prev.map(img => 
          img.id === id ? { ...img, progress: progress, isUploading: progress < 100 } : img
          ));
          if (progress >= 100) clearInterval(interval);
      }, 150);
      };

      const handleCreateProduct = async () => {
        if (!name || !price || images.length === 0) {
          toast.error("Please provide at least a name, price, and cover image.");
          return;
        }
  
        const isTrialExpired = store?.plan === "TRIAL" &&  (new Date(store.trialEndsAt) - new Date() <= 0);
        if (isTrialExpired) {
          toast.error("Access Denied: Your trial has expired. Please upgrade to continue.", {
              icon: "🚫",
              style: { borderRadius: '12px' }
          });
          return; // Stop execution
        }
  
        try {
          setSubmitting(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", Number(price) || 0);       // ✅ ensure number
            formData.append("description", description);
            formData.append("category", category);
            formData.append("inventory", Number(inventory) || 0); // ✅ ensure number      
            images.forEach((img) => {
            formData.append("images", img.file);
          });
  
        // for (let [key, value] of formData.entries()) {
        //   console.log(key, value);
        // }
        await createProduct(formData) 
          
          // Reset Form
          setIsDrawerOpen(false);
          setName(""); setPrice(""); setDescription(""); setCategory(""); setImages([]); setInventory("");
          fetchMyProducts(); // Refresh list
        } catch (err) {
            console.log("Full Error Object:", err);
            const errorMsg = err.response?.data?.message || "Failed to create product"; 
        // Extract the specific message: "Product limit reached"
          const errorMessage = 
            err.response?.data?.message || 
            err.response?.data?.error ||   // Some APIs use 'error' key
            err.message ||                 // Axios default (e.g., "Network Error")
            "Failed to create product";
  
            if (errorMsg.includes("limit")) {
                toast.error("🚀 Product limit reached! Please upgrade your plan.", {
                    icon: "⚠️",
                    style: { borderRadius: '12px' }
                });
            } else {
                toast.error(errorMsg);
            }
          setError(errorMessage);
  
          // If it's a limit issue, don't clear it too fast so they can read it
          const displayTime = errorMessage.includes("limit") ? 8000 : 7000;
          setTimeout(() => setError(""), displayTime);
  
        } finally {
        setSubmitting(false);
        }
      };
  // Handle actual update
  const handleUpdateProduct = async () => {
    // 1. Basic Validation check before starting
    if (!name || !price) {
      return toast.error("Name and Price are required fields");
    }

    setSubmitting(true);
    const { token } = useAuthStore.getState();

    // Create a toast ID to handle loading/success/error in one single notification
    const toastId = toast.loading("Updating product...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("inventory", inventory);
      formData.append("category", category);

      const keptImageIds = images
        .filter((img) => img.isExisting)
        .map((img) => img.id);

      formData.append("keptImageIds", JSON.stringify(keptImageIds));

      images.forEach((img) => {
        if (!img.isExisting && img.file) {
          formData.append("images", img.file);
        }
      });

      // The actual API call
      await updateProduct(selectedProduct._id, formData, token);

      // 2. Success Feedback
      toast.success("Product updated successfully!", { id: toastId });
      setIsEditOpen(false);
    } catch (err) {
      // 3. Error Feedback
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update product";

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      console.error("Update Error:", err);
    } finally {
      toast.dismiss(toastId);
      setSubmitting(false);
    }
  };

  const PAGE_SIZE = 10;
  useEffect(() => {
    fetchMyProducts().catch((err) => {
      setError(err.message || "Failed to load products");
    });
  }, []);

  const getStockStatus = (inventory) => {
    if (inventory === 0) return { label: "Out of Stock", color: "danger" };
    if (inventory <= 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };
  // console.log(products)
  const hoverRow = "hover:bg-gray-50!";
  const filteredProducts = products.filter((product) => {
  const query = search.toLowerCase();
  
  // Safely handle category by falling back to an empty string if it's null/undefined
  const categoryMatch = (product.category ?? "").toLowerCase().includes(query);
  const nameMatch = (product.name ?? "").toLowerCase().includes(query);
  const idMatch = (product._id ?? "").toLowerCase().includes(query);

  return nameMatch || categoryMatch || idMatch;
});

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts]; // Always copy to avoid mutating state
    const { key, direction } = sortConfig;

    if (!key) return items;

    return items.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle empty values
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      // Logic for Numbers (Price, Inventory)
      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Logic for Strings (Name, Category)
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const borderColor = "border-slate-100";

  return (
    <StoreOwnerLayout>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2 } }}
      >
        {/* 1. Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              level="h2"
              sx={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}
            >
              Products
            </Typography>
            <Typography level="body-sm" sx={{ color: "#64748b" }}>
              Manage your inventory and product listings
            </Typography>
          </Box>
        </Box>

        <Box
          className="border-b! rounded-t-xl rounded-b-xl"
          sx={{ bgcolor: "white", border: "1px solid #e2e8f0" }}
        >
          {/* 2. Search & Export Bar */}
          <Box className="border-b border-slate-100" sx={{ p: 2 }}>
            <Box
              className="justify-end!"
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Input
                  size="sm"
                  placeholder="Search products..."
                  onChange={(e) => setSearch(e.target.value)}
                  startDecorator={<Search size={16} />}
                  sx={{
                    borderRadius: "md",
                    width: { xs: "100%", sm: 250 },
                    bgcolor: "#f8fafc",
                    "&::before": {
                      display: "none",
                    },
                    // 2. Remove the default focus border/shadow
                    "&:focus-within": {
                      outline: "none",
                      border: "none",
                    },
                    // 3. Optional: keep a subtle background change instead of a ring
                    "&:hover": {
                      bgcolor: "neutral.100",
                    },
                  }}
                />
              </Box>
              <Button
                className="md:mt-0! mt-3! md:px-3! px-2! md:text-[15px]! text-[14px]!  hover:bg-slate-800/90!"
                onClick={() => setIsDrawerOpen(true)}
                variant="solid"
                startDecorator={<Plus size={18} />}
                sx={{
                  bgcolor: "#0f172b",
                  px: 3,
                  py:1
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* 3. Responsive Products Table */}
          <Sheet
            className="hide-scrollbar border-none!"
            variant="outlined"
            sx={{
              overflow: "auto",
              bgcolor: "white",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Table
              sx={{
                minWidth: 900,
                "--TableCell-paddingX": "16px",
                "--TableCell-paddingY": "14px",
                "& thead th": {
                  bgcolor: "transparent",
                  color: "#64748b",
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRight: "1px solid #e2e8f0",
                  borderBottom: "2px solid #f1f5f9",
                  "&:last-child": { borderRight: "none" },
                },
                "& tbody td": {
                  borderRight: "1px solid #e2e8f0 ",
                  borderBottom: "1px solid #e2e8f0 ",
                  "&:last-child": { borderRight: "none" },
                },
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: "center" }}>
                    <Checkbox size="sm" />
                  </th>
                  {[
                    { label: "Product ID", width: 140 },
                    { label: "Product", width: 220 },
                    { label: "Price", width: 130 },
                    { label: "Stock", width: 120 },
                    { label: "Created", width: 130 },
                    { label: "Updated", width: 130 },
                  ].map((column) => {
                    const keyMap = {
                      "Product ID": "_id",
                      Product: "name",
                      Price: "price",
                      Stock: "inventory",
                      Created: "created",
                      Updated: "updated",
                    };
                    const fieldKey = keyMap[column.label];

                    return (
                      <th
                        key={column.label}
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1, // Added gap between text and icon
                            pr: 0.5, // Padding on the right for the menu button
                          }}
                        >
                          <Typography
                            level="title-sm"
                            sx={{ color: "inherit", whiteSpace: "nowrap" }}
                          >
                            {column.label}
                          </Typography>

                          <Dropdown>
                            <MenuButton
                              slots={{ root: IconButton }}
                              slotProps={{
                                root: {
                                  variant: "plain",
                                  color: "neutral",
                                  size: "sm",
                                },
                              }}
                              sx={{
                                borderRadius: "md",
                                ml: "auto",
                                "&:hover": { bgcolor: "background.level1" },
                              }}
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
                            </MenuButton>
                            <Menu
                              size="sm"
                              placement="bottom-end"
                              variant="outlined"
                              sx={{
                                minWidth: 190,
                                borderRadius: "lg",
                                boxShadow: "xl",
                                p: 1,
                                zIndex: 10000,
                                bgcolor: "background.surface",
                                borderColor: "divider",
                              }}
                            >
                              {/* Sorting Group */}
                              <MenuItem
                                onClick={() => handleSort(fieldKey, "asc")}
                                sx={{ gap: 1.5, py: 1 }}
                              >
                                <ArrowUp size={16} className="text-gray-400" />
                                <Typography
                                  level="body-sm"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Asc
                                </Typography>
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleSort(fieldKey, "desc")}
                                sx={{ gap: 1.5, py: 1 }}
                              >
                                <ArrowDown
                                  size={16}
                                  className="text-gray-400"
                                />
                                <Typography
                                  level="body-sm"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Desc
                                </Typography>
                              </MenuItem>

                              <ListDivider
                                sx={{ my: 0.5, bgcolor: "divider" }}
                              />

                              {/* Movement Group (Disabled) */}
                              <MenuItem
                                disabled
                                sx={{ gap: 1.5, py: 1, opacity: 0.4 }}
                              >
                                <ChevronLeft size={16} />
                                <Typography level="body-sm">
                                  Move to Left
                                </Typography>
                              </MenuItem>
                              <MenuItem
                                disabled
                                sx={{ gap: 1.5, py: 1, opacity: 0.4 }}
                              >
                                <ChevronRight size={16} />
                                <Typography level="body-sm">
                                  Move to Right
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </Dropdown>
                        </Box>
                      </th>
                    );
                  })}
                  <th className="" style={{ width: 120, textAlign: "center" }}>
                    <p className="flex items-center justify-center h-[30px]">
                      Actions
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // 2. LOADING STATE
                  [...Array(5)].map((_, i) => (
                    <tr key={`skeleton-row-${i}`} className="animate-pulse">
                      <td style={{ textAlign: "center" }}>
                        <div className="h-4 w-4 bg-slate-200  rounded mx-auto" />
                      </td>
                      <td>
                        <div className="h-4 w-24 bg-slate-200  rounded" />
                      </td>
                      <td>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <div className="h-8 w-8 bg-slate-200  rounded" />
                          <div className="h-4 w-32 bg-slate-200  rounded" />
                        </Box>
                      </td>
                      <td>
                        <div className="h-4 w-16 bg-slate-200  rounded" />
                      </td>
                      <td>
                        <div className="h-4 w-12 bg-slate-200  rounded" />
                      </td>
                      <td>
                        <div className="h-4 w-20 bg-slate-200  rounded" />
                      </td>
                      <td>
                        <div className="h-4 w-20 bg-slate-200  rounded" />
                      </td>
                      <td>
                        <div className="h-8 w-24 bg-slate-200  rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : products?.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <Box
                        sx={{
                          py: 10,
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-full text-blue-500">
                          <Plus size={32} />
                        </div>
                        <Typography level="h4">No products found</Typography>
                        <Typography
                          level="body-sm"
                          sx={{ maxWidth: 300, mb: 1 }}
                        >
                          Your shop is empty! Add your first product to start
                          selling to your customers.
                        </Typography>
                      </Box>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  /* 3. SEARCH IS EMPTY (Products exist, but search query matches nothing) */
                  <tr>
                    <td colSpan={8}>
                      <Box
                        sx={{
                          py: 10,
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Search size={48} className="text-slate-300 mb-4" />
                        <Typography level="h4" sx={{ color: "text.primary" }}>
                          No results for "{search}"
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{ mb: 3, maxWidth: 300 }}
                        >
                          We couldn't find any products matching your search.
                          Check for typos or try a different keyword.
                        </Typography>
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => setSearch("")}
                        >
                          Clear Search
                        </Button>
                      </Box>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((item) => {
                    const stock = getStockStatus(item.inventory);

                    return (
                      <tr key={item._id} className={hoverRow}>
                        <td style={{ textAlign: "center" }}>
                          <Checkbox size="sm" />
                        </td>

                        <td>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "14px",
                              color: "#475569",
                            }}
                          >
                            PROD - {item?._id?.slice(-6).toUpperCase() || "......"}
                          </Typography>
                        </td>

                        <td>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "md",
                                bgcolor: "#f1f5f9",
                                overflow: "hidden",
                              }}
                            >
                              {item.images?.[0]?.url && (
                                <img
                                  src={item.images[0].url}
                                  alt={item.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </Box>

                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#0f172a",
                              }}
                            >
                              {item.name}
                            </Typography>
                          </Box>
                        </td>

                        <td>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: "#0f172a",
                              fontSize: "14px",
                            }}
                          >
                            ₦{item?.price?.toLocaleString()}
                          </Typography>
                        </td>

                        <td>
                          <Typography
                            sx={{ fontSize: "14px", color: "#64748b" }}
                          >
                            {item.inventory} units
                          </Typography>
                        </td>

                        <td>
                          <Typography
                            sx={{ fontSize: "14px", color: "#64748b" }}
                          >
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </Typography>
                        </td>

                        <td>
                          <Typography
                            sx={{ fontSize: "14px", color: "#64748b" }}
                          >
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </Typography>
                        </td>

                        <td>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="sm"
                              variant="plain"
                              onClick={() => handleEditOpen(item)} // Edit trigger
                            >
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="sm" variant="plain">
                              <ExternalLink size={16} />
                            </IconButton>
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="danger"
                              onClick={() => {
                                setSelectedProduct(item);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </td>
                      </tr>
                    );
                  })
                )}
                {/* Inside your Table or Grid container */}
                {search.trim() !== "" && (
                  <tr>
                    <td colSpan={7}>
                      {" "}
                      {/* Replace 6 with the number of columns in your table */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 10,
                          textAlign: "center",
                          width: "100%", // Now it will take the full width of the table
                        }}
                      >
                        <Typography level="h4" sx={{ color: "text.secondary" }}>
                          No products found
                        </Typography>
                        <Typography level="body-sm" sx={{ mb: 2 }}>
                          Try adjusting your search for "{search}" to find what
                          you're looking for.
                        </Typography>
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => setSearch("")}
                        >
                          Clear Search
                        </Button>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Sheet>
          {!loading && products.length > 0 && (
            <Box
              className="p-3!"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                px: 1,
              }}
            >
              <Typography level="body-sm" sx={{ color: "#64748b" }}>
                Page {page} of {totalPages}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outlined"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Drawer
        anchor="right"
        open={isEditOpen}
        onClose={() => !submitting && setIsEditOpen(false)}
        slotProps={{
          content: { sx: { width: { xs: "100%", sm: 450 }, p: 0 } },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="h4" sx={{ fontWeight: 800 }}>
              Edit Product
            </Typography>
            <ModalClose sx={{ position: "static" }} />
          </Box>

          <DialogContent sx={{ p: 3, overflowY: "auto" }}>
            <Stack spacing={3}>
              {/* MEDIA SECTION - Reusing your existing media logic */}
              <FormControl>

                <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                  Product Media
                </FormLabel>
                <Stack spacing={2}>
                  {/* Current Primary Image */}
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "xl",
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <AspectRatio ratio="16/9">
                      {images.length > 0 ? (
                        <img
                          src={images[0].url}
                          style={{ objectFit: "cover" }}
                          alt="Main"
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "neutral.softBg",
                          }}
                        >
                          <Typography level="body-xs">
                            No images uploaded
                          </Typography>
                        </Box>
                      )}
                    </AspectRatio>
                    {images.length > 0 && (
                      <IconButton
                        size="sm"
                        variant="solid"
                        color="danger"
                        onClick={() => removeImage(images[0].id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          borderRadius: "50%",
                          zIndex: 2,
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Scrollable Thumbnails for other images */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: 1.5,
                    }}
                  >
                    {images.slice(1).map((img) => (
                      <Box
                        key={img.id}
                        sx={{
                          position: "relative",
                          borderRadius: "md",
                          overflow: "hidden",
                          border: "1px solid #eee",
                        }}
                      >
                        <AspectRatio ratio="1/1">
                          <img
                            src={img.url}
                            alt="Thumbnail"
                            style={{ objectFit: "cover" }}
                          />
                        </AspectRatio>

                        {/* Remove Overlay Button */}
                        <Box
                          className="hover-action"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "0.2s",
                            "&:hover": { opacity: 1 },
                          }}
                        >
                          <IconButton
                            size="sm"
                            color="danger"
                            variant="solid"
                            onClick={() => removeImage(img.id)}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}

                    {/* Hidden Input Field */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {images.length < 5 && (
                      <Button
                        variant="dashed"
                        color="neutral"
                        onClick={() => fileInputRef.current.click()} // <--- Triggers the hidden input
                        sx={{
                          aspectRatio: "1/1",
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          borderRadius: "md",
                        }}
                      >
                        <Plus size={20} />
                        <Typography level="body-xs">Add</Typography>
                      </Button>
                    )}
                  </Box>
                </Stack>
              </FormControl>

              <FormControl required>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="soft"
                  sx={{
                    borderRadius: "lg",
                    "&::before": { display: "none" },
                    "&:focus-within": { outline: "none" },
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  minRows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="soft"
                  sx={{ borderRadius: "lg", "&::before": { display: "none" } }}
                />
              </FormControl>

              <Stack spacing={2.5}>
                <FormControl required>
                  <FormLabel sx={{ fontWeight: 600 }}>Price</FormLabel>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    startDecorator={
                      <Typography sx={{ fontWeight: "bold" }}>₦</Typography>
                    }
                    variant="soft"
                    sx={{
                      borderRadius: "lg",
                      "&::before": { display: "none" },
                    }}
                  />
                </FormControl>

                {/* ... Category and Inventory Selects ... */}
                <FormControl required>
                  <FormLabel sx={{ fontWeight: 600 }}>Category</FormLabel>
                  <Select
                    placeholder="Select a category"
                    value={category} // Tied to state const [category, setCategory] = useState("");
                    onChange={(_, newValue) => setCategory(newValue)}
                    variant="soft"
                    sx={{ borderRadius: "lg" }}
                  >
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                {/* INVENTORY INPUT */}
                <FormControl required>
                  <FormLabel sx={{ fontWeight: 600 }}>
                    Inventory / Stock
                  </FormLabel>
                  <Input
                    type="number"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    endDecorator={
                      <Typography level="body-xs">units</Typography>
                    }
                    variant="soft"
                    sx={{
                      borderRadius: "lg",
                      "&::before": { display: "none" },
                    }}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </DialogContent>

          <Box sx={{ p: 3, borderTop: "1px solid #eee", bgcolor: "white" }}>
            <Button
              className="bg-slate-900/90! hover:bg-slate-800!"
              fullWidth
              size="lg"
              loading={submitting}
              disabled={submitting}
              onClick={handleUpdateProduct}
              sx={{ borderRadius: "xl", height: 50 }}
            >
              Update Product
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
            Are you sure you want to delete <b>{selectedProduct?.name}</b>? This
            action cannot be undone.
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, mt: 3, justifyContent: "flex-end" }}
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
              loading={loading} // Assumes your store or local state has a 'loading' variable
              onClick={async () => {
                // 1. Create a toast ID to track the process
                const toastId = toast.loading("Deleting product...");

                try {
                  // 2. Wait for the deletion to complete
                  await deleteProduct(selectedProduct._id);

                  // 3. Success feedback
                  toast.success("Product deleted successfully", {
                    id: toastId,
                  });

                  // 4. Close the modal
                  setIsDeleteModalOpen(false);
                } catch (error) {
                  // 5. Error feedback
                  const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Delete failed";
                  toast.error(msg, { id: toastId });
                  console.error("Delete error:", error);
                } finally {
                  toast.dismiss(toastId);
                }
              }}
              sx={{ borderRadius: "lg" }}
            >
              Delete Product
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Product Creation Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => !submitting && setIsDrawerOpen(false)}
          slotProps={{ content: { sx: { width: { xs: '100%', sm: 450 }, p: 0 } } }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="h4" sx={{ fontWeight: 800 }}>Add New Product</Typography>
              <ModalClose sx={{ position: 'static' }} />
            </Box>

            <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
                {/* --- DYNAMIC ERROR BANNER START --- */}
                {error && (
                    <Sheet
                    variant="solid"
                    color="danger"
                    invertedColors
                    sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 'xl',
                        background: 'linear-gradient(45deg, #dc2626 0%, #991b1b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                        '@keyframes shake': {
                        '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                        '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                        '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                        '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                        },
                    }}
                    >
                    <AlertCircle size={20} />
                    <Box sx={{ flex: 1 }}>
                        <Typography level="title-sm" sx={{ fontWeight: 700 }}>
                        {error.toLowerCase().includes("limit") ? "Limit Reached" : "Error"}
                        </Typography>
                        <Typography level="body-xs" sx={{ opacity: 0.9 }}>
                        {error}
                        </Typography>
                    </Box>
                    <IconButton 
                        size="sm" 
                        variant="plain" 
                        onClick={() => setError("")}
                        sx={{ '--IconButton-size': '24px' }}
                    >
                        <X size={14} />
                    </IconButton>
                    </Sheet>
                )}                
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: 600 }}>Product Media</FormLabel>
                    <Stack spacing={1.5}>
                    {/* Cover Image */}
                    <Box sx={{ position: 'relative', borderRadius: 'xl', border: '2px dashed #cbd5e1', overflow: 'hidden' }}>
                      <AspectRatio ratio="16/9">
                          {images.length > 0 ? (
                              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                  <img 
                                      src={images[0].url} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      alt="Cover"
                                  />
                                  {/* Remove button for the Cover Image */}
                                  <IconButton 
                                      size="md" 
                                      color="danger" 
                                      variant="solid" 
                                      onClick={() => removeImage(images[0].id)} 
                                      sx={{ 
                                          position: 'absolute', 
                                          top: 10, 
                                          right: 10, 
                                          borderRadius: '50%', 
                                          boxShadow: 'sm',
                                          zIndex: 10 
                                      }}
                                  >
                                      <X size={18}/>
                                  </IconButton>
                              </Box>
                          ) : (
                              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                  <UploadCloud size={24} />
                                  <Typography level="body-xs" sx={{ mt: 1 }}>Upload Cover</Typography>
                                  <input type="file" hidden accept="image/*" multiple onChange={handleMultiFileChange} />
                              </label>
                          )}
                      </AspectRatio>
                    </Box>

                    {/* Thumbnails Grid */}
                    <Grid container spacing={1}>
                        {/* 1. Render existing thumbnails (skipping the first image as it's the cover) */}
                        {images.slice(1).map(img => (
                        <Grid key={img.id} xs={4}>
                            <Box sx={{ position: 'relative', borderRadius: 'lg', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <AspectRatio ratio="1/1">
                                <img src={img.url} style={{ objectFit: 'cover' }} alt="Thumb" />
                            </AspectRatio>
                            <IconButton 
                                size="sm" color="danger" variant="solid" 
                                onClick={() => removeImage(img.id)} 
                                sx={{ position: 'absolute', top: 2, right: 2, borderRadius: '50%', minHeight: 20, minWidth: 20 }}
                            >
                                <X size={12}/>
                            </IconButton>
                            </Box>
                        </Grid>
                        ))}

                        {/* 2. THE FIX: The "Add More" button inside the grid */}
                        {images.length > 0 && images.length < MAX_IMAGES && (
                        <Grid xs={4}>
                            <label style={{ cursor: 'pointer' }}>
                            <AspectRatio 
                                ratio="1/1" 
                                sx={{ 
                                borderRadius: 'lg', 
                                border: '2px dashed #cbd5e1', 
                                bgcolor: '#f8fafc',
                                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } 
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={20} className="text-slate-400" />
                                </Box>
                            </AspectRatio>
                            <input type="file" hidden accept="image/*" multiple onChange={handleMultiFileChange} />
                            </label>
                        </Grid>
                        )}
                    </Grid>
                    </Stack>
                </FormControl>

                <FormControl required>
                  <FormLabel>Product Name</FormLabel>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Vintage Denim Jacket" 
                    variant="soft" 
                    sx={{ 
                        borderRadius: 'lg',
                        // 1. Remove the focus ring pseudo-element
                        "&::before": {
                        display: 'none',
                        },
                        // 2. Remove the default focus border/shadow
                        "&:focus-within": {
                        outline: 'none',
                        border: 'none',
                        },
                        // 3. Optional: keep a subtle background change instead of a ring
                        '&:hover': {
                        bgcolor: 'neutral.100',
                        }
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    minRows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe your product..." 
                    variant="soft" 
                                        sx={{ 
                        borderRadius: 'lg',
                        // 1. Remove the focus ring pseudo-element
                        "&::before": {
                        display: 'none',
                        },
                        // 2. Remove the default focus border/shadow
                        "&:focus-within": {
                        outline: 'none',
                        border: 'none',
                        },
                        // 3. Optional: keep a subtle background change instead of a ring
                        '&:hover': {
                        bgcolor: 'neutral.100',
                        }
                    }}
                  />
                </FormControl>
              </Stack>
              <Stack spacing={2.5}>
              {/* PRICE CONTROL */}
              <FormControl required>
                <FormLabel sx={{ fontWeight: 600 }}>Price</FormLabel>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  startDecorator={<Typography sx={{ fontWeight: 'bold', color: 'neutral.500' }}>₦</Typography>}
                  variant="soft"
                  sx={{
                    borderRadius: 'lg',
                    "&::before": { display: 'none' },
                    "&:focus-within": { outline: 'none', border: 'none' },
                    '&:hover': { bgcolor: 'neutral.100' }
                  }}
                />
              </FormControl>

              {/* CATEGORY CONTROL */}
              <FormControl required>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <FormLabel sx={{ fontWeight: 600, mb: 0 }}>Category</FormLabel>
                  {/* Optional: Add a small button to toggle the quick-add even if categories exist */}
                  <Typography 
                    level="body-xs" 
                    onClick={() => setShowQuickCategory(!showQuickCategory)}
                    sx={{ cursor: 'pointer', color: 'slate.800', fontWeight: 600 }}
                  >
                    {showQuickCategory ? "Cancel" : "+ Quick Add"}
                  </Typography>
                </Box>

                {/* 1. The Quick-Add Mini Form (Shows if no categories OR if toggled) */}
                {(categories.length === 0 || showQuickCategory) ? (
                  <Sheet
                    variant="soft"
                    color="primary"
                    sx={{
                      p: 2,
                      borderRadius: 'lg',
                      border: '1px dashed',
                      borderColor: 'primary.300',
                      bgcolor: 'primary.50'
                    }}
                  >
                    <Typography level="title-sm" sx={{ mb: 1.5, color: 'slate.700' }}>
                      Create your first category
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Input
                        size="sm"
                        fullWidth
                        placeholder="Category name (e.g. Shoes)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        sx={{ borderRadius: 'md', bgcolor: 'white' }}
                      />
                      <Button
                        className="bg-slate-800!"
                        size="sm"
                        loading={isCreatingCat}
                        onClick={handleQuickCategorySubmit}
                        sx={{ px: 2 }}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Sheet>
                ) : (
                  /* 2. The Standard Select Dropdown */
                  <Select
                    placeholder="Select a category"
                    value={category}
                    onChange={(_, newValue) => setCategory(newValue)}
                    variant="soft"
                    sx={{
                      borderRadius: 'lg',
                      "&::before": { display: 'none' },
                      "&:focus-within": { outline: 'none', border: 'none' },
                    }}
                  >
                    {categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormControl>

              {/* INVENTORY CONTROL */}
              <FormControl required>
                <FormLabel sx={{ fontWeight: 600 }}>Inventory / Stock</FormLabel>
                <Input
                  type="number"
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value)}
                  placeholder="Quantity available"
                  endDecorator={<Typography level="body-xs" sx={{ color: 'neutral.500' }}>units</Typography>}
                  variant="soft"
                  sx={{
                    borderRadius: 'lg',
                    "&::before": { display: 'none' },
                    "&:focus-within": { outline: 'none', border: 'none' },
                    '&:hover': { bgcolor: 'neutral.100' }
                  }}
                />
                <Typography level="body-xs" sx={{ mt: 0.5, color: 'neutral.500' }}>
                  Low stock alerts will trigger when below 5 units.
                </Typography>
              </FormControl>
            </Stack>
            </DialogContent>

            <Box sx={{ p: 3, borderTop: '1px solid #eee', bgcolor: 'white' }}>
              <Button 
                className='bg-slate-900! hover:bg-slate-800!'
                fullWidth 
                size="lg" 
                loading={submitting}
                startDecorator={!submitting && <Plus size={18} />}
                onClick={handleCreateProduct}
                sx={{ borderRadius: 'xl', height: 50 }}
              >
                {submitting ? "Saving Product..." : "Create Product"}
              </Button>
            </Box>
          </Box>
        </Drawer>
    </StoreOwnerLayout>
  );
}
