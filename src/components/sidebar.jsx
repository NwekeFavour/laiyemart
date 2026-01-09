import React, { useState } from 'react';
import { 
  ChevronLeft, LayoutGrid, Store, Users, 
  CreditCard, Activity, LogOut, X 
} from "lucide-react";
import { Box, Typography, Button, IconButton } from "@mui/joy";
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'ov', label: "Overview", path: "/dashboard", icon: <LayoutGrid size={20} /> },
    { id: 'st', label: "Store Management", path: "/stores", icon: <Store size={20} /> },
    { id: 'us', label: "User Accounts", path: "/users", icon: <Users size={20} /> },
    { id: 'sb', label: "Subscriptions", path: "/billing", icon: <CreditCard size={20} /> },
    { id: 'sy', label: "System Health", path: "/health", icon: <Activity size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully", { theme: "colored", icon: "👋" });
    navigate("/auth/sign-in");
  };

  /**
   * Internal Menu Component to reuse logic between Desktop and Mobile
   */
  const NavigationMenu = ({ isMobile = false }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: '#ef4444', flexShrink: 0 }} />
        {(!isCollapsed || isMobile) && (
          <Typography 
            className="text lg:text-[17px] text-[13px]!" 
            sx={{ color: '#0f172a', whiteSpace: 'nowrap' }}
          >
            LAIYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
          </Typography>
        )}
      </Box>

      {/* Nav Items */}
      <Box sx={{ px: 2, flex: 1, mt: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredItem === item.id;

          return (
            <Box
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              sx={{ position: 'relative', mb: 0.5 }}
            >
              <Button
                variant={isActive ? "soft" : "plain"}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsMobileOpen(false);
                }}
                startDecorator={item.icon}
                sx={{
                  width: '100%',
                  justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  py: 1.5,
                  color: isActive || isHovered ? '#0f172a' : '#64748b',
                  bgcolor: isActive ? '#f1f5f9' : (isHovered ? '#f8fafc' : 'transparent'),
                  '& .MuiButton-startDecorator': { 
                    margin: (isCollapsed && !isMobile) ? 0 : '',
                    color: isActive || isHovered ? '#3b82f6' : 'inherit' 
                  },
                }}
              >
                {(!isCollapsed || isMobile) && (
                  <Typography sx={{ fontWeight: isActive ? 700 : 600, fontSize: '14px', ml: 1, color: 'inherit' }}>
                    {item.label}
                  </Typography>
                )}
              </Button>
              
              <Box sx={{
                position: 'absolute', left: -8, top: '20%', height: '60%', width: 4,
                bgcolor: '#3b82f6', borderRadius: '0 4px 4px 0',
                opacity: isActive || isHovered ? 1 : 0,
                transition: 'all 0.2s ease'
              }} />
            </Box>
          );
        })}
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Button
          variant="plain"
          color="danger"
          onClick={handleLogout}
          startDecorator={<LogOut size={20} />}
          sx={{
            width: '100%',
            justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start',
            borderRadius: '12px',
            py: 1.5,
            '&:hover': { bgcolor: '#fff1f2' },
            '& .MuiButton-startDecorator': { margin: (isCollapsed && !isMobile) ? 0 : '' }
          }}
        >
          {(!isCollapsed || isMobile) && (
            <Typography sx={{ fontWeight: 600, fontSize: '14px', ml: 1 }}>Log out</Typography>
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 1. Desktop Sidebar Wrapper */}
      <Box 
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        sx={{
          display: { xs:"flex" },
          flexDirection: "column",
          width: isCollapsed ? 100 : 280,
          transition: "width 0.3s ease",
          position: "fixed",
          height: "100vh",
          bgcolor: "white",
          borderRight: "1px solid #e2e8f0",
          zIndex: 100,
          overflowX: "hidden",
        }}
      >
        <IconButton
          className='hover:bg-transparent!'
          onClick={() => setIsCollapsed((p) => !p)}
          sx={{
            position: "absolute", right: -2, top: 20, width: 24, height: 24,
            bgcolor: "white", zIndex: 10
          }}
        >
          <ChevronLeft
            size={16}
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
        
        <NavigationMenu isMobile={false} />
      </Box>

      {/* 2. Mobile Sidebar Overlay & Drawer */}
      <Box 
        sx={{ 
          position: 'fixed', inset: 0, zIndex: 1000,
          visibility: isMobileOpen ? 'visible' : 'hidden', 
          display: { lg: 'none' },
          transition: 'visibility 0.3s'
        }}
      >
        {/* Backdrop overlay */}
        <Box 
          onClick={() => setIsMobileOpen(false)}
          sx={{ 
            position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)', opacity: isMobileOpen ? 1 : 0, transition: 'opacity 0.3s'
          }}
        />
        
        {/* Drawer content */}
        <Box 
          sx={{ 
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, bgcolor: 'white',
            transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
            <IconButton variant="plain" onClick={() => setIsMobileOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>
          <NavigationMenu isMobile={true} />
        </Box>
      </Box>
    </>
  );
}