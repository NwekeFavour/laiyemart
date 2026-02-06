import React, { useEffect, useMemo, useState } from "react";
// Added Modal, ModalDialog, ModalClose, Button, Stack
import {
  Box,
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Divider,
  Avatar,
  Badge,
  Modal,
  ModalDialog,
  ModalClose,
  Button,
  Stack,
  AspectRatio,
} from "@mui/joy";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShoppingBag,
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  Captions,
  Truck,
  WalletCards,
  ScrollText,
  Trash2,
  Plus,
  Info,
} from "lucide-react";
import CustomerAccountLayout from "./layout";
import { forgotPasswordCustomer, logoutCustomer } from "../../../services/customerService";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import {
  Alert,
  Checkbox,
  Chip,
  CircularProgress,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Skeleton,
} from "@mui/material";
import { getSubdomain } from "../../../storeResolver";
import { useProductStore } from "../../../services/productService";

export default function CustomerAccountPage({
  storeSlug,
  storeData,
  customer,
  isDark,
  isStarter,
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialTab =
    searchParams.get("tab") || location.state?.activeTab || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const { token } = useCustomerAuthStore.getState();
  const { products, toggleStar } = useProductStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    phone: "",
    label: "",
    isDefault: false,
    country: "Nigeria",
  });
  // console.log(customer);
  const starredProducts = products?.filter((p) => p.star === true) || [];
  const defaultAddress =
    customer?.shippingAddress?.find((addr) => addr.isDefault) ||
    customer?.shippingAddress?.[0];
  const hasAddress = !!defaultAddress;
  const subdomain = getSubdomain();
  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    primary: "#ef4444",
    textMuted: isDark ? "#94a3b8" : "#64748b",
  };
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  const menuItems = [
    { id: "overview", label: "Account Overview", icon: <User size={20} /> },
    {
      id: "orders",
      label: "My Orders",
      icon: <Package size={20} />,
      count: orders?.length,
    },
    { id: "saved", label: "Saved Items", icon: <Heart size={20} /> },
    { id: "address", label: "Address Book", icon: <MapPin size={20} /> },
  ];

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };
  const handleConfirmLogout = () => {
    logoutCustomer();
    setIsLogoutModalOpen(false);
    setTimeout(() => navigate(getStorePath("/login")), 2000);
    toast.success("Logged out successfully", {
      containerId: "STOREFRONT",
    });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Triggered when user clicks the Trash icon
  const confirmDelete = (addressId) => {
    setAddressToDelete(addressId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-store-slug": storeSlug,
          },
        });
        const data = await response.json(); // Fix: Must await .json()
        if (response.ok) {
          setOrders(data.orders);
        } else {
          console.error("Server Error:", data.message);
        }
      } catch (err) {
        console.error("Network Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, token]);

  useEffect(() => {
    if (!modalMode === "edit" && isAddressModalOpen && customer?.address) {
      setAddressForm({
        street: customer.address.street || "",
        city: customer.address.city || "",
        state: customer.address.state || "",
        phone: customer.address.phone || "",
        country: "Nigeria",
      });
    }
  }, [isAddressModalOpen, customer]);

  // Use this for the "Add New" button
  const openAdd = () => {
    setModalMode("add");
    setAddressForm({ street: "", city: "", state: "", phone: "" });
    setIsAddressModalOpen(true);
  };

  // console.log(customer);
  // Use this for the "Edit" button
  const openEdit = (data) => {
    setModalMode("edit");
    setAddressForm(data);
    setIsAddressModalOpen(true);
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const token = useCustomerAuthStore.getState().token;

      // Ensure we are sending the current addressForm state
      // If addressForm._id exists, the backend updates. If null, it pushes.
      const res = await fetch(`${API_URL}/api/address/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-store-slug": subdomain || storeSlug,
        },
        body: JSON.stringify(addressForm),
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.message || "Failed to update address");

      // 1. Sync the global store with the new array returned by the server
      // This ensures your .map() list updates instantly
      useCustomerAuthStore.getState().updateCustomer({
        shippingAddress: result.addresses,
      });
      toast.success(result.message || "Address saved successfully!", {
        containerId: "STOREFRONT",
      });

      // 2. Reset form to a clean state for the next "Add New" click
      setAddressForm({
        _id: null,
        street: "",
        city: "",
        state: "",
        phone: "",
        label: "Home",
        country: "Nigeria",
      });

      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err.message, { containerId: "STOREFRONT" });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteAddress = async (addressId) => {
    setIsDeleting(true);
    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const token = useCustomerAuthStore.getState().token;

      const res = await fetch(`${API_URL}/api/address/delete/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-store-slug": subdomain || storeSlug,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      // Update global state with the new shorter array
      useCustomerAuthStore
        .getState()
        .updateCustomer({ addresses: result.addresses });
      toast.success("Address removed", { containerId: "STOREFRONT" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  const OrderStepper = ({ status }) => {
    // These steps represent the lifecycle of the package after the order is made
    const steps = [
      { id: "pending", label: "Order Placed", icon: <ScrollText size={16} /> },
      { id: "confirmed", label: "Confirmed", icon: <Captions size={16} /> },
      { id: "shipped", label: "Shipped", icon: <Truck size={16} /> },
      { id: "delivered", label: "Delivered", icon: <Package size={16} /> },
    ];

    const getActiveIndex = (s) => {
      const currentStatus = s?.toLowerCase();
      if (currentStatus === "delivered") return 3;
      if (currentStatus === "shipped") return 2;
      if (currentStatus === "confirmed" || currentStatus === "processing")
        return 1;
      return 0; // Default to 'Order Placed'
    };

    const activeIndex = getActiveIndex(status);

    return (
      <div className="flex items-center justify-center flex-wrap lg:flex-nowrap gap-4 lg:gap-1.5 pt-5 mb-12">
        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`text-sm leading-none relative flex items-center gap-1.5 px-4 h-9 rounded-full border font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? "border-[neutral.900]/20 bg-blue-300/30 text-cyan-600"
                      : "border-zinc-200 text-zinc-400 bg-transparent"
                  }`}
              >
                {/* Optional: Add a checkmark for completed steps */}
                <span className="flex items-center justify-center">
                  {step.icon}
                </span>
                {step.label}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`hidden lg:block w-12 h-px border-t border-dashed transition-colors duration-300
                  ${index < activeIndex ? "border-[neutral.900]" : "border-zinc-300"}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const OrderDetailsView = ({ order, onBack }) => (
    <Box sx={{ animateIn: "fade-in", duration: "400ms" }}>
      {/* Back Header */}
      <Button
        onClick={onBack}
        variant="plain"
        startDecorator={<ArrowLeft size={18} />}
        sx={{
          color: "neutral.900",
          p: 0,
          mb: 3,
          fontWeight: 700,
          "&:hover": {
            bgcolor: "transparent",
            textDecoration: "underline neutral.900",
          },
        }}
      >
        BACK TO ORDERS
      </Button>

      <div>
        <p className="md:text-[20px] text-[17px] text-slate-800/90">
          Order Summary
        </p>
        <p className=" text-slate-700 text-[14px] mb-4">
          Review your items before checkout
        </p>
      </div>

      <OrderStepper status={order.productStatus} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Left Column: Items & Delivery Info */}
        <Stack spacing={3}>
          <Card
            className="sm:p-2! p-0!"
            sx={{ borderRadius: "4px", border: "none", bgcolor: "transparent" }}
          >
            <Stack spacing={2}>
              {order.items?.map((item, idx) => (
                <Box
                  className="shadow-sm!"
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 2,
                    maxHeight: 120,
                    p: 2, // Added internal padding
                    bgcolor: "#fff",
                    border: "1px solid #f0f0f0", // Subtle border for each item
                    borderRadius: "8px",
                    transition: "0.2s",
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 100,
                      height: 80,
                      flexShrink: 0,
                      borderRadius: "12px", // Slightly rounded for a modern look
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        "/api/placeholder/100/100"
                      }
                      alt={item.product?.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Product Details */}
                  <Box
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      level="title-sm"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        mb: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.product?.name}
                    </Typography>

                    <Typography
                      level="body-xs"
                      sx={{
                        color: "text.tertiary",
                        bgcolor: "#f5f5f5",
                        px: 1,
                        py: 0.2,
                        borderRadius: "4px",
                        width: "fit-content",
                        mb: 1,
                      }}
                    >
                      Qty: {item.quantity}
                    </Typography>

                    <Box
                      sx={{
                        mt: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <Box>
                        <Typography
                          className="text-slate-800/90! text-[14px]!"
                          level="title-lg"
                          sx={{
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          ₦{item.product?.price.toLocaleString()}
                        </Typography>
                      </Box>

                      {/* Optional: Add a 'Buy Again' or 'Review' button for delivered items */}
                      {order.status === "delivered" && (
                        <Button
                          size="sm"
                          variant="outlined"
                          color="neutral"
                          sx={{ fontSize: "12px" }}
                        >
                          Review
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Card
              sx={{ p: 2, borderRadius: "4px", border: "1px solid #e5e5e5" }}
            >
              <Typography
                level="title-sm"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  fontWeight: 700,
                }}
              >
                <MapPin size={16} /> DELIVERY ADDRESS
              </Typography>
              <Typography level="body-xs" sx={{ lineHeight: 1.6 }}>
                <strong>{order.shippingAddress?.fullName}</strong>
                <br />
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </Typography>
            </Card>

            <Card
              sx={{ p: 2, borderRadius: "4px", border: "1px solid #e5e5e5" }}
            >
              <Typography
                level="title-sm"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  fontWeight: 700,
                }}
              >
                <CreditCard size={16} /> PAYMENT METHOD
              </Typography>
              <Typography level="body-xs" sx={{ textTransform: "capitalize" }}>
                {order.paymentMethod || "Card Payment"}
                <br />
                Total amount: ₦{order.totalAmount?.toLocaleString()}
              </Typography>
            </Card>
          </Box>
        </Stack>

        {/* Right Column: Summary Card */}
        <Box>
          <Card
            sx={{
              p: 2,
              borderRadius: "4px",
              bgcolor: "#f8f9fa",
              border: "none",
              position: "sticky",
              top: 20,
            }}
          >
            <Typography level="title-md" sx={{ mb: 2, fontWeight: 700 }}>
              ORDER SUMMARY
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm">Items total</Typography>
                <Typography level="body-sm">
                  ₦{order.totalAmount?.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm">Delivery fees</Typography>
                <Typography level="body-sm">₦0</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="title-lg" sx={{ fontWeight: 800 }}>
                  Total
                </Typography>
                <Typography
                  level="title-lg"
                  sx={{ fontWeight: 800, color: "neutral.900" }}
                >
                  ₦{order.totalAmount?.toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  return (
    <CustomerAccountLayout
      storeData={storeData}
      title="My Account"
      isStarter={isStarter}
      storeSlug={storeSlug}
    >
      <Box sx={{ bgcolor: colors.bg, py: { xs: 4, md: 8 }, minHeight: "70vh" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Grid container spacing={3}>
            {/* LEFT SIDEBAR */}
            <Grid xs={12} md={3.5}>
              <Card
                sx={{
                  position: { md: "sticky" }, // Only sticky on desktop
                  top: { md: "60px", lg: "100px", xl: "50px" },
                  p: 0,
                  bgcolor: colors.card,
                  border: "1px solid",
                  borderColor: colors.border,
                  borderRadius: "sm",
                  boxShadow: "sm",
                }}
              >
                {/* ... User Info Section ... */}

                <List sx={{ "--ListItem-radius": "0px" }}>
                  {menuItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemButton
                        selected={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemDecorator>{item.icon}</ListItemDecorator>
                        <Typography level="title-sm" sx={{ flex: 1 }}>
                          {item.label}
                        </Typography>
                        {item.count && (
                          <Badge
                            size="sm"
                            badgeContent={item.count}
                            color="danger"
                            variant="solid"
                            sx={{ mr: 2 }}
                          />
                        )}
                        <ChevronRight size={16} opacity={0.3} />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <ListItem>
                    {/* TRIGGER MODAL HERE */}
                    <ListItemButton
                      onClick={() => setIsLogoutModalOpen(true)}
                      sx={{ color: colors.primary }}
                    >
                      <ListItemDecorator sx={{ color: "inherit" }}>
                        <LogOut size={20} />
                      </ListItemDecorator>
                      <Typography level="title-sm">Logout</Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </Card>
            </Grid>

            {/* RIGHT CONTENT */}
            <Grid xs={12} md={8.5}>
              {activeTab === "overview" && (
                <Box>
                  <Typography level="h4" sx={{ mb: 3, fontWeight: 700 }}>
                    Account Overview
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Profile Summary */}

                    <Grid xs={12} sm={6}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%", borderRadius: "sm" }}
                      >
                        <Typography
                          level="title-sm"
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            pb: 1,
                            mb: 2,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Account Details
                        </Typography>

                        <Typography level="body-md" sx={{ fontWeight: 600 }}>
                          {customer?.name}
                        </Typography>

                        <Typography
                          level="body-sm"
                          sx={{ color: colors.textMuted, mb: 2 }}
                        >
                          {customer?.email}
                        </Typography>

                        <Typography
                          className="text-slate-900/80 underline"
                          level="body-xs"
                          sx={{
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                          onClick={() => setIsPassModalOpen(true)}
                        >
                          CHANGE PASSWORD
                        </Typography>
                      </Card>
                    </Grid>


                    <ChangePasswordModal 
                      open={isPassModalOpen} 
                      onClose={() => setIsPassModalOpen(false)} 
                      email={customer?.email}
                      storeData={storeData}
                    />
                    {/* Address Summary */}

                    <Grid xs={12} sm={6}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          borderRadius: "sm",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          level="title-sm"
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            pb: 1,
                            mb: 2,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Address Book
                        </Typography>

                        {hasAddress ? (
                          <Box>
                            <Typography level="body-md" fontWeight={600}>
                              {defaultAddress.street}
                            </Typography>
                            <Typography level="body-sm">
                              {defaultAddress.city}, {defaultAddress.state}
                            </Typography>
                            <Typography level="body-sm" sx={{ mb: 1 }}>
                              {defaultAddress.phone}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography
                            level="body-md"
                            sx={{
                              mt: 1,
                              fontWeight: 500,
                              color: "neutral.500",
                            }}
                          >
                            No address found.
                          </Typography>
                        )}

                        <Typography
                          className="text-slate-900/80 underline!"
                          onClick={() => {
                            if (hasAddress) {
                              openEdit(defaultAddress); // Open modal with default address data
                            } else {
                              openAdd(); // Open empty modal
                            }
                          }}
                          level="body-xs"
                          sx={{
                            mt: "auto",
                            pt: 2,
                            cursor: "pointer",
                            fontWeight: 700,
                            "&:hover": {
                              textDecoration: "underline neutral.900",
                            },
                          }}
                        >
                          {hasAddress ? "EDIT ADDRESS" : "ADD ADDRESS"}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === "orders" && (
                <Box
                  sx={{
                    maxWidth: 800,
                    mx: "auto",
                    px: { xs: 2, md: 0 },
                    py: 2,
                  }}
                >
                  {selectedOrderDetail ? (
                    <OrderDetailsView
                      order={selectedOrderDetail}
                      onBack={() => setSelectedOrderDetail(null)}
                    />
                  ) : (
                    <>
                      <Typography
                        level="h4"
                        sx={{
                          mb: 3,
                          fontWeight: 700,
                          color: "#333",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Package size={24} /> My Orders
                      </Typography>

                      {loading ? (
                        /* --- JUMIA STYLE SKELETON PRELOADER --- */
                        <Stack spacing={2}>
                          {[1, 2, 3].map((i) => (
                            <Card
                              key={i}
                              sx={{
                                p: 2,
                                bgcolor: "#fff",
                                border: "1px solid #e5e5e5",
                                borderRadius: "4px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 2,
                                }}
                              >
                                <Box sx={{ width: "40%" }}>
                                  <Skeleton
                                    variant="text"
                                    width="80%"
                                    height="20px"
                                    sx={{ mb: 1 }}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width="50%"
                                    height="15px"
                                  />
                                </Box>
                                <Skeleton
                                  variant="rectangular"
                                  width={80}
                                  height={24}
                                  sx={{ borderRadius: "2px" }}
                                />
                              </Box>
                              <Divider />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  py: 2,
                                }}
                              >
                                <Skeleton
                                  variant="rectangular"
                                  width={80}
                                  height={80}
                                  sx={{ borderRadius: "4px" }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Skeleton
                                    variant="text"
                                    width="40%"
                                    height="25px"
                                    sx={{ mb: 1 }}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width="20%"
                                    height="20px"
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Skeleton
                                  variant="rectangular"
                                  width={120}
                                  height={35}
                                  sx={{ borderRadius: "4px" }}
                                />
                              </Box>
                            </Card>
                          ))}
                        </Stack>
                      ) : orders.length > 0 ? (
                        /* --- ACTUAL ORDERS LIST --- */
                        <Stack spacing={2}>
                          {orders.map((order) => (
                            <Card
                              key={order._id}
                              sx={{
                                p: 2,
                                border: "1px solid #e5e5e5",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                borderRadius: "4px",
                                bgcolor: "#fff",
                                transition: "0.2s",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                },
                              }}
                            >
                              {/* Header: ID & Status */}
                              <Box
                                className="capitalize!"
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "14px",
                                      color: "#333",
                                    }}
                                  >
                                    ORDER:{" "}
                                    {order.paymentReference?.toUpperCase() ||
                                      order._id.slice(-10).toUpperCase()}
                                  </Typography>
                                  <Typography
                                    level="body-xs"
                                    sx={{ color: "text.tertiary" }}
                                  >
                                    Placed on{" "}
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </Typography>
                                </Box>

                                {order.status}
                              </Box>

                              <Divider sx={{ opacity: 0.5 }} />

                              {/* Product Gallery Section */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  py: 2.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1.5,
                                    flex: 1,
                                    overflowX: "auto",
                                    pb: 0.5,
                                  }}
                                >
                                  {order.items?.map((item, idx) => {
                                    // Try to get image from populated product or fallback to placeholder
                                    const imgSource =
                                      item.product?.images?.[0]?.url ||
                                      item.product?.images?.[0];

                                    return (
                                      <Box key={idx} sx={{ flexShrink: 0 }}>
                                        <Box
                                          key={idx}
                                          sx={{
                                            width: 60,

                                            height: 60,

                                            borderRadius: "4px",

                                            border: "1px solid #eee",

                                            overflow: "hidden",

                                            flexShrink: 0,
                                          }}
                                        >
                                          <img
                                            src={
                                              item.product?.images?.[0].url ||
                                              "/api/placeholder/60/60"
                                            }
                                            alt="product"
                                            style={{
                                              width: "100%",

                                              height: "100%",

                                              objectFit: "cover",
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>

                                <Box
                                  sx={{ textAlign: "right", minWidth: "100px" }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "20px",
                                      fontWeight: 800,
                                      color: "#333",
                                    }}
                                  >
                                    ₦{order.totalAmount.toLocaleString()}
                                  </Typography>
                                  <Typography
                                    level="body-xs"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {order.items.length}{" "}
                                    {order.items.length === 1
                                      ? "Item"
                                      : "Items"}
                                  </Typography>
                                </Box>
                              </Box>

                              <Divider sx={{ opacity: 0.5 }} />

                              {/* Action Button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  mt: 1.5,
                                }}
                              >
                                <Button
                                  className="text-slate-800/90!"
                                  onClick={() => setSelectedOrderDetail(order)}
                                  variant="plain"
                                  size="sm"
                                  sx={{
                                    color: "neutral.900", // Jumia Orange
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    "&:hover": {
                                      bgcolor: "transparent",
                                      textDecoration: "underline neutral.900",
                                    },
                                  }}
                                >
                                  SEE DETAILS
                                </Button>
                              </Box>
                            </Card>
                          ))}
                        </Stack>
                      ) : (
                        /* --- JUMIA EMPTY STATE --- */
                        <Card
                          sx={{
                            textAlign: "center",
                            py: 10,
                            bgcolor: "#fff",
                            border: "1px solid #e5e5e5",
                            borderRadius: "4px",
                          }}
                        >
                          <Box
                            sx={{
                              mb: 3,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor: "#f1f1f1",
                                p: 3,
                                borderRadius: "50%",
                              }}
                            >
                              <ShoppingBag size={60} color="#ccc" />
                            </Box>
                          </Box>
                          <Typography
                            level="title-lg"
                            sx={{ mb: 1, fontWeight: 700 }}
                          >
                            You have no orders yet!
                          </Typography>
                          <Typography
                            level="body-sm"
                            sx={{ mb: 4, maxWidth: "300px", mx: "auto" }}
                          >
                            All your orders will be saved here for you to access
                            and manage anytime.
                          </Typography>
                          <Link
                            className="bg-neutral-800 px-8 py-3 text-white hover:bg-[#e67a0d] transition-colors rounded-sm text-center no-underline font-bold shadow-md uppercase text-sm"
                            to="/shop"
                          >
                            Start Shopping
                          </Link>
                        </Card>
                      )}
                    </>
                  )}
                </Box>
              )}

              {activeTab === "saved" && (
                <Box
                  sx={{
                    maxWidth: 800,
                    mx: "auto",
                    px: { xs: 2, md: 0 },
                    py: 2,
                  }}
                >
                  {/* 1. Filter products locally to find starred items */}
                  {(() => {
                    const starredProducts = products.filter(
                      (p) => p.star === true,
                    );

                    return (
                      <>
                        <Typography
                          level="h4"
                          sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: "#333",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Heart size={24} fill="#e11d48" color="#e11d48" />
                          Saved Items ({starredProducts.length})
                        </Typography>

                        {loading ? (
                          /* --- SKELETON LOADERS --- */
                          <Stack spacing={2}>
                            {[1, 2].map((i) => (
                              <Card
                                key={i}
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  gap: 2,
                                  bgcolor: "#fff",
                                }}
                              >
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={100}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={25}
                                  />
                                  <Skeleton
                                    variant="text"
                                    width="30%"
                                    height={20}
                                  />
                                </Box>
                              </Card>
                            ))}
                          </Stack>
                        ) : starredProducts.length > 0 ? (
                          /* --- STARRED ITEMS LIST --- */
                          <Stack spacing={2}>
                            {starredProducts.map((product) => (
                              <Card
                                key={product._id}
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  flexDirection: { xs: "column", sm: "row" },
                                  gap: 2,
                                  border: "1px solid #e5e5e5",
                                  borderRadius: "4px",
                                  transition: "0.2s",
                                  "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                  },
                                }}
                              >
                                {/* Product Image */}
                                <Box
                                  sx={{
                                    width: { xs: "100%", sm: 100 },
                                    height: 100,
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    border: "1px solid #eee",
                                    flexShrink: 0,
                                  }}
                                >
                                  <img
                                    src={
                                      product.images?.[0]?.url ||
                                      "/api/placeholder/100/100"
                                    }
                                    alt={product.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Box>

                                {/* Product Info */}
                                <Box
                                  sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        color: "#333",
                                        mb: 0.5,
                                      }}
                                    >
                                      {product.name}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "18px",
                                        fontWeight: 800,
                                        color: "#333",
                                      }}
                                    >
                                      ₦{product.price?.toLocaleString()}
                                    </Typography>
                                  </Box>

                                  {/* Actions */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <Button
                                      variant="plain"
                                      color="danger"
                                      size="sm"
                                      // USE TOGGLESTAR HERE
                                      onClick={() =>
                                        toggleStar(product._id, storeData._id)
                                      }
                                      sx={{ fontWeight: 700, p: 0 }}
                                    >
                                      REMOVE
                                    </Button>

                                    <Link
                                      to={getStorePath(`/shop/${product._id}`)}
                                      className="bg-neutral-800 px-4 py-2 text-white rounded-sm text-xs font-bold uppercase no-underline hover:opacity-90"
                                    >
                                      Buy Now
                                    </Link>
                                  </Box>
                                </Box>
                              </Card>
                            ))}
                          </Stack>
                        ) : (
                          /* --- EMPTY STATE --- */
                          <Card
                            sx={{
                              textAlign: "center",
                              py: 10,
                              bgcolor: "#fff",
                              border: "1px solid #e5e5e5",
                            }}
                          >
                            <Box
                              sx={{
                                mb: 3,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: "#f1f1f1",
                                  p: 3,
                                  borderRadius: "50%",
                                }}
                              >
                                <Heart size={60} color="#ccc" />
                              </Box>
                            </Box>
                            <Typography
                              level="title-lg"
                              sx={{ mb: 1, fontWeight: 700 }}
                            >
                              Your wishlist is empty!
                            </Typography>
                            <Typography
                              level="body-sm"
                              sx={{ mb: 4, maxWidth: "300px", mx: "auto" }}
                            >
                              Found something you like? Tap the heart icon to
                              save it here for later.
                            </Typography>
                            <Link
                              className="bg-neutral-800 px-8 py-3 text-white transition-colors rounded-sm font-bold uppercase text-sm no-underline"
                              to={getStorePath("/shop")}
                            >
                              Continue Shopping
                            </Link>
                          </Card>
                        )}
                      </>
                    );
                  })()}
                </Box>
              )}

              {activeTab === "address" && (
                <Box
                  sx={{
                    maxWidth: 800,
                    mx: "auto",
                    px: { xs: 2, md: 0 },
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography level="h4" sx={{ fontWeight: 700 }}>
                      Address Book
                    </Typography>

                    {/* Show "Add New" button if addresses already exist */}
                    {customer?.shippingAddress?.length > 0 && (
                      <Button
                        variant="solid"
                        color="neutral"
                        size="sm"
                        startDecorator={<Plus size={18} />}
                        onClick={openAdd}
                      >
                        Add New
                      </Button>
                    )}
                  </Box>

                  <Stack spacing={2}>
                    {customer?.shippingAddress?.length > 0 ? (
                      customer.shippingAddress.map((addr, i) => (
                        <Card
                          key={i}
                          variant="outlined"
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            borderRadius: "md",
                            gap: 2,
                            transition: "0.2s",
                            position: "relative",
                            "&:hover": {
                              borderColor: "primary.300",
                              bgcolor: "background.surface",
                            },
                          }}
                        >
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mb: 1 }}
                            >
                              <Typography level="title-md" fontWeight={700}>
                                {addr.label || "Home"}
                              </Typography>

                              {/* 1. isDefault Badge */}
                              {addr.isDefault && (
                                <Chip
                                  size="sm"
                                  variant="soft"
                                  color="primary"
                                  sx={{ fontWeight: 700 }}
                                >
                                  DEFAULT
                                </Chip>
                              )}
                            </Stack>

                            <Typography
                              level="body-md"
                              sx={{ fontWeight: 500 }}
                            >
                              {addr.street}
                            </Typography>

                            <Typography level="body-sm" color="neutral">
                              {addr.city}, {addr.state}, {addr.country}
                            </Typography>

                            <Typography
                              level="body-xs"
                              sx={{ mt: 1, color: "neutral.500" }}
                            >
                              Phone: {addr.phone}
                            </Typography>
                          </Box>

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                          >
                            <Button
                              variant="plain"
                              size="sm"
                              onClick={() => openEdit(addr)} // Pass the whole object including _id
                              sx={{ fontWeight: 700 }}
                            >
                              EDIT
                            </Button>

                            <IconButton
                              variant="plain"
                              color="danger"
                              size="sm"
                              onClick={() => confirmDelete(addr._id)}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Stack>
                        </Card>
                      ))
                    ) : (
                      /* 2. Empty State */
                      <Card
                        sx={{
                          textAlign: "center",
                          py: 8,
                          bgcolor: "background.level1",
                          border: "2px dashed",
                          borderColor: "neutral.300",
                        }}
                      >
                        <Typography
                          level="body-md"
                          sx={{ color: "neutral.600", mb: 2 }}
                        >
                          You haven't saved any addresses yet.
                        </Typography>
                        <Button
                          variant="solid"
                          color="neutral"
                          onClick={openAdd}
                          startDecorator={<Plus />}
                        >
                          Add Shipping Address
                        </Button>
                      </Card>
                    )}
                  </Stack>
                </Box>
              )}
              <Modal
                open={isAddressModalOpen}
                onClose={() => !isSaving && setIsAddressModalOpen(false)}
              >
                <ModalDialog
                  sx={{
                    width: { xs: "90vw", sm: 450 },
                    borderRadius: "md",
                  }}
                >
                  <Typography level="h4">
                    {modalMode === "add" ? "Add New Address" : "Edit Address"}
                  </Typography>

                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    {modalMode === "add"
                      ? "Fill in the details below to save a new delivery location."
                      : "Update your existing shipping information."}
                  </Typography>

                  <form onSubmit={handleAddressSubmit}>
                    <Stack spacing={2}>
                      {/* Added Label Field */}
                      <FormControl required>
                        <FormLabel>Address Label</FormLabel>
                        <Input
                          placeholder="e.g. Home, Office, Warehouse"
                          value={addressForm.label}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              label: e.target.value,
                            })
                          }
                          disabled={isSaving}
                          autoFocus
                        />
                      </FormControl>

                      <FormControl required>
                        <FormLabel>Street Address</FormLabel>
                        <Input
                          placeholder="e.g. 123 Main St"
                          value={addressForm.street}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              street: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                      </FormControl>

                      <Stack direction="row" spacing={2}>
                        <FormControl required sx={{ flex: 1 }}>
                          <FormLabel>City</FormLabel>
                          <Input
                            placeholder="Lagos"
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                city: e.target.value,
                              })
                            }
                            disabled={isSaving}
                          />
                        </FormControl>
                        <FormControl required sx={{ flex: 1 }}>
                          <FormLabel>State</FormLabel>
                          <Input
                            placeholder="Lagos State"
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                state: e.target.value,
                              })
                            }
                            disabled={isSaving}
                          />
                        </FormControl>
                      </Stack>

                      <FormControl required>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          placeholder="08012345678"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                          disabled={isSaving}
                        />
                      </FormControl>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "16px",
                          marginBottom: "8px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#333",
                            }}
                          >
                            Set as default address
                          </label>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.75rem",
                              color: "#666",
                            }}
                          >
                            Use this as your primary shipping location
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                          disabled={isSaving}
                        />
                      </div>

                      <Button
                        type="submit"
                        fullWidth
                        loading={isSaving}
                        sx={{ mt: 1 }}
                      >
                        {modalMode === "add"
                          ? "Save Address"
                          : "Update Address"}
                      </Button>
                    </Stack>
                  </form>
                </ModalDialog>
              </Modal>
              <Modal
                open={isDeleteModalOpen}
                onClose={() => !isSaving && setIsDeleteModalOpen(false)}
              >
                <ModalDialog variant="outlined" role="alertdialog">
                  <Typography
                    level="h4"
                    startDecorator={<Trash2 color="red" />}
                  >
                    Confirm Deletion
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography level="body-md">
                    Are you sure you want to delete this address? This action
                    cannot be undone.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="plain"
                      color="neutral"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="solid"
                      color="danger"
                      loading={isDeleting} // This shows the spinner
                      onClick={() => handleDeleteAddress(addressToDelete)}
                    >
                      Delete Address
                    </Button>
                  </Box>
                </ModalDialog>
              </Modal>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <ModalClose />
          <Typography
            level="h4"
            startDecorator={<AlertTriangle color="#ef4444" />}
          >
            Confirm Logout
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md">
            Are you sure you want to log out of your account at{" "}
            <strong>{storeData?.name}</strong>?
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleConfirmLogout}
            >
              Logout
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </CustomerAccountLayout>
  );
}


const ChangePasswordModal = ({ open, onClose, email, storeData }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

const handleTriggerReset = async () => {
  setLoading(true);

  const storeSlug = storeData?.subdomain || storeData?.slug || activeSlug;

  try {
    // 2. Use your centralized helper
    const response = await forgotPasswordCustomer({
      email: email.trim(), // 'email' comes from the modal props
      storeSlug: storeSlug
    });

    // 3. Handle success based on your helper's return structure
    // Assuming your helper returns the data on success
    if (response) {
      setSent(true);
      toast.success("Reset link sent!",{containerId: "STOREFRONT"});
    }
  } catch (err) {
    // 4. If the backend returns 404, the helper likely throws an error
    console.error("Reset Error:", err);
    toast.error(err.response?.data?.message || "User not found in this store.",{containerId: "STOREFRONT"});
  } finally {
    setLoading(false);
  }
};
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ maxWidth: 400, borderRadius: 'md' }}>
        <ModalClose />
        <DialogTitle>Security Update</DialogTitle>
        <DialogContent>
          {sent ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert color="success" variant="soft">
                Reset link sent to your email!
              </Alert>
              <Typography level="body-sm">
                Please check <b>{email}</b> for instructions to update your password.
              </Typography>
              <Button onClick={onClose} fullWidth>Close</Button>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography level="body-sm">
                To update your password, we will send a secure reset link to your registered email address.
              </Typography>
              <Input
                value={email}
                disabled
                startDecorator={<Info size={18} />}
              />
              <Button 
                onClick={handleTriggerReset} 
                loading={loading}
                className="bg-slate-900! text-slate-100!"
                fullWidth
              >
                Send Reset Link
              </Button>
            </Stack>
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};