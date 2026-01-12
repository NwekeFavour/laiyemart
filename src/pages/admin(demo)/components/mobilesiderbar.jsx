import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, Package, Layers, ShoppingCart, 
  Users, Settings, ChevronDown, X, LogOut, ExternalLink 
} from "lucide-react";
import { Box, Typography, Button, IconButton, Divider } from "@mui/joy";

export default function MobileSidebar({ 
  isDark, 
  mobileOpen, 
  setMobileOpen, 
  activePage, 
  setActivePage, 
  demo, 
  setDemo 
}) {
  const [openSettings, setOpenSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (page) => {
    setActivePage(page);
    setMobileOpen(false); // Close drawer after selection
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* --- Backdrop / Overlay --- */}
      <Box
        onClick={() => setMobileOpen(false)}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
          transition: "all 0.3s ease-in-out",
          display: { lg: "none" },
        }}
      />

      {/* --- Sidebar Drawer --- */}
      <Box
        component="aside"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          bgcolor: isDark ? "#0f172a" : "white",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "xl",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '80px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 32, height: 32, borderRadius: '6px', 
              bgcolor: '#ef4444', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' 
            }} />
            <Typography className="text md:text-[13px]! text-[12px]!" sx={{ fontWeight: 800, fontSize: '16px', color: isDark ? 'white' : '#0f172a' }}>
              LAYE<span className="text" style={{ color: '#ef4444' }}>MART</span>
            </Typography>
          </Box>
          <IconButton 
            variant="plain" 
            onClick={() => setMobileOpen(false)}
            sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ px: 2, flex: 1, mt: 1, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <Box key={item.id} sx={{ position: 'relative' }}>
                <Button
                  variant={isActive ? "soft" : "plain"}
                  startDecorator={item.icon}
                  onClick={() => handleSelect(item.id)}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    borderRadius: '12px',
                    py: 1.5, px: 1.5, mb: 0.5,
                    color: isActive ? (isDark ? '#fff' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
                    bgcolor: isActive ? (isDark ? '#1e293b' : '#f1f5f9') : 'transparent',
                    '& .MuiButton-startDecorator': { 
                      color: isActive ? '#3b82f6' : 'inherit' 
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: isActive ? 700 : 600, fontSize: '14px', ml: 1, color: 'inherit' }}>
                    {item.label}
                  </Typography>
                </Button>
                {/* Active Indicator Strip */}
                {isActive && (
                  <Box sx={{ 
                    position: 'absolute', left: -8, top: '20%', height: '60%', width: 4, 
                    bgcolor: '#3b82f6', borderRadius: '0 4px 4px 0' 
                  }} />
                )}
              </Box>
            );
          })}

          {/* Settings Section */}
          <Box sx={{ mt: 1 }}>
            <Button
              variant="plain"
              startDecorator={<Settings size={20} />}
              endDecorator={<ChevronDown size={16} style={{ transition: '0.2s', transform: openSettings ? 'rotate(180deg)' : '' }} />}
              onClick={() => setOpenSettings(!openSettings)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                borderRadius: '12px',
                py: 1.5, px: 1.5,
                color: isDark ? '#94a3b8' : '#64748b',
                '&:hover': { bgcolor: isDark ? '#1e293b' : '#f8fafc' }
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '14px', ml: 1, flex: 1, textAlign: 'left', color: 'inherit' }}>
                Settings
              </Typography>
            </Button>
            
            {openSettings && (
              <Box sx={{ ml: 4.5, mt: 0.5, borderLeft: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9', pl: 1 }}>
                {['settings', 'security'].map(sub => (
                  <Typography 
                    key={sub} 
                    onClick={() => handleSelect(sub)}
                    sx={{ 
                      p: 1.5, cursor: 'pointer', fontSize: '13px', borderRadius: '8px',
                      color: activePage === sub ? '#3b82f6' : (isDark ? '#94a3b8' : '#64748b'),
                      fontWeight: activePage === sub ? 700 : 500,
                      '&:hover': { color: '#3b82f6', bgcolor: isDark ? '#1e293b' : '#f8fafc' } 
                    }}
                  >
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <Button
            variant="soft"
            color={demo ? "neutral" : "primary"}
            startDecorator={<ExternalLink size={18} />}
            onClick={() => setDemo(!demo)}
            sx={{ width: '100%', mb: 1, borderRadius: '12px', justifyContent: 'flex-start' }}
          >
            {demo ? 'Back to Store' : 'Online Store'}
          </Button>

          <Button
            variant="plain"
            color="danger"
            startDecorator={<LogOut size={20} />}
            sx={{ width: '100%', borderRadius: '12px', justifyContent: 'flex-start' }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </>
  );
}