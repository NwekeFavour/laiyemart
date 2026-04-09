import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, Sheet, Avatar, Chip, Input, Link, Modal, ModalDialog, ModalClose, Divider, Grid, Card, IconButton, Tooltip } from "@mui/joy";
import { Search, Store as StoreIcon, Download, ShieldCheck, ShieldAlert, Trash2, AlertTriangle, Percent, Award, ExternalLink, Wallet, Users, ArrowUpRight, ShoppingBag, AlertCircle } from "lucide-react";
import { useAdminStore } from '../../../services/adminService';
import SuperAdminLayout from './layout';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function DeleteStoreModal({ store, onConfirm, onCancel, isDeleting }) {
  if (!store) return null;

  return (
    <Modal open={!!store} onClose={onCancel}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          maxWidth: 440,
          borderRadius: '20px',
          p: 0,
          overflow: 'hidden',
          border: '1px solid #fecaca',
        }}
      >
        {/* Red accent top bar */}
        <Box sx={{ height: 5, bgcolor: '#ef4444', width: '100%' }} />

        <Box sx={{ p: 3.5 }}>
          {/* Icon + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} color="#ef4444" />
            </Box>
            <Box>
              <Typography level="title-lg" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Delete Store
              </Typography>
              <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Store preview */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              bgcolor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              mb: 2.5,
            }}
          >
            <Avatar
              src={store.logo?.url}
              sx={{ borderRadius: '10px', width: 40, height: 40, flexShrink: 0 }}
            >
              {store.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography level="title-sm" sx={{ fontWeight: 700 }}>
                {store?.name}
              </Typography>
              <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                {store?.owner?.email}
              </Typography>
            </Box>
          </Box>

          <Typography level="body-sm" sx={{ color: '#475569', mb: 3, lineHeight: 1.7 }}>
            You are about to permanently delete this store and all its associated data,
            including orders and assets. This <strong>cannot be reversed</strong>.
          </Typography>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={onCancel}
              disabled={isDeleting}
              sx={{ borderRadius: '10px', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              className='md:block! hidden!'
              color="danger"
              onClick={onConfirm}
              loading={isDeleting}
              startDecorator={!isDeleting ? <Trash2 size={16} /> : null}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
              }}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Store'}
            </Button>
            <Button
              className='md:hidden! flex!'
              color="danger"
              onClick={onConfirm}
              loading={isDeleting}
              startDecorator={!isDeleting ? <Trash2 size={16} /> : null}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
              }}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

