import React from 'react';
import { 
  Box, Typography, Button, Input, Sheet, Table, 
  Checkbox, Chip, Link, IconButton 
} from "@mui/joy";
import { Search, ChevronDown, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import StoreOwnerLayout from './layout';

export default function ProductsPage() {
  // Mock Data matching your "Laiyemart" schema
  const products = [
    { id: "PROD-001", name: "Premium Wireless Headphones", category: "Electronics", price: "$299.00", stock: 45, status: "In Stock" },
    { id: "PROD-002", name: "Leather Messenger Bag", category: "Accessories", price: "$150.00", stock: 0, status: "Out of Stock" },
    { id: "PROD-003", name: "Organic Cotton T-Shirt", category: "Apparel", price: "$35.00", stock: 120, status: "In Stock" },
    { id: "PROD-004", name: "Smart Watch Series 5", category: "Electronics", price: "$399.00", stock: 8, status: "Low Stock" },
  ];

  const getStockStatus = (status) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'neutral';
    }
  };

  const hoverRow = 'hover:bg-gray-50!';

  return (
    <StoreOwnerLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p:{xs: 2}}}>
        
        {/* 1. Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
            <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Products</Typography>
            <Typography level="body-sm" sx={{ color: '#64748b' }}>Manage your inventory and product listings</Typography>
            </Box>
            <Button 
            startDecorator={<Plus size={20} />} 
            sx={{ bgcolor: '#0f172a', borderRadius: 'xl', '&:hover': { bgcolor: '#1e293b' } }}
            >
            Add Product
            </Button>
        </Box>

        {/* 2. Search & Export Bar */}
        <Box sx={{ bgcolor: 'white', borderRadius: 'xl', border: '1px solid #e2e8f0', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>All Products</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Input 
                size="sm"
                placeholder="Search products..." 
                startDecorator={<Search size={16} />}
                sx={{ borderRadius: 'md', width: { xs: '100%', sm: 250 }, bgcolor: '#f8fafc' }}
                />
                <Button variant="outlined" color="neutral" size="sm" sx={{ borderRadius: 'md', fontWeight: 600 }}>
                Export
                </Button>
            </Box>
            </Box>
        </Box>

        {/* 3. Responsive Products Table */}
        <Sheet
            className="hide-scrollbar"
            variant="outlined"
            sx={{
            borderRadius: 'xl',
            overflow: 'auto',
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            '&::-webkit-scrollbar': { display: 'none' },
            }}
        >
            <Table
            sx={{
                minWidth: 900,
                '--TableCell-paddingX': '16px',
                '--TableCell-paddingY': '14px',
                '& thead th': {
                bgcolor: 'transparent',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                borderRight: '1px solid #e2e8f0',
                borderBottom: '2px solid #f1f5f9',
                '&:last-child': { borderRight: 'none' }
                },
                '& tbody td': {
                borderRight: '1px solid #e2e8f0 ',
                borderBottom: '1px solid #e2e8f0 ',
                '&:last-child': { borderRight: 'none' }
                }
            }}
            >
            <thead>
                <tr>
                <th style={{ width: 48, textAlign: 'center' }}><Checkbox size="sm" /></th>
                {["Product ID", "Product Name", "Category", "Price", "Stock", "Status"].map((h) => (
                    <th key={h}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {h} <ChevronDown size={14} className="text-slate-400" />
                    </Box>
                    </th>
                ))}
                <th style={{ width: 120, textAlign: 'center' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item) => (
                <tr 
                className={`${hoverRow}`}
                 key={item.id}>
                    <td style={{ textAlign: 'center' }}><Checkbox size="sm" /></td>
                    <td><Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>{item.id}</Typography></td>
                    <td>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', borderRadius: 'md' }} /> {/* Product Image Placeholder */}
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{item.name}</Typography>
                    </Box>
                    </td>
                    <td><Typography sx={{ fontSize: '14px', color: '#64748b' }}>{item.category}</Typography></td>
                    <td><Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{item.price}</Typography></td>
                    <td><Typography sx={{ fontSize: '14px', color: '#64748b' }}>{item.stock} units</Typography></td>
                    <td>
                    <Chip 
                        variant="soft" 
                        size="sm" 
                        color={getStockStatus(item.status)}
                        sx={{ fontWeight: 700, borderRadius: 'md', textTransform: 'uppercase', fontSize: '10px' }}
                    >
                        {item.status}
                    </Chip>
                    </td>
                    <td>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="sm" variant="plain" color="neutral"><Edit size={16} /></IconButton>
                        <IconButton size="sm" variant="plain" color="neutral"><ExternalLink size={16} /></IconButton>
                        <IconButton size="sm" variant="plain" color="danger"><Trash2 size={16} /></IconButton>
                    </Box>
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