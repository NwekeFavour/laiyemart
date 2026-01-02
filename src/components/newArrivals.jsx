import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Rating, Stack, IconButton } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const NewArrivalsSlider = () => {
  const [width, setWidth] = useState(0);
  const carousel = useRef();
  const controls = useAnimation();

  // Updated effect to calculate scrollable area
  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  const handleNext = () => {
    // Moves slider left by 300px (one card width roughly)
    controls.start({ x: -300 }); 
  };

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>NEW ARRIVALS</Typography>
          <Typography variant="body2" color="text.secondary">Discover the latest ready-to-wear dresses.</Typography>
          
          <Stack direction="row" spacing={3} mt={3}>
            <Typography fontWeight="bold" sx={{ borderBottom: '2px solid black', pb: 1, cursor: 'pointer' }}>DRESSES</Typography>
            <Typography color="text.secondary" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>BOTTOMS</Typography>
          </Stack>
        </Box>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => controls.start({ x: 0 })} sx={{ border: '1px solid #ddd' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNext} sx={{ border: '1px solid #ddd' }}>
            <ChevronRight />
          </IconButton>
        </Stack>
      </Box>

      {/* The Viewport (Visible Area) */}
      <Box 
        component={motion.div} 
        ref={carousel}
        sx={{ overflow: 'hidden', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
      >
        {/* The Track (Moving Part) */}
        <motion.div
          drag="x"
          animate={controls}
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          style={{ display: 'flex', gap: '20px' }}
        >
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id} 
              style={{ minWidth: '300px', flexShrink: 0 }}
            >
              <Box sx={{ position: 'relative', bgcolor: '#f5f5f5', aspectRatio: '3/4', mb: 2 }}>
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
                
                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {product.isNew && (
                    <Box sx={{ bgcolor: '#E67E22', color: 'white', px: 1, py: 0.3, fontSize: '10px', fontWeight: 'bold', borderRadius: '4px' }}>NEW</Box>
                  )}
                  {product.isBest && (
                    <Box sx={{ bgcolor: '#3498DB', color: 'white', px: 1, py: 0.3, fontSize: '10px', fontWeight: 'bold', borderRadius: '4px' }}>BESTSELLER</Box>
                  )}
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" fontWeight="bold">{product.brand}</Typography>
              <Typography variant="body2" fontWeight="bold" noWrap>{product.name}</Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>${product.price.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">Available in {product.colors} colors</Typography>
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

// Dummy Data
const PRODUCTS = [
  { id: 1, brand: 'KOMONO', name: 'TOTE BAG - VARIANT IMAGE SET', price: 142.50, colors: 3, isNew: true, isBest: true, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400' },
  { id: 2, brand: 'CLOUDNOLA', name: 'RIB AINE LS TOP - CHOCOLATE', price: 38.20, colors: 4, isNew: false, image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400' },
  { id: 3, brand: 'MAJESTIC', name: 'NORA JEANS - BLACK CORD', price: 52.00, colors: 1, isNew: false, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400' },
  { id: 4, brand: 'KALEIDOSCOPE', name: 'MANFRED WALLET - TOFFEE', price: 94.00, colors: 3, isNew: false, image: 'https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?q=80&w=400' },
  { id: 5, brand: 'KOMONO', name: 'OVERSIZED TEE', price: 45.00, colors: 2, isNew: true, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
];

export default NewArrivalsSlider;