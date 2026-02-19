import React, { useState, useMemo, useEffect } from "react";
import HeroSection from "../components/hero";
import ValuePropsSection from "../components/card";
import MarqueeSection from "../components/marq";
import { Box, Sheet, Typography, Button } from "@mui/joy";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  Check,
  X,
  PencilRuler,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import Footer from "../components/footer";
import Account from "./admin(demo)/account";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { Container } from "@mui/material";
import { copy } from "../../lib/copy";
import { cn } from "../../lib/cn";

function Home(props) {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate()
  const [mode, setMode] = useState(false);
  const [demo, setDemo] = useState(null);
  const [billing, setBilling] = useState("yearly");
  const rows = 10;
  const cols = 20;

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    // This runs only when the page is refreshed/initially loaded
    localStorage.removeItem("demo");
  }, []);

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
      title: "Create Your Store",
      description:
        "Register with your email address, choose your password and verify your email with otp sent to the email.",
      icon: MousePointerClick,
    },
    {
      step: "02",
      title: "Choose Your Plan",
      description:
        "Select between Starter and Professional Plan, and make payment (monthly or Yearly) via Paystack (Card, Transfer, USSD, Opay, Palmpay) if professional plan is chosen.",
      icon: PencilRuler,
    },
    {
      step: "03",
      title: "Access & Verify",
      description:
        "Access your dashboard, verify your identity and add your bank account details.",
      icon: CheckCircle2,
    },
    {
      step: "04",
      title: "Launch & handoff",
      description:
        "Your Store link is ready on the dashboard to share with customers and start earning.",
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
      {!mode && (
        <div>
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

          <Box id="about-us" component="section" className="bg-white md:py-10 py-10">
            <div  className="mx-auto max-w-7xl px-6">
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
                <Typography className="text-[#0F172A]! text-[20px]! md:text-3xl! font-bold mx- text-foreground!">
                  A simple, structured process designed <br />
                  for speed and clarity.
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
                        <Icon className="h-5 w-5 text-[#4F46E5]" />
                      </div>

                      {/* Accent line */}
                      <span className="absolute left-0 top-8 h-8 w-px bg-neutral-300" />

                      {/* Step */}
                      <span className="mb-6 block text-xs font-medium tracking-wide text-neutral-400">
                        STEP {item.step}
                      </span>

                      {/* Title */}
                      <Typography
                        level="h4"
                        className="mb-3 font-medium text-[#0F172A]!"
                      >
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
            <div className="text-center mt-16">
              <p className="text-muted-foreground sm:w-full w-[300px]  mx-auto mb-4">
                Ready to get started? It takes less than 5 minutes.
              </p>
              <Link
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none bg-slate-900/90 hover:bg-[#4F46E5] text-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 has-[&gt;svg]:px-4"
                to={"/auth/sign-up"}
              >
                Start Your Journey
              </Link>
            </div>
          </Box>
          <section className="relative py-section md:py-section-lg bg-gradient-to-b from-[#f3f4ff] to-[#ffffff] overflow-hidden">
  {/* Background Blobs for Elegance */}
  <span className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-3xl opacity-50"></span>
  <span className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-100/30 blur-3xl opacity-60"></span>

  <Container>
    {/* Header */}
    <SectionHeading
      eyebrow="The Problem"
      title={copy.problem.title}
      description={copy.problem.lead}
      align="center"
      className="mb-16"
    />

    {/* Conversation Flow Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {copy.problem.conversationFlow.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="relative group rounded-3xl border border-neutral-200/10 bg-white/90 p-6 md:p-8 shadow-md hover:shadow-lg transition-all overflow-hidden"
        >
          {/* Accent Circle */}
          <span className="absolute -top-5 -left-5 h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-200 to-blue-200 opacity-20"></span>

          {/* Text */}
          <p className="text-body font-medium text-neutral-900">{item}</p>
        </motion.div>
      ))}
    </div>

    {/* Problem Bullets */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {copy.problem.bullets.map((bullet, index) => (
        <motion.div
          key={bullet}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.12 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className="relative group rounded-3xl border border-neutral-200/10 bg-white/90 p-6 md:p-8 shadow-md hover:shadow-lg transition-all overflow-hidden flex items-start gap-3"
        >
          {/* Bullet Accent Dot */}
          <span className="flex-shrink-0 h-3 w-3 mt-1 rounded-full bg-blue-500"></span>

          <p className="text-body text-neutral-800 font-semibold">{bullet}</p>
        </motion.div>
      ))}
    </div>

    {/* Close Text */}
    <p className="mt-12 text-body fst-italic font-semibold text-neutral-900 max-w-3xl mx-auto text-center">
      {copy.problem.close}
    </p>
  </Container>
</section>


   <section className="py-section md:py-section-lg bg-neutral-50">
      <Container>
        {/* Header */}
        <SectionHeading
          eyebrow="The Solution"
          title={copy.solution.title}
          description={copy.solution.lead}
          align="center"
          className="mb-16"
        />

        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {copy.solution.bullets.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="relative rounded-2xl bg-white border-none p-6 md:p-8 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Optional Icon */}
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-green-50">
                <CheckCircle2 className="w-6 h-6 text-[#4f46e5]" />
              </div>

              {/* Card Text */}
              <p className="text-body text-neutral-900 font-semibold">{item}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center text-center gap-4">
          <p className="text-body text-neutral-900 font-semibold max-w-2xl">
            {copy.solution.close}
          </p>
          <Button
            onClick={() => navigate("/auth/sign-up")}
            className="px-10! py-3!  text-lg bg-[#4f46e5]! md:text-[17px]! text-[16px]! mb-7!"
          >
            {copy.ctas.createStore}
          </Button>
        </div>
      </Container>
    </section>


          <section id="pricing" className="py-24 bg-background! ">
            <div className="container md:mx-auto lg:px-6">
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
                          : "bg-transparent text-gray-500 hover:bg-indigo-100 hover:text-[#4f46e5]/90"
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
                          : "bg-transparent text-gray-500 hover:bg-indigo-100 hover:text-[#4f46e5]/90"
                      }`}
                    >
                      Yearly
                      <span className="inline-flex items-center text-[11px] font-semibold bg-indigo-100 text-indigo-700 rounded-sm px-1 py-0.5">
                        -15%
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Starter */}
                <PricingCard
                  title="Starter"
                  plan={"Starter"}
                  description="For new store owners just getting started"
                  monthly="₦0"
                  yearly="₦0"
                  features={[
                    "Up to 100 products",
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
                  monthly="₦15,000"
                  yearly="₦153,000"
                  features={[
                    "Up to 200 products",
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
                  description="For large businesses"
                  features={["Custom Development & Integration"]}
                  billing={billing}
                />
              </div>
            </div>
          </section>

          {/* <Box component="section" className="w-full bg-neutral-800! py-24 px-4 md:px-6 rounded-t-[50px]">
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
                    </Box> */}
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

              <h1 className=" text-[23px] md:text-[24px] sm:text-4xl md:text-5xl font-semibold text-white mb-8">
                Start your Journey today with Layemart Commerce
              </h1>

              <Link
                className="pointer-events-auto rounded-lg outline-none! bg-white px-6 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
                to={"/auth/sign-in"}
              >
                Get started
              </Link>
            </div>
          </section>
          <section className="py-24 bg-background! xl:px-0 lg:px-6 px-4">
            <div
              className="flex items-center justify-center flex-col text-center gap-5 mb-25"
              style={{ opacity: "1", transform: "none" }}
            >
              <div className="py-1 text-indigo-600 font-semibold border-b-2 border-indigo-600 mb-1.5">
                Get in Touch
              </div>
              <h2 className="text-[20px] md:text-3xl font-bold text-foreground">
                Contact Us
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions or ready to get started with Layemart Commerce? Send us a
                message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left Column - Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-gray-800 font-semibold! md:mb-0 mb-2  text-xl md:text-3xl">
                    Let's Start a Conversation
                  </h3>                  
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
                      <h4 className="font-semibold text-foreground mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:info@layemart.com"
                        className="text-muted-foreground text-slate-600 hover:text-[#4F46E5]  whitespace-pre-line"
                      >
                        info@layemart.com
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
                      <h4 className="font-semibold text-foreground mb-1">
                        Phone
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-line text-slate-600 ">
                        +234 909 4337 227
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
                      <h4 className="font-semibold text-foreground mb-1">
                        Address
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-line text-slate-600 ">
                        292A Solomon Ojuekaiye Street, Abuja, Nigeria.
                      </p>
                      <p className="text-muted-foreground mt-2 whitespace-pre-line text-slate-600 ">
                        83 Olympic Way Wellingborough,
                        <br />
                        NN8 3QB, United Kingdom.
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
          <Footer />
        </div>
      )}
      {mode && <Account setMode={setMode} />}
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
    [],
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    fullName: "",
    userEmail: "",
    details: "",
    budget: "₦500k - ₦1M",
    timeline: "2-4 Weeks",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch coupons on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/coupon/`);
        const data = await res.json();
        if (data.success) setCoupons(data.coupons);
      } catch (err) {
        // silently fail — coupons are optional
      }
    };
    fetchCoupons();
  }, []);

  console.log(coupons)

  const handleAction = (selectedPlan) => {
    if (selectedPlan === "Enterprise" || title === "Enterprise") {
      setIsModalOpen(true);
    } else {
      handlePay(selectedPlan);
    }
  };

  const handlePay = async (selectedPlan) => {
    try {
      const { user, token, store } = useAuthStore.getState();
      if (!token || !user) { window.location.href = "/auth/sign-up"; return; }
      if (!store?._id) { toast.error("No active store selected"); return; }

      const amount =
        selectedPlan === "Starter" ? 29000 :
        selectedPlan === "Professional" ? 99000 : 299000;

      const res = await fetch(`${BACKEND_URL}/api/paystack/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user.email, plan: "PAID", amount, storeId: store._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userEmail || !formData.fullName) {
      toast.error("Please provide your name and email");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/contact-sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Message sent! We will contact you at " + formData.userEmail);
        setIsModalOpen(false);
        setFormData({ fullName: "", userEmail: "", details: "", budget: "₦500k - ₦1M", timeline: "2-4 Weeks" });
      } else {
        throw new Error(data.message || "Failed to send inquiry");
      }
    } catch (err) {
      toast.error(err.message || "Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full md:w-full w-80 sm:w-100 mx-auto relative transition-all duration-300 group hover:border-[#4f46e5] ${
          mostPopular ? "shadow-2xl scale-105 border-[#4f46e5]" : "border-slate-100"
        }`}
      >
        {mostPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="inline-flex items-center justify-center rounded-md text-xs font-medium bg-[#4f46e5] text-white px-2.5 py-1">
              Most Popular
            </span>
          </div>
        )}

        <div className="text-center px-6 py-6">
          <div className="sm:text-2xl text-[30px] font-bold">{title}</div>
          <div className="text-sm text-muted-foreground mb-5">{description}</div>
          <div className="flex items-end justify-center">
            <span className="lg:text-[40px] md:text-[38px] text-[30px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {billing === "monthly" ? monthly : yearly}
            </span>
            {title !== "Enterprise" && (
              <span className="text-muted-foreground ms-1 mb-1">
                /{billing === "monthly" ? "mo" : "yr"}
              </span>
            )}
          </div>
        </div>

        <div className="px-6 space-y-4 flex-1">

          {/* ✅ COUPONS — above features list */}
            {coupons
    .slice(0, 1) // show only the best/first coupon
    .map((coupon) => (
     <span
  key={coupon._id}
  className="absolute -top-5 right-0 inline-flex items-center gap-1 font-bold bg-indigo-600 text-green-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-600"
>
  🏷️ {coupon.discountType === "percentage"
    ? `${coupon.discountPercent}% OFF`
    : `${coupon.discountPercent?.toLocaleString()}% OFF`}
</span>
    ))}

          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-6 mt-auto">
            <button
              onClick={() => handleAction(plan)}
              className={`w-full h-10 rounded-md font-semibold transition ${
                mostPopular
                  ? "bg-[#4f46e5] text-white hover:bg-[#4f46e5]/80"
                  : "border bg-[#0F172A] text-white border-slate-200 hover:bg-[#4f46e5]/80"
              }`}
            >
              {title === "Enterprise" ? "Contact Sales" : "Get Started"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL — unchanged */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Custom Website Request</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Tell us about your project and we'll build a unique e-commerce experience for your brand.
              </p>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Full Name</label>
                    <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#4f46e5] outline-none" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Contact Email</label>
                    <input type="email" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#4f46e5] outline-none" value={formData.userEmail} onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })} placeholder="john@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Project Details</label>
                  <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#4f46e5] outline-none transition-all" rows="4" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} placeholder="E.g. I need a custom theme, wholesale features, and SAP integration..." required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Estimated Budget</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#4f46e5]" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}>
                      <option>₦500k - ₦1M</option>
                      <option>₦1M - ₦5M</option>
                      <option>₦5M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Timeline</label>
                    <select className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#4f46e5]" value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}>
                      <option>2-4 Weeks</option>
                      <option>1-3 Months</option>
                      <option>3+ Months</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#4f46e5] text-white py-3 rounded-lg font-bold hover:bg-[#4f46e5]/90 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : "Send Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  action,
  className,
}) => {
  const aligned = align === "center";
  const inverse = tone === "inverse";

  return (
    <header
      className={cn(
        "mt-10 flex flex-col gap-4",
        aligned ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "rounded-pill px-3 pt-6 text-indigo-600  border-b-2 border-indigo-600 py-1 text-small font-semibold capitalize tracking-wide",
            inverse
              ? "bg-neutral-0/15 text-neutral-0"
              : "bg-accent-200 text-primary-800"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "max-w-3xl text-h2 text-[#0F172A]! text-[20px]! md:text-3xl! font-bold mx- text-foreground",
          inverse ? "text-neutral-0" : "text-neutral-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-3xl text-body",
            inverse ? "text-neutral-100" : "text-neutral-600"
          )}
        >
          {description}
        </p>
      )}
      {action}
    </header>
  );
};