const StatWidget = ({ title, value, subtext, icon: Icon, color, percentage, trend = 12 }) => (
  <Card variant="soft" sx={{ bgcolor: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', p: 2.5, flex: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: '14px',
          bgcolor: `${color}.50`,
          color: `${color}.600`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={20} />
      </Box>
      {percentage !== undefined && (
        <Chip 
          size="sm" 
          variant="soft" 
          color={trend === "up" ? "success" : "neutral"} 
          startDecorator={trend === "up" ? <ArrowUpRight size={12} /> : <Percent size={12} />}
        >
          {percentage}%
        </Chip>
      )}
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography level="body-xs" sx={{ fontWeight: 700, textTransform: 'uppercase', tracking: '1px', color: 'text.tertiary' }}>
        {title}
      </Typography>
      <Typography level="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.5 }}>
        {subtext}
      </Typography>
    </Box>
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StoreManagement() {
  const { stores, fetchAllStores, loadingStores, deleteStore, fetchPlatformOrders, platformOrders, platformStats } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [storeToDelete, setStoreToDelete] = useState(null); // store object to confirm
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const isDark = false;

  useEffect(() => {
    fetchAllStores();
    fetchPlatformOrders();
  }, [fetchAllStores, fetchPlatformOrders]);

  const filteredStores = useMemo(() => {
    if (!stores?.data) return [];
    return stores.data.filter(
      (store) =>
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  console.log(stores)
  // ── Handlers ──
  const handleDeleteClick = (store) => setStoreToDelete(store);
  const handleCancelDelete = () => {
    if (!isDeleting) setStoreToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;
    setIsDeleting(true);

    const result = await deleteStore(storeToDelete._id);

    if (result.success) {
      // Refresh the list so the deleted store vanishes immediately
      await fetchAllStores(); 
    }

    setIsDeleting(false);
    setStoreToDelete(null);

    setToast({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
    setTimeout(() => setToast(null), 4000);
  };
  // ── Styles ──
  const thStyle = `px-4 py-3 font-semibold text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`;
  const tdStyle = `px-4 py-4 text-[13px] ${isDark ? "text-slate-300" : "text-gray-700"}`;

  return (
<SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1600px', mx: 'auto' }}>
        
        {/* ── Header ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography level="h2" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>Mission Control</Typography>
            <Typography level="body-md" sx={{ color: 'text.tertiary' }}>
              Monitoring <strong>{stores?.count || 0}</strong> active merchants and platform liquidity.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="soft" color="neutral" startDecorator={<Download size={18} />} sx={{ borderRadius: '12px' }}>
              Financial Report
            </Button>
            <Button variant="solid" sx={{ bgcolor: '#4f46e5', borderRadius: '12px', fontWeight: 700 }}>
              Platform Settings
            </Button>
          </Box>
        </Box>

        {/* ── Analytics Grid ── */}
        <Grid  className="grid! grid-cols-1! md:grid-cols-3! space-y-4 md:space-x-4 "  sx={{ mb: 5 }}>
          <Grid  xs={12} md={3}>
            <StatWidget 
              title="Platform Rev" 
              value={`₦${platformStats?.platformRev?.toLocaleString() || '0'}`} 
              subtext="Total Commission Earned" 
              icon={Percent} 
              color="primary" 
              percentage={platformStats?.totalRevenue > 0 
                ? ((platformStats.platformRev / platformStats.totalRevenue) * 100).toFixed(1) 
                : 0}
              trend="up"
            />
          </Grid>
          <Grid xs={12} md={3}>
            <StatWidget 
              title="Vendor Payouts" 
              value={`₦${platformStats?.vendorPayouts?.toLocaleString() || '0'}`}
              subtext="Successfully split to subaccounts" 
              icon={Wallet} 
              color="success"
              percentage={platformStats?.totalRevenue > 0 
                ? ((platformStats.vendorPayouts / platformStats.totalRevenue) * 100).toFixed(1) 
                : 0}
              trend="up"
            />
          </Grid>
          <Grid xs={12} md={3}>
            <StatWidget 
              title="Escrow Balance" 
              value={`₦${platformStats?.escrowBalance?.toLocaleString() || '0'}`} 
              subtext="Funds held for active orders" 
              icon={ShieldCheck} // Changed to represent security/holding
              color="warning" 
              percentage={platformStats?.totalRevenue > 0 
                ? ((platformStats.escrowBalance / platformStats.totalRevenue) * 100).toFixed(1) 
                : 0}
              trend="neutral"
            />
          </Grid>      
        </Grid>

        {/* ── Main Table Sheet ── */}
        <Sheet
          sx={{
            borderRadius: '28px',
            border: '1px solid #e2e8f0',
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Table Toolbar */}
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
            <Input
              variant="outlined"
              placeholder="Search by merchant, email, or subaccount ID..."
              startDecorator={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                width: 400, 
                borderRadius: '14px',
                '--Input-focusedHighlight': '#4f46e5',
                bgcolor: 'white'
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
               <Chip variant="soft" color="primary" sx={{ fontWeight: 700 }}>Active: {stores?.count}</Chip>
               <Chip variant="soft" color="danger" sx={{ fontWeight: 700 }}>Flagged: 2</Chip>
            </Box>
          </Box>

<Box sx={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-50/80 border-b border-slate-100">
        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Merchant & Subaccount</th>
        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Financial Performance</th>
        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Customer Reach</th>
        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">KYC & Plan</th>
        <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-50">
      {filteredStores.map((store) => (
        <tr key={store._id} className="hover:bg-blue-50/20 transition-colors">
          {/* COLUMN 1: Merchant Identity */}
          <td className="px-6 py-4">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={store.logo?.url} variant="rounded" sx={{ width: 44, height: 44, bgcolor: 'primary.softBg', color: 'primary.solidBg', fontWeight: 'bold' }}>
                {store.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography level="title-sm" sx={{ fontWeight: 800, mb: 0.5 }}>{store.name}</Typography>
                <Typography level="body-xs" sx={{ fontFamily: 'monospace', bgcolor: 'primary.softBg', px: 0.8, py: 0.2, borderRadius: '4px', display: 'inline-block' }}>
                  {store.paystack?.subaccount_code || 'PENDING_SUB'}
                </Typography>
              </Box>
            </Box>
          </td>

          {/* COLUMN 2: Performance (Real Data) */}
          <td className="px-6 py-4">
            <Box>
              <Typography level="body-sm" sx={{ fontWeight: 700 }}>
                ₦{store.totalRevenue?.toLocaleString()}
              </Typography>
              <Typography level="body-xs" sx={{ color: 'success.600', fontWeight: 600 }}>
                Platform Cut ({store.activeRate}%): ₦{store.platformCut?.toLocaleString()}
              </Typography>
            </Box>
          </td>

          {/* COLUMN 3: Growth (Orders & Customers) */}
          <td className="px-6 py-4">
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Total Paid Orders" variant="soft">
                <Chip size="sm" variant="soft" color="neutral" startDecorator={<ShoppingBag size={12} />}>
                  {store.orderCount || 0}
                </Chip>
              </Tooltip>
              <Tooltip title="Registered Customers" variant="soft">
                <Chip size="sm" variant="soft" color="neutral" startDecorator={<Users size={12} />}>
                  {store.totalCustomers || 0}
                </Chip>
              </Tooltip>
            </Box>
          </td>

          {/* COLUMN 4: Status & Tier */}
          <td className="px-6 py-4">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Chip
                variant="soft"
                size="sm"
                color={store.paystack?.verified ? "success" : "warning"}
                startDecorator={store.paystack?.verified ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}
              >
                {store.paystack?.verified ? "Verified" : "KYC Pending"}
              </Chip>
              <Typography level="body-xs" sx={{ pl: 0.5, textTransform: 'capitalize', fontWeight: 600 }}>
                Plan: {store.plan || 'Starter'}
              </Typography>
            </Box>
          </td>

          {/* COLUMN 5: Controls */}
          <td className="px-6 py-4">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Button 
                size="sm" 
                variant="outlined" 
                color="neutral"
                onClick={() => window.open(`${protocol}://${store.subdomain}.layemart.com`, '_blank')}
                sx={{ borderRadius: '8px', fontWeight: 700 }}
              >
                Visit
              </Button>
              <IconButton  
                variant="soft" 
                color="danger" 
                onClick={() => handleDeleteClick(store)}
                sx={{ borderRadius: '8px' }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Box>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Box>
        </Sheet>

        <DeleteStoreModal 
        store={storeToDelete} 
        onConfirm={handleConfirmDelete} 
        onCancel={handleCancelDelete} 
        isDeleting={isDeleting} 
      />
      </Box>
    </SuperAdminLayout>
  );
}