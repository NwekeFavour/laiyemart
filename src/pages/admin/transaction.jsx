import React, { useEffect, useState } from "react";
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
  Filter,
  Percent,
} from "lucide-react";
import { useAdminStore } from "../../../services/adminService";
import SuperAdminLayout from "./layout";

const StatWidget = ({
  title,
  value,
  subtext,
  icon: Icon,
  color,
  percentage,
  trend = 12,
}) => (
  <Card
    variant="soft"
    sx={{
      bgcolor: "white",
      borderRadius: "24px",
      border: "1px solid #f1f5f9",
      p: 2.5,
      flex: 1,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: "14px",
          bgcolor: `${color}.50`,
          color: `${color}.600`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} />
      </Box>
      {percentage !== undefined && (
        <Chip
          size="sm"
          variant="soft"
          color={trend === "up" ? "success" : "neutral"}
          startDecorator={
            trend === "up" ? <ArrowUpRight size={12} /> : <Percent size={12} />
          }
        >
          {percentage}%
        </Chip>
      )}
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography
        level="body-xs"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          tracking: "1px",
          color: "text.tertiary",
        }}
      >
        {title}
      </Typography>
      <Typography level="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography level="body-xs" sx={{ color: "text.tertiary", mt: 0.5 }}>
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

//   console.log(transactions, platformWideStats);
  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1600px", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography level="h2" sx={{ fontWeight: 900 }}>
            Financial Ledger
          </Typography>
          <Typography level="body-md" sx={{ color: "text.tertiary" }}>
            Tracking subscription revenue and marketplace commissions.
          </Typography>
        </Box>

        {/* --- Top Stats --- */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid xs={12} md={4}>
            <Card
              variant="solid"
              color="primary"
              sx={{ borderRadius: "24px", p: 3, bgcolor: "#4f46e5" }}
            >
              <Typography
                level="title-sm"
                sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}
              >
                TOTAL PLATFORM EARNINGS
              </Typography>
              <Typography
                level="h1"
                sx={{ color: "white", fontWeight: 800, mt: 1 }}
              >
                ₦{platformWideStats?.totalEarnings?.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  Subscription + Commission
                </Chip>
              </Box>
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <StatWidget
              title="Subscription Rev"
              value={`₦${platformWideStats?.subscriptionRev?.toLocaleString()}`}
              subtext="Direct monthly/yearly plans"
              icon={CreditCard}
              color="success"
              percentage={
            platformWideStats?.totalEarnings > 0 
                ? ((platformWideStats.subscriptionRev / platformWideStats.totalEarnings) * 100).toFixed(1) 
                : "0"   
            }
            />
          </Grid>

          <Grid xs={12} md={4}>
            <StatWidget
              title="Order Commissions"
              value={`₦${platformWideStats?.commissionRev?.toLocaleString()}`}
              subtext="Take-rate from vendor sales"
              icon={PieChart}
              color="warning"
              percentage={
                platformWideStats?.totalEarnings > 0 
                    ? ((platformWideStats.commissionRev / platformWideStats.totalEarnings) * 100).toFixed(1) 
                    : "0"
                }
            />
          </Grid>
        </Grid>

        {/* --- Transactions Table --- */}
        <Sheet
          sx={{
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <Box
            className="flex! flex-wrap! space-y-3"
            sx={{
              p: 3,
              justifyContent: "space-between",
              bgcolor: "#f8fafc",
            }}
          >
            <Input
                className="w-full md:w-[350px]!"
              placeholder="Search reference or store..."
              startDecorator={<Search size={18} />}
              sx={{  borderRadius: "12px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                className="w-full md:w-[100px]!"
              variant="outlined"
              color="neutral"
              startDecorator={<Filter size={18} />}
            >
              Filters
            </Button>
          </Box>

<Box sx={{ overflowX: "auto", width: "100%" }}>
          <Table
            hoverRow
            sx={{
              "--TableCell-paddingX": "20px",
              "--TableCell-paddingY": "16px",
              minWidth: 900,
            }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Store / Merchant</th>
                <th>Type</th>
                <th>Plan / Details</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingTransactions ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <Typography level="body-md" sx={{ color: "text.tertiary" }}>
                      Loading transactions...
                    </Typography>
                  </td>
                </tr>
              ) :  transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Typography level="title-sm">
                        {tx.storeId?.name}
                      </Typography>
                      <Typography level="body-xs">
                        {tx.ownerId?.email}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        size="sm"
                        variant="soft"
                        color={
                          tx.type === "SUBSCRIPTION" ? "primary" : "success"
                        }
                      >
                        {tx.type}
                      </Chip>
                    </td>
                    <td>
                      <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                        {tx.plan}
                      </Typography>
                      <Typography level="body-xs">{tx.billingCycle}</Typography>
                    </td>
                    <td>
                      <Typography sx={{ fontWeight: 700 }}>
                        ₦{tx.amount.toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        size="sm"
                        variant="solid"
                        color="success"
                        startDecorator={<ArrowDownCircle size={14} />}
                      >
                        {tx.status}
                      </Chip>
                    </td>
                  </tr>
                ))
              )  :
               (
                <tr>
                  <td colSpan={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 10,
                        gap: 2,
                        bgcolor: "transparent",
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          bgcolor: "neutral.softBg",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <CreditCard size={32} color="#94a3b8" />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                          No transactions found
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{
                            color: "text.tertiary",
                            maxWidth: 300,
                            mx: "auto",
                            mt: 1,
                          }}
                        >
                          When vendors subscribe to plans or platform
                          commissions are processed, they will appear here.
                        </Typography>
                      </Box>
                      <Button
                        variant="soft"
                        color="primary"
                        size="sm"
                        onClick={() => fetchTransactions()}
                        sx={{ mt: 1, borderRadius: "10px" }}
                      >
                        Refresh Records
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
