import { Box, Typography, IconButton, Badge, Link } from "@mui/joy";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const MotionBox = motion(Box);

export default function Header() {
  return (
    <div className="div">
        <Box sx={{ width: "100%", position: "sticky", top: 0, zIndex: 1000 }}>
        
        {/* ========= ANNOUNCEMENT BAR ========= */}
        <Box
            sx={{
            backgroundColor: "#111",
            color: "#fff",
            textAlign: "center",
            py: 0.7,
            fontSize: 12,
            }}
        >
            <Typography level="body-xs">
            Free delivery on orders over ₦20,000
            </Typography>
        </Box>

        {/* ========= NAVBAR ========= */}
        <MotionBox
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
            backgroundColor: "none", // Shopify-like dark nav
            color: "#fff",
            px: { xs: 2, md: 4 },
            py: 1.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            }}
        >
            {/* Brand */}
            <Typography
            level="h4"
            sx={{
                fontWeight: 700,
                letterSpacing: 1,
                cursor: "pointer",
            }}
            >
            LaiyeMart
            </Typography>

            {/* Nav Links */}
            <Box
            sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
            }}
            >
            {["Home", "Shop", "Pricing", "Contact"].map((item) => (
                <MotionBox
                key={item}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                >
                <Link
                    href="#"
                    underline="none"
                    sx={{
                    color: "#171717",
                    fontSize: 14,
                    fontWeight: 500,
                    "&:hover": { color: "#fff" },
                    }}
                >
                    {item}
                </Link>
                </MotionBox>
            ))}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
            variant="plain"
            color="neutral"
            sx={{
                backgroundColor: 'transparent', // no background by default
                '&:hover': {
                backgroundColor: 'transparent', // no hover effect
                },
            }}
            >  
                <SearchIcon />
            </IconButton>

            <IconButton
            variant="plain"
            color="neutral"
            sx={{
                backgroundColor: 'transparent', // no background by default
                '&:hover': {
                backgroundColor: 'transparent', // no hover effect
                },
            }}
            >  
                <PersonOutlineIcon />
            </IconButton>

            </Box>
        </MotionBox>
        </Box>
    </div>
  );
}
