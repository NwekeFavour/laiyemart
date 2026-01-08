import React, { useState } from 'react';
import { 
  Box, Typography, Button, Input, Sheet, 
  Divider, FormControl, FormLabel, Avatar, Stack, Switch
} from "@mui/joy";
import { User, Store, Bell, Shield, Save, Globe, Mail } from "lucide-react";
import StoreOwnerLayout from './layout';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Store Profile', icon: <Store size={18} /> },
    { id: 'account', label: 'Account Info', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

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
                    <Avatar sx={{ '--Avatar-size': '64px', bgcolor: '#0f172a' }}>LM</Avatar>
                    <Button variant="outlined" color="neutral" size="sm">Change Logo</Button>
                    </Stack>
                </FormControl>

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Store Name</FormLabel>
                    <Input placeholder="Laiyemart Store" sx={{ flex: 1, maxWidth: 400 }} />
                </FormControl>

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Subdomain</FormLabel>
                    <Input 
                    startDecorator={<Globe size={16} />} 
                    endDecorator={<Typography level="body-xs">.laiyemart.com</Typography>}
                    placeholder="mystore" 
                    sx={{ flex: 1, maxWidth: 400 }} 
                    />
                </FormControl>

                <FormControl sx={{ display: { sm: 'flex-row' }, gap: 2 }}>
                    <FormLabel sx={{ minWidth: 140 }}>Support Email</FormLabel>
                    <Input startDecorator={<Mail size={16} />} placeholder="support@laiyemart.com" sx={{ flex: 1, maxWidth: 400 }} />
                </FormControl>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="plain" color="neutral">Cancel</Button>
                    <Button className='hover:bg-slate-800/90!' startDecorator={<Save size={18} />} sx={{ bgcolor: '#0f172a', borderRadius: 'lg' }}>Save Changes</Button>
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
            </Sheet>
        </Box>
        </Box>
    </StoreOwnerLayout>
  );
}