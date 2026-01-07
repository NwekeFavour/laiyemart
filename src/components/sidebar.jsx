import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Store, Users, CreditCard, Activity, LogOut } from "lucide-react"; // Changed to Lucide LogOut
import { Box, Typography, Button, IconButton, Divider } from "@mui/joy";
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const navItems = [
    { id: 'ov', label: "Overview", icon: <LayoutGrid size={20} /> },
    { id: 'st', label: "Store Management", icon: <Store size={20} /> },
    { id: 'us', label: "User Accounts", icon: <Users size={20} /> },
    { id: 'sb', label: "Subscriptions", icon: <CreditCard size={20} /> },
    { id: 'sy', label: "System Health", icon: <Activity size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth/sign-in");
    // Add your auth logic here (e.g., clearing tokens, redirecting)
  };

  return (
    <Box sx={{ 
      width: isCollapsed ? 80 : 280, 
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      height: '100vh',
      bgcolor: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    }}>
      
      {/* Collapse Toggle Arrow */}
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          position: 'absolute',
          right: -12, // Adjusted so it sits on the border
          top: 32,
          width: 24,
          height: 24,
          bgcolor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '50%',
          zIndex: 10,
          boxShadow: 'sm',
          display: { xs: 'none', lg: 'flex' },
          '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>

      {/* Brand Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <div className="w-8 h-8 rounded-md bg-red-500 flex-shrink-0" />
        {!isCollapsed && (
          <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', whiteSpace: 'nowrap' }}>
            LAIYEMART
          </Typography>
        )}
      </Box>

      {/* Main Nav Items */}
      <Box sx={{ px: 2, flex: 1, mt: 2 }}>
        {navItems.map((item) => (
          <Box
            key={item.id}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            sx={{ position: 'relative', mb: 0.5 }}
          >
            <Button
              variant="plain"
              startDecorator={item.icon}
              sx={{
                width: '100%',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius: '12px',
                py: 1.5,
                color: hoveredItem === item.id ? '#0f172a' : '#64748b',
                bgcolor: hoveredItem === item.id ? '#f1f5f9' : 'transparent',
                '& .MuiButton-startDecorator': { 
                    margin: isCollapsed ? 0 : '',
                    color: hoveredItem === item.id ? '#3b82f6' : 'inherit' 
                }
              }}
            >
              {!isCollapsed && <span className="font-semibold text-[14px]">{item.label}</span>}
            </Button>
            
            {/* Hover Indicator */}
            <Box sx={{
              position: 'absolute', left: -8, top: '20%', height: '60%', width: 4,
              bgcolor: '#3b82f6', borderRadius: '0 4px 4px 0',
              opacity: hoveredItem === item.id ? 1 : 0,
              transition: 'all 0.2s ease'
            }} />
          </Box>
        ))}
      </Box>

      {/* Dedicated Logout Section at the bottom */}
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
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': { bgcolor: '#fff1f2' }, // Light red hover
            '& .MuiButton-startDecorator': { margin: isCollapsed ? 0 : '' }
          }}
        >
          {!isCollapsed && "Log out"}
        </Button>
      </Box>
    </Box>
  );
}