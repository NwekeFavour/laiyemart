import { Box, Typography, IconButton, Badge, Stack, Button } from "@mui/joy";
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

export default function Header({storeName}) {
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
            <Typography className="text lg:text-[16px]! text-[13px]! sm:block! hidden!" sx={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em' }}>
                   <span className="text-[12px]! text font-extrabold">{storeName}</span> <span className="">X</span>  LAYE<span className='text text-[#f8fafc]' style={{ color: '#ef4444' }}>MART</span>
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
                <Link to="#" style={{ color: 'black', textDecoration: 'none', opacity: 0.7 }}>
                    LOGIN (DEMO)
                </Link>
                ) : 
                /* 2. If Not Demo, check if Customer is Authenticated */
                isAuthenticated ? (
                <Link to={`/account`} style={{ color: 'black', textDecoration: 'none' }}>
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
  sx={{
    '--Drawer-horizontalSize': '300px', // Standard mobile menu width
  }}
>
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      bgcolor: "background.surface",
    }}
  >
    {/* ===== Header / Branding ===== */}
    <Box
      sx={{
        px: 2.5,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        bgcolor: "#f8fafc", // Very light slate background
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative'
      }}
    >
      <IconButton 
        onClick={() => setOpen(false)}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ position: 'absolute', top: 10, right: 10, borderRadius: '50%' }}
      >
        ✕
      </IconButton>

      <Typography
        level="h4"
        sx={{
          fontWeight: 800,
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {/* Merchant Store Name */}
        <Box className="text" component="span" sx={{ fontSize: '12px', color: '#0f172a', textTransform: 'capitalize' }}>
          {storeName}
        </Box>
        
        {/* Powered By Section */}
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography className="text-[16px]!" level="body-xs" sx={{ fontWeight: 400, color: 'neutral.400' }}>✕</Typography>
          <Typography className="text" sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
            <span className="text" style={{ color: '#64748b' }}>LAYE</span>
            <span className="text" style={{ color: '#ef4444' }}>MART</span>
          </Typography>
        </Box>
      </Typography>
    </Box>

    {/* ===== Navigation Sections ===== */}
    <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
      
      {/* Primary Links */}
      <Stack spacing={0.5} sx={{ px: 2, mb: 3 }}>
        {["Home", "Shop", "Contact Us"].map((item) => (
          <Button
            key={item}
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
            sx={{
              justifyContent: "flex-start",
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: 'lg',
              py: 1.5,
              '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' }
            }}
          >
            {item}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ mx: 2, mb: 3 }} />

      {/* User Actions Section */}
      <Typography level="body-xs" sx={{ px: 3, mb: 1.5, fontWeight: 700, color: 'neutral.400', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Your Account
      </Typography>
      <Stack spacing={0.5} sx={{ px: 2 }}>
        {[
          { label: "My Orders", icon: "📦" },
          { label: "Wishlist", icon: "❤️" },
          { label: "Cart", icon: "🛒" }
        ].map((item) => (
          <Button
            key={item.label}
            variant="plain"
            color="neutral"
            startDecorator={<span style={{ fontSize: '18px' }}>{item.icon}</span>}
            onClick={() => setOpen(false)}
            sx={{
              justifyContent: "flex-start",
              fontSize: '15px',
              fontWeight: 500,
              borderRadius: 'md',
              py: 1.2
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>

    {/* ===== Footer Actions ===== */}
    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fdfdfd' }}>
      <Button 
        fullWidth 
        variant="solid" 
        sx={{ bgcolor: '#0f172a', borderRadius: 'lg', mb: 1, height: 44 }}
      >
        Login / Account
      </Button>
      <Button 
        fullWidth 
        variant="plain" 
        color="neutral"
        sx={{ fontSize: '13px' }}
      >
        Help & Support
      </Button>
    </Box>
  </Box>
</Drawer>



    </Box>
  );
}
