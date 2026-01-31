import React, { useEffect } from "react";
import {
  Users,
  Store,
  Activity,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  DollarSign,
  Globe,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Box, Typography, Button, Grid, Sheet, Chip, Skeleton, Divider } from "@mui/joy";
import SuperAdminLayout from "./layout";
import { useAdminStore } from "../../../services/adminService";

export default function SuperAdminDashboard() {
  const {
    fetchStoreOwners,
    fetchAllStores,
    owners,
    stores,
    loadingOwners,
    loadingStores,
    error,
  } = useAdminStore();

  useEffect(() => {
    fetchStoreOwners();
    fetchAllStores();
  }, [fetchStoreOwners, fetchAllStores]);

  /* ------------------ Derived Data ------------------ */
  const totalStores = stores?.count || 0;
  const activeUsers = owners?.count || 0;

  const recentStores = [...(stores?.data || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

  const storesThisWeek = (stores.data || []).filter(s => new Date(s.createdAt) >= sevenDaysAgo).length;
  const storesLastWeek = (stores.data || []).filter(s => {
    const d = new Date(s.createdAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  }).length;

  const ownersThisWeek = (owners.data || []).filter(o => new Date(o.createdAt) >= sevenDaysAgo).length;
  const ownersLastWeek = (owners.data || []).filter(o => {
    const d = new Date(o.createdAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  }).length;

  const stats = [
    {
      label: "Total Stores",
      value: totalStores,
      grow: calculateGrowth(storesThisWeek, storesLastWeek),
      icon: <Store size={20} />,
      color: "blue",
    },
    {
      label: "Store Owners",
      value: activeUsers,
      grow: calculateGrowth(ownersThisWeek, ownersLastWeek),
      icon: <Users size={20} />,
      color: "indigo",
    },
    {
      label: "System Revenue",
      value: "₦42,000",
      grow: "+12.5%", // Example static growth
      icon: <DollarSign size={20} />,
      color: "emerald",
    },
    {
      label: "Server Health",
      value: "99.9%",
      grow: "Stable",
      icon: <Activity size={20} />,
      color: "rose",
    },
  ];

  return (
    <SuperAdminLayout>
      <Box className="hide-scrollbar"  sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 4, gap: 2 }}>
          <Box>
            <Typography level="h2" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              System Overview
            </Typography>
            <Typography level="body-md" sx={{ color: "text.tertiary" }}>
              Real-time monitoring of the Layemart ecosystem.
            </Typography>
          </Box>
          <Button
            variant="solid"
            startDecorator={<ShieldCheck size={18} />}
            sx={{ bgcolor: "#0f172a", borderRadius: "12px", "&:hover": { bgcolor: "#1e293b" } }}
          >
            Security Audit
          </Button>
        </Box>

        {error && (
          <Sheet color="danger" variant="soft" sx={{ p: 2, mb: 3, borderRadius: "lg", display: 'flex', alignItems: 'center', gap: 2 }}>
            <AlertCircle size={20} />
            <Typography fontWeight={700}>{error}</Typography>
          </Sheet>
        )}

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {loadingStores || loadingOwners ? 
            Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} xs={12} sm={6} md={3}>
                <Sheet sx={{ p: 2.5, borderRadius: "20px", border: '1px solid #e2e8f0' }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" level="h3" width="40%" />
                </Sheet>
              </Grid>
            )) : 
            stats.map((stat, i) => (
              <Grid key={i} xs={12} sm={6} md={3}>
                <Sheet
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: "24px", bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '12px', bgcolor: `${stat.color}.50`, color: `${stat.color}.600` }}>
                      {stat.icon}
                    </Box>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={stat.grow?.includes('-') ? "danger" : "success"}
                      startDecorator={stat.grow?.includes('-') ? <TrendingDown size={14}/> : <TrendingUp size={14}/>}
                      sx={{ fontWeight: 700 }}
                    >
                      {stat.grow}
                    </Chip>
                  </Box>
                  <Typography level="body-sm" sx={{ color: "text.tertiary", fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography level="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Sheet>
              </Grid>
            ))
          }
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Stores Table */}
          <Grid xs={12} md={8}>
            <Sheet sx={{ p: 3, borderRadius: "24px", border: '1px solid #e2e8f0', bgcolor: 'white' }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 3 }}>
                <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                  Newly Launched Stores
                </Typography>
                <Button variant="plain" size="sm" endDecorator={<ArrowRight size={16} />} sx={{ fontWeight: 600 }}>
                  View All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loadingStores ? (
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 'lg' }} />
                ) : recentStores.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Store className="w-25 mx-auto" size={40} style={{ opacity: 0.2, textAlign: "center", marginBottom: '8px' }} />
                    <Typography color="neutral">No stores found</Typography>
                  </Box>
                ) : (
                  recentStores.map((store) => (
                    <Box
                      key={store._id}
                      sx={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        p: 1.5, borderRadius: '12px', transition: '0.2s',
                        '&:hover': { bgcolor: '#f8fafc' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box className="capitalize!" sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {store?.name?.charAt(0) || "S"}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{store.name}</Typography>
                          <Typography sx={{ fontSize: '12px', color: "text.tertiary" }}>
                            {store.owner?.email || 'No email attached'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        variant="soft"
                        size="sm"
                        color={store.status === "ACTIVE" ? "success" : "neutral"}
                        sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}
                      >
                        {store.status}
                      </Chip>
                    </Box>
                  ))
                )}
              </Box>
            </Sheet>
          </Grid>

          {/* System Alerts */}
          <Grid xs={12} md={4}>
            <Sheet sx={{ p: 3, borderRadius: "24px", border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
              <Typography level="title-lg" sx={{ fontWeight: 700, mb: 3 }}>
                Critical Alerts
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ color: 'rose.500', mt: 0.5 }}><AlertCircle size={20} /></Box>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 700 }}>Security Protocol</Typography>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                      Monitor subdomain collisions & active store abuse.
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ opacity: 0.5 }} />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ color: 'blue.500', mt: 0.5 }}><Globe size={20} /></Box>
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: 700 }}>Regional Expansion</Typography>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                      24% growth detected in West African traffic this month.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Sheet>
          </Grid>
        </Grid>
      </Box>
    </SuperAdminLayout>
  );
}