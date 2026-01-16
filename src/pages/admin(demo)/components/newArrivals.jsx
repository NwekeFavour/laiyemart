import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Rating, Stack, IconButton, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBagOutlined, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../../../services/productService';
import { getSubdomain } from '../../../../storeResolver';

// Accept 'subtitle' and 'storeType' as props
const NewArrivalsSlider = ({ subtitle }) => {
  const [width, setWidth] = useState(0);
  const { fetchStoreProducts, setLocalProducts, products, loading } = useProductStore();
  const navigate = useNavigate();
  
  const carousel = useRef();
  const controls = useAnimation();
  const theme = useTheme();
  const xOffset = useRef(0);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const getCardWidth = () => {
    if (isMobile) return 'calc(75vw)';
    if (isTablet) return 'calc(45vw)';
    if (isMedium) return '280px';
    return '300px';
  };

  const cardWidthValue = getCardWidth();

  useEffect(() => {
    const initData = async () => {
      const isDemo = localStorage.getItem('demo') === 'true';
      const subdomain = getSubdomain();
      if (isDemo || !subdomain) {
        setLocalProducts(DUMMY_PRODUCTS);
      } else {
        await fetchStoreProducts(subdomain);
      }
    };
    initData();
  }, [fetchStoreProducts, setLocalProducts]);

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        const newWidth = carousel.current.scrollWidth - carousel.current.offsetWidth;
        setWidth(newWidth);

        // Keep xOffset within new bounds
        if (xOffset.current < -newWidth) {
          xOffset.current = -newWidth;
          controls.start({ x: -newWidth });
        }
      }
    };

    // Run after images have loaded
    const images = carousel.current?.querySelectorAll('img');
    let loadedCount = 0;
    images?.forEach((img) => {
      if (img.complete) loadedCount++;
      else img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) updateWidth();
      };
    });

    // fallback in case all images are cached
    if (loadedCount === images?.length) updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [products]);


  const handleNext = () => {
    const step = isMobile ? window.innerWidth * 0.75 : 400; 
    const newX = Math.max(xOffset.current - step, -width);
    xOffset.current = newX;
    controls.start({ x: newX, transition: { type: 'spring', damping: 25, stiffness: 120 } });
  };

  const handlePrev = () => {
    const step = isMobile ? window.innerWidth * 0.75 : 400;
    const newX = Math.min(xOffset.current + step, 0);
    xOffset.current = newX;
    controls.start({ x: newX, transition: { type: 'spring', damping: 25, stiffness: 120 } });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress color="inherit" />
    </Box>
  );

  const displayedProducts = products.slice(0, 10);
  const hasMore = products.length > 10;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: '1440px', margin: '0 auto', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography 
            className='lg:text-[34px]! md:text-[30px]! text-[26px]!' 
            variant="h4" 
            fontWeight="800" 
            sx={{ letterSpacing: '-1.5px' }}
          >
            NEW ARRIVALS
          </Typography>
          {/* Use the dynamic subtitle prop here */}
          <Typography variant="body2" color="text.secondary">
            {subtitle || "The latest additions to our collection."}
          </Typography>
        </Box>

        {!isMobile && (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={handlePrev} sx={{ border: '1px solid #eee', bgcolor: 'white' }}><ChevronLeft /></IconButton>
            <IconButton onClick={handleNext} sx={{ border: '1px solid #eee', bgcolor: 'white' }}><ChevronRight /></IconButton>
          </Stack>
        )}
      </Box>

      <Box ref={carousel} sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
        <motion.div
          drag="x"
          animate={controls}
          dragConstraints={{ right: 0, left: -width }}
          onDragEnd={(e, info) => { xOffset.current = info.offset.x; }}
          style={{ display: 'flex', gap: '20px', width: 'max-content' }}
        >
          {displayedProducts.map((product) => (
            <motion.div key={product._id || product.id} style={{ width: cardWidthValue, flexShrink: 0 }}>
              <Box sx={{ position: 'relative', bgcolor: '#f9f9f9', aspectRatio: '3/4', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ opacity: 0.6 }}>{product.brand}</Typography>
                <Typography variant="body2" fontWeight="700" noWrap>{product.name}</Typography>
                <Typography variant="body2" fontWeight="800">₦{(product.price || 0).toLocaleString()}</Typography>
              </Stack>
            </motion.div>
          ))}

          {/* VIEW MORE CARD */}
          {(hasMore || products.length > 0) && (
            <motion.div style={{ width: cardWidthValue, flexShrink: 0 }}>
              <Box 
                onClick={() => navigate('/products')}
                sx={{ 
                  aspectRatio: '3/4', 
                  borderRadius: '12px', 
                  border: '2px dashed #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': { bgcolor: '#f5f5f5', borderColor: '#000' }
                }}
              >
                <Box className="bg-neutral-600/15!" sx={{ color: 'black', p: 2, borderRadius: '50%', mb: 2 }}>
                  <ArrowForwardIos sx={{ fontSize: 18, ml: 0.5 }} />
                </Box>
                <Typography variant="button" fontWeight="800">View All</Typography>
                <Typography variant="caption" color="text.secondary">
                   Explore {products.length} Items
                </Typography>
              </Box>
            </motion.div>
          )}
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
    { id: 7, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
    { id: 8, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
    { id: 9, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
    { id: 10, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
    { id: 11, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
];

export default NewArrivalsSlider;