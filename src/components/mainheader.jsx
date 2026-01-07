import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  Sheet,
} from "@mui/joy";
import { Menu, X, Moon, Zap, LayoutGrid, Rocket, Sparkles } from "lucide-react";
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

];

export default function SaaSHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <Sheet
        className="bg-slate-100/40!"
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
                  color: "neutral.900",
                  backgroundColor: "transparent",
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

            <Link
              to={'/auth/sign-up'}
              className="bg-slate-900/90! py-2 cursor-pointer! z-1 text-white font-semibold px-4 rounded-lg hover:bg-slate-800/90! transition-all shadow-lg shadow-slate-200/20!"
            >
              Launch Your Store
            </Link>

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
<Drawer 
      open={open} 
      onClose={() => setOpen(false)}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.2)' }
        }
      }}
    >
      <Sheet 
        sx={{ 
          p: 0, 
          height: "100%", 
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white'
        }}
      >
        {/* Header Section */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          px: 3, 
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'gray.100'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <Typography className="text" sx={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.02em', color: '#0f172a' }}>
              LAIYEMART
            </Typography>
          </Box>
          <IconButton 
            variant="plain" 
            color="neutral"
            onClick={() => setOpen(false)}
            sx={{ borderRadius: '50%' }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Navigation Section */}
        <Box sx={{ flex: 1, px: 2, mt: 3, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography sx={{ px: 1.5, mb: 1, fontWeight: 700, color: 'neutral.400', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Main Menu
          </Typography>
          
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="plain"
              component={Link}
              to={item.href}
              onClick={() => setOpen(false)}
              startDecorator={item.icon}
              sx={{ 
                justifyContent: "flex-start",
                fontWeight: 600,
                fontSize: '14px',
                py: 1.2,
                borderRadius: 'xl',
                color: '#475569', // slate-600
                '&:hover': {
                  bgcolor: 'neutral.softBg',
                  color: '#0f172a', // slate-900
                },
                '& .MuiButton-startDecorator': { color: 'neutral.400' }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Footer Section */}
        <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'gray.100' }}>
          {/* Upgrade Card */}
          <Box sx={{ 
            p: 2, 
            mb: 2, 
            borderRadius: 'xl', 
            bgcolor: '#f8fafc', // slate-50
            border: '1px solid',
            borderColor: '#f1f5f9',
            display: 'flex', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Box sx={{ p: 1, borderRadius: 'lg', bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#3b82f6' }}>
              <Sparkles size={18} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>Growth Plan</Typography>
              <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Manage unlimited stores</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            size="lg"
            variant="solid"
            startDecorator={<Rocket size={18} />}
            sx={{ 
              py: 1.5,
              borderRadius: 'xl',
              bgcolor: '#0f172a', // slate-900
              fontWeight: 600,
              '&:hover': { bgcolor: '#1e293b' }
            }}
          >
            Launch Store
          </Button>
        </Box>
      </Sheet>
    </Drawer>
    </>
  );
}
