import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  X,
  BellOff,
  Settings,
  SunDim,
  Moon,
  LogOut,
} from "lucide-react";
import {
  Box,
  IconButton,
  Sheet,
  Badge,
  GlobalStyles,
  Dropdown,
  Menu,
  MenuButton,
  Avatar,
  Divider,
  List,
} from "@mui/joy"; // Added GlobalStyles
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../../services/adminService";
import { MenuItem, Switch, Typography } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
export default function SuperAdminLayout({ children, isDark }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    handleMarkAdminAllRead,
    fetchAdminNotifications,
    adminNotifications,
    adminUnreadCount,
  } = useAdminStore();
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("layemart-auth")) {
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  const handleNotifToggle = (event) => {
    // If the menu is already open, close it. Otherwise, open it.
    setNotifAnchorEl(notifAnchorEl ? null : event.currentTarget);
  };
  const handleMarkAllRead = async () => {
    try {
      // 1. Call the store function
      await handleMarkAdminAllRead();

      // 2. Optional: Force a refresh to update the UI instantly
      // (though the store usually handles this)
      await fetchAdminNotifications();

      // 3. Optional: Provide feedback or close the menu
      setNotifAnchorEl(null);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  // console.log(adminNotifications)
  useEffect(() => {
    const auth = localStorage.getItem("layemart-auth");
    if (auth) {
      fetchAdminNotifications();
    } else {
      navigate("/auth/sign-in");
    }
  }, [fetchAdminNotifications, navigate]);
  const RenderSidebar = ({ mobile = false }) => (
    <Sidebar
      isCollapsed={mobile ? false : isCollapsed}
      setIsCollapsed={setIsCollapsed}
      isMobileOpen={isMobileOpen} // Added this prop for internal sidebar use
      setIsMobileOpen={setIsMobileOpen} // Ensure sidebar can close itself
    />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* --- GLOBAL CSS TO HIDE SCROLLBARS --- */}
      <GlobalStyles
        styles={{
          ".hide-scrollbar": {
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          },
          ".hide-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
          // Apply to body if needed
          "body::-webkit-scrollbar": {
            display: "none",
          },
        }}
      />

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: isCollapsed ? 100 : 280, // Match your sidebar width
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "fixed",
          height: "100vh",
          zIndex: 100,
        }}
      >
        <RenderSidebar />
      </Box>

      {/* Main Content Area */}
      <Box
        className="hide-scrollbar"
        sx={{
          flex: 1,
          ml: { lg: isCollapsed ? "100px" : "280px" },
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh", // Critical: Fixed height for the container
          overflow: "hidden", // Prevents double scrollbars
        }}
      >
        {/* Top Header Bar */}
        <Sheet
          className="md:justify-end! justify-between!"
          sx={{
            height: 70,
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 4 },
            bgcolor: "white",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0, // Prevents header from squishing
            zIndex: 50,
          }}
        >
          <IconButton
            variant="plain"
            sx={{ display: { lg: "none" } }}
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Notification Bell */}
            <Badge
              // Only render the dot if there are unread notifications
              badgeContent={adminUnreadCount > 0 ? "" : null}
              variant="solid"
              color="danger"
              size="sm"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  width: "10px",
                  height: "10px",
                  minWidth: "unset",
                  padding: 0,
                  top: "6px", // Adjust these to position the dot on the bell
                  right: "6px",
                  borderRadius: "50%",
                  border: `2px solid ${isDark ? "#020618" : "white"}`, // Prevents the red from bleeding into the icon
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                },
              }}
            >
              <IconButton
                onClick={handleNotifToggle}
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
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={() => setNotifAnchorEl(null)}
              placement={window.innerWidth < 600 ? "bottom" : "bottom-end"}
              variant="outlined"
              sx={{
                width: { xs: "95vw", sm: 360 },
                maxHeight: { xs: "60vh", sm: 500 },
                p: 0,
                boxShadow: "xl",
                bgcolor: isDark ? "#020618" : "background.body",
                borderColor: isDark ? "slate.800" : "neutral.outlineBorder",
                mt: 1,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid",
                  borderColor: isDark ? "slate.800" : "neutral.outlineBorder",
                }}
              >
                <Typography
                  level="title-md"
                  fontWeight="bold"
                  sx={{ color: isDark ? "white" : "inherit" }}
                >
                  Platform Alerts
                </Typography>
                {adminUnreadCount > 0 && (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="primary"
                    onClick={handleMarkAllRead}
                    sx={{ fontSize: "12px", fontWeight: "bold" }}
                  >
                    Mark all read
                  </IconButton>
                )}
              </Box>

              {/* Notification List Area */}
              <Box
                className="hide-scrollbar"
                sx={{ overflowY: "auto", maxHeight: "400px" }}
              >
                {adminNotifications.length === 0 ? (
                  <Box sx={{ p: 5, textAlign: "center", color: "neutral.500" }}>
                    <BellOff
                      size={32}
                      style={{
                        opacity: 0.2,
                        marginBottom: 8,
                        margin: "0 auto",
                      }}
                    />
                    <Typography level="body-xs">No platform alerts</Typography>
                  </Box>
                ) : (
                  adminNotifications.map((notif) => (
                    <div
                      key={notif._id}
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        borderBottom: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}`,
                        backgroundColor: !notif.isRead
                          ? isDark
                            ? "rgba(56, 189, 248, 0.08)"
                            : "rgba(59, 130, 246, 0.05)"
                          : "transparent",
                        transition: "all 0.2s",
                      }}
                      
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = isDark
                          ? "#0f172a"
                          : "#f8fafc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = !notif.isRead
                          ? isDark
                            ? "rgba(56, 189, 248, 0.08)"
                            : "rgba(59, 130, 246, 0.05)"
                          : "transparent")
                      }
                    >
                      <Typography
                        level="title-sm"
                        sx={{ mb: 0.5, color: isDark ? "white" : "inherit" }}
                      >
                        {notif.title}
                      </Typography>
                      <Typography
                        level="body-xs"
                        sx={{
                          color: isDark ? "neutral.400" : "neutral.600",
                          lineHeight: 1.4,
                        }}
                      >
                        {notif.message}
                      </Typography>
                      <Typography
                        level="body-xs"
                        sx={{
                          mt: 1,
                          fontSize: "10px",
                          opacity: 0.5,
                          color: isDark ? "neutral.500" : "inherit",
                        }}
                      >
                        {new Date(notif.createdAt).toLocaleString()}
                      </Typography>
                    </div>
                  ))
                )}
              </Box>
            </Menu>

            {/* User Avatar & Profile Dropdown */}
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                ml: 1,
              }}
            >
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  className="w-9 h-9 rounded-full"
                >
                  <Avatar
                    src={user?.profilePicture?.url}
                    sx={{ width: 32, height: 32 }}
                  />
                </MenuButton>
                <Menu
                  placement="bottom-end"
                  sx={{
                    p: 0,
                    minWidth: 200,
                    borderRadius: "xl",
                    bgcolor: isDark ? "#0f172a" : "white",
                    boxShadow: "xl",
                    border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Avatar src={user?.profilePicture?.url} size="sm" />
                    <Box>
                      <Typography
                        level="title-sm"
                        className={isDark ? "text-white!" : ""}
                      >
                        {user?.fullName || "Admin"}
                      </Typography>
                      <Typography level="body-xs">
                        System Administrator
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => navigate("/admin/settings")}>
                    <Settings size={18} /> Settings
                  </MenuItem>
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      {isDark ? (
                        <SunDim size={18} className="text-amber-400" />
                      ) : (
                        <Moon size={18} />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    <Switch
                      size="sm"
                      checked={isDark}
                      onChange={(e) => toggleDarkMode(e.target.checked)}
                    />
                  </div>
                  <Divider />
                  <MenuItem
                    variant="soft"
                    color="danger"
                    onClick={() => setIsLogoutModalOpen(true)}
                  >
                    <LogOut size={18} /> Log out
                  </MenuItem>
                </Menu>
              </Dropdown>
            </Box>
          </Box>
        </Sheet>

        {/* Dynamic Page Content (The actual scrollable area) */}
        <Box
          className="hide-scrollbar"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 0 }, // Let the child pages handle padding for better layout control
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Mobile Sidebar Overlay & Drawer (Same as before but ensures visibility) */}
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
          <RenderSidebar mobile={true} />
        </Box>
      </Box>
    </Box>
  );
}
