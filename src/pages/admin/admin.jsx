import React, { useEffect, useMemo } from "react";
import {
  Users,
  Store,
  ArrowRight,
  TrendingUp,
  Clock,
  Package,
  ShoppingBag,
  CreditCard,
  TrendingDown,
  AlertTriangle, XCircle, PackageX, MessageSquareWarning
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
  Stack,
} from "@mui/joy";
import SuperAdminLayout from "./layout";
import { useAdminStore } from "../../../services/adminService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


export default function SuperAdminDashboard() {
  const {
    fetchStoreOwners,
    fetchAllStores,
    fetchPlatformOrders,
    fetchCategoryStats,
    categoryStats,
    owners,
    fetchEarningsBreakdown,
    fetchPlatformEarnings,
    subscriptionStats,
    platformStats,
     healthSummary, webhookHistogram, fetchHealthSummary, fetchWebhookHistogram,
    stores,
    loading,
  } = useAdminStore();
  const navigate = useNavigate();
  const [generatingReport, setGeneratingReport] = React.useState(false);

  useEffect(() => {
    fetchStoreOwners();
    fetchAllStores();
    fetchEarningsBreakdown();
    fetchPlatformEarnings();
    fetchPlatformOrders();
    fetchCategoryStats();
    fetchHealthSummary();
    fetchWebhookHistogram();
  }, [
    fetchStoreOwners,
    fetchAllStores,
    fetchPlatformEarnings,
    fetchEarningsBreakdown,
    fetchPlatformOrders,
    fetchCategoryStats,
    fetchHealthSummary,
    fetchWebhookHistogram
  ]);

  const stats = useMemo(() => {
    const totalStores = stores?.count || 0;
    const totalOwners = owners?.count || 0;

    return [
      {
        label: "Total merchants",
        value: totalOwners,
        sub: "Registered users",
        icon: <Users />,
        color: "#6366f1",
        trend: platformStats?.ownersTrend || 0,
      },
      {
        label: "Active storefronts",
        value: totalStores,
        sub: "Public shops",
        icon: <Store />,
        color: "#0ea5e9",
        trend: platformStats?.storesTrend || 0,
      },
      {
        label: "Ecosystem GMV",
        value: `₦${(platformStats?.totalGMV || 0).toLocaleString()}`,
        sub: "Platform wide",
        icon: <ShoppingBag />,
        color: "#10b981",
        trend: platformStats?.gmvTrend || 0,
      },
      {
        label: "Pending reviews",
        value: platformStats?.pendingReviews || 0,
        sub: "Needs attention",
        icon: <Clock />,
        color: "#f43f5e",
        trend: platformStats?.reviewsTrend || 0,
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

  const totalGMV = platformStats?.totalGMV || 0;

  const handleDownloadReport = async () => {
    if (loading) {
      toast.error("Data is still loading — try again in a moment");
      return;
    }

    setGeneratingReport(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const generatedAt = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor("#0f172a");
      doc.text("Layemart Platform Report", margin, 50);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#64748b");
      doc.text(`Generated ${generatedAt}`, margin, 68);

      doc.setDrawColor("#e2e8f0");
      doc.line(margin, 82, pageWidth - margin, 82);

      let cursorY = 100;

      // KPI section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor("#0f172a");
      doc.text("Key metrics", margin, cursorY);

      autoTable(doc, {
        startY: cursorY + 10,
        margin: { left: margin, right: margin },
        head: [["Metric", "Value", "Trend"]],
        body: stats.map((s) => [s.label, String(s.value), `${s.trend >= 0 ? "+" : ""}${s.trend}%`]),
        theme: "grid",
        headStyles: { fillColor: "#0f172a", textColor: "#ffffff", fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: "#334155" },
        styles: { cellPadding: 6 },
      });
      cursorY = doc.lastAutoTable.finalY + 30;

      // Revenue section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor("#0f172a");
      doc.text("Subscription revenue", margin, cursorY);

      autoTable(doc, {
        startY: cursorY + 10,
        margin: { left: margin, right: margin },
        head: [["Metric", "Value"]],
        body: [
          ["Total earnings", `NGN ${(subscriptionStats?.totalEarnings || 0).toLocaleString()}`],
          ["Active stores on Pro plan", String(stores?.count || 0)],
        ],
        theme: "grid",
        headStyles: { fillColor: "#0f172a", textColor: "#ffffff", fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: "#334155" },
        styles: { cellPadding: 6 },
      });
      cursorY = doc.lastAutoTable.finalY + 30;

      // Category breakdown
      if (categoryStats?.length > 0) {
        if (cursorY > 650) {
          doc.addPage();
          cursorY = 50;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor("#0f172a");
        doc.text("GMV by category", margin, cursorY);

        autoTable(doc, {
          startY: cursorY + 10,
          margin: { left: margin, right: margin },
          head: [["Category", "Total sales", "Share of GMV"]],
          body: categoryStats.map((item) => [
            item._id || "Uncategorized",
            `NGN ${(item.totalSales || 0).toLocaleString()}`,
            `${totalGMV > 0 ? Math.round((item.totalSales / totalGMV) * 100) : 0}%`,
          ]),
          theme: "grid",
          headStyles: { fillColor: "#0f172a", textColor: "#ffffff", fontSize: 9 },
          bodyStyles: { fontSize: 9, textColor: "#334155" },
          styles: { cellPadding: 6 },
        });
        cursorY = doc.lastAutoTable.finalY + 30;
      }

      // Recent merchants
      if (recentStores.length > 0) {
        if (cursorY > 650) {
          doc.addPage();
          cursorY = 50;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor("#0f172a");
        doc.text("Recently joined merchants", margin, cursorY);

        autoTable(doc, {
          startY: cursorY + 10,
          margin: { left: margin, right: margin },
          head: [["Store", "Owner email", "Status", "Joined"]],
          body: recentStores.map((store) => [
            store.name || "",
            store.owner?.email || "N/A",
            store.status || "",
            store.createdAt
              ? new Date(store.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "",
          ]),
          theme: "grid",
          headStyles: { fillColor: "#0f172a", textColor: "#ffffff", fontSize: 9 },
          bodyStyles: { fontSize: 9, textColor: "#334155" },
          styles: { cellPadding: 6 },
        });
      }

      // Footer page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#94a3b8");
        doc.text(`Layemart — Page ${i} of ${pageCount}`, margin, doc.internal.pageSize.getHeight() - 20);
      }

      const dateStamp = new Date().toISOString().split("T")[0];
      doc.save(`layemart-platform-report-${dateStamp}.pdf`);

      toast.success("Report downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1440px", mx: "auto" }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography level="h3" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Overview
            </Typography>
            <Typography level="body-sm" sx={{ color: "#64748b", mt: 0.25 }}>
              Platform performance and merchant activity
            </Typography>
          </Box>
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            loading={generatingReport}
            disabled={loading}
            onClick={handleDownloadReport}
            startDecorator={!generatingReport ? <Package size={15} /> : null}
            sx={{ borderRadius: "8px", fontWeight: 600 }}
          >
            Download report
          </Button>
        </Box>

        {/* KPI row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} xs={12} sm={6} md={3}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "10px" }} />
                </Grid>
              ))
            : stats.map((stat, i) => {
                const isPositive = stat.trend >= 0;
                return (
                  <Grid key={i} xs={12} sm={6} md={3}>
                    <Sheet
                      variant="outlined"
                      sx={{ p: 2.5, borderRadius: "10px", bgcolor: "white", borderColor: "#e2e8f0" }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.25,
                            borderRadius: "8px",
                            bgcolor: `${stat.color}15`,
                            color: stat.color,
                            display: "flex",
                          }}
                        >
                          {React.cloneElement(stat.icon, { size: 18 })}
                        </Box>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={isPositive ? "success" : "danger"}
                          startDecorator={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          sx={{ borderRadius: "6px", fontWeight: 600 }}
                        >
                          {isPositive ? "+" : ""}
                          {stat.trend}%
                        </Chip>
                      </Box>

                      <Typography
                        level="body-xs"
                        sx={{ fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography level="h4" sx={{ fontWeight: 700, color: "#0f172a", my: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: "#94a3b8" }}>
                        {stat.sub}
                      </Typography>
                    </Sheet>
                  </Grid>
                );
              })}
        </Grid>


        {/* Platform health */}
<Sheet variant="outlined" sx={{ borderRadius: "10px", borderColor: "#e2e8f0", bgcolor: "white", p: 2.5, mb: 3 }}>
  <Typography level="title-sm" sx={{ fontWeight: 700, color: "#0f172a", mb: 2 }}>
    Platform health
  </Typography>

  <Grid container spacing={2} sx={{ mb: 3 }}>
    {[
      {
        label: "Webhook failures (24h)",
        value: healthSummary?.webhookFailures24h ?? "—",
        icon: <XCircle size={16} />,
        color: "#f43f5e",
        onClick: () => navigate("/admin/webhooks"),
      },
      {
        label: "Stores w/ errors (24h)",
        value: healthSummary?.errorRateStores?.length ?? "—",
        icon: <AlertTriangle size={16} />,
        color: "#f97316",
      },
      {
        label: "Stale stores (30d)",
        value: healthSummary?.staleStores ?? "—",
        icon: <Store size={16} />,
        color: "#94a3b8",
      },
      {
        label: "Delivery zone gaps",
        value: healthSummary?.deliveryGaps ?? "—",
        icon: <PackageX size={16} />,
        color: "#eab308",
      },
      {
        label: "Feedback backlog",
        value: healthSummary?.feedbackBacklog ?? "—",
        icon: <MessageSquareWarning size={16} />,
        color: "#6366f1",
      },
    ].map((item, i) => (
      <Grid key={i} xs={6} sm={4} md={2.4}>
        <Box
          onClick={item.onClick}
          sx={{
            p: 1.75,
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            cursor: item.onClick ? "pointer" : "default",
            "&:hover": item.onClick ? { bgcolor: "#f8fafc" } : {},
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75, color: item.color }}>
            {item.icon}
          </Box>
          <Typography level="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
            {item.value}
          </Typography>
          <Typography level="body-xs" sx={{ color: "#64748b" }}>
            {item.label}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>

  {/* Responsive histogram — webhook failures, last 14 days */}
  <Typography level="body-xs" sx={{ fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", mb: 1 }}>
    Webhook failures — last 14 days
  </Typography>
  <Box sx={{ width: "100%", height: { xs: 160, sm: 200 } }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={webhookHistogram || []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
        <Tooltip
          labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          formatter={(value) => [value, "Failures"]}
        />
        <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  </Box>
</Sheet>

        <Grid container spacing={3}>
          {/* Recent mercha nts */}
          <Grid xs={12} md={7}>
            <Sheet variant="outlined" sx={{ borderRadius: "10px", borderColor: "#e2e8f0", bgcolor: "white", overflow: "hidden" }}>
              <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography level="title-sm" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Recently joined merchants
                </Typography>
                <Button
                  onClick={() => navigate("/admin/stores")}
                  variant="plain"
                  size="sm"
                  endDecorator={<ArrowRight size={15} />}
                  sx={{ fontWeight: 600 }}
                >
                  View directory
                </Button>
              </Box>
              <Divider />
              <Box sx={{ p: 1 }}>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", p: 1.5, gap: 2 }}>
                      <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: "8px" }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </Box>
                  ))
                ) : recentStores.length > 0 ? (
                  recentStores.map((store) => (
                    <Box
                      key={store._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        borderRadius: "8px",
                        "&:hover": { bgcolor: "#f8fafc" },
                      }}
                    >
                      <Avatar variant="outlined" sx={{ borderRadius: "8px", mr: 1.5, width: 36, height: 36, fontWeight: 700 }}>
                        {store.name?.charAt(0) || "S"}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }} noWrap>
                          {store.name}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "#94a3b8" }} noWrap>
                          {store.owner?.email || "N/A"}
                        </Typography>
                      </Box>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={store.status === "ACTIVE" ? "success" : "neutral"}
                        sx={{ borderRadius: "6px", fontWeight: 600 }}
                      >
                        {store.status}
                      </Chip>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        mb: 1.5,
                      }}
                    >
                      <Store size={24} color="#94a3b8" />
                    </Box>
                    <Typography level="title-sm" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                      No stores yet
                    </Typography>
                    <Typography level="body-xs" sx={{ color: "#94a3b8", maxWidth: 220, mx: "auto" }}>
                      New merchant signups appear here once they onboard.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Sheet>
          </Grid>

          {/* Insights column */}
          <Grid xs={12} md={5}>
            <Stack spacing={2}>
              <Sheet sx={{ p: 2.5, borderRadius: "10px", bgcolor: "#0f172a", color: "white" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography level="body-sm" sx={{ color: "white", fontWeight: 600 }}>
                    Subscription revenue
                  </Typography>
                  <CreditCard size={18} color="#94a3b8" />
                </Box>
                <Typography level="h4" sx={{ color: "white", fontWeight: 700 }}>
                  ₦{(subscriptionStats?.totalEarnings || 0).toLocaleString()}
                </Typography>
                <Typography level="body-xs" sx={{ color: "#94a3b8", mb: 2.5 }}>
                  Total earnings and fees collected
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography level="body-xs" sx={{ color: "white" }}>
                    Pro plan (active)
                  </Typography>
                  <Typography level="body-xs" sx={{ color: "white", fontWeight: 700 }}>
                    {stores?.count || 0} stores
                  </Typography>
                </Box>
              </Sheet>

              <Sheet variant="outlined" sx={{ p: 2.5, borderRadius: "10px", borderColor: "#e2e8f0", bgcolor: "white" }}>
                <Typography level="body-xs" sx={{ fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em", mb: 2 }}>
                  GMV by category
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} variant="rectangular" height={20} sx={{ borderRadius: "6px" }} />
                    ))}
                  </Stack>
                ) : categoryStats?.length > 0 ? (
                  <Stack spacing={2}>
                    {categoryStats.map((item, index) => {
                      const percentage = totalGMV > 0 ? Math.round((item.totalSales / totalGMV) * 100) : 0;
                      return (
                        <Box key={index}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 600, color: "#0f172a" }}>
                              {item._id || "Uncategorized"}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#64748b" }}>
                              {percentage}%
                            </Typography>
                          </Box>
                          <Box sx={{ height: 6, borderRadius: "6px", bgcolor: "#f1f5f9" }}>
                            <Box sx={{ width: `${percentage}%`, height: "100%", bgcolor: "#3b82f6", borderRadius: "6px" }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography level="body-xs" sx={{ color: "#94a3b8" }}>
                    No category sales recorded yet.
                  </Typography>
                )}
              </Sheet>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </SuperAdminLayout>
  );
}