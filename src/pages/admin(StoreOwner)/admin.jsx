import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  UserX,
  UserCheck,
  Zap,
  Clock,
  ArrowUpRight,
  Plus,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  ShoppingBag,
} from "lucide-react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Sheet,
  LinearProgress,
  Drawer,
  ModalClose,
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  AspectRatio,
  IconButton,
  Skeleton,
  Chip,
  Textarea,
  Select,
  Option,
} from "@mui/joy";
import StoreOwnerLayout from "./layout";
import { fetchMe } from "../../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../../services/productService";
import { toast } from "react-toastify";
import { useCategoryStore } from "../../../services/categoryService";
import { InventoryCard } from "../../components/inventory";
export default function StoreOwnerTrialDashboard() {
  // Stats reflecting a brand new store
  const [error, setError] = useState("");
  const { user, store } = useAuthStore();
  const navigate = useNavigate();
  const total_orders = 0;
  const [loading, setLoading] = useState(false);
  const { products, fetchMyProducts, createProduct } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState([])
  // Form State
  const isDark = false
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState([]);
      const thStyle = `px-4 py-3 font-semibold border-r ${isDark ? "border-slate-800" : "border-slate-100"}`;
    const tdStyle = `px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-gray-700"}`;
  useEffect(() => {
    getCategories();
  }, []);
  const handleSelect = (id) => {
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

  const toggleAll = () => {
  if (selected.length === orders.length) {
    setSelected([]);
  } else {
    setSelected(orders.map((o) => o._id));
  }
};

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const stats = useMemo(() => {
    const totalProducts = products.length;

    const outOfStock = products.filter((p) => p.inventory === 0).length;

    const inventoryValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.inventory) || 0),
      0,
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
    if (store?.plan === "starter" && store?.trialEndsAt) {
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

    if (store?.plan === "professional" && store?.trialEndsAt) {
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

      const amount = 5000;
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
      console.log(data);
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
      <Skeleton
        variant="rectangular"
        width={40}
        height={40}
        sx={{ borderRadius: "8px", mb: 2 }}
      />
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={32} sx={{ mt: 1 }} />
      <Skeleton width="70%" height={12} sx={{ mt: 1 }} />
    </Sheet>
  );

  return (
    <StoreOwnerLayout>
      <Box sx={{ p: { xs: 2, md: 2 }, minHeight: "100vh" }}>
        {error && (
          <Sheet
            variant="solid"
            color="danger"
            invertedColors
            sx={{
              mb: 4,
              p: 2.5,
              borderRadius: "24px",
              background: "linear-gradient(45deg, #dc2626 0%, #991b1b 100%)",
              boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.1)",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Decoration */}
            <Box
              sx={{
                position: "absolute",
                right: -20,
                top: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                flexShrink: 0,
              }}
            >
              <AlertCircle size={24} />
            </Box>

            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Typography level="title-md" sx={{ fontWeight: 800 }}>
                {/* Determine title by error content */}
                {error.toLowerCase().includes("auth")
                  ? "Authentication Issue"
                  : "Action Failed"}
              </Typography>

              <Typography
                level="body-sm"
                sx={{ opacity: 0.9, lineHeight: 1.4 }}
              >
                {/* THE FIX: This prints the actual error string from your state */}
                {error}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="plain"
                size="sm"
                onClick={() => setError("")}
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  borderRadius: "xl",
                  flex: 1,
                  color: "white",
                }}
              >
                Dismiss
              </Button>

              {/* Show Sign In button ONLY if it's an auth error */}
              {error.toLowerCase().includes("unauthorized") ||
              error.toLowerCase().includes("login") ? (
                <Button
                  variant="solid"
                  color="neutral"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem("layemart-auth");
                    navigate("/auth/sign-in");
                  }}
                  sx={{ borderRadius: "xl", flex: 1, whiteSpace: "nowrap" }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => window.location.reload()}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    borderRadius: "xl",
                    flex: 1,
                    color: "white",
                  }}
                >
                  Retry
                </Button>
              )}
            </Box>
          </Sheet>
        )}

        {/* Trial Countdown Header */}
        {store?.plan === "TRIAL" && (
          <Sheet
            className="bg-slate-900/90! text-white! shadow-lg shadow-slate-200/20! lg:items-center! items-end! flex! justify-between! flex-wrap!"
            variant="solid"
            sx={{
              mb: 4,
              p: 2,
              borderRadius: "20px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div className="bg-amber-400 p-2 rounded-lg">
                <Zap size={20} className="text-slate-900" />
              </div>
              <Box>
                <Typography sx={{ color: "white", fontWeight: 700 }}>
                  You're on the Free Trial
                </Typography>
                <Typography
                  className="text-slate-200!"
                  sx={{ fontSize: "12px" }}
                >
                  Upgrade now to unlock unlimited products and custom domains.
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handlePay}
              className="md:mt-0 mt-4!"
              size="sm"
              sx={{
                bgcolor: "white",
                color: "#0f172a",
                "&:hover": { bgcolor: "#f1f5f9" },
                borderRadius: "lg",
              }}
            >
              Upgrade to Pro
            </Button>
          </Sheet>
        )}

        {/* Header Section */}
        <Box
          className="flex! flex-wrap!"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              className="lg:text-[30px]! md:text-[24px]! text-[22px]!"
              level="h2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome,{" "}
              {user?.fullName ? user.fullName.split(" ")[0] : "Store Owner"}!
            </Typography>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Typography level="body-md" sx={{ color: "neutral.500" }}>
                Your store is currently live at:
              </Typography>
              <Typography
                sx={{
                  color: "blue.600",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <a
                  href={
                    store?.subdomain
                      ? `http://${store.subdomain}.${window.location.hostname.replace("www.", "")}${window.location.port ? ":" + window.location.port : ""}`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 hover:underline transition-colors"
                >
                  {store?.subdomain
                    ? `${store.subdomain}.layemart.com`
                    : "mystore.layemart.com"}
                  <ExternalLink size={14} className="mb-0.5" />
                </a>
              </Typography>
            </div>
          </Box>
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{ p: 1, borderRadius: "lg", bgcolor: "#f1f5f9" }}
                      >
                        {item.icon}
                      </Box>
                    </Box>

                    <Typography
                      level="body-sm"
                      sx={{ fontWeight: 600, color: "neutral.500" }}
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      level="h3"
                      sx={{ fontWeight: 800, color: "#0f172a" }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "12px", color: "neutral.400", mt: 0.5 }}
                    >
                      {item.sub}
                    </Typography>
                  </Sheet>
                </Grid>
              ))}
        </Grid>

        <div className="grid grid-cols-1 justify-items-center lg:my-5 my-3">
          <div>
            <InventoryCard isDark={false} products={products} />
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
          <Box sx={{ mb: 4, overflowX: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Recent Orders
                </Typography>
                <Typography level="body-sm" sx={{ color: "neutral.500" }}>
                  Manage and track your latest customer purchases
                </Typography>
              </Box>
            </Box>

            <table className="w-full text-left border-collapse border-t border-slate-100 min-w-[800px]">
              <thead className="bg-transparent">
                <tr
                  className={`text-[13px] border-b ${isDark ? "border-slate-800 bg-slate-800/50 text-slate-400" : "border-slate-100 text-gray-600"}`}
                >
                  <th
                    className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selected.length > 0 && selected.length === orders.length
                      }
                      onChange={toggleAll}
                      className="rounded-sm accent-blue-600"
                    />
                  </th>

                  <th className={`w-[150px] ${thStyle}`}>Order ID</th>
                  <th className={`w-[200px] ${thStyle}`}>Customer</th>
                  <th className={`w-[120px] ${thStyle}`}>Items</th>
                  <th className={`w-[150px] ${thStyle}`}>Total Amount</th>
                  <th className={`w-[120px] ${thStyle}`}>Status</th>
                  <th className="px-4 py-3 w-[120px] text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody
                className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}
              >
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className={`text-[13px] transition-colors hover:bg-gray-50 ${isDark ? "hover:bg-slate-800/40" : ""}`}
                    >
                      <td
                        className={`px-4 py-3 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(order._id)}
                          onChange={() => handleSelect(order._id)}
                          className="rounded-sm accent-blue-600"
                        />
                      </td>

                      <td className={`${tdStyle} font-medium text-blue-600`}>
                        #{order._id?.slice(-6).toUpperCase()}
                      </td>

                      <td className={tdStyle}>
                        <div className="flex flex-col">
                          <span
                            className={`font-medium ${isDark ? "text-slate-200" : "text-gray-900"}`}
                          >
                            {order.customerName}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {order.customerEmail}
                          </span>
                        </div>
                      </td>

                      <td className={tdStyle}>
                        {order.items?.length || 0} items
                      </td>

                      <td className={`${tdStyle} font-semibold`}>
                        ₦{order.totalAmount?.toLocaleString()}
                      </td>

                      <td className={tdStyle}>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-600"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <IconButton
                            size="sm"
                            variant="plain"
                            onClick={() => handleView(order)}
                          >
                            <Eye size={16} />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => handleDelete(order)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-12 text-center text-gray-500 italic"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Sheet>

        <Grid container spacing={3}>
          {/* Onboarding Checklist */}
          <Grid xs={12} md={7}>
            <Sheet
              sx={{
                p: 3,
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                bgcolor: "white",
              }}
            >
              <Typography level="title-lg" sx={{ fontWeight: 700, mb: 1 }}>
                Setup Checklist
              </Typography>
              <Typography level="body-sm" sx={{ color: "neutral.500", mb: 3 }}>
                Complete these steps to launch your store successfully.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    task: "Add your first product",
                    done: products.length > 0 ? true : false,
                  },
                  {
                    task: "Receive your first order",
                    done: total_orders > 0, // The ultimate "Success" milestone
                    link: "/orders",
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: "xl",
                      border: "1px solid",
                      borderColor: item.done ? "#f1f5f9" : "#e2e8f0",
                      bgcolor: item.done ? "#f8fafc" : "transparent",
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}
                    >
                      {item.done && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: item.done ? "neutral.400" : "neutral.700",
                        textDecoration: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.task}
                    </Typography>
                    {!item.done && (
                      <ChevronRight
                        size={16}
                        className="ml-auto text-slate-400"
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Sheet>
          </Grid>

          {/* Upgrade Card */}
          {store?.plan === "TRIAL" && (
            <Grid xs={12} md={5}>
              <Sheet
                sx={{
                  p: 4,
                  borderRadius: "24px",
                  bgcolor: "#eff6ff",
                  border: "1px solid #dbeafe",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Zap
                  className="absolute -right-4 -top-4 text-blue-100"
                  size={120}
                />

                <Typography
                  sx={{
                    color: "blue.700",
                    fontWeight: 800,
                    fontSize: "20px",
                    mb: 1,
                  }}
                >
                  Ready to grow?
                </Typography>
                <Typography
                  sx={{
                    color: "blue.600",
                    fontSize: "14px",
                    mb: 3,
                    lineHeight: 1.5,
                  }}
                >
                  The Pro plan gives you custom domains, advanced analytics, and
                  0% transaction fees.
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "blue.700",
                      }}
                    >
                      Trial Usage
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "blue.700",
                      }}
                    >
                      60%
                    </Typography>
                  </Box>
                  <LinearProgress
                    determinate
                    value={60}
                    color="primary"
                    sx={{ borderRadius: "sm", height: 8, bgcolor: "#dbeafe" }}
                  />
                </Box>

                <Button
                  fullWidth
                  endDecorator={<ArrowUpRight size={18} />}
                  sx={{
                    bgcolor: "#2563eb",
                    color: "white",
                    py: 1.5,
                    borderRadius: "xl",
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  See All Pro Features
                </Button>
              </Sheet>
            </Grid>
          )}
        </Grid>

        {/* product modal */}
      </Box>
    </StoreOwnerLayout>
  );
}
