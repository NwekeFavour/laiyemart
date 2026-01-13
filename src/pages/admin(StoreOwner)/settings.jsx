import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Input, Sheet, 
  Divider, FormControl, FormLabel, Avatar, Stack, Switch
} from "@mui/joy";
import { User, Store, Bell, Shield, Save, Globe, Mail } from "lucide-react";
import StoreOwnerLayout from './layout';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import { useStoreProfileStore } from '../../store/useStoreProfile';

export default function SettingsPage() {
    const { updateStoreProfile, loading } = useStoreProfileStore();
    const [activeSection, setActiveSection] = useState('profile');
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [storeDits, setStoreDits] = useState("")
    const {store, user, token} = useAuthStore()
    const [isUpdating, setIsUpdating] = useState(false);
    const [formEmail, setFormEmail] = useState(store?.email);
    const [logoFile, setLogoFile] = useState(null);
    useEffect(() => {
    if (store?.logo?.url) {
        setPreviewUrl(store.logo.url);
        setLogoFile(null); // Clear the pending file since it's now saved
    }
    }, [store]);
    const [previewUrl, setPreviewUrl] = useState(store.logo?.url || "");
    console.log(store)
  const menuItems = [
    { id: 'profile', label: 'Store Profile', icon: <Store size={18} /> },
    { id: 'account', label: 'Account Info', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

    const handleSave = async () => {
    // 1. Basic Validation
    if (!formEmail) {
        toast.error("Email is required");
        return;
    }

    try {
        // 2. Trigger the Zustand Action
        // Note: Ensure your updateStoreProfile action returns the data
        const result = await updateStoreProfile({ 
        email: formEmail, 
        logo: logoFile, 
        token 
        });

        // 3. Handle Success Feedback
        // If the email was changed, show a specific message about verification
        if (formEmail !== store.email) {
        toast.success("Profile updated! Please check your email to verify.", {
            icon: '📩',
            duration: 6000
        });
        } else {
        toast.success("Store profile updated successfully");
        }
        console.log(store?.isEmailVerified)
        // 4. Reset local file state now that upload is complete
        setLogoFile(null);

    } catch (err) {
        // 5. Handle Error Feedback
        // The 'err' here will be the thrown Error(data.message) from your store
        console.error("Update Error:", err.message);
        toast.error(err.message || "Failed to update store profile");
    }
    };

    const handlePasswordUpdate = async () => {
        // 1. Validation
        if (!passwords.newPassword) {
            toast.error("Please enter a new password");
            return;
        }
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // 2. State & Token Retrieval
        // Using getState() here is fine inside the handler to get the current snapshot
        const token = useAuthStore.getState().token;
        
        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        setIsUpdating(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ newPassword: passwords.newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully!");
                // Clear the form fields after success
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            // Error is an object; toast.error needs a string
            toast.error("Network error. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };
//   console.log(user)

  return (
    <StoreOwnerLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: {xs:2} }}>
        {/* Header */}
        <Box>
            <Typography level="h2" sx={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Settings</Typography>
            <Typography level="body-sm" sx={{ color: '#64748b' }}>Manage your store preferences and account settings</Typography>
        </Box>

        <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            alignItems: 'flex-start' 
        }}>
            {/* Settings Sidebar Navigation */}
            <Sheet variant="outlined" sx={{ 
            width: { xs: '100%', md: 240 }, 
            borderRadius: 'xl', 
            p: 1, 
            bgcolor: 'white' 
            }}>
            {menuItems.map((item) => (
                <Button
                key={item.id}
                variant={activeSection === item.id ? 'soft' : 'plain'}
                color={activeSection === item.id ? 'primary' : 'neutral'}
                onClick={() => setActiveSection(item.id)}
                startDecorator={item.icon}
                sx={{
                    justifyContent: 'flex-start',
                    width: '100%',
                    mb: 0.5,
                    fontWeight: 600,
                    borderRadius: 'lg',
                    ...(activeSection === item.id ? { bgcolor: '#f1f5f9', color: '#0f172a' } : { color: '#64748b' })
                }}
                >
                {item.label}
                </Button>
            ))}
            </Sheet>

            {/* Settings Content Area */}
            <Sheet variant="outlined" sx={{ 
            flex: 1, 
            borderRadius: 'xl', 
            p: { xs: 2, md: 4 }, 
            bgcolor: 'white' 
            }}>
            {activeSection === 'profile' && (
                <Stack gap={3}>
                <Box>
                    <Typography level="h4" sx={{ fontWeight: 700 }}>Store Profile</Typography>
                    <Typography level="body-sm">This information will be displayed publicly to your customers.</Typography>
                </Box>
                
                <Divider />

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Store Logo</FormLabel>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                            src={previewUrl}
                            sx={{ '--Avatar-size': '64px', bgcolor: '#0f172a', border: '1px solid #e2e8f0' }} 
                        />
                        <Button component="label" variant="outlined" color="neutral" size="sm">
                            Change Logo
                            <input 
                                type="file" 
                                hidden 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setLogoFile(file);
                                    setPreviewUrl(URL.createObjectURL(file));
                                }} 
                            />
                        </Button>
                    </Stack>
                </FormControl>



                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Store Name</FormLabel>
                    <Input className='placeholder:capitalize!' value={store.name} disabled placeholder="Layemart Store" sx={{ flex: 1, maxWidth: 400 }} />
                </FormControl>

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Subdomain</FormLabel>
                    <Input 
                    value={store.subdomain}
                    disabled
                    startDecorator={<Globe size={16} />} 
                    endDecorator={<Typography level="body-xs">.layemart.com</Typography>}
                    placeholder="mystore" 
                    sx={{ flex: 1, maxWidth: 400 }} 
                    />
                </FormControl>

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                <FormLabel sx={{ minWidth: 140 }}>Support Email</FormLabel>
                <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <Input 
                    value={formEmail} 
                    onChange={(e) => setFormEmail(e.target.value)}
                    startDecorator={<Mail size={16} />} 
                    endDecorator={
                        store?.isEmailVerified ? (
                        <Typography level="body-xs" color="success" sx={{ fontWeight: 'bold' }}>
                            VERIFIED
                        </Typography>
                        ) : (
                        <Typography level="body-xs" color="warning" sx={{ fontWeight: 'bold' }}>
                            PENDING
                        </Typography>
                        )
                    }
                    />
                    
                    {/* This block detects the change immediately after the API call finishes */}
                    {!store?.isEmailVerified && formEmail !== store.email && (
                    <Typography 
                        level="body-xs" 
                        sx={{ 
                        mt: 1, 
                        color: 'orange',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        // CSS Animation to make it pop in
                        animation: 'fadeIn 0.4s ease-out' 
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>✉️</span> Check your inbox to verify <strong>{store?.email}</strong>
                    </Typography>
                    )}
                </Box>
                </FormControl>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="plain" color="neutral">Cancel</Button>
                    <Button 
                    loading={loading}
                    onClick={handleSave}
                    startDecorator={<Save size={18} />} 
                    sx={{ bgcolor: '#0f172a', borderRadius: 'lg' }}
                    className='hover:bg-slate-800/90!'
                    >
                    Save Changes
                    </Button>
                </Box>
                </Stack>
            )}

            {activeSection === 'notifications' && (
                <Stack gap={3}>
                <Box>
                    <Typography level="h4" sx={{ fontWeight: 700 }}>Notification Preferences</Typography>
                    <Typography level="body-sm">Control how you receive updates about your store.</Typography>
                </Box>
                <Divider />
                
                {[
                    { title: 'Email Notifications', desc: 'Receive daily summaries of your sales.' },
                    { title: 'New Order Alerts', desc: 'Get notified immediately when a customer places an order.' },
                    { title: 'Inventory Alerts', desc: 'Receive alerts when products go out of stock.' }
                ].map((notif, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography sx={{ fontWeight: 600 }}>{notif.title}</Typography>
                        <Typography level="body-xs">{notif.desc}</Typography>
                    </Box>
                    <Switch defaultChecked color="success" size="lg" />
                    </Box>
                ))}
                </Stack>
            )}

            {activeSection === 'account' && (
                <Stack gap={3}>
                    <Box>
                        <Typography level="h4" sx={{ fontWeight: 700 }}>
                            Account Information
                        </Typography>
                        <Typography level="body-sm">
                            Manage your personal account details and security.
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Email & Role (Disabled as per your code) */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Email Address</FormLabel>
                        <Input
                            value={user?.email || ""}
                            disabled
                            startDecorator={<Mail size={16} />}
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Account Role</FormLabel>
                        <Input
                            value={user?.role === "OWNER" ? "Store Owner" : user?.role}
                            disabled
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <Divider />

                    {/* Password Section */}
                    <Box>
                        <Typography level="title-md" sx={{ fontWeight: 700 }}>
                            Password
                        </Typography>
                        <Typography level="body-xs">
                            Change your account password.
                        </Typography>
                    </Box>

                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>New Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            error={passwords.confirmPassword !== "" && passwords.newPassword !== passwords.confirmPassword}
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button 
                            variant="plain" 
                            color="neutral"
                            onClick={() => setPasswords({ newPassword: '', confirmPassword: '' })}
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={isUpdating}
                            onClick={handlePasswordUpdate}
                            startDecorator={<Save size={18} />}
                            sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                            className="hover:bg-slate-800/90!"
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Stack>
            )}

            </Sheet>
        </Box>
        </Box>
    </StoreOwnerLayout>
  );
}