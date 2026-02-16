import React, { useState, useEffect } from "react";
import {
  TicketPercent,
  Users,
  PlusCircle,
  Info,
  Trash2,
  Loader2,
} from "lucide-react";
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
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupon/${id}`,
        { method: "DELETE" },
      );
      const data = await res.json();

      if (data.success) {
        toast.success("Coupon deleted successfully");
        // Update local state to remove the deleted coupon
        setCoupons(coupons.filter((c) => c._id !== id));
      } else {
        toast.error(data.message || "Failed to delete coupon");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setDeletingId(null); // Stop loading
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
            bgcolor: "white",
            boxShadow: "sm",
            // 1. Added horizontal scroll for mobile
            overflowX: "auto",
            width: "100%",
            // Custom scrollbar styling to stay minimalist
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 10,
              bgcolor: "rgba(45, 42, 112, 0.1)", // Subtle Indigo scrollbar
            },
          }}
        >
          <Table
            className="bg-white!"
            sx={{
              "& tr > *": { p: 2 },
              // 2. Ensures the table doesn't collapse too much on small screens
              minWidth: { xs: 650, md: "100%" },
              "--TableCell-height": "40px",
              "--TableHeader-height": "50px",
            }}
          >
            <thead>
              <tr className="bg-slate-50/50">
                <th style={{ width: "25%" }}>Coupon Code</th>
                <th style={{ width: "15%" }}>Value</th>
                <th style={{ width: "25%" }}>Usage</th>
                <th style={{ width: "15%" }}>Status</th>
                <th style={{ width: "20%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white!">
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <Typography
                        level="title-sm"
                        sx={{ color: "#2D2A70", fontWeight: 700 }} // Your Royal Indigo
                      >
                        {c.code}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        color="success"
                        size="sm"
                        sx={{ fontWeight: 600 }}
                      >
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
                      {/* Added a small progress bar for better UX */}
                      <Box
                        sx={{
                          height: 4,
                          width: "60px",
                          bgcolor: "neutral.softBg",
                          borderRadius: "xs",
                          mt: 0.5,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${Math.min((c.usedCount / c.usageLimit) * 100, 100)}%`,
                            bgcolor: "#2D2A70",
                          }}
                        />
                      </Box>
                    </td>
                    <td>
                      <Chip
                        variant="solid"
                        color={c.isActive ? "success" : "danger"}
                        size="sm"
                        sx={{
                          borderRadius: "xs",
                          fontSize: "10px",
                          fontWeight: 800,
                          px: 1,
                        }}
                      >
                        {c.isActive ? "ACTIVE" : "EXPIRED"}
                      </Chip>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Usage Analytics" variant="soft">
                          <IconButton size="sm" variant="plain" color="neutral">
                            <Info size={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete" variant="soft" color="danger">
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            disabled={deletingId === c._id}
                            onClick={() => handleDelete(c._id)}
                          >
                            {deletingId === c._id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "60px" }}
                  >
                    <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                      No active coupons found.
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
