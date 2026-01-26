import React, { useState } from "react";
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
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { toast } from "react-toastify";

export default function Header({ storeName, storeLogo }) {
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useCustomerAuthStore();

  const isDemo = localStorage.getItem("demo") === "true";

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

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
              const path = item === "Home" ? "/" : "/shop";
              const active = pathname === path;

              return (
                <Link
                  key={item}
                  to={`${isDemo ? "#" : path}`}
                  style={{
                    textDecoration: active ? "underline" : "none",
                    textUnderlineOffset: "6px",
                    textDecorationColor: "#ef4444",
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
            <Link to={`${isDemo ? "#" : "/cart"} `}>
              <Badge badgeContent={0} color="danger">
                <ShoppingBag size={20} />
              </Badge>
            </Link>

            {isDemo ? (
              <Button size="sm" variant="soft" startDecorator={<User size={14} />}>
                DEMO
              </Button>
            ) : (
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Link to={isAuthenticated ? "/account" : "/login"}>
                  <Button size="sm" variant="outlined">
                    {isAuthenticated ? "My Account" : "Login"}
                  </Button>
                </Link>
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
                const path = item === "home" ? "/" : `/${item}`;
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
                      textDecoration: active ? "underline" : "none",
                      textUnderlineOffset: "6px",
                      textDecorationColor: "#ef4444",
                      color: "#111827",
                    }}
                  >
                    {item}
                  </Link>
                );
              })}
          </Stack>

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
            <Link to="/login">
              <Button fullWidth>Login to Account</Button>
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
            <Button
              variant="plain"
              onClick={() => setIsLogoutModalOpen(false)}
            >
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
