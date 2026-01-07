import React, { useEffect, useState } from 'react';
import { 
  Package, ShoppingCart, Users, Zap, 
  Clock, ArrowUpRight, Plus, ExternalLink,
  ChevronRight, AlertCircle,
  X
} from "lucide-react";
import { Box, Typography, Button, Grid, Sheet, LinearProgress, IconButton } from "@mui/joy";
import StoreOwnerLayout from './layout';
import { fetchMe } from '../../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function StoreOwnerTrialDashboard() {
  // Stats reflecting a brand new store
  const [error, setError] = useState("")
const { user, store } = useAuthStore();
const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const stats = [
    { label: "Total Sales", value: "$0.00", sub: "Goal: $1,000", icon: <ShoppingCart size={20} className="text-blue-500" /> },
    { label: "Store Visits", value: "12", sub: "Last 24h", icon: <Users size={20} className="text-indigo-500" /> },
    { label: "Active Products", value: "3", sub: "Limit: 5", icon: <Package size={20} className="text-emerald-500" /> },
    { label: "Days Left", value: "12 Days", sub: "Trial Period", icon: <Clock size={20} className="text-rose-500" /> },
  ];

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

  return (
    <StoreOwnerLayout>
            <Box sx={{ p: { xs: 2, md: 2 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
{error && (
  <Sheet
    variant="solid"
    color="danger"
    invertedColors
    sx={{
      mb: 4,
      p: 2.5,
      borderRadius: '24px',
      background: 'linear-gradient(45deg, #dc2626 0%, #991b1b 100%)',
      boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.1), 0 8px 10px -6px rgba(220, 38, 38, 0.1)',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 3,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* Decorative background circle */}
    <Box sx={{ 
      position: 'absolute', right: -20, top: -20, width: 100, height: 100, 
      borderRadius: '50%', background: 'rgba(255,255,255,0.1)' 
    }} />

    {/* Icon with "Pulse" animation */}
    <Box sx={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)', 
      borderRadius: '16px', flexShrink: 0
    }}>
      <AlertCircle size={24} />
    </Box>

    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
      <Typography level="title-md" sx={{ fontWeight: 800 }}>
        Session Sync Interrupted
      </Typography>
      <Typography level="body-sm" sx={{ opacity: 0.9 }}>
        We couldn't verify your account details. This might be due to an expired session or a temporary network glitch.
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
      <Button 
        variant="plain" 
        size="sm" 
        onClick={() => window.location.reload()}
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.1)', 
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          borderRadius: 'xl', flex: 1
        }}
      >
        Retry
      </Button>
      <Button 
        variant="solid" 
        color="neutral"
        size="sm"
        onClick={() => {
          localStorage.removeItem("layemart-auth");
          navigate("/auth/sign-in");
        }}
        sx={{ borderRadius: 'xl', flex: 1, whiteSpace: 'nowrap' }}
      >
        Sign In Again
      </Button>
    </Box>
  </Sheet>
)}
      {/* Trial Countdown Header */}
      <Sheet 
        className="bg-slate-900/90! text-white! shadow-lg shadow-slate-200/20!"
        variant="solid" 
        sx={{ 
          mb: 4, p: 2, borderRadius: '20px', 
           display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center', justifyContent: 'space-between', gap: 2 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div className="bg-amber-400 p-2 rounded-lg">
            <Zap size={20} className="text-slate-900" />
          </div>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 700 }}>You're on the Free Trial</Typography>
            <Typography className="text-slate-200!" sx={{ fontSize: '12px' }}>Upgrade now to unlock unlimited products and custom domains.</Typography>
          </Box>
        </Box>
        <Button 
          size="sm" 
          sx={{ bgcolor: 'white', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: 'lg' }}
        >
          Upgrade to Pro
        </Button>
      </Sheet>

      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography level="h2" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Welcome, Store Owner!
          </Typography>
          <div className="flex items-center gap-2 mt-1">
            <Typography level="body-md" sx={{ color: 'neutral.500' }}>Your store is currently live at:</Typography>
            <Typography sx={{ color: 'blue.600', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {store?.subdomain ? `${store.subdomain}.layemart.shop` : "mystore.layemart.shop"} <ExternalLink size={14} />
            </Typography>
          </div>
        </Box>
        <Button 
          variant="solid" 
          startDecorator={<Plus size={18} />}
          sx={{ bgcolor: '#0f172a', borderRadius: 'xl', height: 48, px: 3 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((item, i) => (
          <Grid key={i} xs={12} sm={6} md={3}>
            <Sheet
              variant="outlined"
              sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: 'white' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 'lg', bgcolor: '#f1f5f9' }}>{item.icon}</Box>
              </Box>
              <Typography level="body-sm" sx={{ fontWeight: 600, color: 'neutral.500' }}>{item.label}</Typography>
              <Typography level="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>{item.value}</Typography>
              <Typography sx={{ fontSize: '12px', color: 'neutral.400', mt: 0.5 }}>{item.sub}</Typography>
            </Sheet>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Onboarding Checklist */}
        <Grid xs={12} md={7}>
          <Sheet sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <Typography level="title-lg" sx={{ fontWeight: 700, mb: 1 }}>Setup Checklist</Typography>
            <Typography level="body-sm" sx={{ color: 'neutral.500', mb: 3 }}>Complete these steps to launch your store successfully.</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { task: "Add your first product", done: true },
                { task: "Connect payment gateway", done: false },
              ].map((item, idx) => (
                <Box key={idx} sx={{ 
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, 
                  borderRadius: 'xl', border: '1px solid', 
                  borderColor: item.done ? '#f1f5f9' : '#e2e8f0',
                  bgcolor: item.done ? '#f8fafc' : 'transparent'
                }}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {item.done && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <Typography sx={{ 
                    fontSize: '14px', fontWeight: 600, 
                    color: item.done ? 'neutral.400' : 'neutral.700',
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}>
                    {item.task}
                  </Typography>
                  {!item.done && <ChevronRight size={16} className="ml-auto text-slate-400" />}
                </Box>
              ))}
            </Box>
          </Sheet>
        </Grid>

        {/* Upgrade Card */}
        <Grid xs={12} md={5}>
          <Sheet sx={{ 
            p: 4, borderRadius: '24px', bgcolor: '#eff6ff', 
            border: '1px solid #dbeafe', position: 'relative', overflow: 'hidden' 
          }}>
            <Zap className="absolute -right-4 -top-4 text-blue-100" size={120} />
            
            <Typography sx={{ color: 'blue.700', fontWeight: 800, fontSize: '20px', mb: 1 }}>
              Ready to grow?
            </Typography>
            <Typography sx={{ color: 'blue.600', fontSize: '14px', mb: 3, lineHeight: 1.5 }}>
              The Pro plan gives you custom domains, advanced analytics, and 0% transaction fees.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'blue.700' }}>Trial Usage</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'blue.700' }}>60%</Typography>
              </Box>
              <LinearProgress 
                determinate 
                value={60} 
                color="primary"
                sx={{ borderRadius: 'sm', height: 8, bgcolor: '#dbeafe' }} 
              />
            </Box>

            <Button 
              fullWidth 
              endDecorator={<ArrowUpRight size={18} />}
              sx={{ bgcolor: '#2563eb', color: 'white', py: 1.5, borderRadius: 'xl', '&:hover': { bgcolor: '#1d4ed8' } }}
            >
              See All Pro Features
            </Button>
          </Sheet>
        </Grid>
      </Grid>
    </Box>
    </StoreOwnerLayout>
  );
}