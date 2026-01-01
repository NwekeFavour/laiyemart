import React, { useState } from 'react';
import HeroSection from '../components/hero';
import ValuePropsSection from '../components/card';
import MarqueeSection from '../components/marq';
import { Box, Sheet, Typography , Button} from "@mui/joy";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Footer from '../components/footer';


function Home(props) {
    const [openIndex, setOpenIndex] = useState(null);

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
            <HeroSection/>
            <ValuePropsSection/>
            <MarqueeSection/>
            <Box
            component="section"
            className="relative w-full bg-neutral-800 py-20 rounded-t-4 rounded-t-[50px]"
            >
            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16 max-w-2xl"
                >
                <Typography
                    level="h2"
                    className="mb-4 font-medium text-neutral-100! lg:text-[40px]! md:text-[32px]! text-[24px]!"
                >
                    From slow, costly builds to high-performing stores
                </Typography>

                <Typography className="text-neutral-400!">
                    Most e-commerce businesses face the same blockers. We remove them,
                    quickly and deliberately.
                </Typography>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* Problems */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="
                    rounded-xl
                    border border-neutral-700
                    bg-neutral-900/40
                    p-8
                    "
                >
                    <Typography
                    level="h4"
                    className="mb-6 font-medium text-neutral-100!"
                    >
                    What’s slowing most stores down
                    </Typography>

                    <ul className="space-y-4 text-neutral-300">
                    <li>Long development timelines that delay launches</li>
                    <li>Generic themes that don’t convert or scale</li>
                    <li>Poor mobile experience and slow load times</li>
                    <li>Hard-to-maintain, fragile codebases</li>
                    <li>Little to no support after delivery</li>
                    </ul>
                </motion.div>

                {/* Outcomes */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="
                    rounded-xl
                    border border-neutral-700
                    bg-neutral-900/40
                    p-8
                    "
                >
                    <Typography
                    level="h4"
                    className="mb-6 font-medium text-neutral-100!"
                    >
                    What you get instead
                    </Typography>

                    <ul className="space-y-4 text-neutral-300">
                    <li>Production-ready stores built in days, not months</li>
                    <li>Conversion-focused, mobile-first layouts</li>
                    <li>Fast, optimized performance out of the box</li>
                    <li>Clean, scalable architecture built to grow</li>
                    <li>Clear handoff, documentation, and support</li>
                    </ul>
                </motion.div>
                </div>

                {/* Supporting Line */}
                <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-16 max-w-3xl"
                >
                <Typography className="text-neutral-400!">
                    Built for e-commerce owners who prioritize speed, structure, and
                    measurable results.
                </Typography>
                </motion.div>
            </div>
            </Box>

            <Box component="section" className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Heading */}
                    <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-20 max-w-2xl"
                    >
                    <Typography level="h2" className="mb-4 font-medium text-neutral-900 lg:text-[40px]! md:text-[32px]! text-[24px]!">
                        How it works
                    </Typography>
                    <Typography className="text-neutral-600">
                        A simple, structured process designed for speed and clarity.
                    </Typography>
                    </motion.div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((item, index) => (
                        <motion.div
                        key={item.step}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="
                            group relative rounded-2xl
                            border border-neutral-200
                            bg-neutral-50/40
                            p-8
                            transition-shadow
                            hover:shadow-sm
                        "
                        >
                        {/* Accent line */}
                        <span className="absolute left-0 top-8 h-8 w-px bg-neutral-300" />

                        {/* Step */}
                        <span className="mb-6 block text-xs font-medium tracking-wide text-neutral-400">
                            STEP {item.step}
                        </span>

                        {/* Title */}
                        <Typography
                            level="h4"
                            className="mb-3 font-medium text-neutral-900"
                        >
                            {item.title}
                        </Typography>

                        {/* Description */}
                        <Typography className="md:text-[13px]! text-[12px]! leading-relaxed text-neutral-600">
                            {item.description}
                        </Typography>
                        </motion.div>
                    ))}
                    </div>
                </div>
            </Box>
            <Box component="section" className="bg-neutral-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="
                        relative h-[420px] w-full overflow-hidden rounded-2xl
                        border border-neutral-200 bg-neutral-100
                        "
                    >
                        {/* Replace with next/image or img */}
                        <div className="absolute inset-0 flex items-center justify-center text-[13px]! text-neutral-400">
                        Image placeholder
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div>
                        <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 max-w-xl"
                        >
                        <Typography level="h2" className="mb-4 font-medium text-neutral-900 lg:text-[40px]!  md:text-[32px]! text-[24px]!">
                            Why work with us
                        </Typography>
                        <Typography className="text-neutral-600">
                            We focus on speed, structure, and outcomes, so you can launch
                            confidently and scale without friction.
                        </Typography>
                        </motion.div>

                        <div className="space-y-8">
                        {reasons.map((item, index) => (
                            <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                            <Typography
                                level="h4"
                                className="mb-2 font-medium text-neutral-900"
                            >
                                {item.title}
                            </Typography>
                            <Typography className="text-neutral-600">
                                {item.description}
                            </Typography>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
            </Box>
            <Box component="section" className="w-full bg-neutral-800! py-24 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto mb-16 text-center"
                >
                    <Typography level="h2" className="mb-4 lg:text-[40px]! md:text-[32px]! text-[24px]! font-medium text-neutral-100!">
                    Frequently Asked Questions
                    </Typography>
                    <Typography className="text-neutral-400!">
                    Answers to common questions from ecommerce owners like you.
                    </Typography>
                </motion.div>

                <div className="max-w-5xl mx-auto space-y-4">
                    {faqs.map((faq, index) => {
                    const isOpen = index === openIndex;
                    return (
                        <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                        <Sheet
                            variant="outlined"
                            sx={{
                                borderRadius: "0", // no rounded corners
                                backgroundColor: "transparent",
                                borderTop: "none",
                                borderLeft: "none",
                                borderRight: "none",
                                borderBottom: "1px solid",
                                borderColor: "neutral.500",
                                p: 4,
                                cursor: "pointer",
                            }}
                            onClick={() => toggleIndex(index)}
                        >
                            <div className="flex justify-between items-center">
                            <Typography
                                level="body-md"
                                sx={{ fontWeight: 600, color: "neutral.100" }}
                            >
                                {faq.question}
                            </Typography>
                            {isOpen ? (
                                <ChevronUp className="text-neutral-100!" size={20} />
                            ) : (
                                <ChevronDown className="text-neutral-200!" size={20} />
                            )}
                            </div>

                            {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2"
                            >
                                <Typography className="text-neutral-300! leading-relaxed">
                                {faq.answer}
                                </Typography>
                            </motion.div>
                            )}
                        </Sheet>
                        </motion.div>
                    );
                    })}
                </div>
            </Box>
             <Box
                component="section"
                className="w-full bg-neutral-800 py-24 px-4 md:px-6"
                >
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    {/* Heading */}
                    <Typography
                    level="h2"
                    className="mb-6 font-medium text-neutral-100!"
                    >
                    Ready to launch your high-performing store?
                    </Typography>

                    {/* Subheading */}
                    <Typography className="mb-8 text-neutral-400!">
                    Let’s build your store fast, structured, and optimized for real results. Start today and see your ecommerce vision come alive.
                    </Typography>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            className='bg-neutral-100! mt-3! text-neutral-800!'
                        size="lg"
                        sx={{
                            px: 4,
                            fontWeight: 600,
                            borderRadius: "sm",
                        }}
                        >
                        Get Started
                        </Button>
                    </motion.div>

                    </div>
                </motion.div>
            </Box>
            <Footer/>
        </div>
    );
}

export default Home;