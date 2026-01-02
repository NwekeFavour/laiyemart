import { Box, Typography, Chip, Button } from "@mui/joy";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  MessageCircle,
  Package,
  Settings,
  HelpCircle,
} from "lucide-react";

const navSection = {
  main: [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingBag },
    { label: "Customers", icon: Users },
    { label: "Categories", icon: MessageCircle },
    { label: "Products", icon: Package, active: true },

  ],
  settings: [
    { label: "Settings", icon: Settings },
    { label: "Help", icon: HelpCircle },
  ],
};

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        backgroundColor: "#fff",
        p: 3,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
      }}
    >

      {/* MAIN */}
      <NavGroup title="MAIN" items={navSection.main} />

      {/* SETTINGS */}
      <NavGroup title="SETTINGS" items={navSection.settings} />
    </Box>
  );
}




function NavGroup({
  title,
  items,
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        level="body-xs"
        sx={{
          color: "neutral.500",
          fontWeight: 600,
          mb: 1.5,
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {items.map(({ label, icon: Icon, active }) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.2,
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              backgroundColor: active ? "neutral.600" : "transparent",
              color: active ? "#fff" : "neutral.700",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: active ? "neutral.400" : "neutral.100",
              },
            }}
          >
            <Icon size={16} />
            {label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
