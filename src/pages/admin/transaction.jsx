import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Sheet,
  Chip,
  Table,
  Input,
  Card,
  Grid,
  Button,
} from "@mui/joy";
import {
  Search,
  CreditCard,
  PieChart,
  ArrowDownCircle,
  ArrowUpRight,
  Filter,
  Percent,
} from "lucide-react";
import { useAdminStore } from "../../../services/adminService";
import SuperAdminLayout from "./layout";

const StatWidget = ({ title, value, subtext, icon: Icon, color, percentage, trend = "up" }) => (
  <Card
    variant="outlined"
    sx={{
      bgcolor: "white",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      p: 2.5,
      flex: 1,
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <Box
        sx={{
          p: 1.25,
          borderRadius: "8px",
          bgcolor: `${color}.50`,
          color: `${color}.600`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} />
      </Box>
      {percentage !== undefined && (
        <Chip
          size="sm"
          variant="soft"
          color={trend === "up" ? "success" : "neutral"}
          startDecorator={trend === "up" ? <ArrowUpRight size={12} /> : <Percent size={12} />}
          sx={{ borderRadius: "6px", fontWeight: 600 }}
        >
          {percentage}%
        </Chip>
      )}
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography
        level="body-xs"
        sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", color: "#64748b" }}
      >
        {title}
      </Typography>
      <Typography level="h4" sx={{ fontWeight: 700, mt: 0.5, color: "#0f172a" }}>
        {value}
      </Typography>
      <Typography level="body-xs" sx={{ color: "#94a3b8", mt: 0.5 }}>
        {subtext}
      </Typography>
    </Box>
  </Card>
);

export default function TransactionsPage() {
  const {
    loadingTransactions,
    transactions,
    fetchTransactions,
    platformWideStats,
    fetchPlatformWideStats,
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchPlatformWideStats();
  }, [fetchTransactions, fetchPlatformWideStats]);

  const filteredTransactions = useMemo(() => {
    const list = transactions || [];
    if (!searchTerm.trim()) return list;
    const search = searchTerm.toLowerCase();
    return list.filter(
      (tx) =>
        tx._id?.toLowerCase().includes(search) ||
        tx.reference?.toLowerCase().includes(search) ||
        tx.storeId?.name?.toLowerCase().includes(search) ||
        tx.ownerId?.email?.toLowerCase().includes(search),
    );
  }, [transactions, searchTerm]);

  const subscriptionPct =
    platformWideStats?.totalEarnings > 0
      ? ((platformWideStats.subscriptionRev / platformWideStats.totalEarnings) * 100).toFixed(1)
      : "0";

  const commissionPct =
    platformWideStats?.totalEarnings > 0
      ? ((platformWideStats.commissionRev / platformWideStats.totalEarnings) * 100).toFixed(1)
      : "0";

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1440px", mx: "auto" }}>
        <Box sx={{ mb: 3 }}>
          <Typography level="h3" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Financial ledger
          </Typography>
          <Typography level="body-sm" sx={{ color: "#64748b", mt: 0.25 }}>
            Subscription revenue and marketplace commissions
          </Typography>
        </Box>

        {/* Top stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} md={4}>
            <Card variant="solid" sx={{ borderRadius: "10px", p: 2.5, bgcolor: "#4f46e5", height: "100%" }}>
              <Typography level="body-xs" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Total platform earnings
              </Typography>
              <Typography level="h4" sx={{ color: "white", fontWeight: 700, mt: 0.75 }}>
                ₦{platformWideStats?.totalEarnings?.toLocaleString() || "0"}
              </Typography>
              <Chip
                size="sm"
                variant="soft"
                sx={{ mt: 1.5, bgcolor: "rgba(255,255,255,0.15)", color: "white", borderRadius: "6px", fontWeight: 600 }}
              >
                Subscription + commission
              </Chip>
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <StatWidget
              title="Subscription revenue"
              value={`₦${platformWideStats?.subscriptionRev?.toLocaleString() || "0"}`}
              subtext="Direct monthly/yearly plans"
              icon={CreditCard}
              color="success"
              percentage={subscriptionPct}
              trend="up"
            />
          </Grid>

          <Grid xs={12} md={4}>
            <StatWidget
              title="Order commissions"
              value={`₦${platformWideStats?.commissionRev?.toLocaleString() || "0"}`}
              subtext="Take-rate from vendor sales"
              icon={PieChart}
              color="warning"
              percentage={commissionPct}
              trend="up"
            />
          </Grid>
        </Grid>

        {/* Transactions table */}
        <Sheet variant="outlined" sx={{ borderRadius: "10px", borderColor: "#e2e8f0", overflow: "hidden" }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Input
              placeholder="Search reference or store"
              startDecorator={<Search size={16} color="#94a3b8" />}
              size="sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300, borderRadius: "8px" }}
            />
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<Filter size={15} />}
              sx={{ borderRadius: "8px", fontWeight: 600 }}
            >
              Filters
            </Button>
          </Box>

          <Box sx={{ overflowX: "auto", width: "100%" }}>
            <Table
              sx={{
                "--TableCell-paddingX": "16px",
                "--TableCell-paddingY": "12px",
                "--TableCell-headBackground": "#f8fafc",
                minWidth: 900,
              }}
            >
              <thead>
                <tr>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Date</th>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Store / merchant</th>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Type</th>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Plan / details</th>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Amount</th>
                  <th style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingTransactions ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px 0" }}>
                      <Typography level="body-sm" sx={{ color: "#94a3b8" }}>
                        Loading transactions…
                      </Typography>
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>
                        <Typography level="body-sm" sx={{ color: "#475569" }}>
                          {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </Typography>
                      </td>
                      <td>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }}>
                          {tx.storeId?.name}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "#94a3b8" }}>
                          {tx.ownerId?.email}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={tx.type === "SUBSCRIPTION" ? "primary" : "success"}
                          sx={{ borderRadius: "6px", fontWeight: 600, fontSize: "11px" }}
                        >
                          {tx.type}
                        </Chip>
                      </td>
                      <td>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }}>
                          {tx.plan}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "#94a3b8" }}>
                          {tx.billingCycle}
                        </Typography>
                      </td>
                      <td>
                        <Typography level="body-sm" sx={{ fontWeight: 700, color: "#0f172a" }}>
                          ₦{tx.amount.toLocaleString()}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="solid"
                          color="success"
                          startDecorator={<ArrowDownCircle size={13} />}
                          sx={{ borderRadius: "6px", fontWeight: 600, fontSize: "11px" }}
                        >
                          {tx.status}
                        </Chip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 8,
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "10px",
                            bgcolor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CreditCard size={22} color="#94a3b8" />
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography level="title-sm" sx={{ fontWeight: 700, color: "#0f172a" }}>
                            {searchTerm ? "No matching transactions" : "No transactions yet"}
                          </Typography>
                          <Typography level="body-sm" sx={{ color: "#94a3b8", maxWidth: 300, mx: "auto", mt: 0.5 }}>
                            {searchTerm
                              ? `Nothing matches "${searchTerm}".`
                              : "Vendor subscriptions and platform commissions will appear here."}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="neutral"
                          size="sm"
                          onClick={() => (searchTerm ? setSearchTerm("") : fetchTransactions())}
                          sx={{ mt: 0.5, borderRadius: "8px", fontWeight: 600 }}
                        >
                          {searchTerm ? "Clear search" : "Refresh"}
                        </Button>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Box>
        </Sheet>
      </Box>
    </SuperAdminLayout>
  );
}