import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/joy";
import OrderSuccess from "./pages/admin(demo)/components/orderS";
import ProductPage from "./pages/(demo)/indoproducts";
import AuthSync from "./pages/authsync";
import StoreManagement from "./pages/admin/stores";
import CustomerManagement from "./pages/admin/customers";

function App() {
  const isDashboard = isDashboardSubdomain();
  const subdomain = getSubdomain();
  const { customer } = useCustomerAuthStore();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pathSlug, setPathSlug] = useState(null);
  const [resType, setResType] = useState(null);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const toggleDarkMode = (checked) => {
    setIsDark(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

useEffect(() => {
  const validateStore = async () => {
    const currentPath = window.location.pathname.split("/").filter(Boolean);
    const reserved = ["auth", "auth-sync", "payment", "admin", "unauthorized"];

    // 1. Define the base domain correctly
    const host = window.location.host; // e.g., "localhost:5173" or "layemart.com"
    const isLocal = host.includes("localhost");
    // This removes the subdomain if it exists to get the "root" domain
    const baseDomain = isLocal ? "localhost:5173" : host.split('.').slice(-2).join('.');

    let detectedSlug = subdomain;
    let resolutionType = "subdomain";

    if (!detectedSlug && currentPath.length > 0 && !reserved.includes(currentPath[0])) {
      detectedSlug = currentPath[0];
      resolutionType = "path";
    }

    if (!detectedSlug || isDashboard) {
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/stores/public/${detectedSlug}`);
      const result = await res.json();

      if (res.ok && result.success) {
        const store = result.data;

        // --- PLAN ENFORCEMENT REDIRECTS ---

        // A. STARTER PLAN using a SUBDOMAIN (Wrong! Send to Path)
        if (resolutionType === "subdomain" && store?.plan === "starter") {
          // Redirect from mystore.layemart.com/shop -> layemart.com/mystore/shop
          window.location.href = `${window.location.protocol}//${baseDomain}/${store.subdomain}${window.location.pathname}`;
          return; 
        }

        // B. PRO PLAN using a PATH (Wrong! Send to Subdomain)
        if (resolutionType === "path" && store?.plan === "professional") {
          const cleanPath = window.location.pathname.replace(`/${detectedSlug}`, "") || "/";
          // Redirect from layemart.com/mystore/shop -> mystore.layemart.com/shop
          window.location.href = `${window.location.protocol}//${store.subdomain}.${baseDomain}${cleanPath}`;
          return;
        }

        setStoreData(store);
        setResType(resolutionType);
        if (resolutionType === "path") setPathSlug(detectedSlug);
      }
    } catch (err) {
      console.error("Validation Error:", err);
    } finally {
      setLoading(false);
    }
  };
  validateStore();
}, [subdomain, isDashboard]);
  // Unified context check
  const activeSlug = subdomain || pathSlug;
  const isStorefront = activeSlug && !isDashboard;
  // Handle Under Construction state for Subdomain Stores
  if (isStorefront && storeData?.isOnboarded === false) {
    return (
      <>
        <Helmet>
          <title>{storeData.name} | Coming Soon</title>
        </Helmet>
        <UnderConstructionState
          storeName={storeData.name}
          storeLogo={storeData.logo?.url}
        />
      </>
    );
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
            </Route>
          </>
        )}

        {/* --- CASE 2: STOREFRONT (Subdomain OR Path) --- */}
        {isStorefront && (
          <Route path={pathSlug ? `/${pathSlug}` : "/"}>
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
            <Route path="login" element={<AuthPage isDark={false} storeSlug={activeSlug} isStarter={storeData?.plan === "starter"} storeData={storeData} />} />
            <Route path="register" element={<CustomerSignUp storeData={storeData}  storeSlug={activeSlug} isStarter={storeData?.plan === "starter"} />} />
            <Route path="shop" element={<Products storeSlug={activeSlug} isStarter={storeData?.plan === "starter"} />} />
            <Route path="shop/product/:id" element={<ProductPage storeSlug={activeSlug} />} />
            <Route
              path="cart"
              element={<CartDashboard storeSlug={activeSlug} />}
            />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route
              path="account"
              element={
                <CustomerAccountPage
                  storeData={storeData}
                  customer={customer}
                  isDark={isDark}
                />
              }
            />
            <Route
              path="reset-password/:token"
              element={<ResetPasswordPage storeSlug={activeSlug} />}
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
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route
              path="/verify-store-email/:token"
              element={<VerifyStore />}
            />
          </>
        )}

        {/* --- GLOBAL ROUTES --- */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>

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
