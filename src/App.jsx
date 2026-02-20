import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page Imports
import Home from "./pages/home";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/register";
import SuperAdminDashboard from "./pages/admin/admin";
import StoreOwnerTrialDashboard from "./pages/admin(StoreOwner)/admin";
import Unauthorized from "./components/unauthorized";
import ProtectedRoute from "../ProtectedRoute";
import RoleRedirect from "./components/redirect";
import OrdersPage from "./pages/admin(StoreOwner)/orders";
import ProductsPage from "./pages/admin(StoreOwner)/products";
import SettingsPage from "./pages/admin(StoreOwner)/settings";
import DemoHome from "./pages/(demo)/home";
import AuthPage from "./pages/admin(StoreOwner)/auth/login";
import PaymentSuccess from "./pages/paymentSuccess";
import CustomerSignUp from "./pages/admin(StoreOwner)/auth/register";
import { isDashboardSubdomain, getSubdomain } from "../storeResolver";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import CategoriesTable from "./pages/admin(StoreOwner)/category";
import VerifyStore from "./pages/verifyStore";
import CustomerList from "./pages/admin(StoreOwner)/customers";
import Products from "./pages/(demo)/products";
import CartDashboard from "./pages/(demo)/cart";
import { useCustomerAuthStore } from "./store/useCustomerAuthStore";
import CustomerAccountPage from "./pages/(demo)/account";
import ResetPasswordPage from "./pages/admin(StoreOwner)/auth/reset";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CircularProgress,
  Modal,
  ModalDialog,
  Option,
  Select,
  Textarea,
} from "@mui/joy";
import OrderSuccess from "./pages/admin(demo)/components/orderS";
import ProductPage from "./pages/(demo)/indoproducts";
import AuthSync from "./pages/authsync";
import StoreManagement from "./pages/admin/stores";
import CustomerManagement from "./pages/admin/customers";
import NotFound from "./components/notfound";
import VerifyOTP from "./pages/admin(StoreOwner)/auth/verify";
import { MessageSquarePlus } from "lucide-react";
import OrderDetails from "./pages/(demo)/orderDetails";
import CouponPage from "./pages/admin/coupon";
import VendorStoreWrapper from "./components/VendorStoreWrapper";

