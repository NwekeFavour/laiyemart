import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Sheet,
  Avatar,
  Chip,
  Input,
  Modal,
  ModalDialog,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/joy";
import {
  Search,
  Download,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Percent,
  ExternalLink,
  Wallet,
  Users,
  ShoppingBag,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAdminStore } from "../../../services/adminService";
import SuperAdminLayout from "./layout";

// ─── Store Details Modal ───────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        p: 1.25,
        borderRadius: "10px",
        bgcolor: "#fff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Box sx={{ color: "#64748b", mt: 0.2 }}>
        <Icon size={15} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          level="body-xs"
          sx={{
            color: "#64748b",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ fontWeight: 600, color: "#0f172a", whiteSpace: "pre-wrap" }}
        >
          {value || "Not provided"}
        </Typography>
      </Box>
    </Box>
  );
}

function StoreDetailsModal({ store, onClose }) {
  if (!store) return null;

  const ownerName =
    store?.owner?.name ||
    store?.owner?.fullName ||
    store?.owner?.email ||
    "Pending owner";
  const ownerEmail = store?.owner?.email || store?.email || "Not provided";
  const ownerPhone = store?.owner?.phone || store?.phone || "Not provided";
  const ownerAddress =
    typeof store?.owner?.address === "string"
      ? store.owner.address
      : [
          store?.owner?.address?.street,
          store?.owner?.address?.city,
          store?.owner?.address?.state,
          store?.owner?.address?.country,
        ]
          .filter(Boolean)
          .join(", ") || "Not provided";

  return (
    <Modal open={!!store} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="dialog"
        aria-labelledby="store-details-title"
        sx={{
          maxWidth: 560,
          width: { xs: "92vw", sm: 560 },
          borderRadius: "16px",
          p: { xs: 2.25, sm: 3 },
          boxShadow: "0 20px 45px rgba(15,23,42,0.16)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={store.logo?.url}
              sx={{
                width: 46,
                height: 46,
                borderRadius: "10px",
                fontWeight: 700,
                bgcolor: "#e2e8f0",
              }}
            >
              {store.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                id="store-details-title"
                level="title-md"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                {store.name}
              </Typography>
              <Typography level="body-sm" sx={{ color: "#64748b" }}>
                {store.plan || "Starter"} plan • {store.subdomain ? "Live store" : "Setup in progress"}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={onClose}
            sx={{ borderRadius: "999px" }}
          >
            Close
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "grid", gap: 1.25 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.25,
              borderRadius: "10px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={15} color="#0f766e" />
            </Box>
            <Box>
              <Typography
                level="body-xs"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Store owner
              </Typography>
              <Typography level="body-sm" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {ownerName}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <DetailRow icon={Mail} label="Email" value={ownerEmail} />
            <DetailRow icon={Phone} label="Phone" value={ownerPhone} />
          </Box>

          <DetailRow icon={MapPin} label="Address" value={ownerAddress} />
          <DetailRow icon={ShoppingBag} label="Store slug" value={store.slug || "Not assigned"} />
          <DetailRow icon={Wallet} label="Plan" value={store.plan || "Starter"} />
        </Box>
      </ModalDialog>
    </Modal>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function DeleteStoreModal({ store, onConfirm, onCancel, isDeleting }) {
  if (!store) return null;

  return (
    <Modal open={!!store} onClose={onCancel}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          maxWidth: 420,
          borderRadius: "12px",
          p: 3,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} color="#dc2626" />
          </Box>
          <Box>
            <Typography
              level="title-md"
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Delete store
            </Typography>
            <Typography level="body-sm" sx={{ color: "#64748b", mt: 0.25 }}>
              This can't be undone.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            bgcolor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            mb: 2.5,
          }}
        >
          <Avatar
            src={store.logo?.url}
            sx={{ borderRadius: "6px", width: 32, height: 32 }}
          >
            {store.name?.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography level="body-sm" sx={{ fontWeight: 600 }} noWrap>
              {store?.name}
            </Typography>
            <Typography level="body-xs" sx={{ color: "#64748b" }} noWrap>
              {store?.owner?.email}
            </Typography>
          </Box>
        </Box>

        <Typography level="body-sm" sx={{ color: "#475569", mb: 3 }}>
          This permanently deletes the store and its orders and assets.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={onCancel}
            disabled={isDeleting}
            sx={{ borderRadius: "8px", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={onConfirm}
            loading={isDeleting}
            startDecorator={!isDeleting ? <Trash2 size={14} /> : null}
            sx={{ borderRadius: "8px", fontWeight: 600 }}
          >
            Delete store
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtext, icon: Icon }) => (
  <Sheet
    variant="outlined"
    sx={{
      borderRadius: "10px",
      p: 2,
      flex: 1,
      bgcolor: "white",
      borderColor: "#e2e8f0",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <Icon size={15} color="#64748b" />
      <Typography
        level="body-xs"
        sx={{
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography level="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
      {value}
    </Typography>
    <Typography level="body-xs" sx={{ color: "#94a3b8", mt: 0.25 }}>
      {subtext}
    </Typography>
  </Sheet>
);

// ─── Status Badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ verified }) => (
  <Chip
    size="sm"
    variant="soft"
    color={verified ? "success" : "warning"}
    startDecorator={
      verified ? <ShieldCheck size={12} /> : <AlertCircle size={12} />
    }
    sx={{ fontWeight: 600, fontSize: "11px", borderRadius: "6px" }}
  >
    {verified ? "Verified" : "KYC pending"}
  </Chip>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StoreManagement() {
  const {
    stores,
    fetchAllStores,
    loadingStores,
    deleteStore,
    fetchPlatformOrders,
    platformOrders,
    platformStats,
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const protocol = window.location.protocol;

  useEffect(() => {
    fetchAllStores();
    fetchPlatformOrders();
  }, [fetchAllStores, fetchPlatformOrders]);

  const filteredStores = useMemo(() => {
    if (!stores?.data) return [];
    const term = searchTerm.toLowerCase();
    return stores.data.filter((store) => {
      const ownerName = `${store.owner?.name || ""} ${store.owner?.fullName || ""}`.toLowerCase();
      return (
        store.name?.toLowerCase().includes(term) ||
        store.owner?.email?.toLowerCase().includes(term) ||
        ownerName.includes(term) ||
        store?.email?.toLowerCase().includes(term)
      );
    });
  }, [stores, searchTerm]);

  const handleDeleteClick = (store) => setStoreToDelete(store);
  const handleOpenDetails = (store) => setSelectedStoreDetails(store);
  const handleCloseDetails = () => setSelectedStoreDetails(null);
  const handleCancelDelete = () => {
    if (!isDeleting) setStoreToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;
    setIsDeleting(true);

    const result = await deleteStore(storeToDelete._id);

    if (result.success) {
      await fetchAllStores();
    }

    setIsDeleting(false);
    setStoreToDelete(null);

    setToast({
      type: result.success ? "success" : "error",
      message: result.message,
    });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1440px", mx: "auto" }}>
        {/* ── Header ── */}
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
            <Typography level="h3" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Stores
            </Typography>
            <Typography level="body-sm" sx={{ color: "#64748b", mt: 0.25 }}>
              {stores?.count || 0} active merchants
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              startDecorator={<Download size={15} />}
              sx={{ borderRadius: "8px", fontWeight: 600 }}
            >
              Export
            </Button>            
          </Box>
        </Box>

        {/* ── Stat Row ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            title="Platform revenue"
            value={`₦${platformStats?.platformRev?.toLocaleString() || "0"}`}
            subtext="Total commission earned"
            icon={Percent}
          />
          <StatCard
            title="Vendor payouts"
            value={`₦${platformStats?.vendorPayouts?.toLocaleString() || "0"}`}
            subtext="Split to subaccounts"
            icon={Wallet}
          />
          <StatCard
            title="Escrow balance"
            value={`₦${platformStats?.escrowBalance?.toLocaleString() || "0"}`}
            subtext="Held for active orders"
            icon={ShieldCheck}
          />
        </Box>

        {/* ── Table Card ── */}
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "#e2e8f0",
            bgcolor: "white",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexWrap: "wrap",
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                size="sm"
                variant="soft"
                color="neutral"
                sx={{ fontWeight: 600 }}
              >
                {filteredStores.length} shown
              </Chip>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  {["S/N", "Merchant", "Revenue", "Reach", "Status", ""].map(
                    (h, i) => (
                      <th
                        key={h + i}
                        style={{
                          textAlign: i === 4 ? "right" : "left",
                          padding: "10px 20px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loadingStores && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      Loading stores…
                    </td>
                  </tr>
                )}

                {!loadingStores && filteredStores.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      No stores match "{searchTerm}"
                    </td>
                  </tr>
                )}

                {filteredStores.map((store, index) => (
                  <tr
                    key={store._id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                    className="hover:bg-slate-50"
                  >
                    {/* S/N */}
                    <td style={{ padding: "12px 20px" }}>
                      {index + 1}
                    </td>
                    {/* Merchant */}
                    <td style={{ padding: "12px 20px" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          src={store.logo?.url}
                          variant="outlined"
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "8px",
                            fontWeight: 700,
                          }}
                        >
                          {store.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            level="body-sm"
                            sx={{ fontWeight: 600, color: "#0f172a" }}
                            noWrap
                          >
                            {store.name}
                          </Typography>
                          <Typography
                            level="body-xs"
                            sx={{ color: "#0f766e", fontWeight: 600 }}
                            noWrap
                          >
                            {store?.name || store?.owner?.fullName || "Pending owner"}
                          </Typography>
                          <Typography
                            level="body-xs"
                            sx={{ color: "#94a3b8", fontFamily: "monospace" }}
                            noWrap
                          >
                            {store?.owner?.email || store?.email || "pending setup"}
                          </Typography>
                        </Box>
                      </Box>
                    </td>

                    {/* Revenue */}
                    <td style={{ padding: "12px 20px" }}>
                      <Typography
                        level="body-sm"
                        sx={{ fontWeight: 600, color: "#0f172a" }}
                      >
                        ₦{store.totalRevenue?.toLocaleString() || 0}
                      </Typography>
                      <Typography level="body-xs" sx={{ color: "#64748b" }}>
                        Cut ({store.activeRate}%): ₦
                        {store.platformCut?.toLocaleString() || 0}
                      </Typography>
                    </td>

                    {/* Reach */}
                    <td style={{ padding: "12px 20px" }}>
                      <Box sx={{ display: "flex", gap: 0.75 }}>
                        <Tooltip title="Paid orders" size="sm">
                          <Chip
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<ShoppingBag size={11} />}
                            sx={{ borderRadius: "6px" }}
                          >
                            {store.orderCount || 0}
                          </Chip>
                        </Tooltip>
                        <Tooltip title="Customers" size="sm">
                          <Chip
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<Users size={11} />}
                            sx={{ borderRadius: "6px" }}
                          >
                            {store.totalCustomers || 0}
                          </Chip>
                        </Tooltip>
                      </Box>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 20px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <StatusBadge verified={store.paystack?.verified} />
                        {/* <Typography
                          level="body-xs"
                          sx={{ color: "#64748b", textTransform: "capitalize" }}
                        >
                          {store.plan || "Starter"} plan
                        </Typography> */}
                      </Box>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 20px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        {store?.subdomain && (
                          <Tooltip title="Visit store">
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="neutral"
                              onClick={() => {
                                const url =
                                  store?.plan === "starter"
                                    ? `${import.meta.env.VITE_FRONTEND_URL}/${store.slug}`
                                    : `${protocol}://${store.subdomain}.layemart.com`;

                                window.open(url, "_blank");
                              }}
                            >
                              <ExternalLink size={15} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View details">
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="neutral"
                            onClick={() => handleOpenDetails(store)}
                          >
                            <Eye size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete store">
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => handleDeleteClick(store)}
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Sheet>

        <StoreDetailsModal
          store={selectedStoreDetails}
          onClose={handleCloseDetails}
        />

        <DeleteStoreModal
          store={storeToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      </Box>

      {toast && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            bgcolor: toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "white",
            px: 2.5,
            py: 1.25,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </Box>
      )}
    </SuperAdminLayout>
  );
}
