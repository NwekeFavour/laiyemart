import React, { useEffect, useMemo } from "react";
import {
  Users,
  Store,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Sheet,
  Chip,
  Skeleton,
  Divider,
  Avatar,
} from "@mui/joy";
import { Stack } from "@mui/material";
import SuperAdminLayout from "./layout";
import { useAdminStore } from "../../../services/adminService";

export default function SuperAdminDashboard() {
  const {
    fetchStoreOwners,
    fetchAllStores,
    fetchPlatformOrders,
    fetchCategoryStats,
    categoryStats,
    orders,
    owners,
    platformStats,
    stores,
    loadingOwners,
    loading,
  } = useAdminStore();

  useEffect(() => {
    fetchStoreOwners();
    fetchAllStores();
    fetchPlatformOrders();
    fetchCategoryStats();
  }, [
    fetchStoreOwners,
    fetchAllStores,
    fetchPlatformOrders,
    fetchCategoryStats,
  ]);

  /* ------------------ Operational Metrics ------------------ */
  const stats = useMemo(() => {
    const totalStores = stores?.count || 0;
    const totalOwners = owners?.count || 0;

    return [
      {
        label: "Total Merchants",
        value: totalOwners,
        sub: "Registered Users",
        icon: <Users />,
        color: "#6366f1",
      },
      {
        label: "Active Storefronts",
        value: totalStores,
        sub: "Public Shops",
        icon: <Store />,
        color: "#0ea5e9",
      },
      {
        label: "Ecosystem GMV",
        value: `₦${(platformStats?.totalGMV || 0).toLocaleString()}`,
        sub: "Platform Wide",
        icon: <ShoppingBag />,
        color: "#10b981",
      },
      {
        label: "Pending Reviews",
        value: platformStats?.pendingReviews || 0,
        sub: "Needs Attention",
        icon: <Clock />,
        color: "#f43f5e",
      },
    ];
  }, [stores, owners, platformStats]);

  const recentStores = useMemo(
    () =>
      [...(stores?.data || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [stores],
  );

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: "1600px", mx: "auto" }}>
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Typography
              level="h2"
              sx={{
                fontWeight: 800,
                fontSize: "1.85rem",
                letterSpacing: "-0.02em",
              }}
            >
              Executive Summary
            </Typography>
            <Typography level="body-md" sx={{ color: "text.tertiary" }}>
              High-level performance and merchant acquisition data.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Package size={16} />}
          >
            Download Report
          </Button>
        </Box>

        {/* Core KPIs */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ borderRadius: "24px" }}
                  />
                </Grid>
              ))
            : stats.map((stat, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                  <Sheet
                    variant="plain"
                    sx={{
                      p: 3,
                      borderRadius: "24px",
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "neutral.100",
                      boxShadow: "sm",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "12px",
                          bgcolor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {React.cloneElement(stat.icon, { size: 22 })}
                      </Box>
                      <Chip
                        size="sm"
                        variant="soft"
                        color="success"
                        startDecorator={<TrendingUp size={12} />}
                      >
                        12%
                      </Chip>
                    </Box>
                    <Typography
                      level="body-xs"
                      sx={{
                        fontWeight: 700,
                        color: "neutral.500",
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography level="h2" sx={{ fontWeight: 800, my: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: "neutral.400" }}>
                      {stat.sub}
                    </Typography>
                  </Sheet>
                </Grid>
              ))}
        </Grid>

        <Grid container spacing={4}>
          {/* New Merchants List */}
          <Grid xs={12} md={7}>
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "24px",
                bgcolor: "white",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography level="title-md" sx={{ fontWeight: 700 }}>
                  Recently Joined Merchants
                </Typography>
                <Button
                  variant="plain"
                  size="sm"
                  endDecorator={<ArrowRight size={16} />}
                >
                  View Directory
                </Button>
              </Box>
              <Divider />
              <Box sx={{ p: 1 }}>
                {recentStores.length > 0 ? (
                  recentStores.map((store) => (
                    <Box
                      key={store._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "16px",
                        "&:hover": { bgcolor: "neutral.50" },
                      }}
                    >
                      <Avatar
                        color="primary"
                        variant="soft"
                        sx={{ borderRadius: "12px", mr: 2 }}
                      >
                        {store.name?.charAt(0) || "S"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                          {store.name}
                        </Typography>
                        <Typography level="body-xs">
                          Owner: {store.owner?.email || "N/A"}
                        </Typography>
                      </Box>
                      <Chip
                        size="sm"
                        color={
                          store.status === "ACTIVE" ? "success" : "neutral"
                        }
                        variant="outlined"
                      >
                        {store.status}
                      </Chip>
                    </Box>
                  ))
                ) : (
                  /* --- EMPTY STATE BLOCK --- */
                  <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: "neutral.50",
                        mb: 2,
                      }}
                    >
                      <Store size={32} color="#94a3b8" />
                    </Box>
                    <Typography level="title-sm" sx={{ mb: 0.5 }}>
                      No stores found
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: "text.tertiary",
                        maxWidth: "200px",
                        mx: "auto",
                      }}
                    >
                      New merchant deployments will appear here once they
                      onboard.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Sheet>
          </Grid>

          {/* Business Insights Column */}
          <Grid xs={12} md={5}>
            <Stack spacing={3}>
              {/* Revenue Snapshot */}
              <Sheet
                sx={{
                  p: 3,
                  borderRadius: "24px",
                  bgcolor: "#0f172a",
                  color: "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700 }}>
                    Subscription Revenue
                  </Typography>
                  <CreditCard color="#94a3b8" />
                </Box>
                <Typography level="h1" sx={{ color: "white", fontWeight: 800 }}>
                  ₦840,000
                </Typography>
                <Typography
                  level="body-xs"
                  sx={{ color: "neutral.400", mb: 3 }}
                >
                  Total commission & fees collected
                </Typography>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography level="body-xs" sx={{ color: "white" }}>
                      Pro Plan (Active)
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      42 Stores
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "65%",
                        height: "100%",
                        bgcolor: "#10b981",
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Stack>
              </Sheet>

              {/* Actionable Tasks */}
              <Stack spacing={3}>
                {categoryStats.map((item, index) => {
                  // Calculate percentage based on total GMV
                  const percentage = (
                    (item.totalSales / platformStats.totalGMV) *
                    100
                  ).toFixed(0);

                  return (
                    <Box key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                          {item._id || "Uncategorized"}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          {percentage}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          borderRadius: 10,
                          bgcolor: "neutral.100",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            height: "100%",
                            bgcolor: "#3b82f6",
                            borderRadius: 10,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </SuperAdminLayout>
  );
}