function App() {
  const isDashboard = isDashboardSubdomain();
  const subdomain = getSubdomain();
  const customer = useCustomerAuthStore((state) => state.customer);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pathSlug, setPathSlug] = useState(null);
  const [resType, setResType] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const [showConstruction, setShowConstruction] = useState(true)
  const toggleDarkMode = (checked) => {
    setIsDark(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  useEffect(() => {
    const validateStore = async () => {
      const host = window.location.hostname;
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const sub = getSubdomain();

      // 1. Identify the intended slug/subdomain
      let detectedIdentifier = sub || pathParts[0];
      let resolutionType = sub ? "subdomain" : "path";

      // 2. Reserved Routes & Dashboard Guard
      const reserved = [
        "auth",
        "auth-sync",
        "payment",
        "admin",
        "unauthorized",
        "verify-store-email",
      ];
      if (
        !detectedIdentifier ||
        (!sub && reserved.includes(pathParts[0])) ||
        isDashboard
      ) {
        setLoading(false);
        return;
      }

      // 3. SMART CACHE: Skip fetch if storeData is already correct
      if (
        storeData &&
        (storeData.slug === detectedIdentifier ||
          storeData.subdomain === detectedIdentifier)
      ) {
        setLoading(false);
        return;
      }

      try {
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        // Optimization: Backend should use .lean() and .select('slug subdomain plan status _id')
        const res = await fetch(
          `${API_URL}/api/stores/public/${detectedIdentifier}`,
        );
        const result = await res.json();

        if (res.ok && result.success) {
          const store = result.data;
          const hostParts = host.split(".");

          // --- BASE DOMAIN CALCULATION ---
          const isLocal = host.includes("localhost") || host === "127.0.0.1";
          let baseDomain = isLocal
            ? hostParts.includes("localhost")
              ? "localhost"
              : host
            : hostParts.slice(-2).join(".");
          if (isLocal && window.location.port)
            baseDomain += `:${window.location.port}`;

          const targetSub = (store.subdomain || store.slug).toLowerCase();
          const currentFirstPart = hostParts[0].toLowerCase();

          // 4. REDIRECT LOGIC (Starter vs Pro)
          if (resolutionType === "subdomain" && store.plan === "starter") {
            window.location.replace(
              `${window.location.protocol}//${baseDomain}/${targetSub}${window.location.pathname}`,
            );
            return;
          }

          if (
            resolutionType === "path" &&
            (store.plan === "professional" || store.plan === "enterprise")
          ) {
            if (currentFirstPart !== targetSub) {
              const cleanPath =
                window.location.pathname.replace(
                  `/${detectedIdentifier}`,
                  "",
                ) || "/";
              window.location.replace(
                `${window.location.protocol}//${targetSub}.${baseDomain}${cleanPath}`,
              );
              return;
            }
          }

          // 5. FINAL STATE UPDATE
          setStoreData(store);
          setResType(resolutionType);
          if (resolutionType === "path") setPathSlug(detectedIdentifier);
        } else {
          setStoreData(null);
        }
      } catch (err) {
        console.error("Store Validation Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    validateStore();

    // 6. NARROW DEPENDENCIES: Only re-run if the identifier changes, not every path change
  }, [
    subdomain,
    isDashboard,
    window.location.hostname,
    window.location.pathname.split("/")[1],
  ]);
  // Unified context check
  const activeSlug = subdomain || pathSlug;
  const isStorefront = activeSlug && !isDashboard;

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { token } = useCustomerAuthStore.getState();

    if (!activeSlug) {
      toast.error("Error: Could not identify the store.", {containerId: "STOREFRONT"});
      setIsSubmitting(false);
      return;
    }

    if(!token ){
      toast.error("Please login to submit feedback.",{containerId: "STOREFRONT"})
      setIsSubmitting(false);
      return
    }
    const identifier = storeData?.subdomain || storeData?.slug || activeSlug;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-store-slug": identifier,
        },
        body: JSON.stringify({
          category: feedbackCategory,
          message: feedback,
          storeSlug: identifier,
        }),
      });

      const result = await res.json();

      if (res.status === 429) {
        toast.error(result.message, { containerId: "STOREFRONT" }); // "Too many feedback reports..."
        return;
      }

      if (!res.ok) throw new Error(result.message);

      setFeedback("")
      setFeedbackCategory("")
      toast.success("Feedback submitted!", { containerId: "STOREFRONT" });
      setIsFeedbackOpen(false);
    } catch (err) {
      toast.error(err.message, { containerId: "STOREFRONT" });
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle Under Construction state for Subdomain Stores
  // if (isStorefront && storeData?.isOnboarded === false) {
  if (showConstruction) {
    return (
      <>
        <Helmet>
          {/* <title>{storeData.name} | Coming Soon</title> */}
        </Helmet>
        <UnderConstructionState
          // storeName={storeData?.name || "Layemart Commerce"}
          // storeLogo={storeData?.logo?.url || ""}
          storeName={"Layemart Commerce"}
          storeLogo={""}
        />
      </>
    );
  }

  if (loading) {
    return <LoadingScreen />; // Create a simple full-screen spinner
  }
  return (
    <div className="hide-scrollbar">
      <Routes>
        {/* --- SHARED SYSTEM ROUTES --- */}
        <Route path="/auth-sync" element={<AuthSync />} />

        {/* --- CASE 1: DASHBOARD SUBDOMAIN (dashboard.layemart.com) --- */}
        {isDashboard && (
          <>
            <Route path="/auth/sign-in" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER"]} />
              }
            >
              <Route
                path="/"
                element={
                  <StoreOwnerTrialDashboard
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/orders"
                element={
                  <OrdersPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
                }
              />
              <Route
                path="/products"
                element={
                  <ProductsPage
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <SettingsPage
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/categories"
                element={
                  <CategoriesTable
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/customers"
                element={
                  <CustomerList
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route
                  path="/admin/dashboard"
                  element={<SuperAdminDashboard />}
                />
              </Route>
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route path="/admin/stores" element={<StoreManagement />} />
              </Route>
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route
                  path="/admin/customers"
                  element={<CustomerManagement />}
                />
              </Route>
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route
                  path="/admin/coupons"
                  element={<CouponPage />}
                />
              </Route>
            </Route>
          </>
        )}
        

        {/* --- CASE 2: STOREFRONT (Subdomain OR Path) --- */}
        {isStorefront && storeData && (
          <Route path={pathSlug ? `/${pathSlug}` : "/"} element={<VendorStoreWrapper><Outlet/></VendorStoreWrapper>}>
            {/* 'index' matches the base path exactly */}
            <Route
              index
              element={
                <DemoHome storeSlug={activeSlug} resolverType={resType} />
              }
            />

            {/* Sub-routes: These will automatically become /mystore/shop or /shop */}
            <Route
              path="home"
              element={
                <DemoHome storeSlug={activeSlug} resolverType={resType} />
              }
            />
            <Route
              path="verify-otp"
              element={<VerifyOTP storeSlug={activeSlug} isStarter={storeData?.plan ==="starter"} />}
            />
            <Route
              path="login"
              element={
                <AuthPage
                  isDark={false}
                  storeSlug={activeSlug}
                  isStarter={storeData?.plan === "starter"}
                  storeData={storeData}
                />
              }
            />
            <Route
              path="register"
              element={
                <CustomerSignUp
                  storeData={storeData}
                  storeSlug={activeSlug}
                  isStarter={storeData?.plan === "starter"}
                />
              }
            />
            <Route path="account/orders/:orderId" element={<OrderDetails storeSlug={activeSlug} storeData={storeData} isStarter={storeData?.plan === "starter"} storeLogo={storeData.logo?.url} storeName={storeData?.name} />} />
            <Route
              path="shop"
              element={
                <Products
                  storeSlug={activeSlug}
                  isStarter={storeData?.plan === "starter"}
                />
              }
            />
            <Route
              path="shop/product/:id"
              element={
                <ProductPage  />
              }
              
            />
            <Route
              path="cart"
              element={
                <CartDashboard
                  isStarter={storeData?.plan === "starter"}
                  storeSlug={activeSlug}
                  storeData={storeData}
                />
              }
            />
            <Route
              path="order-success"
              element={
                <OrderSuccess
                  isStarter={storeData?.plan === "starter"}
                  storeSlug={activeSlug}
                />
              }
            />
            <Route
              path="account"
              element={
                <CustomerAccountPage
                  storeData={storeData}
                  customer={customer}
                  isDark={isDark}
                  isStarter={storeData?.plan === "starter"}
                  storeSlug={activeSlug}
                />
              }
            />
            <Route
              path="reset-password/:token"
              element={<ResetPasswordPage isStarter={storeData?.plan === "starter"} storeData={storeData} storeSlug={activeSlug} />}
            />
          </Route>
        )}

        {/* --- CASE 3: MAIN LANDING PAGE (layemart.com) --- */}
        {!isStorefront && !isDashboard && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/auth/sign-in" element={<LoginPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/redirect" element={<RoleRedirect />} />
            <Route path="/payment/success" element={<PaymentSuccess isStarter={storeData?.plan === "starter"} storeData={storeData} />} />
            <Route
              path="/verify-store-email/:token"
              element={<VerifyStore />}
            />
          </>
        )}

        {/* --- GLOBAL ROUTES --- */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isStorefront && storeData && (
        <>
          {/* FLOATING FEEDBACK BUTTON */}
          <IconButton
            variant="solid"
            color="primary"
            size="lg"
            onClick={() => setIsFeedbackOpen(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              borderRadius: "50%",
              boxShadow: "lg",
              zIndex: 1000,
              "&:hover": { transform: "scale(1.1)" },
              transition: "0.2s",
            }}
          >
            <MessageSquarePlus size={24} />
          </IconButton>

          {/* FEEDBACK MODAL */}
          <Modal
            open={isFeedbackOpen}
            onClose={() => !isSubmitting && setIsFeedbackOpen(false)}
          >
            <ModalDialog sx={{ width: { xs: "90vw", sm: 400 } }}>
              <Typography level="h4">Share your thoughts</Typography>
              <Typography level="body-sm" sx={{ mb: 2 }}>
                Help us improve your experience at this store.
              </Typography>

              <form onSubmit={handleFeedbackSubmit}>
                <Stack spacing={2}>
                  {/* CATEGORY SELECTION */}
                  <FormControl required>
                    <FormLabel>Topic</FormLabel>
                    <Select
                      value={feedbackCategory}
                      onChange={(_, newValue) => setFeedbackCategory(newValue)}
                    >
                      <Option value="general">General Feedback</Option>
                      <Option value="complaint">Report a Complaint</Option>
                      <Option value="bug">Technical Bug/Error</Option>
                      <Option value="delivery">Shipping & Delivery</Option>
                      <Option value="product">Product Inquiry</Option>
                    </Select>
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Your Message</FormLabel>
                    <Textarea
                      minRows={4}
                      placeholder={
                        feedbackCategory === "bug"
                          ? "What went wrong?"
                          : "Tell us more..."
                      }
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    className="bg-slate-900! text-slate-100!"
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    disabled={!feedback.trim()} // Prevent empty submissions
                  >
                    {isSubmitting
                      ? "Sending..."
                      : `Submit ${feedbackCategory === "complaint" ? "Report" : "Feedback"}`}
                  </Button>
                </Stack>
              </form>
            </ModalDialog>
          </Modal>
        </>
      )}
      {/* --- TOAST CONTAINERS --- */}
      {/* Container specifically for the Storefront side */}
      {isStorefront && (
        <ToastContainer
          containerId="STOREFRONT"
          theme="dark"
          position="bottom-right"
          autoClose={2000}
          hideProgressBar
          toastClassName="store-toast"
        />
      )}

      {/* Container for Dashboard and Main Landing */}
      {(!isStorefront || isDashboard) && (
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          theme="light"
          pauseOnHover
          limit={3}
        />
      )}
    </div>
  );
}

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa] text-slate-900 overflow-hidden">
    {/* Top Progress Bar - Royal Indigo */}
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-1 bg-[#2D2A70] z-50 shadow-[0_0_10px_rgba(45,42,112,0.3)]"
    />

    <div className="flex flex-col items-center gap-8">
      {/* Logo Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Soft Branding Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-32 w-32 bg-[#2D2A70] rounded-full blur-3xl"
        />

        {/* Logo Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center justify-center"
        >
          <img 
            src="https://res.cloudinary.com/dzrfqk1zk/image/upload/v1771239090/layemart-icon-removebg-preview_lh5vom.png" 
            alt="Layemart Logo" 
            className="h-16 w-auto object-contain"
          />
          
          {/* Animated Orbit Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-[1.5px] border-transparent border-t-[#2D2A70] rounded-[2rem] opacity-40"
          />
        </motion.div>
      </div>

      {/* Modern Text Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-lg font-black tracking-[0.3em] text-[#2D2A70] uppercase">
          LAYE<span className="text-slate-400 font-light">MART</span>
        </h2>
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="h-1 w-1 rounded-full bg-[#2D2A70]"
            />
          ))}
        </div>
      </motion.div>
    </div>

    {/* Footer Detail */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-12 flex flex-col items-center gap-2"
    >
      <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
        Layemart Engine
      </span>
      <div className="h-[1px] w-8 bg-slate-200" />
    </motion.div>
  </div>
);
// Sub-component for clean rendering
const UnderConstructionState = ({ storeName, storeLogo }) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      px: 3,
      background: "linear-gradient(180deg, #fff 0%, #f9fafb 100%)",
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {storeLogo ? (
        <img
          src={storeLogo}
          alt={storeName}
          style={{ height: "60px", marginBottom: "16px" }}
        />
      ) : (
        <Typography level="h2" sx={{ mb: 1, fontWeight: 800, color: "#111" }}>
          {storeName?.toUpperCase()}
        </Typography>
      )}
      <Box sx={{ position: "relative", my: 4 }}>
        <Typography sx={{ fontSize: "5rem" }}>🏗️</Typography>
        <CircularProgress
          color="warning"
          size="lg"
          thickness={2}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            "--CircularProgress-size": "120px",
          }}
        />
      </Box>
      <Typography level="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Coming Soon
      </Typography>
      <Typography
        level="body-lg"
        sx={{ color: "text.secondary", maxWidth: 500, mx: "auto", mb: 4 }}
      >
        We are currently building something amazing for you.{" "}
        <strong>{storeName}</strong> is putting on the finishing touches.
      </Typography>
    </motion.div>
  </Box>
);

export default App;
