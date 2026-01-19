import React, { useState, useMemo, useEffect } from 'react';
import HeroSection from '../components/hero';
import ValuePropsSection from '../components/card';
import MarqueeSection from '../components/marq';
import { Box, Sheet, Typography, Button} from "@mui/joy";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, MousePointerClick, PencilRuler, CheckCircle2, Rocket } from "lucide-react";
import Footer from '../components/footer';
import Account from './admin(demo)/account';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';


function Home(props) {
    const [openIndex, setOpenIndex] = useState(null);
    const [mode, setMode] = useState(false);
    const [demo, setDemo] = useState(null)
    const [billing, setBilling] = useState("yearly");
    const rows = 10;
    const cols = 20;




    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
    // This runs only when the page is refreshed/initially loaded
    localStorage.removeItem("demo");
    }, [])

    const handleCreateStore = () => {
    // 1. Toggle the mode
    setMode((prev) => !prev);
    
    // 2. Set the localStorage key with a value
    // I'm assuming you want 'demo' to be 'true'
    localStorage.setItem("demo", "true");
    
    // 3. Optional: Sync the 'demo' state if you have one
    if (setDemo) setDemo(true);
    };

    const steps = [
    {
        step: "01",
        title: "Choose your build",
        description:
        "Select a package or request a custom build based on your store’s needs and scale.",
        icon: MousePointerClick,
    },
    {
        step: "02",
        title: "We design & develop",
        description:
        "We design and build your store using a modern, performance-focused stack, fast and structured.",
        icon: PencilRuler,
    },
    {
        step: "03",
        title: "Review & refine",
        description:
        "You review the build, request adjustments, and we refine until everything is ready.",
        icon: CheckCircle2,
    },
    {
        step: "04",
        title: "Launch & handoff",
        description:
        "Your store goes live with clean code, documentation, and optional ongoing support.",
        icon: Rocket,
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
            {!mode&& 
                (<div>
                    <HeroSection onCreateStore={handleCreateStore} />
                    {/* <ValuePropsSection/> */}
                    {/* <MarqueeSection/> */}
                    {/* <Box
                    component="section"
                    className="relative w-full bg-neutral-800 py-20 rounded-t-4 rounded-t-[50px]"
                    > */}
                    {/* <div className="mx-auto max-w-7xl px-6"> */}
                        {/* Heading */}
                        {/* <motion.div
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
                        </motion.div> */}

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        {/* Problems */}
                        {/* <motion.div
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
                        </motion.div> */}

                        {/* Outcomes */}
                        {/* <motion.div
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
                        </motion.div> */}
                        </div>

                        {/* Supporting Line */}
                        {/* <motion.div
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
                        </motion.div> */}
                    {/* </div> */}
                    {/* </Box> */}

                    <Box component="section" className="bg-white py-24">
                        <div className="mx-auto max-w-7xl px-6">
                            {/* Heading */}
                            <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mb-20 text-center"
                            >
                            <div className="py-1 text-indigo-600 font-semibold border-b-2 border-indigo-600 w-fit mx-auto mb-1.5">
                                How it works
                            </div>
                            <Typography className="text-neutral-600 text-[20px]! md:text-3xl! font-bold mx- text-foreground!">
                                A simple, structured process designed <br/>for speed and clarity.
                            </Typography>
                            </motion.div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {steps.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    whileHover={{ y: -4 }}
                                    className="
                                        group relative rounded-2xl
                                        border border-neutral-200/20
                                        bg-neutral-50/40
                                        p-8
                                        transition-shadow
                                        hover:shadow-sm
                                    "
                                    >
                                    {/* Icon */}
                                    <div className="mb-6 flex mx-auto h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                                        <Icon className="h-5 w-5 text-neutral-700" />
                                    </div>

                                    {/* Accent line */}
                                    <span className="absolute left-0 top-8 h-8 w-px bg-neutral-300" />

                                    {/* Step */}
                                    <span className="mb-6 block text-xs font-medium tracking-wide text-neutral-400">
                                        STEP {item.step}
                                    </span>

                                    {/* Title */}
                                    <Typography level="h4" className="mb-3 font-medium text-neutral-900">
                                        {item.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography className="md:text-[13px]! text-[12px]! leading-relaxed text-neutral-600">
                                        {item.description}
                                    </Typography>
                                    </motion.div>
                                );
                                })}
                            </div>
                        </div>
                        <div className="text-center mt-16"><p className="text-muted-foreground sm:w-full w-[300px]  mx-auto mb-4">Ready to get started? It takes less than 5 minutes.</p><Link data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none bg-slate-900/90 text-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 has-[&gt;svg]:px-4" to={"/auth/sign-up"}>Start Your Journey</Link></div>
                    </Box>
                    <section id="features" className="py-24 bg-background">
                    <div className="container mx-auto px-6">

                        {/* Header */}
                        <div className="flex items-center justify-center flex-col text-center gap-5 mb-16">
                        <div className="py-1 text-indigo-600 font-semibold border-b-2 border-indigo-600 mb-1.5">
                            Platform Capabilities
                        </div>
                        <h2 className="text-[22px] md:text-3xl font-bold text-foreground">
                            Everything You Need to Launch Your Store
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Build, launch, and grow your eCommerce store faster with tools designed to simplify operations and increase sales.
                        </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

                        {/* Feature 1: Quick Store Setup */}
                        <div className="group">
                            <div className="flex flex-col gap-6 rounded-xl h-full bg-background border shadow-sm border-slate-200 transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg hover:border-blue-500">

                            <div className="flex items-start justify-between mb-8">
                                <div className="size-12 rounded-full flex items-center justify-center bg-blue-100/40 dark:bg-blue-950/40 group-hover:scale-110 transition-all duration-500">
                                <svg className="size-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M3 3h18v18H3V3z" />
                                    <path d="M3 9h18" />
                                </svg>
                                </div>

                                <div className="text-right">
                                <div className="text-2xl font-semibold">Launch Fast</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">Setup Time</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-6">Quick Store Setup</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Create your online store in minutes with pre-configured settings, product pages, and payment options—no technical skills needed.
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Feature 2: Prebuilt Templates */}
                        <div className="group">
                            <div className="flex flex-col gap-6 rounded-xl h-full bg-background border shadow-sm border-slate-200 transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg hover:border-red-500">

                            <div className="flex items-start justify-between mb-8">
                                <div className="size-12 rounded-full flex items-center justify-center bg-red-100/40 dark:bg-red-950/40 group-hover:scale-110 transition-all duration-500">
                                <svg className="size-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M12 2l8 4v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z"/>
                                </svg>
                                </div>

                                <div className="text-right">
                                <div className="text-2xl font-semibold">Professional</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">Designs</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-6">Prebuilt Templates</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Choose from a library of beautifully designed templates optimized for sales and mobile experience.
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Feature 3: Integrations */}
                        <div className="group">
                            <div className="flex flex-col gap-6 rounded-xl h-full bg-background border shadow-sm border-slate-200 transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg hover:border-emerald-500">

                            <div className="flex items-start justify-between mb-8">
                                <div className="size-12 rounded-full flex items-center justify-center bg-emerald-100/40 dark:bg-emerald-950/40 group-hover:scale-110 transition-all duration-500">
                                <svg className="size-5 text-emerald-600 flex! items-center! justify-center!" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                                </svg>
                                </div>

                                <div className="text-right">
                                <div className="text-2xl font-semibold">Seamless</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">Integrations</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-6">Seamless Integrations</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Connect payment gateways, shipping providers, and marketing tools effortlessly to streamline store management.
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Feature 4: Analytics */}
                        <div className="group">
                            <div className="flex flex-col gap-6 rounded-xl h-full bg-background border shadow-sm border-slate-200 transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg hover:border-amber-500">

                            <div className="flex items-start justify-between mb-8">
                                <div className="size-12 rounded-full flex items-center justify-center bg-amber-100/40 dark:bg-amber-950/30 group-hover:scale-110 transition-all duration-500">
                                <svg className="size-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M3 3v18h18"/>
                                    <path d="M18 17V9M13 17V5M8 17v-3"/>
                                </svg>
                                </div>

                                <div className="text-right">
                                <div className="text-2xl font-semibold">Actionable</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">Insights</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-6">Analytics & Insights</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Track sales, customer behavior, and marketing performance with real-time analytics for smarter business decisions.
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </div>

                        </div>
                    </div>
                    </section>
                    <section id="pricing" className="py-24 bg-background! ">
                        <div className="container mx-auto px-6">

                            {/* Header */}
                            <div className="flex items-center justify-center flex-col text-center gap-5 mb-10">
                            <div className="py-1 text-[#4f46e5] font-semibold border-b-2 border-indigo-600 mb-1.5">
                                Pricing
                            </div>
                            <h2 className="text-[22px] md:text-3xl font-bold text-foreground">
                                Simple & Transparent Plans
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                Pick the perfect plan for your store. <br />
                                All plans include a 14-day free trial—no credit card required.
                            </p>

                            {/* Toggle Monthly / Yearly */}
                            <div className="flex items-center justify-center mb-18 bg-slate-300/30 rounded-2xl p-2 mt-6">
                                <div className="group/toggle-group flex w-fit items-center bg-accent/20 dark:bg-accent/10 rounded-xl gap-1 p-1.5">
                                    <button
                                    type="button"
                                    onClick={() => setBilling("monthly")}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        billing === "monthly"
                                        ? "bg-[#4f46e5] text-white shadow-md"
                                        : "bg-transparent text-gray-500 hover:bg-indigo-100 hover:text-[#4f46e5]/20"
                                    }`}
                                    >
                                    Monthly
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setBilling("yearly")}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                                        billing === "yearly"
                                        ? "bg-[#4f46e5] text-white shadow-md"
                                        : "bg-transparent text-gray-500 hover:bg-indigo-100 hover:text-[#4f46e5]/20"
                                    }`}
                                    >
                                    Yearly
                                    <span className="inline-flex items-center text-[11px] font-semibold bg-indigo-100 text-indigo-700 rounded-sm px-1 py-0.5">
                                        -20%
                                    </span>
                                    </button>
                                </div>
                                </div>

                            </div>

                            {/* Pricing Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Starter */}
                            <PricingCard
                                title="Starter"
                                plan={"Starter"}
                                description="For new store owners just getting started"
                                monthly="₦29"
                                yearly="₦25"
                                features={[
                                "Up to 5 products",
                                "Basic store templates",
                                "Payment integration",
                                "Email support",
                                ]}
                                billing={billing}
                            />

                            {/* Professional */}
                            <PricingCard
                                title="Professional"
                                plan={"Professional"}
                                description="For growing online stores"
                                monthly="₦99"
                                yearly="₦79"
                                features={[
                                "Up to 50 products",
                                "Advanced templates & layouts",
                                "Marketing tools & SEO",
                                "Priority email support",
                                ]}
                                billing={billing}
                                mostPopular
                            />

                            {/* Enterprise */}
                            <PricingCard
                                title="Enterprise"
                                description="For large businesses with multiple stores"
                                monthly="₦299"
                                yearly="₦249"
                                features={[
                                "Unlimited products",
                                "Custom templates & workflows",
                                "Multi-store management",
                                "Dedicated 24/7 support",
                                "Full API access",
                                ]}
                                billing={billing}
                            />
                            </div>
                        </div>
                    </section>

                    <Box component="section" className="w-full bg-neutral-800! py-24 px-4 md:px-6 rounded-t-[50px]">
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

                        <div className="max-w-3xl mx-auto space-y-4">
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
                    <section className="relative w-full h-[28rem] sm:h-[32rem] md:h-[36rem] overflow-hidden bg-neutral-800">
                    {/* ROTATED GRID */}
                    <div className="absolute inset-[-50%] md:inset-[-20%] rotate-0 md:rotate-9">
                        <div
                        className="grid w-full"
                        style={{
                            gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                            gridTemplateRows: "repeat(24, minmax(0, 1fr))",
                        }}
                        >
                        {Array.from({ length: 24 * 24 }).map((_, i) => (
                            <DiamondCell key={i} />
                        ))}
                        </div>
                    </div>

                    {/* DARK OVERLAY */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neutral-700/20 via-neutral-700/40 to-slate-800/50" />

                    {/* CONTENT */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 sm:px-10">
                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">
                        Ready to get started?
                        </p>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-8">
                        Start your free trial today.
                        </h1>

                        <Link
                        className="pointer-events-auto rounded-lg outline-none! bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-200 transition"
                        to={'/auth/sign-in'}
                        >
                        Get started for free
                        </Link>
                    </div>
                    </section>
                    <section className="py-24 bg-background! xl:px-0 lg:px-6 px-4">
                        <div className="flex items-center justify-center flex-col text-center gap-5 mb-25" style={{opacity: "1", transform: "none"}}>
                            <div className="py-1 text-indigo-600 font-semibold border-b-2 border-indigo-600 mb-1.5">Get in Touch</div>
                            <h2 className="text-[20px] md:text-3xl font-bold text-foreground">Contact Us</h2>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Have questions or ready to get started with Metronic ? Send us a message and we'll respond as soon as possible.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Left Column - Contact Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-gray-800 font-semibold! md:mb-0 mb-2  text-xl md:text-3xl">
                                    Let's Start a Conversation
                                </h3>
                                <p className="text-muted-foreground mb-8">
                                    Whether you're looking to streamline your workflow, boost productivity,
                                    or transform your business operations, we're here to help you succeed.
                                </p>
                                </div>

                                <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-mail size-4 text-muted-foreground mt-1"
                                    aria-hidden="true"
                                    >
                                    <path d="M22 7L13.009 12.727a2 2 0 0 1-2.009 0L2 7"></path>
                                    <rect x={2} y={4} width={20} height={16} rx={2}></rect>
                                    </svg>
                                    <div>
                                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                                    <a
                                        href="mailto:hello@kt.com"
                                        className="text-muted-foreground text-slate-600 hover:text-purple-500 whitespace-pre-line"
                                    >
                                        hello@kt.com
                                    </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-phone size-4 text-muted-foreground mt-1"
                                    aria-hidden="true"
                                    >
                                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                                    </svg>
                                    <div>
                                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                                    <p className="text-muted-foreground whitespace-pre-line text-slate-600 ">
                                        +1 (555) 123-4567
                                    </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-map-pin size-4 text-muted-foreground mt-1"
                                    aria-hidden="true"
                                    >
                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                                    <circle cx={12} cy={10} r={3}></circle>
                                    </svg>
                                    <div>
                                    <h4 className="font-semibold text-foreground mb-1">Address</h4>
                                    <p className="text-muted-foreground whitespace-pre-line text-slate-600 ">
                                        123 Business St, Suite 100
                                        <br />
                                        San Francisco, CA 94102
                                    </p>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Right Column - Contact Form */}
                            <div>
                                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl  py-6 shadow-sm border-border/50">
                                <div className="p-8">
                                    <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                        <label
                                            htmlFor="name"
                                            className="flex items-center gap-2 text-sm font-medium"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Your name"
                                            className="border-input  flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:border-slate-300 focus-visible:shadow-md"
                                        />
                                        </div>

                                        <div className="grid gap-2">
                                        <label
                                            htmlFor="email"
                                            className="flex items-center gap-2 text-sm font-medium"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            className="border-input  flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:border-slate-300 focus-visible:shadow-md"
                                        />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label
                                        htmlFor="subject"
                                        className="flex items-center gap-2 text-sm font-medium"
                                        >
                                        Subject
                                        </label>
                                        <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="What's this about?"
                                        className="border-input  flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:border-slate-300 focus-visible:shadow-md"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <label
                                        htmlFor="message"
                                        className="flex items-center gap-2 text-sm font-medium"
                                        >
                                        Message
                                        </label>
                                        <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us more about your project or question..."
                                        className="border-input  flex h-24 w-full   md:h-30] rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:border-slate-300 focus-visible:shadow-md"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex bg-slate-900/90 text-white items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md w-full px-6"
                                    >
                                        Send Message
                                    </button>
                                    </form>
                                </div>
                                </div>
                            </div>
                        </div> 
                    </section>                         
                    <Footer/>
                </div>)
            }
            {mode && <Account  setMode={setMode}/>}
        </div>
    );
}

