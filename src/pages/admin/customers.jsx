import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Button, Sheet, Avatar,
  Chip, IconButton, Input,
} from "@mui/joy";
import {
  Search, Filter, Users, Download,
  MoreHorizontal, UserCheck, X,
} from "lucide-react";
import { toast } from "react-toastify";
import SuperAdminLayout from "./layout";
import { useAdminStore } from "../../../services/adminService";
import { useAuthStore } from "../../store/useAuthStore";

const PLAN_STYLES = {
  professional: { bgcolor: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" },
  starter: { bgcolor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" },
  business: { bgcolor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" },
};

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
          <td style={{ padding: "14px 16px", textAlign: "center", borderRight: "1px solid #f1f5f9" }}>
            <Box className="animate-pulse bg-slate-200 h-4 w-4 mx-auto rounded" />
          </td>
          <td style={{ padding: "14px 16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box className="animate-pulse bg-slate-200 h-9 w-9 rounded-lg" />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box className="animate-pulse bg-slate-200 h-3.5 w-28 rounded" />
                <Box className="animate-pulse bg-slate-200 h-3 w-20 rounded" />
              </Box>
            </Box>
          </td>
          <td style={{ padding: "14px 16px" }}><Box className="animate-pulse bg-slate-200 h-5 w-16 rounded" /></td>
          <td style={{ padding: "14px 16px" }}><Box className="animate-pulse bg-slate-200 h-5 w-20 rounded" /></td>
          <td style={{ padding: "14px 16px" }}><Box className="animate-pulse bg-slate-200 h-5 w-16 rounded" /></td>
          <td style={{ padding: "14px 16px" }}><Box className="animate-pulse bg-slate-200 h-3.5 w-20 rounded" /></td>
          <td style={{ padding: "14px 16px" }}><Box className="animate-pulse bg-slate-200 h-7 w-7 mx-auto rounded" /></td>
        </tr>
      ))}
    </>
  );
}

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.25, borderBottom: "1px solid #f1f5f9" }}>
    <Typography level="body-sm" sx={{ color: "#64748b" }}>{label}</Typography>
    <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }}>{value || "N/A"}</Typography>
  </Box>
);

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspending, setSuspending] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { fetchStoreOwners, fetchAllStores, stores, loading } = useAdminStore();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchStoreOwners();
    fetchAllStores();
  }, [fetchStoreOwners, fetchAllStores]);

  const filteredCustomers = useMemo(() => {
    return (stores?.data || [])
      .filter((store) => {
        const search = searchTerm.toLowerCase();
        return (
          store.name?.toLowerCase().includes(search) ||
          store.email?.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [stores, searchTerm]);

  const handleSuspendToggle = async () => {
    setSuspending(true);
    try {
      const res = await fetch(`${API_URL}/api/stores/${selectedStore._id}/suspend`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: suspendReason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchAllStores();
        setSuspendModal(false);
        setDrawerOpen(false);
        setSuspendReason("");
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSuspending(false);
    }
  };

  const escapeCsvValue = (value) => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExport = () => {
    if (!filteredCustomers.length) {
      toast.error("No stores to export");
      return;
    }

    setExporting(true);
    try {
      const headers = ["Name", "Email", "Status", "Plan", "Customers", "Category", "Slug", "Paystack", "Joined"];

      const rows = filteredCustomers.map((store) => [
        store.name,
        store.email,
        store.status,
        store.plan || "Standard",
        store.totalCustomers || 0,
        store.storeType,
        store.slug,
        store.paystack?.verified ? "Verified" : "Unverified",
        store.createdAt
          ? new Date(store.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStamp = new Date().toISOString().split("T")[0];

      link.href = url;
      link.setAttribute("download", `layemart-stores-${dateStamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${filteredCustomers.length} store${filteredCustomers.length === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1440px", mx: "auto" }}>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography level="h3" sx={{ fontWeight: 700, color: "#0f172a" }}>Stores</Typography>
            <Typography level="body-sm" sx={{ color: "#64748b", mt: 0.25 }}>
              Manage storefronts across the Layemart platform
            </Typography>
          </Box>
          <Button
            size="sm"
            startDecorator={!exporting ? <Download size={15} /> : null}
            variant="outlined"
            color="neutral"
            loading={exporting}
            onClick={handleExport}
            sx={{ borderRadius: "8px", fontWeight: 600 }}
          >
            Export list
          </Button>
        </Box>

        {/* Table card */}
        <Sheet
          variant="outlined"
          sx={{ borderRadius: "10px", borderColor: "#e2e8f0", bgcolor: "white", overflow: "hidden" }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Input
              variant="outlined"
              placeholder="Search by name or email"
              startDecorator={<Search size={16} color="#94a3b8" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              sx={{ width: 300, borderRadius: "8px" }}
            />
            <IconButton variant="outlined" color="neutral" size="sm" sx={{ borderRadius: "8px" }}>
              <Filter size={15} />
            </IconButton>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  {["", "Store", "Status", "Customers", "Plan", "Joined", ""].map((h, i) => (
                    <th
                      key={h + i}
                      style={{
                        padding: "10px 16px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                        textAlign: i === 0 || i === 6 ? "center" : "left",
                        width: i === 0 ? 44 : i === 6 ? 60 : "auto",
                        borderRight: i === 0 ? "1px solid #e2e8f0" : "none",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((store, i) => (
                    <tr key={store._id} style={{ borderBottom: "1px solid #f1f5f9" }} className="hover:bg-slate-50">
                      <td style={{ padding: "12px 16px", textAlign: "center", color: "#94a3b8", fontSize: "13px", borderRight: "1px solid #f1f5f9" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar variant="outlined" sx={{ width: 36, height: 36, borderRadius: "8px", fontWeight: 700 }}>
                            {store?.name?.charAt(0) || "?"}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }} noWrap>
                              {store.name}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#94a3b8" }} noWrap>
                              {store.email}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={store.status === "ACTIVE" ? "success" : "danger"}
                          startDecorator={store.status === "ACTIVE" ? <UserCheck size={12} /> : null}
                          sx={{ fontWeight: 600, fontSize: "11px", borderRadius: "6px" }}
                        >
                          {store.status}
                        </Chip>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Users size={14} color="#64748b" />
                          <Typography level="body-sm" sx={{ fontWeight: 600, color: "#0f172a" }}>
                            {(store?.totalCustomers || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Chip
                          variant="soft"
                          size="sm"
                          sx={{
                            fontWeight: 600,
                            fontSize: "11px",
                            borderRadius: "6px",
                            textTransform: "capitalize",
                            ...(PLAN_STYLES[store?.plan?.toLowerCase()] || {}),
                          }}
                        >
                          {store?.plan || "Standard"}
                        </Chip>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Typography level="body-sm" sx={{ color: "#64748b" }}>
                          {store.createdAt
                            ? new Date(store.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "N/A"}
                        </Typography>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <IconButton
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => {
                            setSelectedStore(store);
                            setDrawerOpen(true);
                          }}
                        >
                          <MoreHorizontal size={16} />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                      No stores match "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Sheet>

        {/* Detail drawer */}
        {drawerOpen && selectedStore && (
          <Box
            sx={{ position: "fixed", inset: 0, bgcolor: "rgba(15,23,42,0.4)", zIndex: 1200, display: "flex", justifyContent: "flex-end" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
          >
            <Sheet sx={{ width: { xs: "100%", sm: 380 }, height: "100%", p: 3, overflowY: "auto", borderLeft: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Typography level="title-md" sx={{ fontWeight: 700, color: "#0f172a" }}>{selectedStore.name}</Typography>
                <IconButton variant="plain" color="neutral" size="sm" onClick={() => setDrawerOpen(false)}>
                  <X size={16} />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Chip size="sm" color={selectedStore.status === "ACTIVE" ? "success" : "danger"} variant="soft" sx={{ borderRadius: "6px", fontWeight: 600 }}>
                  {selectedStore.status}
                </Chip>
                <Chip size="sm" variant="outlined" sx={{ borderRadius: "6px", textTransform: "capitalize" }}>
                  {selectedStore.plan}
                </Chip>
              </Box>

              <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mb: 1, color: "#94a3b8", letterSpacing: "0.03em" }}>
                Store info
              </Typography>
              <DetailRow label="Category" value={selectedStore.storeType} />
              <DetailRow label="Slug" value={selectedStore.slug} />
              <DetailRow label="Customers" value={(selectedStore.totalCustomers || 0).toLocaleString()} />
              <DetailRow label="Paystack" value={selectedStore.paystack?.verified ? "Verified" : "Unverified"} />
              <DetailRow
                label="Joined"
                value={new Date(selectedStore.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              />

              <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mt: 3, mb: 1, color: "#94a3b8", letterSpacing: "0.03em" }}>
                Owner
              </Typography>
              <DetailRow label="Name" value={selectedStore.owner?.name || selectedStore.name || "Pending owner"} />
              <DetailRow label="Email" value={selectedStore.owner?.email} />

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color={selectedStore.status === "ACTIVE" ? "danger" : "success"}
                  onClick={() => setSuspendModal(true)}
                  sx={{ borderRadius: "8px", fontWeight: 600 }}
                >
                  {selectedStore.status === "ACTIVE" ? "Suspend store" : "Reactivate store"}
                </Button>
              </Box>
            </Sheet>
          </Box>
        )}

        {/* Suspend confirm modal */}
        {suspendModal && (
          <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(15,23,42,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sheet sx={{ width: 360, p: 3, borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography level="title-md" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                {selectedStore?.status === "ACTIVE" ? `Suspend "${selectedStore?.name}"?` : `Reactivate "${selectedStore?.name}"?`}
              </Typography>
              <Typography level="body-sm" sx={{ color: "#64748b", mb: 2 }}>
                {selectedStore?.status === "ACTIVE"
                  ? "This blocks the store from accepting orders. The owner is notified."
                  : "This allows the store to accept orders again."}
              </Typography>
              {selectedStore?.status === "ACTIVE" && (
                <Box sx={{ mb: 2 }}>
                  <Typography level="body-xs" sx={{ mb: 0.5, color: "#64748b" }}>Reason (optional)</Typography>
                  <input
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "inherit" }}
                    placeholder="e.g. Policy violation"
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button variant="outlined" color="neutral" onClick={() => setSuspendModal(false)} sx={{ borderRadius: "8px", fontWeight: 600 }}>
                  Cancel
                </Button>
                <Button
                  color={selectedStore?.status === "ACTIVE" ? "danger" : "success"}
                  loading={suspending}
                  onClick={handleSuspendToggle}
                  sx={{ borderRadius: "8px", fontWeight: 600 }}
                >
                  Confirm
                </Button>
              </Box>
            </Sheet>
          </Box>
        )}

      </Box>
    </SuperAdminLayout>
  );
}