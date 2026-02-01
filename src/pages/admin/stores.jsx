import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, Sheet, Avatar, Chip, IconButton, Input, Link } from "@mui/joy";
import { Search, Filter, Store as StoreIcon, Download, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAdminStore } from '../../../services/adminService';
import SuperAdminLayout from './layout';

export default function StoreManagement() {
  const { stores, fetchAllStores, loadingStores } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const isDark = false; // Replace with your dark mode state logic

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  const filteredStores = useMemo(() => {
    if (!stores?.data) return [];
    return stores.data.filter(store => 
      store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  // Styles to match your Recent Orders table
  const thStyle = `px-4 py-3 font-semibold text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`;
  const tdStyle = `px-4 py-4 text-[13px] ${isDark ? "text-slate-300" : "text-gray-700"}`;

  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1600px', mx: 'auto' }}>
        
        {/* --- UNIFORM HEADER --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography level="h3" sx={{ fontWeight: 800 }}>Store Management</Typography>
            <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
              Manage and monitor {stores?.count || 0} merchant storefronts.
            </Typography>
          </Box>
          <Button startDecorator={<Download size={18} />} variant="outlined" color="neutral" sx={{ borderRadius: '12px' }}>
            Export CSV
          </Button>
        </Box>

        {/* --- UNIFORM TABLE SHEET --- */}
        <Sheet
          className={`${isDark ? "bg-slate-950! border-[#314158]! text-slate-200!" : "border-slate-100! text-gray-900!"}`}
          sx={{
            mb: 4,
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            overflow: "hidden" // Ensures the border-radius clips the table
          }}
        >
          {/* Header/Search Bar */}
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid', borderColor: isDark ? '#314158' : '#f1f5f9' }}>
            <Input
              variant="plain"
              placeholder="Search merchants..."
              startDecorator={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
            />
            <Typography level="title-md" sx={{ fontWeight: 700 }}>All Stores</Typography>
          </Box>

          <Box className="hide-scrollbar" sx={{ overflowX: "auto" }}>
            <table className={`w-full text-left border-collapse min-w-[1000px]`}>
              <thead>
                <tr className={`text-[13px] border-b ${isDark ? "bg-slate-900/50 border-[#314158]" : "bg-gray-50/50 border-slate-100"}`}>
                  <th className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-[#314158]" : "border-slate-100"}`}>S/N</th>
                  <th className={thStyle}>Store Details</th>
                  <th className={thStyle}>Category</th>
                  <th className={thStyle}>Plan</th>
                  <th className={thStyle}>KYC Status</th>
                  <th className={thStyle}>Status</th>
                  <th className="px-4 py-3 w-[100px] text-center">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
                {filteredStores.length > 0 ? (
                  filteredStores.map((store, i) => (
                    <tr 
                      key={store._id} 
                      className={`transition-colors hover:bg-gray-50/50 ${isDark ? "hover:bg-slate-800/40" : ""}`}
                    >
                      <td className={`px-4 py-4 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                        {i + 1}
                      </td>
                      <td className={tdStyle}>
                        <div className="flex items-center gap-3">
                          <Avatar src={store.logo?.url} sx={{ borderRadius: '10px' }}>{store.name?.charAt(0)}</Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold">{store.name}</span>
                            <span className="text-[11px] text-gray-500">{store.owner?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`${tdStyle} capitalize`}>{store.storeType || 'General'}</td>
                      <td className={tdStyle}>
                        <Chip size="sm" variant="soft" color="neutral" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                          {store.plan}
                        </Chip>
                      </td>
                      <td className={tdStyle}>
                        <div className="flex items-center gap-2">
                          {store.paystack?.verified ? (
                            <ShieldCheck size={16} className="text-emerald-500" />
                          ) : (
                            <ShieldAlert size={16} className="text-rose-500" />
                          )}
                          <span className={store.paystack?.verified ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                            {store.paystack?.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className={tdStyle}>
                        <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                          store.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link className="text-blue-500 flex flex-col items-center group cursor-pointer">
                          <span className="text-[12px] font-medium group-hover:underline">manage</span>
                          <div className="w-8 border-t border-dashed border-blue-300 mt-0.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <Box sx={{ py: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f5f9" }}>
                          <StoreIcon size={24} className="text-slate-400" />
                        </Box>
                        <Typography level="title-md">No stores found</Typography>
                        <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>Try adjusting your search query.</Typography>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Sheet>
      </Box>
    </SuperAdminLayout>
  );
}