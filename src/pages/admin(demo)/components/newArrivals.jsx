import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Rating, Stack, IconButton, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBagOutlined } from '@mui/icons-material';
import { useProductStore } from '../../../../services/productService'; // Adjust path
import { getSubdomain } from '../../../../storeResolver'; // Adjust path

const NewArrivalsSlider = () => {
  const [width, setWidth] = useState(0);
  const { fetchStoreProducts, setLocalProducts, products, loading } = useProductStore();
  
  const carousel = useRef();
  const controls = useAnimation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const initData = async () => {
      const isDemo = localStorage.getItem('demo') === 'true';
      const subdomain = getSubdomain();

      if (isDemo || !subdomain) {
        // Load Dummy Data if Demo mode is active
        setLocalProducts(DUMMY_PRODUCTS);
      } else {
        // Fetch actual products from the backend for the specific store
        await fetchStoreProducts(subdomain);
      }
    };

    initData();
  }, [fetchStoreProducts, setLocalProducts]);

  // Recalculate scrollable width whenever products change
  useEffect(() => {
    if (carousel.current && products.length > 0) {
      const updateWidth = () => {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      };
      
      // Slight delay to ensure DOM has rendered images
      const timer = setTimeout(updateWidth, 100);
      window.addEventListener('resize', updateWidth);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateWidth);
      };
    }
  }, [products]);

  const handleNext = () => controls.start({ x: -300 });
  const handlePrev = () => controls.start({ x: 0 });

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress color="inherit" />
    </Box>
  );

  if (!loading && products.length === 0) {
    return (
      <Box sx={{ 
        py: 10, 
        px: 4, 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        borderRadius: '16px',
        m: 4 
      }}>
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingBagOutlined sx={{ fontSize: 32, color: '#9ca3af' }} />
                  </div>
        <Typography variant="h5" fontWeight="800" gutterBottom>
          CURATING NEW ARRIVALS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          We're currently selecting our next season's favorites. 
          Check back soon to explore our latest pieces!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography className='lg:text-[34px]! md:text-[30px]! text-[26px]!' variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>
            NEW ARRIVALS
          </Typography>
          <Typography variant="body2" color="text.secondary">Discover the latest ready-to-wear dresses.</Typography>
          
        </Box>

        {/* Navigation Buttons */}
        {!isMobile && (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handlePrev} sx={{ border: '1px solid #ddd' }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNext} sx={{ border: '1px solid #ddd' }}>
              <ChevronRight />
            </IconButton>
          </Stack>
        )}
      </Box>

      {/* Viewport */}
      <Box
        component={motion.div}
        ref={carousel}
        sx={{
          overflow: isMobile ? 'visible' : 'hidden',
          cursor: isMobile ? 'default' : 'grab',
        }}
      >
        <motion.div
          drag={isMobile ? false : 'x'}
          animate={controls}
          dragConstraints={isMobile ? false : { right: 0, left: -width }}
          whileTap={{ cursor: isMobile ? 'default' : 'grabbing' }}
          style={{
            display: isMobile ? 'block' : 'flex',
            gap: isMobile ? 0 : '16px',
            width: 'max-content' 
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id || product.id}
              style={{
                minWidth: isMobile ? '100%' : '240px',
                marginBottom: isMobile ? '32px' : 0,
                flexShrink: 0,
              }}
            >
              <Box sx={{ position: 'relative', bgcolor: '#f5f5f5', aspectRatio: '3/4', mb: 2, maxWidth: isMobile ? '100%' : '240px' }}>
                <img
                  src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
                
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {/* Badge Logic: prioritize API data, fallback to dummy */}
                  {(product.isNew || product.status === 'active') && (
                    <Box sx={{ bgcolor: '#E67E22', color: 'white', px: 1, py: 0.3, fontSize: '10px', fontWeight: 'bold', borderRadius: '4px' }}>NEW</Box>
                  )}
                  {product.isBest && (
                    <Box sx={{ bgcolor: '#3498DB', color: 'white', px: 1, py: 0.3, fontSize: '10px', fontWeight: 'bold', borderRadius: '4px' }}>BESTSELLER</Box>
                  )}
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" fontWeight="bold">{product.brand || 'OFFICIAL'}</Typography>
              <Typography variant="body2" fontWeight="bold" noWrap>{product.name}</Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                ${(product.price || 0).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {product.colors ? `Available in ${product.colors} colors` : 'Limited Edition'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Rating value={5} size="small" readOnly sx={{ color: '#E67E22' }} />
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

const DUMMY_PRODUCTS = [
  { id: 1, brand: 'KOMONO', name: 'TOTE BAG - VARIANT IMAGE SET', price: 142.50, colors: 3, isNew: true, isBest: true, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400' },
  { id: 2, brand: 'CLOUDNOLA', name: 'RIB AINE LS TOP - CHOCOLATE', price: 38.20, colors: 4, isNew: false, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400' },
  { id: 3, brand: 'MAJESTIC', name: 'NORA JEANS - BLACK CORD', price: 52.00, colors: 1, isNew: false, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400' },
  { id: 4, brand: 'KALEIDOSCOPE', name: 'MANFRED WALLET - TOFFEE', price: 94.00, colors: 3, isNew: false, image: 'https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?q=80&w=400' },
  { id: 5, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
  { id: 6, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
];

export default NewArrivalsSlider;