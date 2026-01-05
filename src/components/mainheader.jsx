import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  Sheet,
} from "@mui/joy";
import { Menu, X, Moon, Zap, LayoutGrid, Rocket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  {
    label: "Product",
    href: "#product",
    description: "Everything you need to launch fast",
  },
  {
    label: "Templates",
    href: "#templates",
    description: "Ready-to-use ecommerce designs",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Docs",
    href: "#docs",
  },
];

export default function SaaSHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <Sheet
        className="bg-transparent!"
        variant="plain"
        sx={{
          position: "fixed",
          inset: 0,
          bottom: "auto",
          zIndex: 40,
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(255,255,255,0.75)",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, #4f46e5, #6366f1)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Rocket size={16} color="#fff" />
            </Box>

            <Typography
            className="text"
              level="h4"
              sx={{
                fontWeight: 800,
                background:
                  "linear-gradient(90deg, #0f172c, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LAYEMART
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 4,
            }}
          >
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component={Link}
                to={item.href}
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "neutral.700",
                  position: "relative",
                  "&:hover": { color: "primary.600" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -6,
                    width: 0,
                    height: 2,
                    bgcolor: "primary.500",
                    transition: "width 0.25s ease",
                  },
                  "&:hover::after": { width: "100%" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton variant="plain">
              <Moon size={18} />
            </IconButton>

            <Button
              className="bg-slate-900/90!"
              variant="solid"
              color="primary"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Launch Your Store
            </Button>

            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <Menu size={20} />
            </IconButton>
          </Box>
        </Box>
      </Sheet>

      {/* Mobile Navigation */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Sheet sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>

          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="plain"
                component={Link}
                to={item.href}
                onClick={() => setOpen(false)}
                sx={{ justifyContent: "flex-start" }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              className="bg-slate-900/90!"

              variant="solid"
              color="primary"
              startDecorator={<Rocket size={16} />}
              sx={{ mt: 2 }}
            >
              Launch Store
            </Button>
          </Box>
        </Sheet>
      </Drawer>
    </>
  );
}
