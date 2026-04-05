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

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  const { fetchStoreOwners, fetchAllStores, stores, loading } = useAdminStore();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = useAuthStore((state) => state.token);
  const isDark = false;

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

  const thStyle = `px-4 py-3 font-semibold text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`;
  const tdStyle = `px-4 py-4 text-[13px] ${isDark ? "text-slate-300" : "text-gray-700"}`;

  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          <td className="px-4 py-4 text-center border-r border-slate-100">
            <Box className="animate-pulse bg-slate-200 h-4 w-4 mx-auto rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Box className="animate-pulse bg-slate-200 h-10 w-10 rounded-[10px]" />
              <div className="flex flex-col gap-2">
                <Box className="animate-pulse bg-slate-200 h-4 w-32 rounded" />
                <Box className="animate-pulse bg-slate-200 h-3 w-24 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4"><Box className="animate-pulse bg-slate-200 h-6 w-20 rounded-md" /></td>
          <td className="px-4 py-4"><Box className="animate-pulse bg-slate-200 h-6 w-24 rounded-md" /></td>
          <td className="px-4 py-4"><Box className="animate-pulse bg-slate-200 h-6 w-20 rounded-md" /></td>
          <td className="px-4 py-4"><Box className="animate-pulse bg-slate-200 h-4 w-20 rounded" /></td>
          <td className="px-4 py-4"><Box className="animate-pulse bg-slate-200 h-8 w-8 mx-auto rounded-full" /></td>
        </tr>
      ))}
    </>
  );

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1600px", mx: "auto" }}>

        {/* HEADER */}
        <Box className="flex! flex-wrap!" sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography level="h3" sx={{ fontWeight: 800 }}>Platform Stores</Typography>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
              Manage all storefronts across the LAYEMART ecosystem.
            </Typography>
          </Box>
          <Button
            className="md:mt-0! mt-3!"
            startDecorator={<Download size={18} />}
            variant="outlined"
            color="neutral"
            sx={{ borderRadius: "12px" }}
          >
            Export List
          </Button>
        </Box>

        {/* TABLE */}
        <Sheet
          sx={{
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", gap: 2, borderBottom: "1px solid #f1f5f9" }}>
            <Input
              variant="plain"
              placeholder="Search by name or email..."
              startDecorator={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
            />
            <IconButton variant="soft" color="neutral" sx={{ borderRadius: "10px" }}>
              <Filter size={18} />
            </IconButton>
          </Box>

          <Box className="hide-scrollbar" sx={{ overflowX: "auto" }}>
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="text-[13px] border-b bg-gray-50/50 border-slate-100">
                  <th className="px-4 py-3 w-12 text-center border-r border-slate-100">S/N</th>
                  <th className={thStyle}>Store Info</th>
                  <th className={thStyle}>Status</th>
                  <th className={thStyle}>Total Customers</th>
                  <th className={thStyle}>Plan</th>
                  <th className={thStyle}>Joined Date</th>
                  <th className="px-4 py-3 w-[80px] text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton />
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((store, i) => (
                    <tr key={store._id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-4 py-4 text-center border-r border-slate-100">{i + 1}</td>
                      <td className={tdStyle}>
                        <div className="flex items-center gap-3">
                          <Avatar variant="soft" color="neutral" sx={{ borderRadius: "10px" }}>
                            {store?.name?.charAt(0) || "?"}
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold">{store.name}</span>
                            <span className="text-[11px] text-gray-500">{store.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className={tdStyle}>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={store.status === "ACTIVE" ? "success" : "danger"}
                          startDecorator={store.status === "ACTIVE" ? <UserCheck size={12} /> : null}
                          sx={{ fontWeight: 700, fontSize: "10px", borderRadius: "6px" }}
                        >
                          {store.status}
                        </Chip>
                      </td>
                      <td className={tdStyle}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ p: 1, borderRadius: "8px", bgcolor: "primary.50", color: "primary.600" }}>
                            <Users size={16} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                              {(store?.totalCustomers || 0).toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "text.tertiary" }}>Unique Buyers</Typography>
                          </Box>
                        </Box>
                      </td>
                      <td className={tdStyle}>
                        <Chip
                          variant="soft"
                          size="sm"
                          sx={{
                            fontWeight: 700, fontSize: "10px", borderRadius: "6px",
                            textTransform: "uppercase", letterSpacing: "0.5px",
                            ...(store?.plan?.toLowerCase() === "professional" && { bgcolor: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }),
                            ...(store?.plan?.toLowerCase() === "starter" && { bgcolor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" }),
                            ...(store?.plan?.toLowerCase() === "business" && { bgcolor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }),
                          }}
                        >
                          {store?.plan || "Standard"}
                        </Chip>
                      </td>
                      <td className={tdStyle}>
                        {store.createdAt
                          ? new Date(store.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {/* ✅ THIS NOW OPENS THE DRAWER */}
                        <IconButton
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => {
                            setSelectedStore(store);
                            setDrawerOpen(true);
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400">
                      No stores found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Sheet>

        {/* ✅ DRAWER — rendered here in the JSX tree */}
        {drawerOpen && selectedStore && (
          <Box
            sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", justifyContent: "flex-end" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
          >
            <Sheet sx={{ width: { xs: "100%", sm: 380 }, height: "100%", p: 3, overflowY: "auto", borderLeft: "1px solid #e2e8f0" }}>
              
              {/* Drawer header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography level="title-lg" sx={{ fontWeight: 800 }}>{selectedStore.name}</Typography>
                <IconButton variant="plain" color="neutral" onClick={() => setDrawerOpen(false)}>
                  <X size={18} />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Chip size="sm" color={selectedStore.status === "ACTIVE" ? "success" : "danger"} variant="soft">
                  {selectedStore.status}
                </Chip>
                <Chip size="sm" variant="outlined" sx={{ textTransform: "uppercase" }}>
                  {selectedStore.plan}
                </Chip>
              </Box>

              {/* Store details */}
              <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mb: 1.5, color: "neutral.500", letterSpacing: "0.5px" }}>
                Store info
              </Typography>
              {[
                ["Category", selectedStore.storeType],
                ["Slug", selectedStore.slug],
                ["Customers", (selectedStore.totalCustomers || 0).toLocaleString()],
                ["Paystack", selectedStore.paystack?.verified ? "Verified" : "Unverified"],
                ["Joined", new Date(selectedStore.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
              ].map(([key, val]) => (
                <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: "0.5px solid #f1f5f9" }}>
                  <Typography level="body-sm" sx={{ color: "text.tertiary" }}>{key}</Typography>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>{val || "N/A"}</Typography>
                </Box>
              ))}

              {/* Owner details */}
              <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mt: 3, mb: 1.5, color: "neutral.500", letterSpacing: "0.5px" }}>
                Owner
              </Typography>
              {[
                ["Name", selectedStore.owner?.name],
                ["Email", selectedStore.owner?.email],
              ].map(([key, val]) => (
                <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: "0.5px solid #f1f5f9" }}>
                  <Typography level="body-sm" sx={{ color: "text.tertiary" }}>{key}</Typography>
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>{val || "N/A"}</Typography>
                </Box>
              ))}

              {/* Actions */}
              <Box sx={{ mt: 4, display: "flex", gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color={selectedStore.status === "ACTIVE" ? "danger" : "success"}
                  onClick={() => setSuspendModal(true)}
                >
                  {selectedStore.status === "ACTIVE" ? "Suspend store" : "Reactivate store"}
                </Button>
              </Box>
            </Sheet>
          </Box>
        )}

        {/* ✅ SUSPEND CONFIRM MODAL */}
        {suspendModal && (
          <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sheet sx={{ width: 360, p: 3, borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <Typography level="title-md" sx={{ mb: 1 }}>
                {selectedStore?.status === "ACTIVE" ? `Suspend "${selectedStore?.name}"?` : `Reactivate "${selectedStore?.name}"?`}
              </Typography>
              <Typography level="body-sm" sx={{ color: "text.tertiary", mb: 2 }}>
                {selectedStore?.status === "ACTIVE"
                  ? "This will block the store from accepting orders. The owner will be notified."
                  : "This will allow the store to accept orders again."}
              </Typography>
              {selectedStore?.status === "ACTIVE" && (
                <Box sx={{ mb: 2 }}>
                  <Typography level="body-xs" sx={{ mb: 0.5, color: "text.secondary" }}>Reason (optional)</Typography>
                  <input
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "inherit" }}
                    placeholder="e.g. Policy violation"
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                <Button variant="plain" color="neutral" onClick={() => setSuspendModal(false)}>Cancel</Button>
                <Button
                  color={selectedStore?.status === "ACTIVE" ? "danger" : "success"}
                  loading={suspending}
                  onClick={handleSuspendToggle}
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