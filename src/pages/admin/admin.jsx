import React from 'react';
import { 
  Users, 
  Store, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Globe 
} from "lucide-react";
import { Box, Typography, Button, Grid, Sheet } from "@mui/joy";
import SuperAdminLayout from './layout';

export default function SuperAdminDashboard() {
  
  // High-level ecosystem stats
  const stats = [
    { label: "Total Stores", value: "1,284", grow: "+12%", icon: <Store size={20} className="text-blue-500" /> },
    { label: "Active Users", value: "8,432", grow: "+5%", icon: <Users size={20} className="text-indigo-500" /> },
    { label: "System Revenue", value: "₦42,000", grow: "+18%", icon: <DollarSign size={20} className="text-emerald-500" /> },
    { label: "Server Health", value: "99.9%", grow: "Stable", icon: <Activity size={20} className="text-rose-500" /> },
  ];

  return (
    <SuperAdminLayout>
          <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <Box className="lg:flex! flex-wrap!" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography level="h2" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            System Overview
          </Typography>
          <Typography  level="body-md" sx={{ color: 'neutral.500' }}>
            Monitoring the Laiyemart ecosystem and platform performance.
          </Typography>
        </Box>
        <Button 
          className="lg:mt-0! mt-3!"
          variant="solid" 
          startDecorator={<ShieldCheck size={18} />}
          sx={{ bgcolor: '#0f172a', borderRadius: 'xl', '&:hover': { bgcolor: '#1e293b' } }}
        >
          Security Audit
        </Button>
      </Box>

      {/* Top Stats Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((item, i) => (
          <Grid key={i} xs={12} sm={6} md={3}>
            <Sheet
              variant="outlined"
              sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: 'white' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 'lg', bgcolor: '#f1f5f9' }}>{item.icon}</Box>
                <Typography level="body-xs" sx={{ fontWeight: 700, color: 'emerald.600', bgcolor: 'emerald.50', px: 1, py: 0.5, borderRadius: 'md' }}>
                  {item.grow}
                </Typography>
              </Box>
              <Typography level="body-sm" sx={{ fontWeight: 600, color: 'neutral.500' }}>{item.label}</Typography>
              <Typography level="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>{item.value}</Typography>
            </Sheet>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column: Recent Stores & Flagged Content */}
        <Grid xs={12} md={8}>
          <Sheet sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography level="title-lg" sx={{ fontWeight: 700 }}>Newly Launched Stores</Typography>
              <Button variant="plain" size="sm" endDecorator={<ArrowRight size={16} />}>View All</Button>
            </Box>
            
            {/* Simple Table Mockup */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: "Urban Threads", owner: "sarah@gmail.com", plan: "Pro", date: "2 mins ago" },
                { name: "Gadget Galaxy", owner: "mike@tech.io", plan: "Basic", date: "15 mins ago" },
                { name: "Eco Living", owner: "anna@nature.com", plan: "Free", date: "1 hour ago" },
              ].map((store, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderBottom: idx !== 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {store.name[0]}
                    </div>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{store.name}</Typography>
                      <Typography sx={{ fontSize: '12px', color: 'neutral.500' }}>{store.owner}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '12px' }}>{store.plan}</Typography>
                    <Typography sx={{ fontSize: '11px', color: 'neutral.400' }}>{store.date}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Sheet>
        </Grid>

        {/* Right Column: Platform Alerts */}
        <Grid xs={12} md={4}>
          <Sheet sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography level="title-lg" sx={{ fontWeight: 700, mb: 2 }}>System Alerts</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#fff1f2', borderRadius: 'xl', border: '1px solid #ffe4e6', display: 'flex', gap: 2 }}>
                <AlertCircle className="text-rose-500" size={20} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#9f1239' }}>Subdomain Collision</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#be123c' }}>"techstore" requested twice.</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 'xl', border: '1px solid #e0f2fe', display: 'flex', gap: 2 }}>
                <Globe className="text-blue-500" size={20} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#075985' }}>New Region Active</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#0369a1' }}>Traffic spike in West Africa.</Typography>
                </Box>
              </Box>
            </Box>

            <Button fullWidth sx={{ mt: 3, bgcolor: '#f1f5f9', color: '#475569', '&:hover': { bgcolor: '#e2e8f0' } }}>
              View System Logs
            </Button>
          </Sheet>
        </Grid>
      </Grid>
    </Box>
    </SuperAdminLayout>
  );
}