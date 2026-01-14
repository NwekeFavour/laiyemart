import React, { useEffect, useMemo, useState } from 'react';
import { 
  Eye, UserX, UserCheck, Zap, 
  Clock, ArrowUpRight, Plus, ExternalLink,
  ChevronRight, AlertCircle,
  X,
  UploadCloud
  
} from "lucide-react";
import { Box, Typography, Button, Grid, Sheet, LinearProgress, Drawer, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Divider, AspectRatio, IconButton, Skeleton, Chip, Textarea, Select, Option } from "@mui/joy";
import StoreOwnerLayout from './layout';
import { fetchMe } from '../../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../../services/productService';
import { toast } from 'react-toastify';
import { useCategoryStore } from '../../../services/categoryService';
import { InventoryCard } from '../../components/inventory';
export default function StoreOwnerTrialDashboard() {
  // Stats reflecting a brand new store
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [error, setError] = useState("")
    const { user, store } = useAuthStore();
    const navigate = useNavigate();
    const total_orders = 0
    const [loading, setLoading] = useState(false)
    const { products, fetchMyProducts, createProduct } = useProductStore();
    const {categories, getCategories} = useCategoryStore();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);    
        // Form State
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
      getCategories()
    }, [])
    const [category, setCategory] = useState(categories);
    const [inventory, setInventory] = useState(1);
    const [images, setImages] = useState([]); // Array of { id, url, progress, isUploading }
    const MAX_IMAGES = 4;
    const BACKEND_URL= import.meta.env.VITE_BACKEND_URL
    const stats = useMemo(() => {
    const totalProducts = products.length;

    const outOfStock = products.filter(
        (p) => p.inventory === 0
    ).length;

    const inventoryValue = products.reduce(
        (sum, p) => sum + (Number(p.price) || 0) * (Number(p.inventory) || 0),
        0
    );

    // 1. Core stats that always show
    const baseStats = [
        {
        label: "Total Products",
        value: totalProducts,
        sub: "All products",
        icon: "📦",
        },
        {
        label: "Out of Stock",
        value: outOfStock,
        sub: "Needs restock",
        icon: "⚠️",
        },
        {
        label: "Inventory Value",
        value: `₦${inventoryValue.toLocaleString()}`,
        sub: "Stock worth",
        icon: "💰",
        },
    ];
    

    // 2. Logic for Trial Days
    let trialStat = null;
    if (store?.plan === "TRIAL" && store?.trialEndsAt) {
        const end = new Date(store.trialEndsAt);
        const now = new Date();
        const diffInMs = end - now;
        const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        
        trialStat = {
        label: "Trial Days Left",
        value: daysLeft > 0 ? daysLeft : 0,
        sub: daysLeft > 0 ? "Days remaining" : "Trial expired",
        icon: daysLeft > 0 ? "⏳" : "❌",
        };
    }

    return [...baseStats, trialStat].filter(Boolean);
    }, [products, store]); 

  useEffect(() => {
  fetchMyProducts();
}, []);

