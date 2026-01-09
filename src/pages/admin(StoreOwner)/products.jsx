import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Input, Sheet, Table, 
  Checkbox, Chip, Link, IconButton 
} from "@mui/joy";
import { Search, ChevronDown, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import StoreOwnerLayout from './layout';
import { useProductStore } from '../../../services/productService';

export default function ProductsPage() {
  // Mock Data matching your "Laiyemart" schema
    const { products, fetchMyProducts, loading } = useProductStore();
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const PAGE_SIZE = 10;
    useEffect(() => {
        fetchMyProducts().catch(err => {
        setError(err.message || "Failed to load products");
        });
    }, []);

    const getStockStatus = (inventory) => {
    if (inventory === 0) return { label: "Out of Stock", color: "danger" };
    if (inventory <= 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
    };
    // console.log(products)
    const hoverRow = 'hover:bg-gray-50!';
    const filteredProducts = products.filter(product => {
    const query = search.toLowerCase();
    return (
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product._id.toLowerCase().includes(query)
    );
    });

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
    );

    useEffect(() => {
    setPage(1);
    }, [search]);
  return (
    <StoreOwnerLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p:{xs: 2}}}>
        
        {/* 1. Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
            <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Products</Typography>
            <Typography level="body-sm" sx={{ color: '#64748b' }}>Manage your inventory and product listings</Typography>
            </Box>
        </Box>

        {/* 2. Search & Export Bar */}
        <Box sx={{ bgcolor: 'white', borderRadius: 'xl', border: '1px solid #e2e8f0', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>All Products</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Input 
                size="sm"
                placeholder="Search products..." 
                onChange={(e) => setSearch(e.target.value)}
                startDecorator={<Search size={16} />}
                sx={{ 
                    borderRadius: 'md', 
                    width: { xs: '100%', sm: 250 }, 
                    bgcolor: '#f8fafc', 
                    "&::before": {
                        display: 'none',
                    },
                        // 2. Remove the default focus border/shadow
                    "&:focus-within": {
                        outline: 'none',
                        border: 'none',
                    },
                    // 3. Optional: keep a subtle background change instead of a ring
                    '&:hover': {
                        bgcolor: 'neutral.100',
                    }
                }}
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
                {loading ? (
                    <tr>
                    <td colSpan={8}>
                        <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography level="body-sm">Loading products…</Typography>
                        </Box>
                    </td>
                    </tr>
                ) : products.length === 0 ? (
                    <tr>
                    <td colSpan={8}>
                        <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography level="body-sm">
                            No products yet. Add your first product 🚀
                        </Typography>
                        </Box>
                    </td>
                    </tr>
                ) : (
                    paginatedProducts.map((item) => {
                    const stock = getStockStatus(item.inventory);

                    return (
                        <tr key={item._id} className={hoverRow}>
                    <td style={{ textAlign: "center" }}>
                        <Checkbox size="sm" />
                    </td>

                    <td>
                        <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#475569" }}>
                        PROD - {item._id.slice(-6).toUpperCase()}
                        </Typography>
                    </td>

                    <td>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "md",
                            bgcolor: "#f1f5f9",
                            overflow: "hidden",
                            }}
                        >
                            {item.images?.[0]?.url && (
                            <img
                                src={item.images[0].url}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            )}
                        </Box>

                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
                            {item.name}
                        </Typography>
                        </Box>
                    </td>

                    <td>
                        <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                        {item.category || "—"}
                        </Typography>
                    </td>

                    <td>
                        <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>
                        ₦{item.price.toLocaleString()}
                        </Typography>
                    </td>

                    <td>
                        <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                        {item.inventory} units
                        </Typography>
                    </td>

                    <td>
                        <Chip
                        variant="soft"
                        size="sm"
                        color={stock.color}
                        sx={{ fontWeight: 700, borderRadius: "md", fontSize: "10px" }}
                        >
                        {stock.label}
                        </Chip>
                    </td>

                    <td>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton size="sm" variant="plain">
                            <Edit size={16} />
                        </IconButton>
                        <IconButton size="sm" variant="plain">
                            <ExternalLink size={16} />
                        </IconButton>
                        <IconButton size="sm" variant="plain" color="danger">
                            <Trash2 size={16} />
                        </IconButton>
                        </Box>
                    </td>
                    </tr>
                );
                }))}

            </tbody>
            </Table>

            {!loading && products.length > 0 && (
            <Box
                className="p-3!"
                sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                px: 1,
                }}
            >
                <Typography level="body-sm" sx={{ color: "#64748b" }}>
                Page {page} of {totalPages}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                    size="sm"
                    variant="outlined"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </Button>

                <Button
                    size="sm"
                    variant="outlined"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
                </Box>
            </Box>
            )}

        </Sheet>
        </Box>
    </StoreOwnerLayout>
  );
}