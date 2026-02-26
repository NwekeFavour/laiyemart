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
  PackageOpenIcon,
  Filter,
  Trash2,
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
import { useStoreProfileStore } from "../../store/useStoreProfile";
import BestSellersCard from "../../components/bestSeller";
import useOrderStore from "../../../services/orderService";

export default function StoreOwnerTrialDashboard({ isDark, toggleDarkMode }) {
  // Stats reflecting a brand new store
  const [error, setError] = useState("");
  const { user, store } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { products, fetchMyProducts, createProduct } = useProductStore();
  const { totalCustomers, setTotalCustomers, fetchTotalCustomers } =
    useStoreProfileStore();
  const { categories, getCategories } = useCategoryStore();
  const { fetchVendorOrders, orders } = useOrderStore();
  const total_orders = orders.length;

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState([]);
  const thStyle = `px-4 py-3 font-semibold border-r ${isDark ? "border-[#314158] border-r" : "border-slate-100"}`;
  const tdStyle = `px-4 py-3 border-r ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-gray-700"}`;
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  // console.log(orders)

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (store?._id) {
          const data = await fetchTotalCustomers(store._id);
          setTotalCustomers(data.count); // data.count comes from your controller
        }
      } catch (err) {
        console.error("Customer fetch error:", err);
      }
    };
    loadStats();
  }, [store?._id]);
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o._id));
    }
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalSales = orders
      ?.filter((order) => order.status === "paid") // Only count successful payments
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // 2. Stock Worth (Potential Revenue)
    const stockWorth = products?.reduce((sum, product) => {
      return sum + product.price * (product.inventory || 0);
    }, 0);
    // 1. Core stats that always show
    const baseStats = [
      {
        label: "Total Products",
        value: totalProducts,
        sub: "All products",
        icon: "📦",
      },
      {
        label: "Total Customers",
        value: totalCustomers || 0, // Ensure you have this variable from your state/props
        sub: "Lifetime customers",
        icon: "👥",
      },
      {
        label: "Total Revenue",
        value: `₦${totalSales?.toLocaleString() || 0}`,
        sub: `₦${stockWorth?.toLocaleString()} in inventory`,
        icon: "💰",
      },
      {
        label: "Total Orders",
        value: `${orders?.length || 0}`,
        sub: "Lifetime orders", // or "Completed sales"
        icon: "🛍️", // Shopping bag icon
      },
    ];

    return [...baseStats].filter(Boolean);
  }, [products, store]);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const pendingOrders = orders
    .filter(
      (order) => order.status !== "Delivered" && order.status !== "Cancelled",
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Latest first
    .slice(0, 3); // Show only top 5
  // console.log(products)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Only call fetchMe if a token actually exists to avoid unnecessary "Failed" states
        const token = useAuthStore.getState().token;
        if (token) {
          await fetchMe();
        }
      } catch (err) {
        // Only show error if it's a real server error, not just "no token"
        console.error("Silent fetchMe error:", err);
        // setError("Failed to fetch user"); // Only uncomment if you want the red bar
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const StatSkeleton = ({ isDark }) => (
    <Sheet
      className="shadow-md!"
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: "20px",
        // ✅ Match the border and background logic from your actual cards
        borderColor: isDark ? "#314158" : "#e2e8f0",
        bgcolor: isDark ? "#0f172a" : "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Icon Box Skeleton */}
      <Skeleton
        variant="rectangular"
        width={40}
        height={40}
        sx={{
          borderRadius: "lg",
          mb: 0.5,
          // ✅ Adjust skeleton colors for dark mode visibility
          bgcolor: isDark ? "bg-slate-950!" : undefined,
        }}
      />

      {/* Label Skeleton */}
      <Skeleton
        variant="text"
        width="60%"
        height={20}
        sx={{ bgcolor: isDark ? "bg-slate-950!" : undefined }}
      />

      {/* Value Skeleton */}
      <Skeleton
        variant="text"
        width="45%"
        height={40}
        sx={{ bgcolor: isDark ? "bg-slate-950!" : undefined }}
      />

      {/* Subtext Skeleton */}
      <Skeleton
        variant="text"
        width="75%"
        height={15}
        sx={{ bgcolor: isDark ? "bg-slate-950!" : undefined }}
      />
    </Sheet>
  );
  return (
    <StoreOwnerLayout isDark={isDark} toggleDarkMode={toggleDarkMode}>
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
              className={`lg:text-[30px]! md:text-[24px]! text-[22px]! ${isDark ? "text-slate-200!" : ""}`}
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
            <div
              className={`${isDark ? "text-slate-200" : ""} flex items-center gap-2 mt-1 flex-wrap`}
            >
              <Typography
                className="lg:text-[15px]! text-[14.5px]!"
                level="div"
                sx={{
                  color: isDark ? "neutral.400" : "neutral.500",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: store?.isOnboarded ? "success.500" : "warning.500",
                    boxShadow: store?.isOnboarded
                      ? "0 0 8px #10b981"
                      : "0 0 8px #f59e0b",
                  }}
                />
                {store?.isOnboarded
                  ? "Your store is live at:"
                  : "Store Status:"}
              </Typography>

              {store?.isOnboarded ? (
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <a
                    href={(() => {
                      // 1. Check for slug (since your DB uses 'slug')
                      const storeIdentifier = store?.subdomain;
                      if (!storeIdentifier) return "#";

                      // Base domain cleanup (removes dashboard. and www.)
                      const baseDomain = window.location.hostname
                        .replace("dashboard.", "")
                        .replace("www.", "");
                      const port = window.location.port
                        ? ":" + window.location.port
                        : "";

                      // If Starter plan: layemart.com/slug
                      if (store.plan === "starter") {
                        return `${window.location.protocol}//${baseDomain}${port}/${storeIdentifier}`;
                      }

                      // If Professional plan: slug.layemart.com
                      return `${window.location.protocol}//${storeIdentifier}.${baseDomain}${port}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 transition-colors ${
                      isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-700"
                    } hover:underline`}
                  >
                    {/* Dynamic Text Display */}
                    {store.plan === "starter"
                      ? `layemart.com/${store?.subdomain ? store?.subdomain : store?.slug}`
                      : `${store?.slug || store?.subdomain || "shop"}.layemart.com`}
                    <ExternalLink size={14} className="mb-0.5" />
                  </a>
                </Typography>
              ) : (
                <Typography
                 className={`${isDark ? "text-[#df9541]!" : ""}`}
                  level="body-sm"
                  sx={{
                    fontWeight: 500,
                    color: "warning.700",
                    bgcolor: isDark
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(245, 158, 11, 0.05)",
                    px: 1,
                    borderRadius: "4px",
                  }}
                >
                  Verification Required to Generate Link
                </Typography>
              )}

              {/* Conditional Helper Text */}
              {!store?.isOnboarded && (
                <Typography
                 className={`${isDark ? "text-[#df9541]!" : ""}`}
                  level="body-xs"
                  sx={{
                    width: "100%",
                    color: "warning.600",
                    fontStyle: "italic",
                    mt: 0.5,
                  }}
                >
                  Note: Complete your bank details verification to launch your
                  store domain.
                </Typography>
              )}
            </div>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                  <StatSkeleton isDark={isDark} />
                </Grid>
              ))
            : stats.map((item, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                  <Sheet
                    className="shadow-md!"
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: "20px",
                      // ✅ Dynamic border color
                      borderColor: isDark ? "#314158" : "#e2e8f0",
                      // ✅ Dynamic background (Matches your slate-900/950 theme)
                      bgcolor: isDark ? "#0f172a" : "white",
                      transition: "all 0.2s ease",
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
                        sx={{
                          p: 1,
                          borderRadius: "lg",
                          // ✅ Dynamic icon background
                          bgcolor: isDark ? "bg-slate-950!" : "#f1f5f9",
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Box>

                    <Typography
                      level="body-sm"
                      sx={{
                        fontWeight: 600,
                        // ✅ Dynamic label color
                        color: isDark ? "neutral.400" : "neutral.500",
                      }}
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      level="h3"
                      sx={{
                        fontWeight: 800,
                        // ✅ Dynamic value color (White in dark mode)
                        color: isDark ? "#f8fafc" : "#0f172a",
                      }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "12px",
                        // ✅ Dynamic subtext color
                        color: isDark ? "neutral.500" : "neutral.400",
                        mt: 0.5,
                      }}
                    >
                      {item.sub}
                    </Typography>
                  </Sheet>
                </Grid>
              ))}
        </Grid>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full lg:my-5 my-4">
          <div
            className={`rounded-xl min-h-80 border flex flex-col
      ${isDark ? "bg-slate-950 border-[#E5E7EB] text-slate-200" : "bg-white border-slate-100 text-gray-900"}`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between mb-4 border-b px-3 py-4
        ${isDark ? "border-[#E5E7EB]" : "border-slate-100"}`}
            >
              <h3 className="font-semibold">Pending Orders</h3>
              <button
                className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}
                onClick={() => navigate("/orders")}
              >
                See All
              </button>
            </div>

            <div className="flex flex-col flex-1 p-3">
              {pendingOrders.length > 0 ? (
                <ul className="space-y-3">
                  {pendingOrders.map((order) => (
                    <li
                      key={order._id}
                      className={`flex items-start justify-between rounded-xl px-4 py-3 border transition-all
            ${
              isDark
                ? "bg-slate-900/50 border-slate-800 hover:bg-slate-800/80"
                : "bg-slate-50 border-slate-100 hover:bg-gray-100"
            }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-900"}`}
                        >
                          {order.customerName}
                        </span>
                        <span
                          className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        >
                          ORD-{order._id.slice(-6).toUpperCase()} •{" "}
                          {order.items.length}{" "}
                          {order.items.length > 1 ? "items" : "item"}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-sm font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
                        >
                          ₦{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                /* EMPTY STATE - Shows if no pending orders exist */
                <div className="flex flex-col items-center justify-center flex-1 py-10 px-6 text-center">
                  <div
                    className={`p-4 rounded-full mb-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
                  >
                    <PackageOpenIcon
                      size={32}
                      className={isDark ? "text-slate-500" : "text-slate-300"}
                    />
                  </div>
                  <p
                    className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    All caught up!
                  </p>
                  <p
                    className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    No pending orders to process right now.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <InventoryCard isDark={isDark} products={products} />
          </div>
          <div>
            <BestSellersCard isDark={isDark} />
          </div>
        </div>

        <Sheet
          className={`${isDark ? "bg-slate-950! border-[#314158]! rounded-t-3xl! text-slate-200!" : " border-slate-100! text-gray-900!"}`}
          sx={{
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
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  className={`${isDark ? "text-slate-200!" : ""}`}
                  level="title-lg"
                  sx={{ fontWeight: 700 }}
                >
                  Recent Orders
                </Typography>
              </Box>
            </Box>

            <table
              className={`${isDark ? "border-[#314158]!" : "border-slate-100"} w-full text-left border-collapse border-t  min-w-200`}
            >
              <thead className="bg-transparent">
                <tr
                  className={`text-[13px] border-b ${isDark ? "bg-slate-950 border-b border-[#314158] text-slate-200" : "bg-white border-slate-100 text-gray-900"}`}
                >
                  <th
                    className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-[#314158] border-r" : "border-slate-100"}`}
                  >
                    S/N
                  </th>

                  <th className={`w-37.5 ${thStyle} `}>Order ID</th>
                  <th className={`w-[200px] ${thStyle}`}>Customer</th>
                  <th className={`w-[120px] ${thStyle}`}>Items</th>
                  <th className={`w-[150px] ${thStyle}`}>Total Amount</th>
                  <th className={`w-[120px] ${thStyle}`}>Order Status</th>
                  <th className="px-4 py-3 w-[120px] text-center font-semibold"></th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}
              >
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order, i) => (
                    <tr
                      key={i}
                      className={`text-[13px] transition-colors hover:bg-gray-50 ${
                        isDark ? "hover:bg-slate-800/40" : ""
                      }`}
                    >
                      <td
                        className={`px-4 py-3 text-center border-r ${
                          isDark ? "border-slate-800" : "border-slate-100"
                        }`}
                      >
                        {i + 1}
                      </td>

                      <td className={`${tdStyle} font-medium text-blue-600`}>
                        ORD - {order._id?.slice(-6).toUpperCase()}
                      </td>

                      <td className={tdStyle}>
                        <div className="flex flex-col">
                          <span
                            className={`font-medium ${
                              isDark ? "text-slate-200" : "text-gray-900"
                            }`}
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
                      <td>
                        <Link className="text-blue-400 flex flex-col justify-center text-center">
                          details
                          <div className=" w-10 border-t mx-auto border-dashed border-blue-400" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* ✅ MUST wrap content in td + colSpan */}
                    <td colSpan={7} className="border-none">
                      <Box
                        sx={{
                          py: 10,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#f1f5f9",
                          }}
                        >
                          <Filter
                            size={22}
                            className={
                              isDark ? "text-slate-400" : "text-slate-500"
                            }
                          />
                        </Box>

                        <Typography
                          level="title-md"
                          className={isDark ? "text-slate-200!" : ""}
                        >
                          No orders yet
                        </Typography>

                        <Typography
                          level="body-sm"
                          sx={{ maxWidth: 360 }}
                          className={
                            isDark ? "text-slate-400!" : "text-slate-500"
                          }
                        >
                          Orders will appear here once customers start
                          purchasing from your store.
                        </Typography>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Sheet>

        <Grid container spacing={3}>
          {/* Onboarding Checklist */}
          <Grid xs={12} md={12}>
            <Sheet
              sx={{
                p: 3,
                borderRadius: "24px",
                border: isDark ? "1px solid #314158" : "1px solid #e2e8f0",
                bgcolor: isDark ? "#020618" : "white",
              }}
            >
              <Typography
                className={`${isDark ? "text-slate-200!" : ""}`}
                level="title-lg"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Setup Checklist
              </Typography>
              <Typography
                className={`${isDark ? "text-slate-400!" : ""}`}
                level="body-sm"
                sx={{ color: "neutral.500", mb: 3 }}
              >
                Complete these steps to launch your store successfully.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    task: "Add your first product",
                    done: products.length > 0,
                  },
                  {
                    task: "Receive your first order",
                    done: total_orders > 0,
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
                      // ✅ Dynamic Border: Subtler in dark mode
                      borderColor: item.done
                        ? isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "#f1f5f9"
                        : isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "#e2e8f0",
                      // ✅ Dynamic Background: Slate 900 for dark mode cards
                      bgcolor: item.done
                        ? isDark
                          ? "rgba(255, 255, 255, 0.02)"
                          : "#f8fafc"
                        : "transparent",
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.done
                          ? "bg-emerald-500 border-emerald-500"
                          : isDark
                            ? "border-[#E5E7EB]"
                            : "border-slate-300"
                      }`}
                    >
                      {item.done && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        // ✅ Dynamic Text Color
                        color: item.done
                          ? isDark
                            ? "neutral.600"
                            : "neutral.400"
                          : isDark
                            ? "neutral.200"
                            : "neutral.700",
                        textDecoration: item.done
                          ? "line-through neutral.900"
                          : "none",
                      }}
                    >
                      {item.task}
                    </Typography>

                    {!item.done && (
                      <ChevronRight
                        size={16}
                        className={`ml-auto ${isDark ? "text-slate-600" : "text-slate-400"}`}
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
