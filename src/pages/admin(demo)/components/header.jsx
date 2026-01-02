import { Box, Typography, IconButton, Badge, Link } from "@mui/joy";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Drawer from "@mui/joy/Drawer";
import Divider from "@mui/joy/Divider";

const MotionBox = motion(Box);

export default function Header() {
    const [open, setOpen] = useState(false);
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
            <Typography
            level="h4"
            sx={{
                justifySelf: "center",
                fontFamily: "serif",
                letterSpacing: 2,
                fontWeight: 700,
            }}
            className="text md:text-[20px]! sm:text-[16px]! text-[13px]!"
            >
            LAIYEMART
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
            <Typography
                level="body-sm"
                sx={{ display: { xs: "none", md: "block" } }}
            >
                LOGIN
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
                LaiyeMart
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
