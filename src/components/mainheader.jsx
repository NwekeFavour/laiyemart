import { Box, Typography, IconButton, Button, Drawer, Sheet } from "@mui/joy";
import { Menu, X, Moon, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Layemart from '../assets/img/layemart-icon.jpg'

const navItems = [
  { label: "About", href: "about-us" },
  { label: "Products", href: "product" },
  { label: "Pricing", href: "pricing" },
];

const handleScroll = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
};

export default function SaaSHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-200 blur-[120px] opacity-60" />
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[45%] rounded-full bg-indigo-200 blur-[130px] opacity-70" />

      {/* Header */}
<Sheet
  variant="plain"
  sx={{
    position: "fixed",
    top: 12,
    left: 0,
    right: 0,
    zIndex: 100, // Higher z-index to stay above page content
    mx: "auto",
    maxWidth: 1240,
    width: "95%", // Ensures it doesn't touch screen edges on smaller monitors
    borderRadius: "999px",
    backdropFilter: "blur(20px)",
    bgcolor: "rgba(255,255,255,0.85)", // Increased opacity for Indigo contrast
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow: "0 10px 40px rgba(15,23,42,0.1)",
  }}
>
  <Box
    sx={{
      px: { xs: 2, md: 4 },
      py: 1, 
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Keeps left, center, and right sections separate
    }}
  >
    {/* 1. Brand Section - Relative positioning instead of absolute */}
    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
      <img 
        src={Layemart} 
        alt="Layemart Logo" 
        className="h-15 w-auto object-contain" // Height adjusted for the pill shape
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
      />
    </Box>

    {/* 2. Desktop Nav - Centered perfectly */}
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        flex: 2, // Takes more space to stay centered
      }}
    >
      {navItems.map((item) => (
        <Typography
          key={item.label}
          onClick={() => handleScroll(item.href)}
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#2D2A70", // Your Royal Indigo
            cursor: "pointer",
            position: "relative",
            "&:hover": { color: "#4F46E5" },
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: -4,
              width: 0,
              height: 2,
              bgcolor: "#2D2A70",
              transition: "width .25s ease",
            },
            "&:hover::after": { width: "100%" },
          }}
        >
          {item.label}
        </Typography>
      ))}
    </Box>

    {/* 3. Actions Section */}
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1.5,
        flex: 1, 
        justifyContent: "flex-end" 
      }}
    >
      {isAuthenticated ? (
        <a
          href={"/auth-sync"}
          className="hidden md:flex items-center px-5 py-2.5 rounded-full bg-[#2D2A70] text-white font-semibold shadow-lg hover:bg-[#1a184a] transition-all"
        >
          Dashboard
        </a>
      ) : (
        <Link
          to="/auth/sign-up"
          className="hidden md:flex items-center px-5 py-2.5 rounded-full bg-[#2D2A70] text-white font-semibold shadow-lg hover:bg-[#1a184a] transition-all"
        >
          Sign Up
        </Link>
      )}

      <IconButton
        onClick={() => setOpen(true)}
        sx={{ display: { xs: "inline-flex", md: "none" }, color: "#2D2A70" }}
      >
        <Menu size={24} />
      </IconButton>
    </Box>
  </Box>
</Sheet>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.15)",
            },
          },
        }}
      >
        <Sheet
          sx={{
            width: 300,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            borderLeft: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          {/* Brand Header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img 
                  src={Layemart} 
                  alt="Layemart Logo" 
                  className="h-18 w-auto object-contain" // Height adjusted for the pill shape
                  style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
                />
              </Box>            
            </Box>

            <IconButton onClick={() => setOpen(false)}>
              <X size={18} />
            </IconButton>
          </Box>

          {/* Navigation */}
          <Box sx={{ px: 2, py: 3, flex: 1 }}>
            <Typography
              sx={{
                mb: 1.5,
                px: 1,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              Navigation
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="plain"
                  onClick={() => {
                    handleScroll(item.href);
                    setOpen(false);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.2,
                    px: 1.5,
                    borderRadius: "12px",
                    color: "#334155",
                    "&:hover": {
                      bgcolor: "rgba(79,70,229,0.08)",
                      color: "#0f172a",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* CTA Footer */}
          <Box
            sx={{
              px: 2.5,
              py: 3,
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                <Sparkles size={18} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                  Start Selling Today
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                  Launch your store in minutes
                </Typography>
              </Box>
            </Box>

            <Link
              to="/auth/sign-up"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 transition"
            >
              <Rocket size={16} />
              Launch Your Store
            </Link>
          </Box>
        </Sheet>
      </Drawer>
    </div>
  );
}