// console.log(products)

   useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchMe();
        // console.log(data)
      } catch (err) {
        setError("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

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

    const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
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
        const displayTime = errorMessage.includes("limit") ? 8000 : 4000;
        setTimeout(() => setError(""), displayTime);

      } finally {
      setSubmitting(false);
      }
    };

    const handlePay = async () => {
      try {
        const { user, token, store } = useAuthStore.getState();
  
        // 🔐 Must be logged in
        if (!token || !user) {
          window.location.href = "/auth/sign-in";
          return;
        }
  
        // 🏪 Must have an active store
        if (!store?._id) {
          alert("No active store selected");
          return;
        }
  
        const amount = 5000
        const res = await fetch(`${BACKEND_URL}/api/payments/init`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            plan: "PAID",
            amount,
            storeId: store._id, // ✅ REQUIRED
          }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Payment failed");
        console.log(data)
        // 🚀 Redirect to Paystack
        window.location.href = data.url;
      } catch (err) {
        alert(err.message);
      }
    };

    const StatSkeleton = () => (
    <Sheet
        variant="outlined"
        sx={{
        p: 2.5,
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
        }}
    >
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: "8px", mb: 2 }} />
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={32} sx={{ mt: 1 }} />
        <Skeleton width="70%" height={12} sx={{ mt: 1 }} />
    </Sheet>
    );

  return (
    <StoreOwnerLayout>
        <Box  sx={{ p: { xs: 2, md: 2 },  minHeight: '100vh' }}>
            {error && (
            <Sheet
                variant="solid"
                color="danger"
                invertedColors
                sx={{
                mb: 4,
                p: 2.5,
                borderRadius: '24px',
                background: 'linear-gradient(45deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
                position: 'relative',
                overflow: 'hidden'
                }}
            >
                {/* Background Decoration */}
                <Box sx={{ 
                position: 'absolute', right: -20, top: -20, width: 100, height: 100, 
                borderRadius: '50%', background: 'rgba(255,255,255,0.1)' 
                }} />

                <Box sx={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px', flexShrink: 0
                }}>
                <AlertCircle size={24} />
                </Box>

                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography level="title-md" sx={{ fontWeight: 800 }}>
                    {/* Determine title by error content */}
                    {error.toLowerCase().includes("auth") ? "Authentication Issue" : "Action Failed"}
                </Typography>
                
                <Typography level="body-sm" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
                    {/* THE FIX: This prints the actual error string from your state */}
                    {error}
                </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
                <Button 
                    variant="plain" 
                    size="sm" 
                    onClick={() => setError("")}
                    sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    borderRadius: 'xl', flex: 1, color: 'white'
                    }}
                >
                    Dismiss
                </Button>
                
                {/* Show Sign In button ONLY if it's an auth error */}
                {error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("login") ? (
                    <Button 
                    variant="solid" 
                    color="neutral"
                    size="sm"
                    onClick={() => {
                        localStorage.removeItem("layemart-auth");
                        navigate("/auth/sign-in");
                    }}
                    sx={{ borderRadius: 'xl', flex: 1, whiteSpace: 'nowrap' }}
                    >
                    Login
                    </Button>
                ) : (
                    <Button 
                    variant="plain" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 'xl', flex: 1, color: 'white'
                    }}
                    >
                    Retry
                    </Button>
                )}
                </Box>
            </Sheet>
            )}
            
        {/* Trial Countdown Header */}
        { store?.plan === "TRIAL" &&
          <Sheet 
              className="bg-slate-900/90! text-white! shadow-lg shadow-slate-200/20! lg:items-center! items-end! flex! justify-between! flex-wrap!"
              variant="solid" 
              sx={{ 
              mb: 4, p: 2, borderRadius: '20px', 
              }}
          >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div className="bg-amber-400 p-2 rounded-lg">
                  <Zap size={20} className="text-slate-900" />
              </div>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 700 }}>You're on the Free Trial</Typography>
                <Typography className="text-slate-200!" sx={{ fontSize: '12px' }}>Upgrade now to unlock unlimited products and custom domains.</Typography>
              </Box>
              </Box>
              <Button 
              onClick={handlePay}
              className='md:mt-0 mt-4!'
              size="sm" 
              sx={{ bgcolor: 'white', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: 'lg' }}
              >
              Upgrade to Pro
              </Button>
          </Sheet>
        }

        {/* Header Section */}
        <Box className="flex! flex-wrap!" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
            <Box>
            <Typography 
              className="lg:text-[30px]! md:text-[24px]! text-[22px]!" 
              level="h2" 
              sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}
            >
              Welcome, {user?.fullName ? user.fullName.split(' ')[0] : "Store Owner"}!
            </Typography>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Typography level="body-md" sx={{ color: 'neutral.500' }}>Your store is currently live at:</Typography>
                <Typography sx={{ color: 'blue.600', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <a 
                    href={
                      store?.subdomain 
                        ? `http://${store.subdomain}.${window.location.hostname.replace('www.', '')}${window.location.port ? ':' + window.location.port : ''}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {store?.subdomain ? `${store.subdomain}.layemart.com` : "mystore.layemart.com"}
                    <ExternalLink size={14} className="mb-0.5" />
                  </a>
                </Typography>
            </div>
            </Box>
            <Button 
                className='md:mt-0! mt-3! md:px-3! px-2! md:text-[15px]! text-[14px]!  hover:bg-slate-800/90!'
                onClick={() => setIsDrawerOpen(true)}
            variant="solid" 
            startDecorator={<Plus size={18} />}
            sx={{ bgcolor: '#0f172b', borderRadius: 'xl', height: 48, px: 3 }}
            >
            Add Product
            </Button>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
        {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                <StatSkeleton />
                </Grid>
            ))
            : stats.map((item, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                <Sheet
                    variant="outlined"
                    sx={{
                    p: 2.5,
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "white",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: "lg", bgcolor: "#f1f5f9" }}>
                        {item.icon}
                    </Box>
                    </Box>

                    <Typography level="body-sm" sx={{ fontWeight: 600, color: "neutral.500" }}>
                    {item.label}
                    </Typography>

                    <Typography level="h3" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {item.value}
                    </Typography>

                    <Typography sx={{ fontSize: "12px", color: "neutral.400", mt: 0.5 }}>
                    {item.sub}
                    </Typography>
                </Sheet>
                </Grid>
            ))}
        </Grid>

        <div className='grid grid-cols-1 justify-items-center lg:my-5 my-3'>
          <div>
            <InventoryCard isDark={false} 
            products={products}/>
          </div>
        </div>

        <Sheet
        sx={{
            p: 3,
            mb: 4,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
        }}
        >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
            <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                Recent Store Visitors
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
                Visitors who viewed your store but didn’t purchase
            </Typography>
            </Box>

            <Chip
            variant="soft"
            color="warning"
            startDecorator={<Eye size={14} />}
            >
            Early data
            </Chip>
        </Box>

        {/* Empty / Trial State */}
        <Box
            sx={{
            mt: 3,
            p: 3,
            borderRadius: "16px",
            border: "1px dashed #e2e8f0",
            textAlign: "center",
            bgcolor: "#f8fafc",
            }}
        >
            <UserX size={36} className="mx-auto text-slate-400" />

            <Typography sx={{ fontWeight: 700, mt: 2 }}>
            No returning visitors yet
            </Typography>

            <Typography sx={{ fontSize: "14px", color: "neutral.500", mt: 1 }}>
            Once people start visiting your store, you’ll see inactive and returning
            visitors here.
            </Typography>

            <Button
            size="sm"
            sx={{
                mt: 3,
                bgcolor: "#0f172a",
                borderRadius: "lg",
            }}
            >
            Share Store Link
            </Button>
        </Box>
        </Sheet>


        <Grid container spacing={3}>
            {/* Onboarding Checklist */}
            <Grid xs={12} md={7}>
            <Sheet sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography level="title-lg" sx={{ fontWeight: 700, mb: 1 }}>Setup Checklist</Typography>
                <Typography level="body-sm" sx={{ color: 'neutral.500', mb: 3 }}>Complete these steps to launch your store successfully.</Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                    { task: "Add your first product", done: products.length > 0 ? true : false},
                    { 
                        task: "Receive your first order", 
                        done: total_orders > 0, // The ultimate "Success" milestone
                        link: "/orders" 
                    },
                ].map((item, idx) => (
                    <Box key={idx} sx={{ 
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, 
                    borderRadius: 'xl', border: '1px solid', 
                    borderColor: item.done ? '#f1f5f9' : '#e2e8f0',
                    bgcolor: item.done ? '#f8fafc' : 'transparent'
                    }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                        {item.done && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <Typography sx={{ 
                        fontSize: '14px', fontWeight: 600, 
                        color: item.done ? 'neutral.400' : 'neutral.700',
                        textDecoration: item.done ? 'line-through' : 'none'
                    }}>
                        {item.task}
                    </Typography>
                    {!item.done && <ChevronRight size={16} className="ml-auto text-slate-400" />}
                    </Box>
                ))}
                </Box>
            </Sheet>
            </Grid>

            {/* Upgrade Card */}
            <Grid xs={12} md={5}>
            <Sheet sx={{ 
                p: 4, borderRadius: '24px', bgcolor: '#eff6ff', 
                border: '1px solid #dbeafe', position: 'relative', overflow: 'hidden' 
            }}>
                <Zap className="absolute -right-4 -top-4 text-blue-100" size={120} />
                
                <Typography sx={{ color: 'blue.700', fontWeight: 800, fontSize: '20px', mb: 1 }}>
                Ready to grow?
                </Typography>
                <Typography sx={{ color: 'blue.600', fontSize: '14px', mb: 3, lineHeight: 1.5 }}>
                The Pro plan gives you custom domains, advanced analytics, and 0% transaction fees.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'blue.700' }}>Trial Usage</Typography>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'blue.700' }}>60%</Typography>
                </Box>
                <LinearProgress 
                    determinate 
                    value={60} 
                    color="primary"
                    sx={{ borderRadius: 'sm', height: 8, bgcolor: '#dbeafe' }} 
                />
                </Box>

                <Button 
                fullWidth 
                endDecorator={<ArrowUpRight size={18} />}
                sx={{ bgcolor: '#2563eb', color: 'white', py: 1.5, borderRadius: 'xl', '&:hover': { bgcolor: '#1d4ed8' } }}
                >
                See All Pro Features
                </Button>
            </Sheet>
            </Grid>
        </Grid>

        
        {/* product modal */}

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
                <FormLabel sx={{ fontWeight: 600 }}>Category</FormLabel>
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
                  {/* Dynamic mapping starts here */}
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>No categories found</Option>
                  )}
                </Select>
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
        </Box>
    </StoreOwnerLayout>
  );
}