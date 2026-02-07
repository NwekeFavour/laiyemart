import React, { useState } from "react";
import {
  ChevronLeft,
  LayoutGrid,
  Store,
  Users,
  CreditCard,
  Activity,
  LogOut,
  X,
  ArrowLeftRight,
  MonitorPlay,
  TicketPercent,
} from "lucide-react";
import { Box, Typography, Button, IconButton } from "@mui/joy";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "ov",
      label: "Overview",
      path: "/admin/dashboard",
      icon: <LayoutGrid size={20} />,
    },
    {
      id: "st",
      label: "Store Management",
      path: "/admin/stores",
      icon: <Store size={20} />,
    },
    {
      id: "tr",
      label: "Transactions",
      path: "",
      icon: <ArrowLeftRight size={20} />,
    },
    // REPLACED: Simple list of all registered customers (the buyers)
    {
      id: "us",
      label: "Customers",
      path: "/admin/customers",
      icon: <Users size={20} />,
    },
    // REPLACED: Control banners, categories, and featured sections on the main site
    {
      id: "coupons",
      label: "Manage Coupons",
      path: "/admin/coupons",
      icon: <TicketPercent size={20} />, // Using TicketPercent for clarity
    },
  ];

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
  /**
   * Internal Menu Component to reuse logic between Desktop and Mobile
   */
  const NavigationMenu = ({ isMobile = false }) => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand Section */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
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

      {/* Nav Items */}
      {/* Nav Items */}
      <Box sx={{ px: 2, flex: 1, mt: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredItem === item.id;

          return (
            <Box
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              sx={{ position: "relative", mb: 0.5 }}
            >
              <Button
                variant={isActive ? "soft" : "plain"}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsMobileOpen(false);
                }}
                // Decorator color logic
                startDecorator={React.cloneElement(item.icon, {
                  color: isActive
                    ? "#3b82f6"
                    : isHovered
                      ? "#0f172a"
                      : "#64748b",
                  strokeWidth: isActive ? 2.5 : 2,
                })}
                sx={{
                  width: "100%",
                  justifyContent:
                    isCollapsed && !isMobile ? "center" : "flex-start",
                  borderRadius: "12px",
                  py: 1.5,
                  // Active Text Styling
                  color: isActive
                    ? "#ef4444"
                    : isHovered
                      ? "#0f172a"
                      : "#64748b",
                  bgcolor: isActive
                    ? "#f1f5f9"
                    : isHovered
                      ? "#f1f5f9"
                      : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive ? "#f1f5f9" : "#f8fafc",
                  },
                  "& .MuiButton-startDecorator": {
                    margin: isCollapsed && !isMobile ? 0 : "",
                  },
                }}
              >
                {(!isCollapsed || isMobile) && (
                  <Typography
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "14px",
                      ml: 1,
                      color: "neutral.900",
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Button>

              {/* The Active Indicator (Vertical Bar) */}
              <Box
                sx={{
                  position: "absolute",
                  left: -12, // Move slightly outside padding
                  top: "25%",
                  height: "50%",
                  width: 4,
                  bgcolor: "#3b82f6", // Matching your brand red
                  borderRadius: "0 4px 4px 0",
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scaleY(1)" : "scaleY(0)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          variant="plain"
          color="danger"
          onClick={handleLogout}
          startDecorator={<LogOut size={20} />}
          sx={{
            width: "100%",
            justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
            borderRadius: "12px",
            py: 1.5,
            "&:hover": { bgcolor: "#fff1f2" },
            "& .MuiButton-startDecorator": {
              margin: isCollapsed && !isMobile ? 0 : "",
            },
          }}
        >
          {(!isCollapsed || isMobile) && (
            <Typography sx={{ fontWeight: 600, fontSize: "14px", ml: 1 }}>
              Log out
            </Typography>
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 1. Desktop Sidebar Wrapper */}
      <Box
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        sx={{
          display: { xs: "flex" },
          flexDirection: "column",
          width: isCollapsed ? 100 : 280,
          transition: "width 0.3s ease",
          position: "fixed",
          height: "100vh",
          bgcolor: "white",
          borderRight: "1px solid #e2e8f0",
          zIndex: 100,
          overflowX: "hidden",
        }}
      >
        <IconButton
          className="hover:bg-transparent!"
          onClick={() => setIsCollapsed((p) => !p)}
          sx={{
            position: "absolute",
            right: -2,
            top: 20,
            width: 24,
            height: 24,
            bgcolor: "white",
            zIndex: 10,
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

        <NavigationMenu isMobile={false} />
      </Box>

      {/* 2. Mobile Sidebar Overlay & Drawer */}
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
        {/* Backdrop overlay */}
        <Box
          onClick={() => setIsMobileOpen(false)}
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            opacity: isMobileOpen ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />

        {/* Drawer content */}
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
    </>
  );
}
