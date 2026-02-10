import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  X,
  LayoutGrid,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  UserCircle,
  User2,
  Moon,
  Laptop,
  HelpCircle,
  MenuIcon,
  Zap,
  SunDim,
  BellOff,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import {
  Box,
  IconButton,
  Button,
  Badge,
  Sheet,
  Typography,
  ModalDialog,
  Modal,
  Divider,
  Avatar,
  MenuItem,
  Switch,
  Menu,
  Dropdown,
  MenuButton,
  ModalClose,
} from "@mui/joy";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import { fetchMe } from "../../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import { Input, Stack } from "@mui/material";

export default function StoreOwnerLayout({ isDark, toggleDarkMode, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, store, token, setStoreData } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const hasPaidBefore = !!store?.paystack?.lastReference;
  const isStarter = store?.plan;
  const isExpired =
    store?.trialEndsAt &&
    new Date(store.trialEndsAt).getTime() < new Date().getTime();

  // Determine Banner Configuration
  const config = isExpired
    ? {
        bg: "bg-red-500!",
        color: "text-white!",
        icon: <ShieldAlert size={20} className="text-red-500" />,
        iconBg: "bg-white",
        title: "We're sorry, your plan has expired",
        subtext:
          "Your premium features are locked. Renew to keep your subaccount running.",
        btnText: "Renew Subscription",
        showButton: true,
      }
    : !hasPaidBefore
      ? {
          bg: isDark ? "bg-white!" : "bg-slate-900/90!",
          color: isDark ? "text-slate-900!" : "text-white!",
          icon: <Zap size={20} className="text-slate-900" />,
          iconBg: "bg-amber-400",
          title: `${store?.plan?.toUpperCase()} PLAN`,
          subtext:
            "You are exploring pro features for free. Upgrade to remove limits.",
          btnText: "Upgrade to Pro",
          showButton: true,
        }
      : {
          // Active Paid Plan
          bg: isDark ? "bg-slate-800!" : "bg-emerald-600!",
          color: "text-white!",
          icon: <CheckCircle2 size={20} className="text-emerald-600" />,
          iconBg: "bg-white",
          title: `${store?.plan?.toUpperCase()} PLAN ACTIVE`,
          subtext: "Your premium subscription is verified and active.",
          btnText: "",
          showButton: false,
        };
  const location = useLocation();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [showBankReminder, setShowBankReminder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // console.log(store);
  const handlePay = async (planType) => {
    try {
      const { user, token, store } = useAuthStore.getState();

      // 🔐 Auth check
      if (!token || !user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      // 🏪 Store check
      if (!store?._id) {
        toast.error("No active store selected");
        return;
      }

      // Use a toast or loading state here if you have one
      const res = await fetch(`${BACKEND_URL}/api/paystack/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          plan: planType, // Now dynamic: "PROFESSIONAL" or "ENTERPRISE"
          storeId: store._id,
          billingCycle: store.billingCycle,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Payment failed");

      // 🚀 Redirect to Paystack Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Payment Error:", err.message);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    // If store exists but no subaccount, show the reminder banner
    if (store && !store?.paystack?.subaccountCode) {
      setShowBankReminder(true);
    } else {
      setShowBankReminder(false);
    }
  }, [store]);
  const handleCloseBankModal = () => {
    // Do not allow closing if subaccount is missing
    if (!store?.paystack?.subaccountCode) return;
    setIsBankModalOpen(false);
  };

  const handleToggle = (event) => {
    // If anchorEl has a value, it means the menu is open, so we set it to null to close it.
    // Otherwise, we set it to the current target to open it.
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if you use JWT tokens
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjust based on your auth storage
          },
        },
      );

      if (response.ok) {
        await fetchNotifications(); // Refresh the list and count
      } else {
        console.error("Failed to mark notifications as read");
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // const handleNotificationClick = async (e, notif) => {
  //  e?.preventDefault?.();
  // e?.stopPropagation?.();

  //   setAnchorEl(null);

  //   if (notif.link) {
  //   navigate(notif.link);
  // }
  //   // 1. If unread, hit the API to mark it read
  //   if (!notif.isRead) {
  //     try {

  //       setNotifications(prev =>
  //       prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
  //     );
  //     setUnreadCount(prev => Math.max(0, prev - 1));
  //       await fetch(`${BACKEND_URL}/api/notifications/${notif._id}/read`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //     } catch (err) {
  //       console.error("Error updating notification status:", err);
  //       fetchNotifications(); // Re-sync on error
  //     }
  //   }

  //   // 2. UI Actions
  //   setAnchorEl(null); // Close the dropdown

  // };
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);
  const handleLogout = () => {
    // 1. Clear state and storage
    logout();

    // 2. Trigger a well-designed success toast
    toast.success("Signed out successfully");

    // 3. Redirect to login page
    localStorage.removeItem("layemart-auth");

    // 2. Determine the path to the OTHER domain (e.g., localhost:5173)
    const isLocal = window.location.hostname.includes("localhost");
    const mainBase = isLocal ? "localhost:5173" : "layemart.com";

    // This tells the main site to wipe its localStorage too
    window.location.href = `${window.location.protocol}//${mainBase}/auth-sync?action=logout&redirect=/auth/sign-in`;
  };

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

  const navItems = [
    {
      id: "ov",
      label: "Dashboard",
      icon: <LayoutGrid size={20} />,
      path: "/", // Changed from /dashboard/beta
    },
    {
      id: "pr",
      label: "Products",
      icon: <Package size={20} />,
      path: "/products", // Changed from /dashboard/products
    },
    {
      id: "ca",
      label: "Categories",
      icon: <Layers size={20} />,
      path: "/categories", // Changed from /dashboard/categories
    },
    {
      id: "or",
      label: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/orders", // Changed from /dashboard/orders
    },
    {
      id: "cu",
      label: "Customers",
      icon: <Users size={20} />,
      path: "/customers", // Changed from /dashboard/customers
    },
    {
      id: "st",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings", // Changed from /dashboard/settings
    },
  ];
  useEffect(() => {
    if (!localStorage.getItem("layemart-auth")) {
      navigate("/auth/sign-in");
    }
  }, []);
  // Internal Navigation Component to avoid code duplication
  const NavigationMenu = ({ isMobile = false }) => (
    <Box
      className={`${isDark ? "text-slate-200! bg-slate-950!" : ""}`}
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}
    >
      {/* Brand/Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          py: 2,
          mb: 2,
          justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
        }}
      >
        {/* <div className="w-8 h-8 rounded-lg bg-slate-900 flex-shrink-0" /> */}
        {(!isCollapsed || isMobile) && (
          <div className="flex flex-col min-w-0 py-2">
            {/* Store Logo Section */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
            >
              {store?.logo ? (
                <Box
                  component="img"
                  src={store.logo.url}
                  alt="Store Logo"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                  }}
                />
              ) : (
                /* Fallback: First letter of Store Name */
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                    fontWeight: 800,
                    fontSize: "14px",
                  }}
                >
                  {store?.name?.charAt(0).toUpperCase() || "S"}
                </Box>
              )}

              {/* Store Branding - Replacing Laiye Mart */}
              <Typography
                className={`${isDark ? "text-slate-100!" : ""}`}
                sx={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}
              >
                {store?.name || "STORE PANEL"}
              </Typography>
            </Box>

            {/* Status Indicator (Matching your preferred style) */}
            <div className="flex flex-col pl-0.5">
              <Typography
                className={`${isDark ? "text-emerald-400!" : ""}`}
                level="body-xs"
                sx={{
                  color: user ? "success.600" : "danger.500",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    user
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-red-500"
                  }`}
                />
                {user ? "System Online" : "System Offline"}
              </Typography>
            </div>
          </div>
        )}
      </Box>

      {/* Nav Items */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {navItems.map((item) => (
          <Box
            key={item.id}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            sx={{ position: "relative" }}
          >
            <NavLink
              to={item.path}
              onClick={() => isMobile && setIsMobileOpen(false)}
              style={({ isActive }) => ({
                width: "100%",
                display: "block",
                // We use the isActive boolean provided by NavLink or your item.active prop
                color: isActive || item.active ? "#0f172a" : "#64748b",
              })}
            >
              {({ isActive }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0 16px",
                    minHeight: "48px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    justifyContent:
                      isCollapsed && !isMobile ? "center" : "flex-start",
                    // Visual "Active" Background
                    backgroundColor:
                      isActive || item.active ? "#f1f5f9" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {/* Icon */}
                  <span
                    style={{
                      display: "flex",
                      fontSize: "20px",
                      // Optional: make icon slightly larger or darker when active
                      opacity: isActive || item.active ? 1 : 0.7,
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {(!isCollapsed || isMobile) && (
                    <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  )}
                </div>
              )}
            </NavLink>

            {/* Hover Indicator Pill (Desktop Only) */}
            {!isMobile && !isCollapsed && hoveredItem === item.id && (
              <Box
                sx={{
                  position: "absolute",
                  left: -12,
                  top: "25%",
                  height: "50%",
                  width: 4,
                  bgcolor: "#0f172a",
                  borderRadius: "0 4px 4px 0",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Logout Footer */}
      <Box sx={{ pt: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          onClick={() => setIsLogoutModalOpen(true)}
          variant="plain"
          color="danger"
          startDecorator={<LogOut size={20} />}
          sx={{
            justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
            borderRadius: "xl",
            fontWeight: 600,
            width: "100%",
            "& .MuiButton-startDecorator": {
              margin: isCollapsed && !isMobile ? 0 : "",
            },
          }}
        >
          {(!isCollapsed || isMobile) && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      className={`${isDark ? "text-slate-200! bg-slate-950!" : ""}`}
      sx={{ display: "flex", minHeight: "100vh" }}
    >
      {/* 1. Desktop Sidebar Wrapper */}
      <Box
        className={`${isDark ? "text-slate-200! bg-slate-950!" : ""}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          width: isCollapsed ? 100 : 280,
          transition: "width 0.3s ease",
          position: "fixed",
          height: "100vh",
          bgcolor: "white",
          borderRight: isDark ? "1px solid #314158" : "1px solid #e2e8f0",
          zIndex: 100,
          overflowX: "hidden",
        }}
      >
        {/* 2. Collapse Toggle Button */}
        <IconButton
          onClick={() => setIsCollapsed((p) => !p)}
          className={`${isDark ? "bg-slate-950! text-white!" : ""} hover:bg-transparent!`}
          sx={{
            position: "absolute",
            right: -4,
            top: 20,
            width: 20,
            height: 20,
            bgcolor: "white",
          }}
        >
          <ChevronLeft
            size={16}
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>

        {/* 3. Brand Section */}

        <Box
          sx={{
            p: isCollapsed ? 2 : 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "padding 0.3s ease",
          }}
        >
          {/* TOP: Brand Logo/Text */}
          {user?.role === "SUPER_ADMIN" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  bgcolor: "#ef4444",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                L
              </Box>
              {!isCollapsed && (
                <Typography
                  className="text lg:text-[17px] text-[13px]!"
                  sx={{ color: "#0f172a", whiteSpace: "nowrap" }}
                >
                  LAIYE
                  <span className="text" style={{ color: "#ef4444" }}>
                    MART
                  </span>
                </Typography>
              )}
            </Box>
          )}

          {/* BOTTOM: User Profile Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 1,
              overflow: "hidden",
            }}
          >
            <div className="relative shrink-0">
              <Avatar
                src={store?.logo?.url}
                alt={user?.fullName}
                sx={{
                  width: isCollapsed ? 40 : 48,
                  height: isCollapsed ? 40 : 48,
                  transition: "all 0.3s ease",
                  border: "2px solid #f1f5f9",
                }}
              >
                {/* Fallback Initials if no logo URL */}
                {user?.fullName?.charAt(0) || "S"}
              </Avatar>
              <span
                className={`absolute bottom-0.5 right-0.5 w-3 h-3 border-2 border-white rounded-full ${user ? "bg-green-500" : "bg-red-500"}`}
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <Typography
                  className={`${isDark ? "text-slate-200!" : ""}`}
                  noWrap
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {store?.name
                    ? store?.name.toUpperCase()
                    : user?.fullName || "MY"}{" "}
                  STORE
                </Typography>
                <Typography
                  className={`${isDark ? "text-emerald-400!" : ""}`}
                  level="body-xs"
                  sx={{
                    color: user ? "success.600" : "danger.500",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {user ? "Online" : "Offline"}
                </Typography>
              </div>
            )}
          </Box>
        </Box>

        {/* Optional Divider */}
        {!isCollapsed && (
          <Box
            className={`${isDark ? "text-slate-200! bg-slate-100/50!" : ""}`}
            sx={{ mx: 2, height: "1px", bgcolor: "#f1f5f9", mb: 1 }}
          />
        )}

        {/* navigation menu */}
        <Box sx={{ px: 2, flex: 1, mt: 2 }}>
          {navItems.map((item) => {
            // Check if current path matches the item path
            const isActive = location.pathname === item.path;

            return (
              <Box
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{ position: "relative", mb: 0.5 }}
              >
                <Button
                  variant={isActive ? "soft" : "plain"} // Changes look if active
                  onClick={() => navigate(item.path)}
                  startDecorator={item.icon}
                  sx={{
                    width: "100%",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    borderRadius: "12px",
                    py: 1.5,
                    // Priority color: Active > Hovered > Default
                    color:
                      isActive || hoveredItem === item.id
                        ? "#0f172a"
                        : "#64748b",
                    bgcolor: isActive
                      ? "#f1f5f9"
                      : hoveredItem === item.id
                        ? "#f8fafc"
                        : "transparent",

                    "& .MuiButton-startDecorator": {
                      margin: isCollapsed ? 0 : "",
                      color:
                        isActive || hoveredItem === item.id
                          ? "#3b82f6"
                          : "inherit",
                    },
                    "&:hover": {
                      bgcolor: isActive ? "#f1f5f9" : "#f8fafc",
                    },
                  }}
                >
                  {!isCollapsed && (
                    <Typography
                      sx={{
                        fontWeight: isActive ? 700 : 600, // Thicker font if active
                        fontSize: "14px",
                        ml: 1,
                        color: "inherit",
                      }}
                    >
                      {item.label}
                    </Typography>
                  )}
                </Button>

                {/* Active/Hover Indicator Bar */}
                <Box
                  sx={{
                    position: "absolute",
                    left: -8,
                    top: "20%",
                    height: "60%",
                    width: 4,
                    bgcolor: "#3b82f6",
                    borderRadius: "0 4px 4px 0",
                    // Stay visible if active OR hovered
                    opacity: isActive || hoveredItem === item.id ? 1 : 0,
                    transition: "all 0.2s ease",
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* 5. Bottom Logout Section */}
        <Box
          className={`${isDark ? "text-slate-200! border-t! border-slate-100/50! bg-slate-950!" : ""}`}
          sx={{ p: 2, mt: "auto", borderTop: "1px solid #f1f5f9" }}
        >
          <Button
            variant="plain"
            color="danger"
            onClick={() => setIsLogoutModalOpen(true)}
            startDecorator={<LogOut size={20} />}
            sx={{
              width: "100%",
              justifyContent: isCollapsed ? "center" : "flex-start",
              borderRadius: "12px",
              py: 1.5,
              "&:hover": { bgcolor: "#fff1f2" },
              "& .MuiButton-startDecorator": { margin: isCollapsed ? 0 : "" },
            }}
          >
            {!isCollapsed && (
              <Typography sx={{ fontWeight: 600, fontSize: "14px", ml: 1 }}>
                Log out
              </Typography>
            )}
          </Button>
        </Box>
      </Box>

      {/* 2. Main Content Area */}
      <Box
        className={`hide-scrollbar `}
        sx={{
          flex: 1,
          ml: { lg: isCollapsed ? "80px" : "280px" },
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
        }}
      >
        {/* Top Header */}
        <Sheet
          sx={{
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: 4,
            bgcolor: isDark ? "#020618" : "white",
            borderBottom: isDark ? "1px solid #314158" : "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <IconButton
            className={isDark && "text-[#E5E7EB]!"}
            variant="plain"
            sx={{ display: { lg: "none" } }}
            onClick={() => setIsMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: 2,
              flex: 1,
              maxW: 400,
              ml: { lg: 0, xs: 2 },
            }}
          >
            <div className="relative w-full max-w-sm hidden md:block">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search..."
                className={`${isDark ? "bg-slate-900 placeholder:text-slate-200! focus:ring-slate-700!" : "bg-slate-50 focus:ring-slate-200"} w-full  border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring  outline-none transition-all`}
              />
            </div>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Notification Bell */}
            <Badge
              badgeContent={unreadCount > 0 ? unreadCount : null}
              size="sm"
              color="danger"
              variant="solid"
              // Hide badge if count is 0
              sx={{
                "& .MuiBadge-badge": {
                  display: unreadCount === 0 ? "none" : "flex",
                },
              }}
            >
              <IconButton
                onClick={handleToggle}
                className={`${isDark ? "hover:bg-slate-800!" : "hover:bg-transparent!"}`}
                variant="plain"
                sx={{ borderRadius: "xl" }}
              >
                <Bell
                  className={isDark ? "text-slate-200" : "text-slate-600"}
                  size={20}
                />
              </IconButton>
            </Badge>

            {/* Notification Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              // On mobile, we center it; on desktop, we align to the bell icon
              placement={window.innerWidth < 600 ? "bottom" : "bottom-end"}
              variant="outlined"
              sx={{
                // 📱 Mobile: 95% of screen width | 💻 Desktop: 360px
                width: { xs: "95vw", sm: 360 },
                // Prevent the menu from being off-center on mobile
                marginLeft: { xs: "2.5vw", sm: 0 },
                maxHeight: { xs: "60vh", sm: 500 },
                p: 0,
                boxShadow: "20px 20px 60px rgba(0,0,0,0.2)",
                bgcolor: isDark ? "#020618" : "background.body",
                color: isDark ? "neutral.200" : "text.primary",
                borderColor: isDark ? "slate.800" : "neutral.outlineBorder",
                // Fixes the "Menu" from floating too far from the header on mobile
                mt: 1,
                "& .MuiList-root": {
                  p: 0,
                },
              }}
            >
              {/* Header: Sticky so it stays visible while scrolling notifications */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "sticky",
                  top: 0,
                  bgcolor: "inherit",
                  zIndex: 10,
                  borderBottom: "1px solid",
                  bgColor: isDark ? "#1d293d" : "background.body",
                  color: isDark ? "neutral.100" : "text.primary",
                  borderColor: isDark ? "slate.800" : "neutral.outlineBorder",
                }}
              >
                <div>
                  <Typography
                    className={`${isDark && "text-neutral-100! "}`}
                    level="title-md"
                    fontWeight="bold"
                  >
                    Notifications
                  </Typography>
                </div>
                <div className="flex items-center">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="plain"
                      className={`${isDark && "text-neutral-100!"}`}
                      onClick={handleMarkAllRead}
                      sx={{ fontSize: "10px", minHeight: 0, py: 0.5 }}
                    >
                      Mark all read
                    </Button>
                  )}
                  <IconButton
                    size="sm"
                    variant="plain"
                    onClick={() => setAnchorEl(null)}
                    sx={{ display: { sm: "none" } }} // Show close "X" only on mobile
                  >
                    <X size={18} />
                  </IconButton>
                </div>
              </Box>

              <Box sx={{ overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <Box
                    className="flex! items-center! justify-center! flex-col!"
                    sx={{
                      p: 5,
                      textAlign: "center",
                      color: isDark ? "neutral.400" : "neutral.500",
                    }}
                  >
                    <BellOff
                      size={32}
                      style={{ opacity: 0.2, marginBottom: 8 }}
                    />
                    <Typography level="body-xs">All caught up!</Typography>
                  </Box>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      className={`${isDark && "text-neutral-100!  hover:bg-transparent!"}`}
                      sx={{
                        py: 2, // Larger touch target for mobile fingers
                        px: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        whiteSpace: "normal", // Critical: allow text to wrap on small screens
                        borderBottom: "1px solid",
                        borderColor: isDark ? "slate.900" : "neutral.softBg",
                        color: isDark ? "neutral.200" : "text.primary",
                        bgcolor: !notif.isRead
                          ? isDark
                            ? "#f8fafc"
                            : "rgba(59, 130, 246, 0.05)"
                          : "transparent",
                      }}
                    >
                      <Typography
                        className={`${isDark && "text-neutral-100!"}`}
                        level="title-sm"
                        sx={{ fontSize: "14px", mb: 0.5 }}
                      >
                        {notif.title}
                      </Typography>
                      <Typography
                        className={`${isDark && "text-neutral-400!"}`}
                        level="body-xs"
                        sx={{ fontSize: "12px", lineHeight: 1.5 }}
                      >
                        {notif.message}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </Box>
            </Menu>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%", // Perfect circle
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                color: isDark ? "#38bdf8" : "#0f172a", // Blue text in dark mode for a premium look
                fontWeight: 700,
                fontSize: "14px",
                ml: 1,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Dropdown>
                {/* Trigger */}
                <MenuButton
                  slots={{ root: IconButton }}
                  className={`w-9 h-9 rounded-full ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"
                  }`}
                >
                  <Avatar
                    src={user?.profilePicture?.url}
                    sx={{ width: 32, height: 32 }}
                  />
                </MenuButton>

                {/* Menu provides ListContext + positioning */}
                <Menu
                  className={`border-none! shadow-2xl! bg-transparent!`}
                  placement="bottom-end"
                >
                  {/* Sheet for styling */}
                  <Sheet
                    className={`${isDark ? "bg-slate-950!" : "bg-white!"} `}
                    variant="outlined"
                    sx={{
                      m: 0,
                      width: 200,
                      height: 240,
                      border: "none",
                      bgcolor: isDark ? "neutral.900" : "bg-white",
                      borderRadius: "12px",
                      color: isDark ? "neutral.200" : "text.primary",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div className="px-4 py-4 flex items-center gap-3">
                      <div className="relative">
                        <Avatar
                          src={user?.profilePicture?.url}
                          sx={{ width: 48, height: 48 }}
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex flex-col justify-center">
                        <p
                          className={`${isDark ? "text-slate-200!" : "text-slate-900"} text-sm font-semibold `}
                        >
                          {user?.fullName || "Sean"}
                        </p>
                        <p
                          className={`text-xs ${
                            user
                              ? "text-gray-500 dark:text-slate-400"
                              : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {user ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>

                    <Divider className="border-t border-gray-200 dark:border-[#E5E7EB]" />

                    {/* Menu items */}
                    <div className="flex flex-col">
                      <MenuItem
                        className={`${isDark ? "text-slate-200! hover:text-slate-950!" : ""} px-4 py-3 gap-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-none`}
                      >
                        <Link
                          className="flex items-center w-full gap-3"
                          to={"/settings"}
                        >
                          <Settings size={20} /> Settings
                        </Link>
                      </MenuItem>
                    </div>

                    <Divider className="border-t border-gray-200 dark:border-[#E5E7EB]" />

                    {/* Dark mode toggle */}
                    <div
                      className={"px-4 py-3 flex items-center justify-between"}
                    >
                      <div
                        className={`${isDark ? "text-slate-200" : "text-slate-900"} flex items-center gap-3 text-sm `}
                      >
                        <div className="flex items-center gap-3 text-sm font-medium">
                          {isDark ? (
                            <SunDim size={20} className="text-amber-400" />
                          ) : (
                            <Moon size={20} className="text-slate-600" />
                          )}
                          <span>{isDark ? "Light" : "Dark"} mode</span>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={isDark}
                        onChange={(event) =>
                          toggleDarkMode(event.target.checked)
                        }
                      />
                    </div>

                    <Divider className="border-t border-gray-200 dark:border-[#E5E7EB]" />

                    {/* Help */}
                    <MenuItem
                      className={`${isDark ? "text-slate-200! hover:text-slate-950!" : ""}  px-4 py-3 gap-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-none`}
                    >
                      <HelpCircle size={20} /> Help
                    </MenuItem>

                    <Divider className="border-t border-gray-200 dark:border-[#E5E7EB]" />

                    {/* Logout */}
                    <MenuItem
                      className={`${isDark ? "text-slate-200! hover:text-red-600!" : ""} px-4 py-3 gap-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-none`}
                      onClick={() => setIsLogoutModalOpen(true)}
                    >
                      <LogOut size={20} /> Log out
                    </MenuItem>
                  </Sheet>
                </Menu>
              </Dropdown>
            </Box>
          </Box>
        </Sheet>

        {/* Dynamic Page Content */}
        <Box
          className="hide-scrollbar"
          sx={{
            p: { xs: 2, md: 4 },
            overflowY: "auto", // Ensure it is scrollable
            /* Target the scrollbar specifically */
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none" /* IE and Edge */,
            scrollbarWidth: "none",
          }}
          onClick={() => setProfileAnchor(null)}
        >
          {(isStarter || isExpired || hasPaidBefore) && (
            <Sheet
              className={`${config.bg} ${config.color} lg:items-center! items-end! flex! justify-between! flex-wrap! shadow-lg`}
              variant="solid"
              sx={{ p: 2, borderRadius: "20px", mb: 3 }}
            >
              <Box  sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div
                  className={`${config.iconBg} p-2 rounded-lg flex items-center justify-center`}
                >
                  {config.icon}
                </div>

                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      className={`${config.color} text-[15px]! font-bold!`}
                      level="body-xs"
                    >
                      {config.title}
                    </Typography>
                    {!isExpired && (
                      <span
                        className={`px-2 py-0.5 ${!hasPaidBefore ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"} text-[10px] font-bold rounded-full uppercase tracking-wider`}
                      >
                        {!hasPaidBefore && !store?.plan === "starter" ? "Trial" : "Active"}
                      </span>
                    )}
                  </Box>

                  <Typography
                    className={config.color}
                    sx={{ fontSize: "12px", opacity: 0.9 }}
                  >
                    {config.subtext}
                    <span
                      className={`${isStarter && " hidden"} font-bold ml-1`}
                    >
                      {isExpired && !store.plan === "starter" ? "Expired on: " : "Next date: "}
                      {new Date(store?.trialEndsAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </Typography>
                </Box>
              </Box>

              {config.showButton && (
                <Button
                  loading={isUpdating}
                  onClick={() =>
                    handlePay(isExpired ? store?.plan : "professional")
                  }
                  className="md:mt-0 mt-4!"
                  size="sm"
                  sx={{
                    bgcolor: isExpired ? "white" : isDark ? "black" : "white",
                    color: isExpired ? "#ef4444" : isDark ? "#fff" : "#0f172a",
                    "&:hover": { bgcolor: "#f1f5f9" },
                    borderRadius: "lg",
                  }}
                >
                  {config.btnText}
                </Button>
              )}
            </Sheet>
          )}

          {!isExpired && !store.plan === "starter" && (
            <Sheet
              className={`${!isExpired && "hidden!"} ${
                isExpired
                  ? "bg-red-500! text-white!"
                  : isDark
                    ? "bg-white! text-slate-900!"
                    : "bg-slate-900/90! shadow-lg"
              } lg:items-center! items-end! flex! justify-between! flex-wrap!`}
              variant="solid"
              sx={{ p: 2, borderRadius: "20px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div
                  className={`${isExpired ? "bg-white" : "bg-amber-400"} p-2 rounded-lg`}
                >
                  {isExpired ? (
                    <ShieldAlert size={20} className="text-red-500" />
                  ) : (
                    <Zap size={20} className="text-slate-900" />
                  )}
                </div>
                <Box>
                  <Typography
                    className={`${isDark || isExpired ? "text-slate-900!" : ""} text-[15px]! font-bold!`}
                    level="body-xs"
                  >
                    {isExpired ? "Subscription Expired" : "Starter Plan"}
                  </Typography>
                  <Typography
                    className={`${isDark || isExpired ? "text-slate-800!" : "text-slate-200!"}`}
                    sx={{ fontSize: "12px" }}
                  >
                    {isExpired
                      ? "Your access has ended. Renew now to keep using pro features."
                      : "Upgrade to unlock unlimited products and custom domains."}
                  </Typography>
                </Box>
              </Box>

              {/* 3. CONDITIONAL BUTTON: Only shows if Starter or Expired */}
              {isExpired && (
                <Button
                  loading={isUpdating}
                  onClick={() =>
                    handlePay(isExpired ? store?.plan : "professional")
                  }
                  size="sm"
                  sx={{
                    bgcolor: isExpired ? "white" : isDark ? "black" : "white",
                    color: isExpired ? "#ef4444" : isDark ? "#fff" : "#0f172a",
                    "&:hover": { bgcolor: "#f1f5f9" },
                    borderRadius: "lg",
                  }}
                >
                  {isExpired ? "Renew Subscription" : "Upgrade Now"}
                </Button>
              )}
            </Sheet>
          )}

          {store?.plan === "starter" && (
            <Box
              className={`fixed z-20 w-30 mx-auto bottom-2 end-5 md:start-10 transition-all duration-300`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "12px",
                // Glassmorphism logic based on isDark
                bgcolor: isDark
                  ? "rgba(15, 23, 42, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(51, 65, 85, 0.5)"
                  : "rgba(226, 232, 240, 0.8)",
                boxShadow: isDark
                  ? "0 4px 15px -3px rgba(0, 0, 0, 0.5)"
                  : "0 4px 15px -3px rgba(0, 0, 0, 0.08)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: isDark
                    ? "rgba(59, 130, 246, 0.4)"
                    : "rgba(59, 130, 246, 0.2)",
                  bgcolor: isDark ? "rgba(15, 23, 42, 0.9)" : "#ffffff",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "8px",
                  fontWeight: 800,
                  // Text color shifts for readability
                  color: isDark ? "#94a3b8" : "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  mb: 0.3,
                }}
              >
                Powered by
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                {/* Animated Logo Mark */}
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "4px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(37, 99, 235, 0.4)",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "1px",
                      bgcolor: "white",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 900,
                    // LAYEMART text turns white in dark mode
                    color: isDark ? "#f8fafc" : "#0f172a",
                    letterSpacing: "0.5px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  LAYEMART
                </Typography>
              </Box>
            </Box>
          )}
          {/* --- DYNAMIC VERIFICATION REMINDER BANNER --- */}
          {!store?.isOnboarded && (
            <Box
              sx={{
                mb: 3,
                mt: 2,
                p: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                bgcolor: isDark ? "rgba(245, 158, 11, 0.1)" : "#fffbeb",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "#f59e0b",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <HelpCircle size={24} color="#f59e0b" />
                <Box>
                  <Typography
                    level="title-sm"
                    sx={{ color: isDark ? "#f8fafc" : "#92400e" }}
                  >
                    Final Step: Activate Your Store
                  </Typography>
                  <Typography
                    level="body-xs"
                    sx={{ color: isDark ? "#94a3b8" : "#b45309" }}
                  >
                    Validate your identity and link your bank account to enable
                    product listings and payouts.
                  </Typography>
                </Box>
              </Box>
              <Button
                size="sm"
                variant="solid"
                onClick={() => {
                  // Direct them straight to the Bank Details section where the
                  // new Customer Validation logic lives.
                  navigate("/settings?section=bank-details");
                }}
                sx={{
                  borderRadius: "10px",
                  bgcolor: "#f59e0b",
                  color: "white",
                  minWidth: "140px",
                  "&:hover": { bgcolor: "#d97706" },
                }}
              >
                Complete Verification
              </Button>
            </Box>
          )}
          <Box>{children}</Box>
        </Box>
      </Box>

      {/* 3. Mobile Sidebar Overlay & Drawer */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          visibility: isMobileOpen ? "visible" : "hidden",
          display: { lg: "none" },
          transition: "visibility 0.3s",
        }}
      >
        <Box
          onClick={() => setIsMobileOpen(false)}
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            opacity: isMobileOpen ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 280,
            bgcolor: "white",
            transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              position: "absolute",
              right: 0,
              top: 0,
              zIndex: 10,
            }}
          >
            <IconButton variant="plain" onClick={() => setIsMobileOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>
          <NavigationMenu isMobile={true} />
        </Box>
      </Box>

      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            borderRadius: "24px", // Matching your Auth Card radius
            maxWidth: 400,
            p: 3,
            bgcolor: isDark ? "#0f172a" : "#ffffff", // Slate theme colors
            borderColor: isDark ? "#334155" : "#e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: "12px",
                bgcolor: "danger.softBg", // Subtle red background
                display: "flex",
              }}
            >
              <LogOut size={20} color="#ef4444" />
            </Box>
            <Typography
              level="h4"
              sx={{ fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a" }}
            >
              Log Out
            </Typography>
          </Box>

          <Divider sx={{ my: 2, opacity: 0.5 }} />

          <Typography
            level="body-md"
            sx={{ color: isDark ? "#94a3b8" : "#64748b" }}
          >
            Are you sure you want to log out of your account? You will need to
            sign in again to access your store dashboard.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mt: 4,
              justifyContent: "flex-end",
            }}
          >
            <Button
              className={`${isDark ? "text-slate-200! hover:text-slate-800!" : ""}`}
              variant="plain"
              color="neutral"
              onClick={() => setIsLogoutModalOpen(false)}
              sx={{ borderRadius: "12px", fontWeight: 600 }}
            >
              Stay Logged In
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleLogout} // Your logout function
              sx={{
                borderRadius: "12px",
                fontWeight: 700,
                px: 3,
                bgcolor: "#ef4444",
                "&:hover": { bgcolor: "#dc2626" },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
