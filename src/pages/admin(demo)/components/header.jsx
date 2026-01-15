import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Stack,
  Button,
  Avatar,
  Drawer,
  Divider,
} from "@mui/joy";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  HelpCircle,
  Heart,
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";

const MotionBox = motion(Box);

export default function Header({ storeName, storeLogo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, customer, logout } = useCustomerAuthStore();

  const isDemo = localStorage.getItem("demo") === "true";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Constants
  const glassBg = scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent";
  const textColor = scrolled || pathname !== "/" ? "#0f172a" : "#fff";

  return (
    <Box sx={{ width: "100%", position: "sticky", top: 0, zIndex: 1000 }}>
      {/* ================= ANNOUNCEMENT BAR ================= */}
      <AnimatePresence>
        {!scrolled && (
          <MotionBox
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "11px",
              py: 0.8,
              textAlign: "center",
              letterSpacing: "0.05em",
              fontWeight: 600,
              overflow: "hidden",
            }}
          >
            {isDemo
              ? "PREVIEW MODE: CUSTOMER EXPERIENCE"
              : "FREE DELIVERY ON ORDERS OVER ₦30,000"}
          </MotionBox>
        )}
      </AnimatePresence>

      {/* ================= MAIN NAVIGATION ================= */}
      <MotionBox
        animate={{
          backgroundColor: glassBg,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}
        sx={{
          px: { xs: 2, md: 6 },
          py: scrolled ? 1.5 : 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
        }}
      >
        {/* Left: Desktop Nav / Mobile Menu Toggle */}
        <Stack direction="row" alignItems="center" spacing={3} sx={{ flex: 1 }}>
          <IconButton
            variant="plain"
            sx={{ display: { md: "none" }, color: textColor }}
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </IconButton>

          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {["Home", "Shop", "Categories"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                style={{
                  textDecoration: "none",
                  color: textColor,
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>

        {/* Center: Branding */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={storeLogo}
            alt={storeName}
            sx={{
              width: scrolled ? 35 : 45,
              height: scrolled ? 35 : 45,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          {!scrolled && (
            <Typography
              level="body-xs"
              sx={{
                mt: 0.5,
                color: textColor,
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              {storeName?.toUpperCase()}
            </Typography>
          )}
        </Box>

        {/* Right: Actions */}
        <Stack
          direction="row"
          spacing={{ xs: 1, md: 2.5 }}
          alignItems="center"
          sx={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {isDemo ? (
              <Button
                size="sm"
                variant="soft"
                color="neutral"
                startDecorator={<User size={14} />}
              >
                DEMO USER
              </Button>
            ) : isAuthenticated ? (
              <Link
                to={`/account`}
                style={{ textDecoration: "none", color: textColor }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography level="title-sm" sx={{ color: textColor }}>
                    {customer?.name?.split(" ")[0]}
                  </Typography>
                </Stack>
              </Link>
            ) : (
              <Link
                to={`/login`}
                style={{
                  textDecoration: "none",
                  color: textColor,
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                LOGIN
              </Link>
            )}
          </Box>

          <IconButton variant="plain" sx={{ color: textColor }}>
            <Badge badgeContent={0} color="danger" size="sm">
              <ShoppingBag size={20} />
            </Badge>
          </IconButton>
        </Stack>
      </MotionBox>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer open={open} onClose={() => setOpen(false)} size="md">
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Avatar
              src={storeLogo}
              sx={{
                width: scrolled ? 35 : 45,
                height: scrolled ? 35 : 45,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <IconButton onClick={() => setOpen(false)}>
              <X />
            </IconButton>
          </Stack>

          <Stack spacing={3} sx={{ flex: 1 }}>
            {["Home", "Shop", "New Arrivals", "Wishlist"].map((item) => (
              <Typography
                key={item}
                level="h2"
                sx={{ fontSize: "20px", fontWeight: 800 }}
              >
                {item}
              </Typography>
            ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ pb: 4 }}>
            {isAuthenticated ? (
              <Button
                fullWidth
                variant="solid"
                color="danger"
                startDecorator={<LogOut size={18} />}
                onClick={logout}
              >
                Sign Out
              </Button>
            ) : (
              <Link className="w-full px-4 py-2 bg-slate-900 text-slate-100">
                Login to Account
              </Link>
            )}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 4, justifyContent: "center", opacity: 0.6 }}
            >
              <Typography level="body-xs">Powered by Layemart</Typography>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
