import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import CustomerAccountLayout from "./layout";
import { logoutCustomer } from "../../../services/customerService";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import {
  Chip,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
} from "@mui/material";
import { getSubdomain } from "../../../storeResolver";

export default function CustomerAccountPage({ storeData, customer, isDark }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state
  const [orders, setOrders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const { token } = useCustomerAuthStore.getState();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    phone: "",
    country: "Nigeria",
  });

  const hasAddress = customer?.address?.street;
  const subdomain = getSubdomain();
  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    primary: "#ef4444",
    textMuted: isDark ? "#94a3b8" : "#64748b",
  };

  const handleConfirmLogout = () => {
    logoutCustomer();
    setIsLogoutModalOpen(false);
    setTimeout(() => navigate("/login"), 2000);
    toast.success("Logged out successfully", {
      containerId: "STOREFRONT",
    });
  };

  useEffect(() => {
    if (activeTab === "orders") {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/api/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-store-slug": subdomain,
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
    }
  }, [activeTab, token]);

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

  useEffect(() => {
    if (isAddressModalOpen && customer?.address) {
      setAddressForm({
        street: customer.address.street || "",
        city: customer.address.city || "",
        state: customer.address.state || "",
        phone: customer.address.phone || "",
        country: "Nigeria",
      });
    }
  }, [isAddressModalOpen, customer]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const token = useCustomerAuthStore.getState().token;

      const res = await fetch(`${API_URL}/api/address/save`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-store-slug": subdomain,
        },
        body: JSON.stringify(addressForm),
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.message || "Failed to update address");
      // console.log(result);
      // Assuming your store has a setCustomer or update function
      useCustomerAuthStore
        .getState()
        .updateCustomer({ address: result.address });
      toast.success("Address updated successfully!", {
        containerId: "STOREFRONT",
      });
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err.message, {
        containerId: "STOREFRONT",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CustomerAccountLayout storeData={storeData} title="My Account">
      <Box sx={{ bgcolor: colors.bg, py: { xs: 4, md: 8 }, minHeight: "70vh" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Grid container spacing={3}>
            {/* LEFT SIDEBAR */}
            <Grid xs={12} md={3.5}>
              <Card
                sx={{
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
                        >
                          CHANGE PASSWORD
                        </Typography>
                      </Card>
                    </Grid>

                    {/* Address Summary */}

                    <Grid xs={12} sm={6}>
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
                                {customer.address.street}
                              </Typography>
                              <Typography level="body-sm">
                                {customer.address.city},{" "}
                                {customer.address.state}
                              </Typography>
                              <Typography level="body-sm" sx={{ mb: 1 }}>
                                {customer.address.phone}
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
                            onClick={() => setIsAddressModalOpen(true)}
                            level="body-xs"
                            sx={{
                              mt: "auto",
                              pt: 2,
                              cursor: "pointer",
                              fontWeight: 700,
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {hasAddress ? "EDIT ADDRESS" : "ADD ADDRESS"}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* 3. THE ADDRESS MODAL */}
                      <Modal
                        open={isAddressModalOpen}
                        onClose={() =>
                          !isSaving && setIsAddressModalOpen(false)
                        }
                      >
                        <ModalDialog
                          sx={{
                            width: { xs: "90vw", sm: 450 },
                            borderRadius: "md",
                          }}
                        >
                          <Typography level="h4" fontWeight="bold">
                            Shipping Address
                          </Typography>
                          <Typography level="body-sm" sx={{ mb: 2 }}>
                            Provide your delivery details for future orders.
                          </Typography>

                          <form onSubmit={handleAddressSubmit}>
                            <Stack spacing={2}>
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

                              <Button
                                type="submit"
                                fullWidth
                                loading={isSaving}
                                sx={{ mt: 1 }}
                              >
                                {hasAddress ? "Update Address" : "Save Address"}
                              </Button>
                            </Stack>
                          </form>
                        </ModalDialog>
                      </Modal>
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
                            sx={{ display: "flex", justifyContent: "flex-end" }}
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
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
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

                            <Box sx={{ textAlign: "right", minWidth: "100px" }}>
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
                                {order.items.length === 1 ? "Item" : "Items"}
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
                              variant="plain"
                              size="sm"
                              sx={{
                                color: "#f68b1e", // Jumia Orange
                                fontWeight: 700,
                                fontSize: "13px",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  color: "#cc3333",
                                  textDecoration: "underline",
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
                          sx={{ bgcolor: "#f1f1f1", p: 3, borderRadius: "50%" }}
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
                        All your orders will be saved here for you to access and
                        manage anytime.
                      </Typography>
                      <Link
                        className="bg-[#f68b1e] px-8 py-3 text-white hover:bg-[#e67a0d] transition-colors rounded-sm text-center no-underline font-bold shadow-md uppercase text-sm"
                        to="/shop"
                      >
                        Start Shopping
                      </Link>
                    </Card>
                  )}
                </Box>
              )}
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
