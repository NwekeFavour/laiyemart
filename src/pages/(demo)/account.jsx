import React, { useState } from "react";
// Added Modal, ModalDialog, ModalClose, Button, Stack
import { 
  Box, Typography, Card, Grid, List, ListItem, ListItemButton, 
  ListItemDecorator, Divider, Avatar, Badge, Modal, ModalDialog, 
  ModalClose, Button, Stack 
} from "@mui/joy";
import { User, Package, Heart, MapPin, LogOut, ChevronRight, ShoppingBag, AlertTriangle } from "lucide-react";
import CustomerAccountLayout from "./layout";
import { logoutCustomer } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerAccountPage({ storeData, customer, isDark }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();
  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    primary: "#ef4444",
    textMuted: isDark ? "#94a3b8" : "#64748b"
  };

const handleConfirmLogout = () => {
  logoutCustomer();
  setTimeout(()=> navigate("/login"), 5000)
  toast.success("Logged out successfully", {
        containerId: "STOREFRONT",
      });
};

  const menuItems = [
    { id: "overview", label: "Account Overview", icon: <User size={20} /> },
    { id: "orders", label: "My Orders", icon: <Package size={20} />, count: 2 },
    { id: "saved", label: "Saved Items", icon: <Heart size={20} /> },
    { id: "address", label: "Address Book", icon: <MapPin size={20} /> },
  ];

  return (
    <CustomerAccountLayout storeData={storeData} title="My Account">
      <Box sx={{ bgcolor: colors.bg, py: { xs: 4, md: 8 }, minHeight: "70vh" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          
          <Grid container spacing={3}>
            {/* LEFT SIDEBAR */}
            <Grid xs={12} md={3.5}>
              <Card sx={{ p: 0, bgcolor: colors.card, border: "1px solid", borderColor: colors.border, borderRadius: "sm", boxShadow: "sm" }}>
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
                        <Typography level="title-sm" sx={{ flex: 1 }}>{item.label}</Typography>
                        {item.count && <Badge size="sm" badgeContent={item.count} color="danger" variant="solid" sx={{ mr: 2 }} />}
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
                      <ListItemDecorator sx={{ color: "inherit" }}><LogOut size={20} /></ListItemDecorator>
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

                  <Typography level="h4" sx={{ mb: 3, fontWeight: 700 }}>Account Overview</Typography>

                 

                  <Grid container spacing={2}>

                    {/* Profile Summary */}

                    <Grid xs={12} sm={6}>

                      <Card variant="outlined" sx={{ height: "100%", borderRadius: "sm" }}>

                        <Typography level="title-sm" sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1, mb: 2, textTransform: "uppercase", letterSpacing: "1px" }}>

                          Account Details

                        </Typography>

                        <Typography level="body-md" sx={{ fontWeight: 600 }}>{customer?.name}</Typography>

                        <Typography level="body-sm" sx={{ color: colors.textMuted, mb: 2 }}>{customer?.email}</Typography>

                        <Typography level="body-xs" sx={{ color: colors.primary, cursor: "pointer", fontWeight: 700 }}>CHANGE PASSWORD</Typography>

                      </Card>

                    </Grid>



                    {/* Address Summary */}

                    <Grid xs={12} sm={6}>

                      <Card variant="outlined" sx={{ height: "100%", borderRadius: "sm" }}>

                        <Typography level="title-sm" sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1, mb: 2, textTransform: "uppercase", letterSpacing: "1px" }}>

                          Address Book

                        </Typography>

                        <Typography level="body-sm" sx={{ color: colors.textMuted }}>Your default shipping address:</Typography>

                        <Typography level="body-md" sx={{ mt: 1, fontWeight: 500 }}>No address found.</Typography>

                        <Typography level="body-xs" sx={{ color: colors.primary, mt: "auto", pt: 2, cursor: "pointer", fontWeight: 700 }}>ADD ADDRESS</Typography>

                      </Card>

                    </Grid>

                  </Grid>

                </Box>

              )}



              {activeTab === "orders" && (

                <Box>

                  <Typography level="h4" sx={{ mb: 3, fontWeight: 700 }}>Recent Orders</Typography>

                  <Card sx={{ textAlign: "center", py: 8, bgcolor: colors.card }}>

                    <Box sx={{ mb: 2, opacity: 0.2 }}><ShoppingBag size={64} style={{ margin: "0 auto" }} /></Box>

                    <Typography level="title-lg">No orders yet</Typography>

                    <Typography level="body-sm" sx={{ mb: 3 }}>Ready to start shopping at {storeData?.name}?</Typography>

                    <ListItemButton sx={{ alignSelf: "center", bgcolor: colors.primary, color: "white", borderRadius: "md", px: 4, "&:hover": { bgcolor: "#cc3333" } }}>

                        START SHOPPING

                    </ListItemButton>

                  </Card>

                </Box>

              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal open={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <ModalClose />
          <Typography level="h4" startDecorator={<AlertTriangle color="#ef4444" />}>
            Confirm Logout
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md">
            Are you sure you want to log out of your account at <strong>{storeData?.name}</strong>?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="plain" color="neutral" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

    </CustomerAccountLayout>
  );
}