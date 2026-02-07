import React, { useState, useEffect } from "react";
import { TicketPercent, Users, PlusCircle, Info } from "lucide-react";
import {
  Box,
  Typography,
  Button,
  Input,
  Sheet,
  Table,
  FormControl,
  FormLabel,
  Divider,
  Chip,
  Tooltip,
} from "@mui/joy";
import { toast } from "react-toastify";
import SuperAdminLayout from "./layout";
import { IconButton } from "@mui/material";

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    usageLimit: "",
  });

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    setFormData({ ...formData, code: result });
  };
  const fetchCoupons = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupon/`,
      );
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Coupon Created Successfully!");
        setFormData({ code: "", discountPercent: "", usageLimit: "" });
        fetchCoupons();
      } else {
        toast.error(data.message || "Error creating coupon");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box sx={{ p: 1, bgcolor: "primary.100", borderRadius: "lg" }}>
            <TicketPercent size={28} className="text-blue-600" />
          </Box>
          <Box>
            <Typography level="h2" sx={{ fontSize: "1.5rem", mb: 0.5 }}>
              Manage Coupons
            </Typography>
            <Typography level="body-sm">
              Create and track 50% discount offers for your first 60 users.
            </Typography>
          </Box>
        </Box>

        {/* Create Coupon Form Card */}
        <Sheet
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: "xl",
            bgcolor: "white",
            boxShadow: "sm",
            mb: 5,
          }}
        >
          <Typography
            level="title-md"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <PlusCircle size={18} /> New Promotion
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleCreate}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
                gap: 2,
                alignItems: "end",
              }}
            >
              <FormControl required>
                <FormLabel>Coupon Code (6 Digits)</FormLabel>
                <Input
                  placeholder="e.g. AB1234"
                  slotProps={{
                    input: {
                      style: { textTransform: "uppercase" },
                      maxLength: 6,
                    },
                  }}
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  // The magic button inside the input
                  endDecorator={
                    <Button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      onClick={generateRandomCode}
                      sx={{ px: 1 }}
                    >
                      Auto-Gen
                    </Button>
                  }
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Discount (%)</FormLabel>
                <Input
                  type="number"
                  placeholder="50"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Usage Limit</FormLabel>
                <Input
                  type="number"
                  placeholder="60"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                />
              </FormControl>

              <Button
                className="bg-slate-800/90!"
                type="submit"
                loading={loading}
                variant="solid"
                color="primary"
                sx={{ borderRadius: "md", height: "40px" }}
              >
                Create Coupon
              </Button>
            </Box>
          </form>
        </Sheet>

        {/* Table Section */}
        <Typography
          level="title-md"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Users size={18} /> Existing Coupons
        </Typography>

        <Sheet
          variant="outlined"
          sx={{
            borderRadius: "xl",
            overflow: "auto",
            bgcolor: "white",
            boxShadow: "sm",
          }}
        >
          <Table stripe="odd" hoverRow sx={{ "& tr > *": { p: 2 } }}>
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Coupon Code</th>
                <th>Value</th>
                <th>Usage (Claimed/Total)</th>
                <th>Status</th>
                <th style={{ width: "80px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <Typography level="title-sm" color="primary">
                        {c.code}
                      </Typography>
                    </td>
                    <td>
                      <Chip variant="soft" color="success" size="sm">
                        {c.discountPercent}% OFF
                      </Chip>
                    </td>
                    <td>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                          {c.usedCount}
                        </Typography>
                        <Typography
                          level="body-xs"
                          sx={{ color: "text.tertiary" }}
                        >
                          / {c.usageLimit}
                        </Typography>
                      </Box>
                    </td>
                    <td>
                      <Chip
                        variant="solid"
                        color={c.isActive ? "success" : "danger"}
                        size="sm"
                        sx={{ borderRadius: "xs" }}
                      >
                        {c.isActive ? "ACTIVE" : "EXPIRED"}
                      </Chip>
                    </td>
                    <td>
                      <Tooltip
                        title="View users who used this code"
                        variant="soft"
                      >
                        <IconButton size="sm" variant="plain" color="neutral">
                          <Info size={18} />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      No coupons created yet.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      </Box>
    </SuperAdminLayout>
  );
};

export default CouponPage;
