import React, { useState } from 'react';
import ValuePropsSection from '../../components/card';
import MarqueeSection from '../../components/marq';
import { Box, Sheet, Typography , Button} from "@mui/joy";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Account from '../admin(demo)/account';
import FeaturedPicksGrid from '../admin(demo)/components/featuredProducts';
import NewArrivalsSlider from '../admin(demo)/components/newArrivals';
import NewsletterSignup from '../admin(demo)/components/newsletter';
import Footer from '../admin(demo)/components/footer';
import AllProducts from '../admin(demo)/components/allProducts';
import Hero from '../admin(demo)/components/hero1';


function DemoHome(props) {
    const [openIndex, setOpenIndex] = useState(null);

    const phrases = [
  "Wear Your Identity",
  "Bold Fits Only",
  "Street-Ready Essentials",
  "Designed for the Culture",
  "Everyday Statements",
];
    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const steps = [
        {
            step: "01",
            title: "Choose your build",
            description:
            "Select a package or request a custom build based on your store’s needs and scale.",
        },
        {
            step: "02",
            title: "We design & develop",
            description:
            "We design and build your store using a modern, performance-focused stack, fast and structured.",
        },
        {
            step: "03",
            title: "Review & refine",
            description:
            "You review the build, request adjustments, and we refine until everything is ready.",
        },
        {
            step: "04",
            title: "Launch & handoff",
            description:
            "Your store goes live with clean code, documentation, and optional ongoing support.",
        },
    ];
    const reasons = [
        {
            title: "Built specifically for e-commerce",
            description:
            "Every build is optimized for product discovery, checkout flow, and conversion, not generic layouts.",
        },
        {
            title: "Speed without shortcuts",
            description:
            "We move fast without compromising structure, maintainability, or long-term scalability.",
        },
        {
            title: "Modern, scalable stack",
            description:
            "Clean architecture using modern tooling, designed to grow with your business.",
        },
        {
            title: "Clear delivery & handoff",
            description:
            "You get documented, production-ready code with clarity on what’s delivered and what’s next.",
        },
    ];
    
    const faqs = [
        {
            question: "How fast can my store go live?",
            answer:
            "Most builds are ready in just a few days. We focus on speed without sacrificing quality or structure.",
        },
        {
            question: "Which platforms do you support?",
            answer:
            "We primarily build with modern headless ecommerce stacks, including React.js or NextJs, VueJs and custom solutions depending on your needs.",
        },
        {
            question: "What happens after launch?",
            answer:
            "You get clean, maintainable code, documentation, and optional ongoing support to scale your store safely.",
        },
        {
            question: "Can I request custom features?",
            answer:
            "Absolutely. Every build can be tailored to your requirements, from layout tweaks to full custom integrations.",
        },
        {
            question: "Do you provide support after delivery?",
            answer:
            "Yes. We offer optional post-launch support packages to ensure your store stays fast, secure, and scalable.",
        },
    ];

    return (
        <div>
            {
                (<div>
                    <Hero />
                    <NewArrivalsSlider/>
                    <Box
                    sx={{
                        overflow: "hidden",
                        backgroundColor: "neutral.50",
                        py: 4,
                        position: "relative",
                    }}
                    >
                    <motion.div
                        style={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        }}
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 55,
                        ease: "linear",
                        }}
                    >
                        {phrases.map((text, index) => (
                        <Typography
                            key={index}
                            level="h4"
                            sx={{
                            mx: 6,
                            fontWeight: 600,
                            letterSpacing: "-0.5px",
                            fontSize: { xs: "1.5rem", md: "1.5rem" },
                            display: "inline-block",
                            }}
                            className="flex! gap-2 text lg:text-[px]"
                        >
                            <span className="flex items-center justify-center w-fit h-12 text-[40px]!">*</span> {text} 
                        </Typography>
                        ))}
                    </motion.div>
                    </Box> 
                    <FeaturedPicksGrid/>
                    <AllProducts/>
                    <NewsletterSignup/>

                    
                    <Footer/>
                </div>)
            }
        </div>
    );
}

export default DemoHome;