import React, { useState } from 'react';
import { 
  Box, Typography, Button, Input, Table, Sheet, Chip, 
  IconButton, Checkbox, Link, Select, Option
} from "@mui/joy";
import { 
  Search, Filter, MoreVertical, Download, 
  Eye, PackageCheck, Truck, Clock , ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import StoreOwnerLayout from './layout';

export default function OrdersPage() {
  // Mock Data
  const orders = [
    { id: "#ORD-7281", customer: "John Doe", date: "Jan 14, 2026", total: "₦120.00", status: "Delivered", method: "Mastercard" },
    { id: "#ORD-7282", customer: "Sarah Smith", date: "Jan 13, 2026", total: "₦45.50", status: "Processing", method: "PayPal" },
    { id: "#ORD-7283", customer: "Mike Johnson", date: "Jan 13, 2026", total: "₦210.00", status: "Shipped", method: "Visa" },
    { id: "#ORD-7284", customer: "Elena Rodriguez", date: "Jan 12, 2026", total: "₦89.00", status: "Cancelled", method: "Bank Transfer" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Processing': return 'primary';
      case 'Shipped': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <StoreOwnerLayout>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2 }, }}>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 700 }}>Orders</Typography>
          <Typography level="body-sm" sx={{ color: '#64748b' }}>Manage and track your store sales</Typography>
        </Box>
        <Button startDecorator={<Download size={18} />} variant="outline" color="neutral" sx={{ borderRadius: 'xl' }}>
          Export CSV
        </Button>
      </Box>

      {/* Quick Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
        gap: 2 
      }}>
        {[
          { label: "Total Orders", value: "452", icon: <PackageCheck className="text-blue-500" /> },
          { label: "Pending", value: "12", icon: <Clock className="text-amber-500" /> },
          { label: "In Transit", value: "28", icon: <Truck className="text-indigo-500" /> },
          { label: "Revenue", value: "₦12,402", icon: <Typography sx={{color: 'green', fontWeight: 700}}>₦</Typography> },
        ].map((stat, i) => (
          <Sheet className="border-slate-100!" key={i} variant="outlined" sx={{ p: 2, borderRadius: 'xl', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: 'lg' }}>{stat.icon}</Box>
            <Box>
              <Typography level="body-xs" sx={{ fontWeight: 600, color: '#64748b' }}>{stat.label}</Typography>
              <Typography level="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
            </Box>
          </Sheet>
        ))}
      </Box>

      {/* Filters & Search */}
      <Sheet className="border-slate-100!" variant="outlined" sx={{ borderRadius: 'xl', p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input 
          startDecorator={<Search size={18} />} 
          className="border-slate-100! shadow-none!"
          placeholder="Search by order ID or customer..." 
          sx={{ flex: 1, borderRadius: 'lg', minWidth: '250px' }}
        />
        <Button startDecorator={<Filter size={18} />} variant="soft" color="neutral" sx={{ borderRadius: 'lg' }}>
          Filters
        </Button>
      </Sheet>

      {/* Orders Table */}
        {/* 1. Responsive Wrapper */}
        <Sheet
        className="hide-scrollbar"
        variant="outlined"
        sx={{
            width: '100%',
            borderRadius: 'xl',
            overflow: 'auto', // This is the key for responsiveness
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
        }}
        >
        <Table
        className="bg-white!"
        sx={{
            minWidth: 900,
            '--TableCell-paddingX': '16px',
            '--TableCell-paddingY': '12px',
            '& thead th': {
            bgcolor: 'transparent', // Removed #f8fafc background
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            borderRight: '1px solid #e2e8f0',
            borderBottom: '2px solid #f1f5f9',
            '&:last-child': { borderRight: 'none' }
            },
            '& tbody td': {
            borderRight: '1px solid #f8fafc',
            borderBottom: '1px solid #f1f5f9',
            verticalAlign: 'middle',
            '&:last-child': { borderRight: 'none' }
            },
            '& tbody tr:hover': {
            bgcolor: '#f8fafc'
            }
        }}
        >
            <thead>
            <tr>
                <th style={{ width: 48, textAlign: 'center' }}>
                <Checkbox size="sm" />
                </th>
                {[
                { label: "Order ID", width: 140 },
                { label: "Date", width: 120 },
                { label: "Customer", width: 180 },
                { label: "Amount", width: 120 },
                { label: "Payment Method", width: 160 },
                { label: "Order Status", width: 140 }
                ].map((head) => (
                <th key={head.label} style={{ width: head.width }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {head.label}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down size-[0.7rem]! mt-px" aria-hidden="true"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>      
                    </Box>
                </th>
                ))}
                <th style={{ width: 100, textAlign: 'center' }}>Action</th>
            </tr>
            </thead>
            <tbody>
            {orders.map((row) => (
                <tr key={row.id}>
                <td style={{ textAlign: 'center' }}>
                    <Checkbox size="sm" />
                </td>
                <td>
                    <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '14px' }}>
                    {row.id}
                    </Typography>
                </td>
                <td>
                    <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
                    {row.date}
                    </Typography>
                </td>
                <td>
                    <Typography sx={{ color: '#0f172a', fontWeight: 500, fontSize: '14px' }}>
                    {row.customer}
                    </Typography>
                </td>
                <td>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                    {row.total}
                    </Typography>
                </td>
                <td>
                    <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
                    {row.method || 'Mastercard'}
                    </Typography>
                </td>
                <td>
                    <Chip
                    variant="soft"
                    size="sm"
                    color={getStatusColor(row.status)}
                    sx={{ 
                        fontWeight: 700, 
                        borderRadius: 'md', 
                        fontSize: '11px', 
                        textTransform: 'uppercase' 
                    }}
                    >
                    {row.status}
                    </Chip>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <Link
                    underline="always"
                    sx={{ 
                        fontSize: '13px', 
                        fontWeight: 700, 
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' }
                    }}
                    >
                    Details
                    </Link>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        </Sheet>
    </Box>
    </StoreOwnerLayout>
  );
}