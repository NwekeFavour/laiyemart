import { Box, Typography, IconButton, Avatar, Input, Button, Drawer } from "@mui/joy";
import { Menu, Bell, ChevronDown, Search, X, Users, Settings, HelpCircle, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function OwnerHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navigation for project owner
  const navSections = {
    main: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Manage Stores", icon: Users },
      { label: "Users", icon: Users },
    ],
    settings: [
      { label: "Settings", icon: Settings },
      { label: "Help", icon: HelpCircle },
    ],
  };

  return (
    <>
      {/* Header Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 2,
          backgroundColor: "#fff",
          borderColor: "neutral.200",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Left: Hamburger + Brand + Desktop Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Menu size={20} />
          </IconButton>

          <Typography className="md:text-[22px]! text-[14px]! text" level="h4" sx={{ fontWeight: 700 }}>
            LaiyeMart
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, ml: 4 }}>
            {navSections.main.map((item) => (
              <Link key={item.label} className="text-neutral-900! hover:bg-transparent! hover:underline! text-[14px]!" variant="plain">
                {item.label}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton className="hover:bg-transparent!" variant="plain" color="neutral">
            <Bell size={20} />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
            <Avatar src="/avatar.png" size="sm" />
            <Typography level="body-sm" sx={{ fontWeight: 500, display: { xs: "none", md: "block" } }}>
              Owner
            </Typography>
            <ChevronDown size={16} />
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 260, p: 3 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 , p:2}}>
          {Object.keys(navSections).map((section) => (
            <Box key={section}>
              <Typography
                level="body-xs"
                sx={{ color: "neutral.500", fontWeight: 600, mb: 1, letterSpacing: 1 }}
              >
                {section.toUpperCase()}
              </Typography>
              {navSections[section].map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  variant="plain"
                  startDecorator={<Icon size={16} />}
                  sx={{
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    color: "neutral.700",
                    "&:hover": { bgcolor: "neutral.100" },
                  }}
                  fullWidth
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Button>
              ))}
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
