import { Box, Typography, IconButton, Badge } from "@mui/joy";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Drawer from "@mui/joy/Drawer";
import Divider from "@mui/joy/Divider";
import { Link, useParams } from "react-router-dom";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";

const MotionBox = motion(Box);

export default function Header() {
    const [open, setOpen] = useState(false);
    // 1. Get store from URL (e.g., /mystore/shop -> store = "mystore")
    const { storeSlug } = useParams();
    
    // 2. Check auth status from your store
    const { isAuthenticated, customer } = useCustomerAuthStore();
  return (
    <Box sx={{ width: "100%", position: "sticky", top: 0, zIndex: 1000 }}>
      
        {/* ================= TOP BAR ================= */}
        <Box
            sx={{
            backgroundColor: "#111",
            color: "#fff",
            fontSize: 12,
            py: 0.8,
            px: 2,
            textAlign: "center",
            }}
        >
            <Typography level="body-xs">
            Free delivery on orders over ₦30
            </Typography>
        </Box>

        {/* ================= MAIN NAV ================= */}
        <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            sx={{
            backgroundColor: "transparent",
            color: "#fff",
            px: { xs: 2, md: 4 },
            py: 2,
            display: "grid",
            gridTemplateColumns: {
                xs: "auto 1fr auto",
                md: "1fr auto 1fr",
            },
            alignItems: "center",
            }}
        >
            {/* ===== Mobile Menu Button ===== */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={() => setOpen(true)}
                    >
                    <MenuIcon />
                </IconButton>

            </Box>

            {/* ===== Left Nav (Desktop only) ===== */}
            <Box
            sx={{
                display: { xs: "none", md: "flex" },
                gap: 3,
            }}
            >
            {["Home", "Shop", "Contact Us"].map((item) => (
                <MotionBox
                key={item}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                >
                <Link
                    href="#"
                    underline="none"
                    sx={{
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: "uppercase",
                    }}
                >
                    {item}
                </Link>
                </MotionBox>
            ))}
            </Box>


            {/* ===== Logo ===== */}
            <Typography className="text lg:text-[16px]! text-[13px]!" sx={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em' }}>
                    LAYE<span className='text text-[#f8fafc]' style={{ color: '#ef4444' }}>MART</span>
                </Typography>

            {/* ===== Right Actions ===== */}
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 },
                justifySelf: "end",
            }}
            >
            {/* Desktop-only login */}
            <Typography level="body-sm" sx={{ display: { xs: "none", md: "block" } }}>
                {/* 1. If it's a Demo, show a placeholder login link */}
                {localStorage.getItem("demo") ? (
                <Link to="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>
                    LOGIN (DEMO)
                </Link>
                ) : 
                /* 2. If Not Demo, check if Customer is Authenticated */
                isAuthenticated ? (
                <Link to={`/account`} style={{ color: 'white', textDecoration: 'none' }}>
                    HI, {customer?.name?.toUpperCase() || 'ACCOUNT'}
                </Link>
                ) : (
                /* 3. Not Demo and Not Authenticated: Show real Login link */
                <Link to={`/login`} style={{ color: 'black', textDecoration: 'none' }}>
                    LOGIN
                </Link>
                )}
            </Typography>
            <IconButton variant="plain" color="neutral">
                <SearchIcon />
            </IconButton>

            <IconButton variant="plain" color="neutral">
                <Badge badgeContent={0} color="danger">
                <ShoppingBagOutlinedIcon />
                </Badge>
            </IconButton>
            </Box>
        </MotionBox>
        <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="left"
        size="sm"
        >
        <Box
            sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            }}
        >
            {/* ===== Header ===== */}
            <Box
            sx={{
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            >
            <Typography level="h4" sx={{ fontWeight: 700 }}>
                LayeMart
            </Typography>

            <IconButton onClick={() => setOpen(false)}>✕</IconButton>
            </Box>

            <Divider />

            {/* ===== Shopping ===== */}
            <Box sx={{ px: 3, py: 2 }}>
            {["Home", "Shop", "Contact Us"].map((item) => (
                <Link
                key={item}
                underline="none"
                onClick={() => setOpen(false)}
                sx={{
                    display: "block",
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: 500,
                    color: "text.primary",
                }}
                >
                {item}
                </Link>
            ))}
            </Box>

            <Divider />

            {/* ===== User Actions ===== */}
            <Box sx={{ px: 3, py: 2 }}>
            {["My Orders", "Wishlist", "Cart"].map((item) => (
                <Link
                key={item}
                underline="none"
                onClick={() => setOpen(false)}
                sx={{
                    display: "block",
                    py: 1.4,
                    fontSize: 15,
                    color: "text.primary",
                }}
                >
                {item}
                </Link>
            ))}
            </Box>

            <Divider />

            {/* ===== Account ===== */}
            <Box sx={{ px: 3, py: 2 }}>
            <Link
                underline="none"
                sx={{
                display: "block",
                py: 1.4,
                fontSize: 15,
                fontWeight: 500,
                }}
            >
                Login / Account
            </Link>

            <Link
                underline="none"
                sx={{
                display: "block",
                py: 1.2,
                fontSize: 14,
                color: "neutral.600",
                }}
            >
                Help & Support
            </Link>
            </Box>
        </Box>
        </Drawer>



    </Box>
  );
}
