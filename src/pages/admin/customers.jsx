import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Sheet,
  Avatar,
  Chip,
  IconButton,
  Input,
  Link,
} from "@mui/joy";
import {
  Search,
  Filter,
  Users,
  Download,
  Mail,
  MoreHorizontal,
  UserCheck,
} from "lucide-react";
import SuperAdminLayout from "./layout";
import { useAdminStore } from "../../../services/adminService";

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchStoreOwners, fetchAllStores, stores, loading } = useAdminStore();
  const isDark = false; // Linked to your theme provider

  // Mock data - replace with your useAdminStore or useCustomerStore
  useEffect(() => {
    fetchStoreOwners();
    fetchAllStores();
  }, [fetchStoreOwners, fetchAllStores]);

const filteredCustomers = useMemo(() => {
  // Ensure we have data before trying to sort/filter
  const rawData = stores?.data || [];
  
  return rawData
    .filter((store) => {
      const search = searchTerm.toLowerCase();
      return (
        store.name?.toLowerCase().includes(search) ||
        store.email?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}, [stores, searchTerm]);

  // console.log(stores);

  const thStyle = `px-4 py-3 font-semibold text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`;
  const tdStyle = `px-4 py-4 text-[13px] ${isDark ? "text-slate-300" : "text-gray-700"}`;

  const TableSkeleton = ({ isDark }) => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr
          key={i}
          className={`border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}
        >
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
          <td className="px-4 py-4">
            <Box className="animate-pulse bg-slate-200 h-6 w-20 rounded-md" />
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <Box className="animate-pulse bg-slate-200 h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-1">
                <Box className="animate-pulse bg-slate-200 h-4 w-12 rounded" />
                <Box className="animate-pulse bg-slate-200 h-3 w-16 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <Box className="animate-pulse bg-slate-200 h-6 w-24 rounded-md" />
          </td>
          <td className="px-4 py-4">
            <Box className="animate-pulse bg-slate-200 h-4 w-20 rounded" />
          </td>
          <td className="px-4 py-4">
            <Box className="animate-pulse bg-slate-200 h-8 w-8 mx-auto rounded-full" />
          </td>
        </tr>
      ))}
    </>
  );
  return (
    <SuperAdminLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1600px", mx: "auto" }}>
        {/* --- HEADER --- */}
        <Box className="flex! flex-wrap!"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography level="h3" sx={{ fontWeight: 800 }}>
              Platform Customers
            </Typography>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
              Viewing all registered buyers across the LAIYEMART ecosystem.
            </Typography>
          </Box>
          <Button className="md:mt-0! mt-3!"
            startDecorator={<Download size={18} />}
            variant="outlined"
            color="neutral"
            sx={{ borderRadius: "12px" }}
          >
            Export List
          </Button>
        </Box>

        {/* --- TABLE SHEET --- */}
        <Sheet
          className={`${isDark ? "bg-slate-950! border-[#314158]! text-slate-200!" : "border-slate-100! text-gray-900!"}`}
          sx={{
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Input
              variant="plain"
              placeholder="Search by name or email..."
              startDecorator={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
            />
            <IconButton
              variant="soft"
              color="neutral"
              sx={{ borderRadius: "10px" }}
            >
              <Filter size={18} />
            </IconButton>
          </Box>

          <Box className="hide-scrollbar" sx={{ overflowX: "auto" }}>
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr
                  className={`text-[13px] border-b ${isDark ? "bg-slate-900/50 border-[#314158]" : "bg-gray-50/50 border-slate-100"}`}
                >
                  <th
                    className={`px-4 py-3 w-12 text-center border-r ${isDark ? "border-[#314158]" : "border-slate-100"}`}
                  >
                    S/N
                  </th>
                  <th className={thStyle}>Customer Info</th>
                  <th className={thStyle}>Status</th>
                  <th className={thStyle}>Total Customers</th>
                  <th className={thStyle}>Plan</th>
                  <th className={thStyle}>Joined Date</th>
                  <th className="px-4 py-3 w-[80px] text-center"></th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-100"}`}
              >
                {loading ? (
                  <TableSkeleton isDark={isDark} />
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((store, i) => (
                    <tr
                      key={store._id}
                      className={`transition-colors hover:bg-gray-50/50 ${isDark ? "hover:bg-slate-800/40" : ""}`}
                    >
                      <td
                        className={`px-4 py-4 text-center border-r ${isDark ? "border-slate-800" : "border-slate-100"}`}
                      >
                        {i + 1}
                      </td>
                      <td className={tdStyle}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            variant="soft"
                            color="neutral"
                            sx={{ borderRadius: "10px" }}
                          >
                            {/* The ?. prevents the crash, and || '?' provides a placeholder */}
                            {store?.name?.charAt(0) || "?"}
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold">{store.name}</span>
                            <span className="text-[11px] text-gray-500">
                              {store.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={tdStyle}>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={
                            store.status === "ACTIVE" ? "success" : "neutral"
                          }
                          startDecorator={
                            store.status === "ACTIVE" ? (
                              <UserCheck size={12} />
                            ) : null
                          }
                          sx={{
                            fontWeight: 700,
                            fontSize: "10px",
                            borderRadius: "6px",
                          }}
                        >
                          {store.status}
                        </Chip>
                      </td>
                      <td className={tdStyle}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "8px",
                              bgcolor: "primary.50",
                              color: "primary.600",
                            }}
                          >
                            <Users size={16} />
                          </Box>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 700, fontSize: "14px" }}
                            >
                              {/* Safe access to the new field */}
                              {(store?.totalCustomers || 0).toLocaleString()}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "11px", color: "text.tertiary" }}
                            >
                              Unique Buyers
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                      <td className={tdStyle}>
                        <Chip
                          variant="soft"
                          size="sm"
                          sx={{
                            fontWeight: 700,
                            fontSize: "10px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            // Dynamic colors based on plan name
                            ...(store?.plan?.toLowerCase() === "enterprise" && {
                              bgcolor: "#f5f3ff", // Soft Purple
                              color: "#7c3aed",
                              border: "1px solid #ddd6fe",
                            }),
                            ...(store?.plan?.toLowerCase() ===
                              "professional" && {
                              bgcolor: "#eff6ff", // Soft Blue
                              color: "#2563eb",
                              border: "1px solid #dbeafe",
                            }),
                            ...(store?.plan?.toLowerCase() === "starter" && {
                              bgcolor: "#f8fafc", // Soft Slate
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                            }),
                          }}
                        >
                          {store?.plan || "Standard"}
                        </Chip>
                      </td>
                      <td className={tdStyle}>{store.createdAt
                              ? new Date(store.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}</td>
                      <td className="px-4 py-4 text-center">
                        <IconButton variant="plain" color="neutral" size="sm">
                          <MoreHorizontal size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                ): (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-gray-400">
                      No stores or customers found matching your search.
                    </td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </Box>
        </Sheet>
      </Box>
    </SuperAdminLayout>
  );
}
