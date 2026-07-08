import React, { useState, useEffect } from "react";
import {
  TicketPercent,
  Users,
  PlusCircle,
  Info,
  Trash2,
  Loader2,
  X,
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
  IconButton,
} from "@mui/joy";
import { toast } from "react-toastify";
import SuperAdminLayout from "./layout";

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [usageDetails, setUsageDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [open, setOpen] = useState(false);
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
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code: result });
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coupon/`);
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchUsageDetails = async (coupon) => {
    setOpen(true);
    setSelectedCoupon(coupon);
    setLoadingDetails(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coupon/usage/${coupon.code}`);
      const data = await res.json();
      if (data.success) {
        setUsageDetails(data.users);
      }
    } catch (err) {
      toast.error("Could not load usage data");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Coupon created successfully");
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coupon/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Coupon deleted successfully");
        setCoupons(coupons.filter((c) => c._id !== id));
      } else {
        toast.error(data.message || "Failed to delete coupon");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setDeletingId(null);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    setSelectedCoupon(null);
    setUsageDetails([]);
  };

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              p: 1.25,
              bgcolor: "#eef2ff",
              borderRadius: "8px",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TicketPercent size={20} />
          </Box>
          <Box>
            <Typography level="h3" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Coupons
            </Typography>
            <Typography level="body-sm" sx={{ color: "#64748b" }}>
              Create and track discount offers
            </Typography>
          </Box>
        </Box>

        {/* Create coupon form */}
        <Sheet
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "#e2e8f0", bgcolor: "white", p: 2.5, mb: 3 }}
        >
          <Typography level="title-sm" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1, fontWeight: 700, color: "#0f172a" }}>
            <PlusCircle size={16} /> New promotion
          </Typography>
          <Divider sx={{ mb: 2.5 }} />

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
                <FormLabel sx={{ fontWeight: 600, color: "#475569" }}>Coupon code</FormLabel>
                <Input
                  placeholder="e.g. AB1234"
                  slotProps={{ input: { style: { textTransform: "uppercase" }, maxLength: 6 } }}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  sx={{ borderRadius: "8px" }}
                  endDecorator={
                    <Button
                      variant="plain"
                      color="neutral"
                      size="sm"
                      onClick={generateRandomCode}
                      sx={{ px: 1, fontWeight: 600, textDecoration: "underline" }}
                    >
                      Auto-gen
                    </Button>
                  }
                />
              </FormControl>

              <FormControl required>
                <FormLabel sx={{ fontWeight: 600, color: "#475569" }}>Discount (%)</FormLabel>
                <Input
                  type="number"
                  placeholder="50"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  sx={{ borderRadius: "8px" }}
                />
              </FormControl>

              <FormControl required>
                <FormLabel sx={{ fontWeight: 600, color: "#475569" }}>Usage limit</FormLabel>
                <Input
                  type="number"
                  placeholder="60"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  sx={{ borderRadius: "8px" }}
                />
              </FormControl>

              <Button
                type="submit"
                loading={loading}
                variant="solid"
                sx={{ borderRadius: "8px", height: "36px", fontWeight: 600, bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}
              >
                Create coupon
              </Button>
            </Box>
          </form>
        </Sheet>

        {/* Coupons table */}
        <Typography level="title-sm" sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1, fontWeight: 700, color: "#0f172a" }}>
          <Users size={16} /> Existing coupons
        </Typography>

        <Sheet
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "#e2e8f0",
            bgcolor: "white",
            overflowX: "auto",
            width: "100%",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 10, bgcolor: "#e2e8f0" },
          }}
        >
          <Table
            sx={{
              "& tr > *": { p: 2 },
              minWidth: { xs: 650, md: "100%" },
              "--TableCell-height": "40px",
              "--TableHeader-height": "44px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ width: "25%", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Code</th>
                <th style={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Value</th>
                <th style={{ width: "25%", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Usage</th>
                <th style={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Status</th>
                <th style={{ width: "20%", textAlign: "right", fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td>
                      <Typography level="title-sm" sx={{ color: "#0f172a", fontWeight: 700, fontFamily: "monospace" }}>
                        {c.code}
                      </Typography>
                    </td>
                    <td>
                      <Chip variant="soft" color="success" size="sm" sx={{ fontWeight: 600, borderRadius: "6px" }}>
                        {c.discountPercent}% off
                      </Chip>
                    </td>
                    <td>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Typography level="body-sm" sx={{ fontWeight: 700, color: "#0f172a" }}>
                          {c.usedCount}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "#94a3b8" }}>
                          / {c.usageLimit}
                        </Typography>
                      </Box>
                      <Box sx={{ height: 4, width: "60px", bgcolor: "#f1f5f9", borderRadius: "4px", mt: 0.5, overflow: "hidden" }}>
                        <Box
                          sx={{
                            height: "100%",
                            width: `${Math.min((c.usedCount / c.usageLimit) * 100, 100)}%`,
                            bgcolor: "#4f46e5",
                          }}
                        />
                      </Box>
                    </td>
                    <td>
                      <Chip
                        variant="soft"
                        color={c.isActive ? "success" : "danger"}
                        size="sm"
                        sx={{ borderRadius: "6px", fontSize: "10px", fontWeight: 700 }}
                      >
                        {c.isActive ? "Active" : "Expired"}
                      </Chip>
                    </td>
                    <td>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Usage analytics">
                          <IconButton onClick={() => fetchUsageDetails(c)} size="sm" variant="plain" color="neutral">
                            <Info size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            disabled={deletingId === c._id}
                            onClick={() => handleDelete(c._id)}
                          >
                            {deletingId === c._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "48px" }}>
                    <Typography level="body-sm" sx={{ color: "#94a3b8" }}>
                      No coupons yet — create one above.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>

        {/* Usage drawer */}
        {open && (
          <Box
            sx={{ position: "fixed", inset: 0, bgcolor: "rgba(15,23,42,0.4)", zIndex: 1200, display: "flex", justifyContent: "flex-end" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeDrawer(); }}
          >
            <Sheet sx={{ width: { xs: "100%", sm: 400 }, height: "100%", p: 3, overflowY: "auto", borderLeft: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Typography level="title-md" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Usage: {selectedCoupon?.code}
                </Typography>
                <IconButton variant="plain" color="neutral" size="sm" onClick={closeDrawer}>
                  <X size={16} />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {loadingDetails ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                  <Loader2 className="animate-spin" color="#94a3b8" />
                </Box>
              ) : usageDetails.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {usageDetails.map((user) => (
                    <Box
                      key={user._id}
                      sx={{ display: "flex", justifyContent: "space-between", py: 1.25, borderBottom: "1px solid #f1f5f9" }}
                    >
                      <Typography level="body-sm" sx={{ color: "#0f172a" }} noWrap>
                        {user.email}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: "#94a3b8", flexShrink: 0, ml: 1 }}>
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography level="body-sm" sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
                  No users have redeemed this coupon yet.
                </Typography>
              )}
            </Sheet>
          </Box>
        )}
      </Box>
    </SuperAdminLayout>
  );
}; 

export default CouponPage;