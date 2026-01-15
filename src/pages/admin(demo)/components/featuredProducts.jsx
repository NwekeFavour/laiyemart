import React, { useEffect } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { ShoppingBagOutlined } from "@mui/icons-material";
import { useProductStore } from '../../../../services/productService'; 
import { getSubdomain } from '../../../../storeResolver'; 

// 1. Define Content Mapping for Featured Section
const FEATURED_CONTENT = {
  "Fashion": {
    title: "FEATURED PICKS",
    subtitle: "Hand-selected styles curated for everyday wear."
  },
  "Electronics": {
    title: "TOP TECH EDITS",
    subtitle: "Premium gadgets and electronics chosen for performance."
  },
  "Beauty & Health": {
    title: "BEAUTY FAVORITES",
    subtitle: "The very best in skincare and wellness essentials."
  },
  "Home & Garden": {
    title: "HOME HIGHLIGHTS",
    subtitle: "Curated pieces to elevate your living space."
  },
  "Food & Groceries": {
    title: "FRESH PICKS",
    subtitle: "Our top-quality seasonal produce and pantry staples."
  },
  "Digital Products": {
    title: "MOST POPULAR",
    subtitle: "Our highest-rated digital assets and tools."
  },
  "General Store": {
    title: "FEATURED PICKS",
    subtitle: "Hand-selected items curated just for you."
  }
};

const FeaturedPicksGrid = ({ storeType }) => {
  const { fetchStoreProducts, setLocalProducts, products, loading } = useProductStore();

  // 2. Select the correct text based on storeType
  const content = FEATURED_CONTENT[storeType] || FEATURED_CONTENT["General Store"];

  useEffect(() => {
    const initData = async () => {
      const isDemo = localStorage.getItem("demo") === "true";
      const subdomain = getSubdomain();

      if (isDemo || !subdomain) {
        setLocalProducts(DUMMY_FEATURED);
      } else {
        await fetchStoreProducts(subdomain);
      }
    };
    initData();
  }, [fetchStoreProducts, setLocalProducts]);

  const featuredItems = products.filter(p => p.isFeatured).slice(0, 4);
  const displayProducts = featuredItems.length > 0 ? featuredItems : products.slice(0, 4);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!loading && displayProducts.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', m: 4 }}>
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBagOutlined sx={{ fontSize: 32, color: '#9ca3af' }} />
        </div>
        <Typography variant="h5" fontWeight="800" gutterBottom sx={{ letterSpacing: '-1px' }}>
          CURATING {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          We're hand-selecting our top pieces for this collection.
        </Typography>
      </Box>
    );
  }

  return (
    <section className="px-4 py-12 max-w-[1280px] mx-auto">
      <div className="mb-8 text-center md:text-left">
        <Typography 
           className='lg:text-[34px]! md:text-[30px]! text-[26px]!' 
           variant="h4" 
           fontWeight="800" 
           sx={{ letterSpacing: '-1.5px' }}
        >
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.subtitle}
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <div key={product._id || product.id} className="cursor-pointer group">
            <Box sx={{ 
              position: 'relative', bgcolor: '#f5f5f5', 
              aspectRatio: '3/4', mb: 2, borderRadius: '8px', overflow: 'hidden' 
            }}>
              <img
                src={product.image || product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                <Box sx={{ 
                  bgcolor: 'black', color: 'white', px: 1, py: 0.3, 
                  fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', letterSpacing: '1px'
                }}>
                  FEATURED
                </Box>
              </Box>
            </Box>

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {product.brand || 'OFFICIAL'}
              </Typography>
              <Typography variant="body2" fontWeight="bold" noWrap>
                {product.name}
              </Typography>
              <Typography variant="body2" fontWeight="800">
                ₦{(product.price || 0).toLocaleString()}
              </Typography>
            </Stack>
          </div>
        ))}
      </div>
    </section>
  );
};

const DUMMY_FEATURED = [
  { id: 101, brand: 'MAJESTIC', name: 'RELAXED WOOL COAT', price: 180000, colors: 2, isFeatured: true, image: 'https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=400' },
  { id: 102, brand: 'KOMONO', name: 'MINIMAL LEATHER BELT', price: 55000, colors: 3, isFeatured: true, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400' },
  { id: 103, brand: 'CLOUDNOLA', name: 'OVERSIZED KNIT SWEATER', price: 72000, colors: 4, isFeatured: true, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400' },
  { id: 104, brand: 'KALEIDOSCOPE', name: 'TAILORED TROUSERS', price: 98000, colors: 2, isFeatured: true, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400' },
];

export default FeaturedPicksGrid;