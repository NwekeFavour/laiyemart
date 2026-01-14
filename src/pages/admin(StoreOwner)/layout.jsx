import React, { useEffect, useState } from 'react';
import { 
  Bell, Search, Menu, X, LayoutGrid, ShoppingBag, 
  Package, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, 
  Layers
} from "lucide-react";
import { Box, IconButton, Button, Sheet, Badge, Typography } from "@mui/joy";
import { useLocation, useNavigate, Link as RouterLink} from 'react-router-dom';
import { fetchMe } from '../../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'react-toastify';

export default function StoreOwnerLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const [loading, setLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, store } = useAuthStore();
  const [error, setError] = useState("")
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
const location = useLocation();
    const handleLogout = () => {
        // 1. Clear state and storage
        logout(); 
        
        // 2. Trigger a well-designed success toast
        toast.success("Signed out successfully")

        // 3. Redirect to login page
        navigate("/auth/sign-in"); 
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
    { id: 'ov', label: "Dashboard", icon: <LayoutGrid size={20} />, path: '/dashboard/beta' },
    { id: 'pr', label: "Products", icon: <Package size={20} />, path: '/dashboard/products' },
    { id: 'ca', label: "Categories", icon: <Layers size={20} />, path: '/dashboard/categories' },
    { id: 'or', label: "Orders", icon: <ShoppingBag size={20} />, path: '/dashboard/orders' },
    { id: 'cu', label: "Customers", icon: <Users size={20} />, path: '/dashboard/customers' },
    { id: 'st', label: "Settings", icon: <Settings size={20} />, path: '/dashboard/settings' },
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
        {/* <div className="w-8 h-8 rounded-lg bg-slate-900 flex-shrink-0" /> */}
        {(!isCollapsed || isMobile) && (
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: '#ef4444', flexShrink: 0 }} />
              {(!isCollapsed|| isMobile) && (
                <Typography 
                  className="text lg:text-[17px] text-[13px]!" 
                  sx={{ color: '#0f172a', whiteSpace: 'nowrap' }}
                >
                  LAIYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
                </Typography>
              )}
            </Box>
            {(!isCollapsed || isMobile) && (
              <Box sx={{ py: 1.5, mb: 1 }}>
                <Typography level="body-xs" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: 'neutral.500', textTransform: 'uppercase' }}>
                  Current Store
                </Typography>
                <Typography level="title-md" sx={{ color: '#0f172a', fontWeight: 800 }}>
                  {store?.name || "Layemart Store"}
                </Typography>
              </Box>
            )}
          </div>
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
              component={RouterLink}
              to={item.path} // Make sure your item object has a path
              variant={item.active ? "soft" : "plain"}
              startDecorator={item.icon}
              onClick={() => isMobile && setIsMobileOpen(false)}
              sx={{
                justifyContent: (isCollapsed && !isMobile) ? "center" : "flex-start",
                borderRadius: 'xl',
                fontWeight: 600,
                minHeight: 48,
                width: '100%',
                // Use active styles
                color: item.active ? '#0f172a' : '#64748b',
                bgcolor: item.active ? '#f1f5f9' : 'transparent',
                transition: 'all 0.2s',
                '& .MuiButton-startDecorator': { 
                  margin: (isCollapsed && !isMobile) ? 0 : '' 
                },
                '&:hover': { 
                  bgcolor: '#f8fafc', 
                  color: '#0f172a',
                  textDecoration: 'none' // Prevents default link underline on hover
                }
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
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
      
      {/* 1. Desktop Sidebar Wrapper */}
      <Box   
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        sx={{
          display: { xs: "none", lg: "flex" },
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
        
        {/* 2. Collapse Toggle Button */}
        <IconButton
          onClick={() => setIsCollapsed((p) => !p)}
          className='hover:bg-transparent!'
          sx={{
            position: "absolute",
            right: -4,
            top: 20,
            width: 20,
            height: 20,
            bgcolor: "white",
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


        {/* 3. Brand Section */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'start', justifyContent: "flex-start", gap: 2 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: '#ef4444', flexShrink: 0 }} />

          {(!isCollapsed) && (
                      <div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {(!isCollapsed) && (
                <Typography 
                  className="text lg:text-[17px] text-[13px]!" 
                  sx={{ color: '#0f172a', whiteSpace: 'nowrap' }}
                >
                  LAIYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
                </Typography>
              )}
            </Box>
            {(!isCollapsed || isMobile) && (
              <Box sx={{ py: 1.5, mb: 1 }}>
                <Typography level="body-xs" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: 'neutral.500', textTransform: 'uppercase' }}>
                  Current Store
                </Typography>
                <Typography level="title-md" sx={{ color: '#0f172a', fontWeight: 800 }}>
                  {store?.name || "Layemart Store"}
                </Typography>
              </Box>
            )}
          </div>
          )}
        </Box>

            {/* navigation menu */}
        <Box sx={{ px: 2, flex: 1, mt: 2 }}>
          {navItems.map((item) => {
            // Check if current path matches the item path
            const isActive = location.pathname === item.path;

            return (
              <Box
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{ position: 'relative', mb: 0.5 }}
              >
                <Button
                  variant={isActive ? "soft" : "plain"} // Changes look if active
                  onClick={() => navigate(item.path)}
                  startDecorator={item.icon}
                  sx={{
                    width: '100%',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: '12px',
                    py: 1.5,
                    // Priority color: Active > Hovered > Default
                    color: isActive || hoveredItem === item.id ? '#0f172a' : '#64748b',
                    bgcolor: isActive ? '#f1f5f9' : (hoveredItem === item.id ? '#f8fafc' : 'transparent'),
                    
                    '& .MuiButton-startDecorator': { 
                      margin: isCollapsed ? 0 : '',
                      color: isActive || hoveredItem === item.id ? '#3b82f6' : 'inherit' 
                    },
                    '&:hover': {
                      bgcolor: isActive ? '#f1f5f9' : '#f8fafc'
                    }
                  }}
                >
                  {!isCollapsed && (
                    <Typography sx={{ 
                      fontWeight: isActive ? 700 : 600, // Thicker font if active
                      fontSize: '14px', 
                      ml: 1,
                      color: 'inherit'
                    }}>
                      {item.label}
                    </Typography>
                  )}
                </Button>
                
                {/* Active/Hover Indicator Bar */}
                <Box sx={{
                  position: 'absolute', 
                  left: -8, 
                  top: '20%', 
                  height: '60%', 
                  width: 4,
                  bgcolor: '#3b82f6', 
                  borderRadius: '0 4px 4px 0',
                  // Stay visible if active OR hovered
                  opacity: isActive || hoveredItem === item.id ? 1 : 0,
                  transition: 'all 0.2s ease'
                }} />
              </Box>
            );
          })}
        </Box>

        {/* 5. Bottom Logout Section */}
        <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #f1f5f9' }}>
          <Button
            variant="plain"
            color="danger"
            onClick={handleLogout}
            startDecorator={<LogOut size={20} />}
            sx={{
              width: '100%',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: '12px',
              py: 1.5,
              '&:hover': { bgcolor: '#fff1f2' },
              '& .MuiButton-startDecorator': { margin: isCollapsed ? 0 : '' }
            }}
          >
            {!isCollapsed && (
              <Typography sx={{ fontWeight: 600, fontSize: '14px', ml: 1 }}>
                Log out
              </Typography>
            )}
          </Button>
        </Box>
      </Box>

      {/* 2. Main Content Area */}
      <Box className="hide-scrollbar" sx={{ 
        flex: 1, 
        ml: { lg: isCollapsed ? '80px' : '280px' },
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 ,
        height: "100vh"
      }}>
        
        {/* Top Header */}
        <Sheet sx={{ 
          height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          px: { xs: 2, md: 4 }, py: 4, bgcolor: 'white', borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, zIndex: 50
        }}>
          <IconButton variant="plain" sx={{ display: { lg: 'none' } }} onClick={() => setIsMobileOpen(true)}>
            <Menu />
          </IconButton>

          <Box sx={{ display: 'flex', justifyContent: "end", alignItems: 'center', gap: 2, flex: 1, maxW: 400, ml: { lg: 0, xs: 2 } }}>
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
        <Box className="hide-scrollbar" sx={{ 
          p: { xs: 2 },  
          overflowY: 'auto', // Ensure it is scrollable
          /* Target the scrollbar specifically */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',
          }}>
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