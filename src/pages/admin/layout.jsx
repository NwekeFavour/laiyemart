import React, { useEffect, useState } from 'react';
import { Bell, Search, Menu, X } from "lucide-react";
import { Box, IconButton, Sheet, Badge, GlobalStyles } from "@mui/joy"; // Added GlobalStyles
import Sidebar from '../../components/sidebar';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("layemart-auth")){
            navigate("/auth/sign-in")
        }
    }, [navigate]);

    const RenderSidebar = ({ mobile = false }) => (
        <Sidebar 
            isCollapsed={mobile ? false : isCollapsed} 
            setIsCollapsed={setIsCollapsed} 
            isMobileOpen={isMobileOpen} // Added this prop for internal sidebar use
            setIsMobileOpen={setIsMobileOpen} // Ensure sidebar can close itself
        />
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* --- GLOBAL CSS TO HIDE SCROLLBARS --- */}
            <GlobalStyles
                styles={{
                    '.hide-scrollbar': {
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    },
                    '.hide-scrollbar::-webkit-scrollbar': {
                        display: 'none',
                    },
                    // Apply to body if needed
                    'body::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            />

            {/* Desktop Sidebar */}
            <Box sx={{ 
                display: { xs: 'none', lg: 'block' }, 
                width: isCollapsed ? 100 : 280, // Match your sidebar width
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <RenderSidebar />
            </Box>

            {/* Main Content Area */}
            <Box 
                className="hide-scrollbar" 
                sx={{ 
                    flex: 1, 
                    ml: { lg: isCollapsed ? '100px' : '280px' },
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100vh', // Critical: Fixed height for the container
                    overflow: 'hidden' // Prevents double scrollbars
                }}
            >
                {/* Top Header Bar */}
                <Sheet sx={{ 
                    height: 70, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    px: { xs: 2, md: 4 },
                    bgcolor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    flexShrink: 0, // Prevents header from squishing
                    zIndex: 50
                }}>
                    <IconButton 
                        variant="plain" 
                        sx={{ display: { lg: 'none' } }} 
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxW: 400, ml: { lg: 0, xs: 2 } }}>
                        <div className="relative w-full max-w-sm hidden md:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                placeholder="Search stores..." 
                                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                            />
                        </div>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge badgeContent={3} size="sm" color="danger" variant="solid">
                            <IconButton variant="plain" sx={{ borderRadius: 'xl' }}><Bell size={20} /></IconButton>
                        </Badge>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#0f172a', ml: 1 }} />
                    </Box>
                </Sheet>

                {/* Dynamic Page Content (The actual scrollable area) */}
                <Box 
                    className="hide-scrollbar" 
                    sx={{ 
                        flex: 1,
                        overflowY: 'auto', 
                        p: { xs: 0 }, // Let the child pages handle padding for better layout control
                    }}
                >
                    {children}
                </Box>
            </Box>

            {/* Mobile Sidebar Overlay & Drawer (Same as before but ensures visibility) */}
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
                        position: 'absolute', inset: 0, 
                        bgcolor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        opacity: isMobileOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                />
                <Box 
                    sx={{ 
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, bgcolor: 'white',
                        transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <RenderSidebar mobile={true} />
                </Box>
            </Box>
        </Box>
    );
}