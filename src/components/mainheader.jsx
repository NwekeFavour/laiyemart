import { Box, Typography, IconButton, Button, Drawer, Sheet } from "@mui/joy";
import { Menu, X, Moon, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const navItems = [
  { label: "Product", href: "product" },
  { label: "Templates", href: "templates" },
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
          zIndex: 50,
          mx: "auto",
          maxWidth: 1200,
          borderRadius: "999px",
          backdropFilter: "blur(14px)",
          bgcolor: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 8px 30px rgba(15,23,42,0.08)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 6px 16px rgba(79,70,229,0.35)",
              }}
            >
              <Rocket size={16} color="#fff" />
            </Box>

            <Typography
              level="h4"
              sx={{
                fontWeight: 900,
                fontSize: "18px",
                background: "linear-gradient(90deg, #0f172a, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LAYEMART
            </Typography>
          </Box>

          {/* Desktop Nav */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                onClick={() => handleScroll(item.href)}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0F172A",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": { color: "#4F46E5" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -6,
                    width: 0,
                    height: 2,
                    bgcolor: "#4f46e5",
                    transition: "width .25s ease",
                  },
                  "&:hover::after": { width: "100%" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton variant="plain">
              <Moon size={18} />
            </IconButton>

            {isAuthenticated ? (
              /* Show this when Logged In */
              <a
                href={(() => {
                  const isLocal =
                    window.location.hostname.includes("localhost");
                  const dashBase = isLocal
                    ? "dashboard.localhost:5173"
                    : "dashboard.layemart.com";
                  const protocol = window.location.protocol;

                  if (user?.role === "SUPER_ADMIN") {
                    return `${protocol}//${dashBase}/dashboard`;
                  }
                  if (user?.role === "OWNER") {
                    return `${protocol}//${dashBase}/`;
                  }
                  return "/"; // Fallback for customers
                })()}
                className="text-sm text-gray-600 hover:underline"
              >
                Dashboard
              </a>
            ) : (
              /* Show this when Logged Out */
              <Link
                to="/auth/sign-up"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 transition"
              >
                Sign Up
              </Link>
            )}

            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <Menu size={20} />
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
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 6px 16px rgba(79,70,229,0.35)",
                }}
              >
                <Rocket size={16} color="#fff" />
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  color: "#0f172a",
                }}
              >
                LAYEMART
              </Typography>
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
