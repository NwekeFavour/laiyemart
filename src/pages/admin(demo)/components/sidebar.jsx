import React, { useState } from 'react';
import { 
  LayoutGrid, Package, Layers, ShoppingCart, 
  Users, Settings, ChevronDown, ChevronLeft, LogOut, ExternalLink 
} from "lucide-react";
import { Box, Typography, Button, IconButton } from "@mui/joy";

/**
 * Sidebar Component
 * @param {boolean} isDark - Dark mode state
 * @param {boolean} collapsed - Current collapse state from parent
 * @param {function} setCollapsed - Setter to update parent's collapse state
 * @param {boolean} mobileOpen - Controls visibility on mobile screens
 * @param {function} onSelect - Callback when a menu item is clicked
 * @param {string} activeTab - The ID of the currently active page
 * @param {boolean} demo - State for the "Online Store" toggle
 * @param {function} setDemo - Setter for the demo toggle
 */
export default function Sidebar({ 
  isDark, 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  onSelect, 
  activeTab,
  demo, 
  setDemo 
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  // Navigation Items Configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  ];

  const handleDemoToggle = () => setDemo(!demo);

  // Dynamic styles for the Sidebar buttons
  const getItemStyles = (id) => {
    const isActive = activeTab === id;
    const isHovered = hoveredItem === id;
    
    return {
      width: '100%',
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderRadius: '12px',
      py: 1.5, 
      px: 1.5, 
      mb: 0.5,
      // Change colors based on Active vs Hover vs Default
      color: isActive || isHovered ? (isDark ? 'sky.200' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
      bgcolor: isActive ? (isDark ? '#1e293b' : '#f1f5f9') : (isHovered ? (isDark ? '#1e293b80' : '#f8fafc') : 'transparent'),
      '& .MuiButton-startDecorator': { 
        margin: collapsed ? 0 : '',
        color: isActive || isHovered ? '#3b82f6' : 'inherit' 
      },
      transition: 'all 0.2s ease',
    };
  };

  return (
    <Box
      component="aside"
      // Hover logic updates the parent state immediately
      onMouseEnter={() => !mobileOpen && setCollapsed(false)}
      onMouseLeave={() => !mobileOpen && setCollapsed(true)}
      sx={{
        display: { xs: 'none', lg: 'flex' }, // Hidden on mobile, controlled by MobileSidebar.jsx
        flexDirection: 'column',
        width: collapsed ? 100 : 280,
        height: '100vh',
        position: 'fixed',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: isDark ? '#0f172a' : 'white',
        borderRight: '1px solid',
        borderColor: isDark ? '#1e293b' : '#e2e8f0',
        zIndex: 100,
        overflowX: 'hidden',
      }}
    >
      {/* --- Brand Header --- */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '80px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 32, height: 32, borderRadius: '6px', 
            bgcolor: '#ef4444', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' 
          }} />
          {!collapsed && (
            <Typography className="text" sx={{ fontWeight: 800, fontSize: '16px', color: isDark ? 'white' : '#0f172a' }}>
              LAYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
            </Typography>
          )}
        </Box>
        
        {/* Manual Toggle Button */}
        <IconButton
          className='bg-transparent!'
          size="sm"
          variant="soft"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ 
            color: isDark ? '#94a3b8' : '#64748b',
            bgcolor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)',
            borderRadius: '8px',
            transition: 'transform 0.4s ease',
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronLeft size={18} />
        </IconButton>
      </Box>

      {/* --- Main Navigation Menu --- */}
      <Box sx={{ px: 2, flex: 1, mt: 1 }}>
        {navItems.map((item) => (
          <Box 
            key={item.id} 
            sx={{ position: 'relative' }} 
            onMouseEnter={() => setHoveredItem(item.id)} 
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button 
              variant="plain" 
              startDecorator={item.icon} 
              onClick={() => onSelect(item.id)} 
              sx={getItemStyles(item.id)}
            >
              {!collapsed && (
                <Typography sx={{ fontWeight: 600, fontSize: '14px', ml: 1, color: 'inherit' }}>
                  {item.label}
                </Typography>
              )}
            </Button>

            {/* Visual Indicator Bar */}
            <Box sx={{ 
              position: 'absolute', left: -8, top: '20%', height: '60%', width: 4, 
              bgcolor: '#3b82f6', borderRadius: '0 4px 4px 0',
              opacity: activeTab === item.id || hoveredItem === item.id ? 1 : 0,
              transition: 'opacity 0.2s'
            }} />
          </Box>
        ))}

        {/* --- Settings Dropdown --- */}
        <Box 
          sx={{ position: 'relative' }} 
          onMouseEnter={() => setHoveredItem('settings-group')} 
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Button
            variant="plain"
            startDecorator={<Settings size={20} />}
            endDecorator={!collapsed && <ChevronDown size={16} style={{ transition: '0.2s', transform: openSettings ? 'rotate(180deg)' : '' }} />}
            onClick={() => setOpenSettings(!openSettings)}
            sx={getItemStyles('settings-group')}
          >
            {!collapsed && (
              <Typography sx={{ fontWeight: 600, fontSize: '14px', ml: 1, color: 'inherit', flex: 1, textAlign: 'left' }}>
                Settings
              </Typography>
            )}
          </Button>

          {!collapsed && openSettings && (
            <Box sx={{ ml: 4.5, mt: 0.5, borderLeft: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9', pl: 1 }}>
              {['settings', 'security'].map(sub => (
                <Typography 
                  key={sub} 
                  onClick={() => onSelect(sub)} 
                  sx={{ 
                    p: 1, cursor: 'pointer', fontSize: '13px', borderRadius: '8px',
                    color: activeTab === sub ? '#3b82f6' : (isDark ? '#94a3b8' : '#64748b'),
                    fontWeight: activeTab === sub ? 700 : 500,
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

      {/* --- Footer (Actions) --- */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
        {/* Demo Button */}
        <Button
          variant="soft"
          color={demo ? "neutral" : "primary"}
          startDecorator={demo ? <ChevronLeft size={18}/> : <ExternalLink size={18} />}
          onClick={handleDemoToggle}
          sx={{ 
            width: '100%', mb: 1, borderRadius: '12px', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            '& .MuiButton-startDecorator': { margin: collapsed ? 0 : '' } 
          }}
        >
          {!collapsed && (demo ? 'Back to Store' : 'Online Store')}
        </Button>

        {/* Sign Out */}
        <Button
          variant="plain"
          color="danger"
          startDecorator={<LogOut size={20} />}
          sx={{ 
            width: '100%', borderRadius: '12px', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            '& .MuiButton-startDecorator': { margin: collapsed ? 0 : '' } 
          }}
        >
          {!collapsed && "Sign Out"}
        </Button>
      </Box>
    </Box>
  );
}