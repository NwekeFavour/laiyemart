import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from "@mui/joy";
import { motion } from "framer-motion";
import Hero from '../admin(demo)/components/hero1';
import NewArrivalsSlider from '../admin(demo)/components/newArrivals';
import FeaturedPicksGrid from '../admin(demo)/components/featuredProducts';
import AllProducts from '../admin(demo)/components/allProducts';
import NewsletterSignup from '../admin(demo)/components/newsletter';
import Footer from '../admin(demo)/components/footer';
import StoreNotFound from '../../components/storenotfound';

function DemoHome({ storeSlug }) {
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const validateStore = async () => {
            try {
                setLoading(true);
                // Adjust API URL to your environment
                const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
                const res = await fetch(`${API_URL}/api/stores/public/${storeSlug}`);
                
                const result = await res.json();

                if (!res.ok || !result.success) {
                    setError(true);
                } else {
                    setStoreData(result.data);
                }
            } catch (err) {
                console.error("Store Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (storeSlug) {
            validateStore();
        }
    }, [storeSlug]);

    // 1. Loading State
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
                <CircularProgress color="danger" thickness={4} />
                <Typography level="body-sm" sx={{ letterSpacing: '2px', fontWeight: 700 }}>LAYEMART</Typography>
            </Box>
        );
    }

    // 2. Error State (Not Found)
    if (error) {
        return <StoreNotFound />;
    }

    // 3. Success State (Store Exists)
    const phrases = ["Wear Your Identity", "Bold Fits Only", "Street-Ready Essentials"];

    return (
        <div>
            <Hero storeName={storeData?.name} />
            <NewArrivalsSlider />
            
            <Box sx={{ overflow: "hidden", backgroundColor: "neutral.50", py: 4, position: "relative" }}>
                <motion.div
                    style={{ display: "flex", whiteSpace: "nowrap" }}
                    animate={{ x: ["0%", "-50%"] }} // Changed to -50% for smoother infinite loop
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {[...phrases, ...phrases].map((text, index) => (
                        <Typography key={index} level="h4" sx={{ mx: 6, fontWeight: 600, fontSize: "1.5rem", display: "inline-block" }}>
                            <span style={{ color: '#ef4444' }}>*</span> {text}
                        </Typography>
                    ))}
                </motion.div>
            </Box>

            <FeaturedPicksGrid />
            <AllProducts />
            <NewsletterSignup />
            <Footer storeName={storeData?.name} />
        </div>
    );
}

export default DemoHome;