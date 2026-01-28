import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
// 1. Import Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import StoreResolver, { getSubdomain } from "../storeResolver";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import CategoriesTable from "./pages/admin(StoreOwner)/category";
import VerifyStore from "./pages/verifyStore";
import CustomerList from "./pages/admin(StoreOwner)/customers";
import Products from "./pages/(demo)/products";
import CartDashboard from "./pages/(demo)/cart";
import { useCustomerAuthStore } from "./store/useCustomerAuthStore";
import { useStoreProfileStore } from "./store/useStoreProfile";
import CustomerAccountPage from "./pages/(demo)/account";
import ResetPasswordPage from "./pages/admin(StoreOwner)/auth/reset";
import { Helmet } from "react-helmet-async";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/joy";
import OrderSuccess from "./pages/admin(demo)/components/orderS";
import ProductPage from "./pages/(demo)/indoproducts";

function App() {
  const subdomain = getSubdomain();
  const { customer } = useCustomerAuthStore();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleDarkMode = (checked) => {
    setIsDark(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };
  useEffect(() => {
    const validateStore = async () => {
      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/stores/public/${subdomain}`);
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

    if (subdomain) validateStore();
  }, [subdomain]);
  if (subdomain) {
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
        {/* Store Identity */}
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
            <Typography
              level="h2"
              sx={{ mb: 1, fontWeight: 800, color: "#111" }}
            >
              {storeName?.toUpperCase()}
            </Typography>
          )}

          {/* Construction Visual */}
          <Box sx={{ position: "relative", my: 4 }}>
            <Typography
              sx={{
                fontSize: "5rem",
                filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
              }}
            >
              🏗️
            </Typography>
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

          {/* Layemart Ad / Branding */}
          <Box
            sx={{
              pt: 4,
              borderTop: "1px solid",
              borderColor: "neutral.200",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              level="body-xs"
              sx={{
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "neutral.500",
              }}
            >
              Powered By
            </Typography>
            <Typography
              level="title-md"
              sx={{
                fontWeight: 900,
                color: "#ef4444", // Your branding color
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              LAYEMART{" "}
              <Box
                component="span"
                sx={{
                  fontSize: "10px",
                  px: 0.5,
                  py: 0.2,
                  bgcolor: "#ef4444",
                  color: "#fff",
                  borderRadius: "2px",
                }}
              >
                PRO
              </Box>
            </Typography>
            <Typography level="body-xs" sx={{ mt: 1 }}>
              Create your own professional store in minutes.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );

    if (storeData && storeData.isOnboarded === false) {
      return (
        <>
          <Helmet>
            <title>{storeData.name} Store | Coming Soon</title>
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
          {/* All store-front related routes go here */}
          <Route path="/" element={<DemoHome storeSlug={subdomain} />} />
          <Route path="/home" element={<DemoHome storeSlug={subdomain} />} />
          <Route path="/login" element={<AuthPage isDark={false} />} />
          <Route path="/register" element={<CustomerSignUp />} />
          <Route path="/shop" element={<Products storeSlug={subdomain} />} />
          <Route path="/shop/product/:id" element={<ProductPage/>}/>
          <Route
            path="/cart"
            element={<CartDashboard storeSlug={subdomain} />}
          />          
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage storeSlug={subdomain} />}
          />
          <Route path="*" element={<div>Store Page Not Found</div>} />
          <Route
            path="/account"
            element={
              <CustomerAccountPage
                storeData={storeData}
                customer={customer}
                isDark={isDark}
              />
            }
          />

          {/* <Route path="/account/orders" element={
            <CustomerAccountLayout isDark={isDark}>
              <OrdersList isDark={isDark} />
            </CustomerAccountLayout>
          } /> */}
        </Routes>
        <ToastContainer
          containerId="STOREFRONT"
          theme="dark" // Dark look for the shop
          position="bottom-right"
          autoClose={2000}
          hideProgressBar
          toastClassName="store-toast" // Custom class for unique CSS
        />
      </div>
    );
  }
  return (
    <div className="hide-scrollbar">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/sign-in" element={<LoginPage />} />
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/auth/redirect" element={<RoleRedirect />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        {/* Super Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
        </Route>

        {/* Store Owners Only */}
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/beta"
            element={
              <StoreOwnerTrialDashboard
                isDark={isDark}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/orders"
            element={
              <OrdersPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/products"
            element={
              <ProductsPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/settings"
            element={
              <SettingsPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/categories"
            element={
              <CategoriesTable
                isDark={isDark}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["OWNER", "SUPER_ADMIN"]} />}
        >
          <Route
            path="/dashboard/customers"
            element={
              <CustomerList isDark={isDark} toggleDarkMode={toggleDarkMode} />
            }
          />
        </Route>
        <Route path="/verify-store-email/:token" element={<VerifyStore />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-3xl font-semibold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
      {/* 2. Add ToastContainer with a clean, modern config */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar // Highly recommended for a clean look
        newestOnTop
        closeOnClick
        theme="light"
        pauseOnHover
        limit={3} // Prevents "Toast Spam" if the user clicks Save many times
      />
    </div>
  );
}

export default App;
