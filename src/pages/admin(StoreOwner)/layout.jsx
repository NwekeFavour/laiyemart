import React, { useEffect, useState } from 'react';
import { 
  Bell, Search, Menu, X, LayoutGrid, ShoppingBag, 
  Package, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Box, IconButton, Button, Sheet, Badge, Typography } from "@mui/joy";
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';

export default function StoreOwnerLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
    const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, store } = useAuthStore();
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();


    const handleLogout = () => {
        logout();          // clear Zustand state + localStorage
        navigate("/login"); // redirect to login page
    }

    useEffect(() => {
      const loadUser = async () => {
        try {
          const data = await fetchMe();
          // console.log(data)
        } catch (err) {
          setError("Failed to fetch user:", err);
        } finally {
          setLoading(false);
        }
      };
  
      loadUser();
    }, []);
  const navItems = [
    { id: 'ov', label: "Dashboard", icon: <LayoutGrid size={20} />, active: true },
    { id: 'or', label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: 'pr', label: "Products", icon: <Package size={20} /> },
    { id: 'st', label: "Settings", icon: <Settings size={20} /> },
  ];
  useEffect(() => {
    if(!localStorage.getItem("layemart-auth")) {
        navigate("/auth/sign-in")
    }
  }, []) 
  // Internal Navigation Component to avoid code duplication
  const NavigationMenu = ({ isMobile = false }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      {/* Brand/Logo */}
      <Box sx={{ 
        display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 2, mb: 2,
        justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start'
      }}>
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex-shrink-0" />
        {(!isCollapsed || isMobile) && (
          <Typography className="text" sx={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', letterSpacing: '-0.02em' }}>
            {store ? store?.subdomain : "LAIYEMART"}
          </Typography>
        )}
      </Box>

      {/* Nav Items */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {navItems.map((item) => (
          <Box 
            key={item.id} 
            onMouseEnter={() => setHoveredItem(item.id)} 
            onMouseLeave={() => setHoveredItem(null)}
            sx={{ position: 'relative' }}
          >
            <Button
              variant={item.active ? "soft" : "plain"}
              startDecorator={item.icon}
              onClick={() => isMobile && setIsMobileOpen(false)}
              sx={{
                justifyContent: (isCollapsed && !isMobile) ? "center" : "flex-start",
                borderRadius: 'xl',
                fontWeight: 600,
                minHeight: 48,
                width: '100%',
                color: item.active ? '#0f172a' : '#64748b',
                bgcolor: item.active ? '#f1f5f9' : 'transparent',
                transition: 'all 0.2s',
                '& .MuiButton-startDecorator': { margin: (isCollapsed && !isMobile) ? 0 : '' },
                '&:hover': { bgcolor: '#f8fafc', color: '#0f172a' }
              }}
            >
              {(!isCollapsed || isMobile) && item.label}
            </Button>
            
            {/* Hover Indicator Pill (Desktop Only) */}
            {!isMobile && !isCollapsed && hoveredItem === item.id && (
              <Box sx={{
                position: 'absolute', left: -12, top: '25%', height: '50%', width: 4,
                bgcolor: '#0f172a', borderRadius: '0 4px 4px 0'
              }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Logout Footer */}
      <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
        <Button
            onClick={handleLogout}
          variant="plain"
          color="danger"
          startDecorator={<LogOut size={20} />}
          sx={{ 
            justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start', 
            borderRadius: 'xl', fontWeight: 600, width: '100%',
            '& .MuiButton-startDecorator': { margin: (isCollapsed && !isMobile) ? 0 : '' }
          }}
        >
          {(!isCollapsed || isMobile) && "Logout"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      
      {/* 1. Desktop Sidebar Wrapper */}
      <Box sx={{ 
        display: { xs: 'none', lg: 'block' }, 
        width: isCollapsed ? 80 : 280, 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        height: '100vh',
        bgcolor: 'white',
        borderRight: '1px solid #e2e8f0',
        zIndex: 100
      }}>
        {/* Collapse Toggle Button */}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            position: 'absolute', right: -12, top: 28, width: 24, height: 24,
            bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: '50%',
            zIndex: 110, boxShadow: 'sm', '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </IconButton>
        
        <NavigationMenu isMobile={false} />
      </Box>

      {/* 2. Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        ml: { lg: isCollapsed ? '80px' : '280px' },
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 
      }}>
        
        {/* Top Header */}
        <Sheet sx={{ 
          height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          px: { xs: 2, md: 4 }, bgcolor: 'white', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <IconButton variant="plain" sx={{ display: { lg: 'none' } }} onClick={() => setIsMobileOpen(true)}>
            <Menu />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxW: 400, ml: { lg: 0, xs: 2 } }}>
             <div className="relative w-full max-w-sm hidden md:block">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  placeholder="Search..." 
                  className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
             </div>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={3} size="sm" color="danger" variant="solid">
              <IconButton variant="plain" sx={{ borderRadius: 'xl' }}><Bell size={20} /></IconButton>
            </Badge>
            <Box sx={{ width: 32, height: 32, borderRadius: 'full', bgcolor: '#0f172a', ml: 1 }} />
          </Box>
        </Sheet>

        {/* Dynamic Page Content */}
        <Box sx={{ p: { xs: 2 } }}>
          {children}
        </Box>
      </Box>

      {/* 3. Mobile Sidebar Overlay & Drawer */}
      <Box 
        sx={{ 
            position: 'fixed', inset: 0, zIndex: 1000,
            visibility: isMobileOpen ? 'visible' : 'hidden', 
            display: { lg: 'none' },
            transition: 'visibility 0.3s'
        }}
      >
        <Box 
          onClick={() => setIsMobileOpen(false)}
          sx={{ 
            position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)', opacity: isMobileOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out'
          }}
        />
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
    </Box>
  );
}