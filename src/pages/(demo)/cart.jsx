import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  Sheet,
  Avatar,
  Card,
  Skeleton,
  Modal,
  ModalDialog,
  FormControl,
  Input,
  FormLabel,
} from "@mui/joy";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../services/cartService";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import Header from "../admin(demo)/components/header";
import { toast } from "react-toastify";
import Footer from "../admin(demo)/components/footer";
import { getSubdomain } from "../../../storeResolver";

const CartDashboard = ({ storeSlug, isStarter , storeData}) => {
  const navigate = useNavigate();

  // Store & Auth State
  const { cart, loading, fetchCart, updateQuantity, removeItem } =
    useCartStore();
  const { customer, updateCustomer, token } = useCustomerAuthStore();

  // Local UI State

  const [error, setError] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    phone: "",
  });

  // 1. Auth Guard
  useEffect(() => {
    if (!customer) {
      toast.error("Please login to view your bag!", {
        containerId: "STOREFRONT",
      });
      const timer = setTimeout(() => navigate(getStorePath("/login")), 2000);
      return () => clearTimeout(timer);
    }
  }, [customer, navigate]);

  // 2. Pre-fill Address Form when modal opens or customer loads
  useEffect(() => {
    if (customer?.address) {
      setAddressForm({
        street: customer.address.street || "",
        city: customer.address.city || "",
        state: customer.address.state || "",
        phone: customer.address.phone || "",
      });
    }
  }, [customer]);


  // 4. Fetch Cart once Store is validated
  useEffect(() => {
    if (storeData?._id && customer) {
      fetchCart(storeData._id);
    }
  }, [storeData?._id, customer, fetchCart]);

  const hasAddress = useMemo(() => {
    return !!(
      customer?.address?.street &&
      customer?.address?.city &&
      customer?.address?.phone
    );
  }, [customer]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const API_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/address/save`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-store-slug": storeSlug,
        },
        body: JSON.stringify(addressForm),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update address");

      updateCustomer({ address: result.address });
      toast.success("Address updated successfully!", {
        containerId: "STOREFRONT",
      });
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err.message, { containerId: "STOREFRONT" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomerCheckout = async () => {
    if (!storeData?._id || !storeData?.paystack?.subaccountCode) {
      toast.error("Checkout unavailable. Vendor setup incomplete.");
      return;
    }

    setPayLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paystack/customer-init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-store-slug": storeSlug|| getSubdomain(),
          },
          body: JSON.stringify({
            email: customer.email,
            amount: cart?.cartTotal || 0,
            storeId: storeData._id,
            subaccount: storeData.paystack.subaccountCode, // Directing funds to subaccount
            storeName: storeData.name,
            storeLogo: storeData.logo?.url,
            origin: window.location.origin,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message, { containerId: "STOREFRONT" });
    } finally {
      setPayLoading(false);
    }
  };

  // console.log(cart)
  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };
  if (!storeData && error && !cart)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="danger" level="h4">
          Store "{storeSlug || 'Requested Store'}" not found.
        </Typography>
        <Button variant="plain" onClick={() => navigate(getStorePath("/"))}>
          Go Home
        </Button>
      </Box>
    );

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        storeName={storeData?.name}
        storeLogo={storeData?.logo?.url}
        storeSlug={storeSlug} // Pass the slug
        isStarter={isStarter} // Pass the plan check
      />

      <Box
        sx={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          p: { xs: 2, md: 4 },
        }}
      >
        {(!storeData || (loading && !cart)) ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 4 }}
            >
              <IconButton
                variant="outlined"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />
              </IconButton>
              <Typography level="h3" fontWeight="xl">
                Your Shopping Bag
              </Typography>
            </Stack>

            {isEmpty ? (
              <Sheet
                variant="outlined"
                sx={{
                  p: 8,
                  borderRadius: "xl",
                  textAlign: "center",
                  bgcolor: "background.surface",
                }}
              >
                <ShoppingBag
                  size={48}
                  style={{ opacity: 0.2, margin: "0 auto 16px" }}
                />
                <Typography level="h4">Your bag is empty</Typography>
                <Button
                  className="bg-slate-800/90!"
                  sx={{ mt: 3 }}
                  variant="solid"
                  color="primary"
                  onClick={() => navigate(getStorePath("/"))}
                >
                  Start Shopping
                </Button>
              </Sheet>
            ) : (
              <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                {/* Items List */}
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={2}>
                    {cart.items.map((item) => (
                      <Card
                        key={item.product?._id}
                        orientation="horizontal"
                        variant="outlined"
                        sx={{ gap: 2 }}
                      >
                        <Avatar
                          src={
                            item.product?.images?.[0]?.url ||
                            item.product?.image
                          }
                          variant="rounded"
                          sx={{ width: 100, height: 100 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography level="title-md" fontWeight="bold">
                              {item.product?.name}
                            </Typography>
                            <IconButton
                              size="sm"
                              color="danger"
                              variant="plain"
                              onClick={() =>
                                removeItem(storeData._id, item.product._id)
                              }
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Stack>
                          <Typography level="body-sm" sx={{ mb: 1 }}>
                            ₦{item.product?.price?.toLocaleString()}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <IconButton
                              size="sm"
                              variant="outlined"
                              disabled={item.quantity <= 1 || loading}
                              onClick={() =>
                                updateQuantity(
                                  storeData._id,
                                  item.product._id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus size={14} />
                            </IconButton>
                            <Typography fontWeight="bold">
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="sm"
                              variant="outlined"
                              disabled={loading}
                              onClick={() =>
                                updateQuantity(
                                  storeData._id,
                                  item.product._id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus size={14} />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                </Box>

                {/* Summary Section */}
                <Box sx={{ width: { xs: "100%", md: "350px" } }}>
                  <Sheet
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: "xl",
                      position: "sticky",
                      top: 20,
                    }}
                  >
                    <Typography level="title-lg" sx={{ mb: 2 }}>
                      Order Summary
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="neutral">Subtotal</Typography>
                        <Typography fontWeight="bold">
                          ₦{cart.cartTotal?.toLocaleString()}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography level="h4">Total</Typography>
                        <Typography level="h4">
                          ₦{cart.cartTotal?.toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>

                    {!hasAddress && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: "md",
                          bgcolor: "warning.softBg",
                          border: "1px solid",
                          borderColor: "warning.outlinedBorder",
                        }}
                      >
                        <Typography
                          level="body-xs"
                          color="warning"
                          fontWeight="bold"
                        >
                          Address Required
                        </Typography>
                        <Button
                          size="sm"
                          color="warning"
                          sx={{ mt: 1 }}
                          onClick={() => setIsAddressModalOpen(true)}
                        >
                          Add Shipping Address
                        </Button>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      size="lg"
                      loading={payLoading}
                      disabled={!storeData?.paystack?.verified || !hasAddress}
                      startDecorator={<CreditCard />}
                      sx={{ mt: 4, bgcolor: "neutral.900" }}
                      onClick={handleCustomerCheckout}
                    >
                      {storeData?.paystack?.verified
                        ? "Proceed to Checkout"
                        : "Checkout Unavailable"}
                    </Button>
                  </Sheet>
                </Box>
              </Stack>
            )}
          </>
        )}
      </Box>

      {/* Address Modal */}
      <Modal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <ModalDialog sx={{ maxWidth: 450, width: "100%" }}>
          <Typography level="h4">Shipping Details</Typography>
          <form onSubmit={handleAddressSubmit}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl required>
                <FormLabel>Street Address</FormLabel>
                <Input
                  className="border!"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                />
              </FormControl>
              <Box
                className="md:grid-cols-2! "
                sx={{ display: "grid", gap: 2 }}
              >
                <FormControl required>
                  <FormLabel>City</FormLabel>
                  <Input
                  className="border!"

                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>State</FormLabel>
                  <Input
                  className="border!"

                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                  />
                </FormControl>
              </Box>
              <FormControl required>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  className="border!"

                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
              </FormControl>
              <Button type="submit" loading={isSaving} fullWidth>
                Save & Continue
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      <Footer
        storeDescription={storeData?.description}
        storeLogo={storeData?.logo?.url}
        storeName={storeData?.name}
      />
    </Box>
  );
};

export default CartDashboard;
