import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Store, Users, CreditCard, Activity, Settings } from "lucide-react";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/joy";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'ov', label: "Overview", icon: <LayoutGrid size={20} /> },
    { id: 'st', label: "Store Management", icon: <Store size={20} /> },
    { id: 'us', label: "User Accounts", icon: <Users size={20} /> },
    { id: 'sb', label: "Subscriptions", icon: <CreditCard size={20} /> },
    { id: 'sy', label: "System Health", icon: <Activity size={20} /> },
  ];

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
      overflowX: 'hidden', // Prevents text from jumping during transition
    }}>
      
      {/* Collapse Toggle Arrow */}
      <IconButton
        className='lg:block! hidden!'
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          position: 'absolute',
          right: -20,
          top: 32,
          width: 24,
          height: 24,
          bgcolor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '50%',
          zIndex: 10,
          boxShadow: 'sm',
          '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>

      {/* Brand Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
        <div className="w-8 h-8 rounded-md bg-red-500 flex-shrink-0" />
        {!isCollapsed && (
          <Typography className="text xl:text-[15px]! text-[13px]!" sx={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', whiteSpace: 'nowrap' }}>
            LAIYEMART
          </Typography>
        )}
      </Box>

      {/* Nav Items */}
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
                px: isCollapsed ? 0 : 1.5,
                color: hoveredItem === item.id ? '#0f172a' : '#64748b',
                bgcolor: hoveredItem === item.id ? '#f1f5f9' : 'transparent',
                transition: 'all 0.2s ease',
                '& .MuiButton-startDecorator': { 
                    margin: isCollapsed ? 0 : '',
                    color: hoveredItem === item.id ? '#3b82f6' : 'inherit' 
                }
              }}
            >
              {!isCollapsed && <span className="font-semibold text-[14px]">{item.label}</span>}
            </Button>

            {/* Hover Indicator Pill */}
            <Box sx={{
              position: 'absolute',
              left: -8,
              top: '20%',
              height: '60%',
              width: 4,
              bgcolor: '#3b82f6',
              borderRadius: '0 4px 4px 0',
              opacity: hoveredItem === item.id ? 1 : 0,
              transform: hoveredItem === item.id ? 'scaleY(1)' : 'scaleY(0)',
              transition: 'all 0.2s ease'
            }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}