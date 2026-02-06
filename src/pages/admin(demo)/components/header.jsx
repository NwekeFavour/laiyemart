import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  IconButton,
  Typography,
  Button,
  Badge,
  Drawer,
  Divider,
  Avatar,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { Menu, X, ShoppingBag, User, LogOut, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { toast } from "react-toastify";
import { useCartStore } from "../../../../services/cartService";
import { useProductStore } from "../../../../services/productService";

export default function Header({ storeSlug, storeName, storeLogo, isStarter, storeData }) {
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useCustomerAuthStore();
  const { cart } = useCartStore();
  const { products } = useProductStore();

  const uniqueItemCount = cart?.items?.length || 0;

    const getStorePath = (path) => {
    // 1. Clean the path to ensure it starts with / and has no double slashes
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    // 2. Determine if we are ALREADY on a subdomain
    const hostname = window.location.hostname;
    const isCurrentlySubdomain =
      hostname.split(".").length > 2 ||
      (hostname.includes("localhost") &&
        hostname.split(".").length > 1 &&
        !hostname.startsWith("localhost"));

    // 3. If we are on a subdomain (Professional), NEVER use the slug in the path
    if (isCurrentlySubdomain) {
      return cleanPath;
    }

    // 4. If we are on the main domain (Starter), we MUST use the slug
    // Handle the "Home" case where path is just "/"
    if (cleanPath === "/") return `/${storeSlug}`;

    return `/${storeSlug}${cleanPath}`;
  };


  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate(isStarter ? `/${storeData.subdomain}/login}` : `/login`);
  };


  const categories = useMemo(() => {
    const names = products.map((p) => p.category?.name).filter(Boolean);
    return [...new Set(names)];
  }, [products]);

  const navItems = ["Home", "Shop"];

  return (
    <>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          bgcolor: "#fff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            maxWidth: "1280px",
            mx: "auto",
            px: 2,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </IconButton>

            <Link to="/">
              <Avatar
                src={storeLogo}
                sx={{ width: 40, height: 40 }}
                alt={storeName}
              />
            </Link>
          </Stack>

          {/* Center Nav (Desktop) */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => {
              // Convert "Home" to "/", others to "/shop", "/about", etc.
              const rawPath = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const active = pathname === rawPath || pathname === getStorePath(rawPath);

              return (
                <Link
                  key={item}
                  to={rawPath === "/" ? getStorePath("/") : getStorePath(rawPath)}
                  style={{
                    textDecoration: active ? "underline neutral.900" : "none",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {item}
                </Link>
              );
            })}
          </Stack>
          {/* Right */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Link
              to={localStorage.getItem("demo") ? "#" : isStarter ? `/${storeData.subdomain}/cart` : "/cart"}
              style={{  color: "inherit" }}
            >
              <Badge
                // Show the actual count
                badgeContent={uniqueItemCount}
                // Only show the badge if there are items
                invisible={uniqueItemCount === 0}
                color="danger"
                size="sm"
                variant="solid"
                sx={{
                  // Optional: Add a little "pop" animation when count changes
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                <ShoppingBag
                  size={22}
                  strokeWidth={uniqueItemCount > 0 ? 2.5 : 2} // Bold the bag if it's full
                />
              </Badge>
            </Link>

            {localStorage.getItem("demo") ? (
              <Button
                size="sm"
                variant="soft"
                startDecorator={<User size={14} />}
              >
                DEMO
              </Button>
            ) : (
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {isAuthenticated ? (
                  <Link to={getStorePath("/account")}>
                    <Button
                      className="px-5! border-slate-900! text-slate-800/90! hover:bg-slate-300/10!"
                      size="sm"
                      variant="outlined"
                    >
                      My Account
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Login Button - Outlined Slate */}
                    <Link to={isStarter ? `/${storeData.subdomain}/login` : "/login"}>
                      <Button
                        className="px-5! border-slate-900! text-slate-800/90! hover:bg-slate-300/10!"
                        size="sm"
                        variant="outlined"
                      >
                        Login
                      </Button>
                    </Link>

                    {/* Register Button - Solid Slate (Primary Action) */}
                    <Link to={getStorePath(`/register`)}>
                      <Button
                        className="px-5! bg-slate-900! text-white! border-slate-900! hover:bg-slate-800!"
                        size="sm"
                        variant="filled"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Avatar src={storeLogo} sx={{ width: 36, height: 36 }} />
            <IconButton onClick={() => setOpen(false)}>
              <X />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={3}>
            {["home", "shop", "account"]
              .filter((item) => (item === "account" ? isAuthenticated : true))
              .map((item) => {
                // 1. Determine the Base Path 
                // If Starter: /storename
                // If Pro: /
                const base = isStarter ? `/${storeSlug}` : "";

                // 2. Build the specific route
                let path;
                if (item === "home") {
                  path = isStarter ? `${base}` : "/";
                } else {
                  path = `${base}/${item}`;
                }

                // 3. Match active state correctly
                const active = pathname === path;

                return (
                  <Link
                    className="capitalize"
                    key={item}
                    to={path}
                    onClick={() => setOpen(false)}
                    style={{
                      fontSize: 18,
                      fontWeight: active ? 700 : 500,
                      textDecoration: active ? "underline #ef4444" : "none",                      
                      textUnderlineOffset: "6px",
                      color: "#111827",
                    }}
                  >
                    {item}
                  </Link>
                );
              })}
          </Stack>
          {/* CATEGORIES SECTION */}
          <Box sx={{ mt: 3 }}>
            <Typography
              level="body-xs"
              sx={{
                fontSize: 18,
                textTransform: "capitalize",
                fontWeight: 500,
                letterSpacing: "1px",
                color: "#111827",
                mb: 2,
              }}
            >
              Categories
            </Typography>

            <Stack spacing={2}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category} // Use the string as the key
                    to={getStorePath("/shop")}
                    state={{
                      selectedCategory: category, // This must match the string in your Products category list
                    }}
                    onClick={() => setOpen(false)}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#111827",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {category}
                    <ChevronRight size={16} opacity={0.5} />
                  </Link>
                ))
              ) : (
                // Optional: Loading state or fallback
                <Typography
                  level="body-xs"
                  sx={{ fontStyle: "italic", color: "neutral.400" }}
                >
                  No categories found
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {isAuthenticated ? (
            <Button
              fullWidth
              color="danger"
              startDecorator={<LogOut size={18} />}
              onClick={() => setIsLogoutModalOpen(true)}
            >
              Sign Out
            </Button>
          ) : (
            <Link to={isStarter ? `/${storeData.subdomain}/login` : "/login"}>
              <Button
                className="bg-slate-800! hover:bg-slate-800/90! "
                fullWidth
              >
                Login to Account
              </Button>
            </Link>
          )}
        </Box>
      </Drawer>

      {/* ================= LOGOUT MODAL (UNCHANGED) ================= */}
      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            borderRadius: "24px",
            maxWidth: 400,
            p: 3,
            bgcolor: "#ffffff",
            borderColor: "#e2e8f0",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: "12px",
                bgcolor: "danger.softBg",
              }}
            >
              <LogOut size={20} color="#ef4444" />
            </Box>
            <Typography level="h4" fontWeight={700}>
              Log Out
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography level="body-md" sx={{ color: "#64748b" }}>
            Are you sure you want to log out of your account? You will need to
            sign in again to access your store dashboard.
          </Typography>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={4}>
            <Button variant="plain" onClick={() => setIsLogoutModalOpen(false)}>
              Stay Logged In
            </Button>
            <Button color="danger" onClick={handleLogout}>
              Sign Out
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* Spacer */}
      {/* <Box sx={{ height: 64 }} /> */}
    </>
  );
}