export default Home;

function DiamondCell() {
  const [hovered, setHovered] = useState(false);

  const HOVER_COLORS = [
    "bg-blue-400/10 shadow-[0_0_35px_rgba(96,165,250,0.25)]",
    "bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.25)]",
    "bg-purple-400/10 shadow-[0_0_35px_rgba(192,132,252,0.25)]",
    "bg-amber-400/10 shadow-[0_0_35px_rgba(251,191,36,0.25)]",
  ];

  const hoverStyle = useMemo(
    () => HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)],
    []
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative aspect-square w-full h-full"
    >
      {/* Subtle grid line */}
      <div className="absolute inset-0 border border-white/[0.03]" />

      {/* Hover layer */}
      <div
        className={`absolute border border-blue-500/20 inset-0 transition-all duration-300 ease-out ${
          hovered ? hoverStyle : ""
        }`}
      />
    </div>
  );
}

function PricingCard({
  title,
  plan,
  description,
  monthly,
  yearly,
  features,
  billing,
  mostPopular = false,
}) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handlePay = async (selectedPlan) => {
    try {
      const { user, token, store } = useAuthStore.getState();

      // 🔐 Must be logged in
      if (!token || !user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      // 🏪 Must have an active store
      if (!store?._id) {
        alert("No active store selected");
        return;
      }

      const amount =
        selectedPlan === "Starter"
          ? 29000
          : selectedPlan === "Professional"
          ? 99000
          : 299000;

      const res = await fetch(`${BACKEND_URL}/api/payments/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          plan: selectedPlan && "PAID",
          amount,
          storeId: store._id, // ✅ REQUIRED
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");
      console.log(data)
      // 🚀 Redirect to Paystack
      window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full relative transition-all duration-300 group hover:border-[#4f46e5] ${
        mostPopular ? "shadow-2xl scale-105 border-[#4f46e5]" : "border-slate-100"
      }`}
    >
      {mostPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center justify-center rounded-md text-xs font-medium bg-linear-to-r from-[#4f46e5] to-[#4f46e5] text-white px-2.5 py-1">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center px-6 py-6">
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-sm text-muted-foreground mb-5">{description}</div>

        <div className="flex items-end justify-center">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {billing === "monthly" ? monthly : yearly}
          </span>
          <span className="text-muted-foreground ms-1 mb-1">/month</span>
        </div>
      </div>

      <div className="px-6 space-y-4 flex-1">
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <svg
                className="h-5 w-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <div className="pt-6">
          <button
            onClick={() => handlePay(plan)}
            className={`w-full h-10 rounded-md font-semibold transition ${
              mostPopular
                ? "bg-[#4f46e5] text-white hover:bg-[#4f46e5]/80"
                : "border border-slate-200 hover:text-white hover:bg-[#4f46e5]/80"
            }`}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

