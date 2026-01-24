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
  BellRing,
  Moon,
  Laptop,
  HelpCircle,
  MenuIcon,
  Zap,
  SunDim,
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
} from "@mui/joy";
import { useLocation, useNavigate, Link, NavLink } from "react-router-dom";
import { fetchMe } from "../../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

export default function StoreOwnerLayout({ isDark, toggleDarkMode, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, store } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [showBankReminder, setShowBankReminder] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    // 1. Clear state and storage
    logout();

    // 2. Trigger a well-designed success toast
    toast.success("Signed out successfully");

    // 3. Redirect to login page
    navigate("/auth/sign-in");
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
      path: "/dashboard/beta",
    },
    {
      id: "pr",
      label: "Products",
      icon: <Package size={20} />,
      path: "/dashboard/products",
    },
    {
      id: "ca",
      label: "Categories",
      icon: <Layers size={20} />,
      path: "/dashboard/categories",
    },
    {
      id: "or",
      label: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/dashboard/orders",
    },
    {
      id: "cu",
      label: "Customers",
      icon: <Users size={20} />,
      path: "/dashboard/customers",
    },
    {
      id: "st",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/dashboard/settings",
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
      className={`${isDark ?"text-slate-200! bg-slate-950!" : ""}`}
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
          <div>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  bgcolor: "#ef4444",
                  flexShrink: 0,
                }}
              />
              {(!isCollapsed || isMobile) && (
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
            {(!isCollapsed || isMobile) && (
              <Box sx={{ py: 1.5, mb: 1 }}>
                <Typography
                  level="body-xs"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "neutral.500",
                    textTransform: "uppercase",
                  }}
                >
                  Current Store
                </Typography>
                <Typography
                  level="title-md"
                  sx={{ color: "#0f172a", fontWeight: 800 }}
                >
                  {store?.name || "Layemart Store"}
                </Typography>
              </Box>
            )}
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
                textDecoration: "none",
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
    <Box className={`${isDark ?"text-slate-200! bg-slate-950!" : ""}`} sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 1. Desktop Sidebar Wrapper */}
      <Box
        className={`${isDark ?"text-slate-200! bg-slate-950!" : ""}`}
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
          borderRight: isDark ? "1px solid #314158": "1px solid #e2e8f0",
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
                  {store?.name.toUpperCase() + " Store" || "Sean"}
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
          <Box className={`${isDark ?"text-slate-200! bg-slate-100/50!" : ""}`} sx={{ mx: 2, height: "1px", bgcolor: "#f1f5f9", mb: 1 }} />
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
        <Box className={`${isDark ?"text-slate-200! border-t! border-slate-100/50! bg-slate-950!" : ""}`} sx={{ p: 2, mt: "auto", borderTop: "1px solid #f1f5f9" }}>
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
            <Badge badgeContent={3} size="sm" color="danger" variant="solid">
              <IconButton className={`${isDark ? "hover:bg-slate-950!" : ""}`} variant="plain" sx={{ borderRadius: "xl" }}>
                <Bell className={`${isDark ? "text-slate-200" : ""}`} size={20} />
              </IconButton>
            </Badge>
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
                    className={`${isDark ? "bg-slate-950!":  "bg-white!"} `}
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
                        <p className={`${isDark ? "text-slate-200!" : "text-slate-900"} text-sm font-semibold `}>
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

                    <Divider className="border-t border-gray-200 dark:border-slate-700" />

                    {/* Menu items */}
                    <div className="flex flex-col">
                      <MenuItem className={`${isDark ? "text-slate-200! hover:text-slate-950!" : ""} px-4 py-3 gap-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-none`}>
                        <Link
                          className="flex items-center w-full gap-3"
                          to={"/dashboard/settings/"}
                        >
                          <Settings size={20} /> Settings
                        </Link>
                      </MenuItem>
                    </div>

                    <Divider className="border-t border-gray-200 dark:border-slate-700" />

                    {/* Dark mode toggle */}
                    <div className={"px-4 py-3 flex items-center justify-between"}>
                      <div className={`${isDark ? "text-slate-200" : "text-slate-900"} flex items-center gap-3 text-sm `}>
                        <div className="flex items-center gap-3 text-sm font-medium">
                          {isDark ? <SunDim size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                          <span>{isDark ? 'Light' : 'Dark'} mode</span>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={isDark}
                        onChange={(event) => toggleDarkMode(event.target.checked)}
                      />
                    </div>

                    <Divider className="border-t border-gray-200 dark:border-slate-700" />

                    {/* Help */}
                    <MenuItem className={`${isDark ? "text-slate-200! hover:text-slate-950!" : ""}  px-4 py-3 gap-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800 rounded-none`}>
                      <HelpCircle size={20} /> Help
                    </MenuItem>

                    <Divider className="border-t border-gray-200 dark:border-slate-700" />

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
            p: { xs: 2, md: 4},
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
          {store?.plan === "starter" && (
            <Sheet
              className={`${isDark ? "bg-white! text-slate-900!" : "bg-slate-900/90! shadow-slate-200/20!  shadow-lg"} lg:items-center! items-end! flex! justify-between! flex-wrap!`}
              variant="solid"
              sx={{
                p: 2,
                borderRadius: "20px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <div className="bg-amber-400 p-2 rounded-lg">
                  <Zap size={20} className="text-slate-900" />
                </div>
                <Box>
                  <Typography
                    className={`${isDark ? "text-slate-900!" : ""} text-[15px]!`}
                    level="body-xs"
                    sx={{ mt: 1, color: "neutral.100" }}
                  >
                    Trial ends on{" "}
                    {new Date(store.trialEndsAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    className={` ${isDark ? "text-slate-950!" : "text-slate-200!"}`}
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
                  bgcolor: isDark ? "black": "white",
                  color: isDark ? "#fff":  "#0f172a",
                  "&:hover": { bgcolor: "#f1f5f9" },
                  borderRadius: "lg",
                }}
              >
                Upgrade to Pro
              </Button>
            </Sheet>
          )}
          {/* Bank Setup Reminder Modal */}
          <Box
            sx={{
              mt:2,
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {/* --- NEW BANK REMINDER BANNER --- */}
            {showBankReminder && (
              <Box
                sx={{
                  mb: 3,
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
                      Finish setting up your store
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{ color: isDark ? "#94a3b8" : "#b45309" }}
                    >
                      Add your bank details to enable order features and receive
                      payments.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() =>
                    navigate("/dashboard/settings?section=bank-details")
                  }
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "#f59e0b",
                    color: "white",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#d97706" },
                  }}
                >
                  Configure Bank Details
                </Button>
              </Box>
            )}
          </Box>
          <Box >{children}</Box>
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
              className={`${isDark ? "text-slate-200!" : ""}`}
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
