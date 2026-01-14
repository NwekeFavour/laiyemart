import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Input, Sheet, 
  Divider, FormControl, FormLabel, Avatar, Stack, Switch,
  Select,
  Option
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
    const {store, user, token} = useAuthStore()
    const [storeDits, setStoreDits] = useState(store)
    const [isUpdating, setIsUpdating] = useState(false);
    const [formEmail, setFormEmail] = useState(store?.email);
    const [otp, setOtp] = useState("");
    const [fullName, setFullName] = useState(user?.fullName || "")
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loadingp, setLoading] = useState(false)
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [formStoreType, setFormStoreType] = useState(store.storeType)
    const getPasswordStrength = (password) => {
        let score = 0;
        if (!password) return 0;
        if (password.length >= 8) score += 1; // Length
        if (/[A-Z]/.test(password)) score += 1; // Uppercase
        if (/[0-9]/.test(password)) score += 1; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // Symbols
        return score;
    };

    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#15803d"];
    const strengthScore = getPasswordStrength(passwords.newPassword);
        useEffect(() => {
    if (store?.logo?.url) {
        setPreviewUrl(store.logo.url);
        setLogoFile(null); // Clear the pending file since it's now saved
    }
    }, [store]);
    const [previewUrl, setPreviewUrl] = useState(store.logo?.url || "");
    // console.log(store)
  const menuItems = [
    { id: 'profile', label: 'Store Profile', icon: <Store size={18} /> },
    { id: 'account', label: 'Account Info', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

    const handleSave = async () => {
        if (!formEmail) {
            toast.error("Support email is required");
            return;
        }

        try {
            const result = await updateStoreProfile({ 
                email: formEmail, 
                storeType: formStoreType, 
                logo: logoFile, 
                token 
            });

            // 1. Update our local 'display' state with the response from server
            // This ensures storeDits.isEmailVerified reflects the new 'false' status
            setStoreDits(result);
            // console.log(storeDits)

            if (formEmail !== store.email) {
                toast.success("Changes saved! Check your inbox to verify.", {
                    icon: '📩',
                    duration: 6000
                });
                // DO NOT setFormEmail(store.email) here, 
                // otherwise the input jumps back to the old email!
            } else {
                toast.success("Store profile updated successfully");
            }

            setLogoFile(null);
        } catch (err) {
            toast.error(err.message || "Failed to update store profile");
        }
    };

    useEffect(() => {
        if (store) {
            setStoreDits(store);
        }
    }, [store]);

    const handleRequestOtp = async () => {
        const token = useAuthStore.getState().token;

        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }


        if (!passwords.newPassword || !passwords.confirmPassword) {
            toast.error("Please enter and confirm your new password");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSendingOtp(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/request/update-password`,
                {
                    method: "POST",
                    headers: {  Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();

            if (isOtpSent) {
                toast.info("Verification code already sent");
                return;
            }
            if (res.ok) {
                toast.success("Verification code sent to your email");
                setIsOtpSent(true);
            } else {
                toast.error(data.message || "Failed to send verification code");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setIsSendingOtp(false);
        }
    };



    const handleFullNameUpdate = async () => {
        if (!fullName || fullName.trim() === "") return toast.error("Full name cannot be empty");
        setLoading(true)
        const token = useAuthStore.getState().token;
        if (!token) return toast.error("Session expired. Please login again");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ fullName }),
            });

            const data = await res.json();
            setLoading(false)
            if (res.ok) toast.success("Full name updated successfully");
            else toast.error(data.message || "Failed to update name");
        } catch (err) {
            toast.error("Network error");
        }
    };



    const handlePasswordUpdate = async () => {       

        if (!otp) {
            toast.error("Please enter the verification code sent to your email");
            return;
        }

        const token = useAuthStore.getState().token;

        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        newPassword: passwords.newPassword,
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success("Password updated successfully!");
                setPasswords({ newPassword: "", confirmPassword: "" });
                setOtp("");
                setIsOtpSent(false);
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
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

                    {/* LOGO SECTION */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Store Logo</FormLabel>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar 
                                src={previewUrl}
                                sx={{ '--Avatar-size': '64px', bgcolor: '#0f172a', border: '1px solid #e2e8f0' }} 
                            />
                            <Button component="label" variant="outlined" color="neutral" size="sm" disabled={loading}>
                                Change Logo
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setLogoFile(file);
                                            setPreviewUrl(URL.createObjectURL(file));
                                        }
                                    }} 
                                />
                            </Button>
                        </Stack>
                    </FormControl>
                    
                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>

                    <FormLabel sx={{ minWidth: 140 }}>Store Name</FormLabel>

                    <Input className='placeholder:capitalize!' value={store.name} disabled placeholder="Layemart Store" sx={{ flex: 1, maxWidth: 400 }} />

                </FormControl>



                    {/* STORE TYPE SECTION */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Store Category</FormLabel>
                        <Select
                            value={formStoreType} 
                            onChange={(e, newValue) => setFormStoreType(newValue)}
                            sx={{ flex: 1, maxWidth: 400 }}
                        >
                            <Option value="General Store">General Store</Option>
                            <Option value="Fashion">Fashion</Option>
                            <Option value="Electronics">Electronics</Option>
                            <Option value="Beauty & Health">Beauty & Health</Option>
                            <Option value="Digital Products">Digital Products</Option>
                        </Select>
                    </FormControl>

                    {/* SUPPORT EMAIL SECTION */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Support Email</FormLabel>
                        <Box sx={{ flex: 1, maxWidth: 400 }}>
                            <Input 
                                value={formEmail} 
                                onChange={(e) => setFormEmail(e.target.value)}
                                startDecorator={<Mail size={16} />} 
                                endDecorator={
                                    // Use storeDits for both to keep them in sync
                                    storeDits?.isEmailVerified ? (
                                        <Typography level="body-xs" color="success" sx={{ fontWeight: 'bold' }}>VERIFIED</Typography>
                                    ) : (
                                        <Typography level="body-xs" color="warning" sx={{ fontWeight: 'bold' }}>PENDING</Typography>
                                    )
                                }
                            />
                            
                            {/* Only show warning if the current display state is unverified */}
                            {!storeDits?.isEmailVerified && (
                                <Typography 
                                    level="body-xs" 
                                    sx={{ mt: 1, color: 'orange', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    <span>✉️</span> Check <strong>{storeDits?.pendingEmail || storeDits?.email}</strong> to verify.
                                </Typography>
                            )}
                        </Box>
                    </FormControl>
                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="plain" color="neutral" onClick={() => setFormEmail(store.email)}>Cancel</Button>
                        <Button 
                            loading={loading}
                            onClick={handleSave}
                            startDecorator={<Save size={18} />} 
                            sx={{ bgcolor: '#0f172a', borderRadius: 'lg' }}
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


                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Full Name</FormLabel>
                        <Input
                            value={fullName || ""}
                            onChange={(e) =>setFullName(e.target.value)}
                            startDecorator={<Mail size={16} />}
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                        <Button
                            onClick={handleFullNameUpdate}
                            sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                            className="hover:bg-slate-800/90!"
                        >
                            {loadingp ? "Saving " : "Save Full Name"}
                        </Button>
                    </Box>
                    {/* Email */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Email Address</FormLabel>
                        <Input
                            value={user?.email || ""}
                            disabled
                            startDecorator={<Mail size={16} />}
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    {/* Role */}
                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>Account Role</FormLabel>
                        <Input
                            value={user?.role === "OWNER" ? "Store Owner" : user?.role}
                            disabled
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <Divider />

                    {/* Password */}
                    <Box>
                        <Typography level="title-md" sx={{ fontWeight: 700 }}>
                            Password
                        </Typography>
                        <Typography level="body-xs">
                            Change your account password. A verification code will be sent to your email.
                        </Typography>
                    </Box>

                    <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                        <FormLabel sx={{ minWidth: 140 }}>New Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={passwords.newPassword}
                            onChange={(e) =>
                                setPasswords({ ...passwords, newPassword: e.target.value })
                            }
                            sx={{ flex: 1, maxWidth: 400 }}
                        />
                    </FormControl>

                    <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Confirm Password</FormLabel>
                    <Box sx={{ flex: 1, maxWidth: 400 }}>
                        <Input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                            setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        />
                        
                        {/* Password Strength Indicator */}
                        {passwords.newPassword && (
                        <Box sx={{ mt: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                            {[...Array(4)].map((_, i) => (
                                <Box
                                key={i}
                                sx={{
                                    height: 4,
                                    flex: 1,
                                    borderRadius: '2px',
                                    bgcolor: i < strengthScore ? strengthColors[strengthScore] : '#e2e8f0',
                                    transition: 'background-color 0.3s'
                                }}
                                />
                            ))}
                            </Box>
                            <Typography level="body-xs" sx={{ color: strengthColors[strengthScore], fontWeight: 600 }}>
                            Strength: {strengthLabels[strengthScore]}
                            </Typography>
                        </Box>
                        )}
                    </Box>
                    </FormControl>

                    {/* OTP INPUT (Appears After Sending OTP) */}
                    {isOtpSent && (
                        <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                            <FormLabel sx={{ minWidth: 140 }}>Verification Code</FormLabel>
                            <Input
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                sx={{ flex: 1, maxWidth: 200 }}
                            />
                        </FormControl>
                    )}

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => {
                                setPasswords({ newPassword: "", confirmPassword: "" });
                                setOtp("");
                                setIsOtpSent(false);
                            }}
                        >
                            Cancel
                        </Button>

                        {!isOtpSent ? (
                            <Button
                                loading={isSendingOtp}
                                onClick={handleRequestOtp}
                                sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                                className="hover:bg-slate-800/90!"
                            >
                                Send Verification Code
                            </Button>
                        ) : (
                            <Button
                                loading={isUpdating}
                                onClick={handlePasswordUpdate}
                                startDecorator={<Save size={18} />}
                                sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                                className="hover:bg-slate-800/90!"
                            >
                                Confirm Password Update
                            </Button>
                        )}
                    </Box>
                </Stack>
            )}


            </Sheet>
        </Box>
        </Box>
    </StoreOwnerLayout>
  );
}