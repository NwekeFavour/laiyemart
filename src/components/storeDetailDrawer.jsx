import { X, UserCheck, CreditCard, ShoppingBag } from "lucide-react";
import { Sheet, Typography, Chip, Button, Divider, Box } from "@mui/joy";

export default function StoreDetailDrawer({ store, open, onClose, onSuspend }) {
  if (!open || !store) return null;

  return (
    <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.4)", zIndex: 1200, display: "flex", justifyContent: "flex-end" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet sx={{ width: 380, height: "100%", p: 3, overflowY: "auto", borderLeft: "1px solid", borderColor: "neutral.200" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography level="title-lg">{store.name}</Typography>
          <Button variant="plain" color="neutral" size="sm" onClick={onClose}><X size={18} /></Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Chip size="sm" color={store.status === "ACTIVE" ? "success" : "danger"} variant="soft">{store.status}</Chip>
          <Chip size="sm" variant="outlined" sx={{ textTransform: "uppercase" }}>{store.plan}</Chip>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mb: 1.5, color: "neutral.500" }}>Store info</Typography>

        {[
          ["Category", store.storeType],
          ["Slug", store.slug],
          ["Customers", (store.totalCustomers || 0).toLocaleString()],
          ["Joined", new Date(store.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
          ["Paystack", store.paystack?.verified ? "Verified" : "Unverified"],
        ].map(([key, val]) => (
          <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "0.5px solid", borderColor: "neutral.100" }}>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>{key}</Typography>
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>{val || "N/A"}</Typography>
          </Box>
        ))}

        <Typography level="body-xs" sx={{ textTransform: "uppercase", fontWeight: 700, mt: 3, mb: 1.5, color: "neutral.500" }}>Owner</Typography>
        {[
          ["Name", store.owner?.name],
          ["Email", store.owner?.email],
        ].map(([key, val]) => (
          <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "0.5px solid", borderColor: "neutral.100" }}>
            <Typography level="body-sm" sx={{ color: "text.tertiary" }}>{key}</Typography>
            <Typography level="body-sm" sx={{ fontWeight: 600 }}>{val || "N/A"}</Typography>
          </Box>
        ))}

        <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
          <Button fullWidth variant="outlined" color={store.status === "ACTIVE" ? "danger" : "success"} onClick={() => onSuspend(store)}>
            {store.status === "ACTIVE" ? "Suspend store" : "Reactivate store"}
          </Button>
        </Box>
      </Sheet>
    </Box>
  );
}