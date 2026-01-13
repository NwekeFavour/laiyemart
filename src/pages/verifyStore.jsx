import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button, Typography, Box, Stack } from "@mui/joy";
import { useStoreProfileStore } from "../store/useStoreProfile";

export default function VerifyStore() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyStoreEmail, loading, error, success } = useStoreProfileStore();

  useEffect(() => {
    if (token) {
      verifyStoreEmail(token);
    }
  }, [token, verifyStoreEmail]);

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        bg: "#f8fafc", // Light slate background
        p: 3 
      }}
    >
      <Stack 
        spacing={3} 
        sx={{ 
          maxWidth: 400, 
          width: "100%", 
          textAlign: "center",
          p: 5,
          borderRadius: "xl",
          bgcolor: "background.surface",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        {/* LOGO */}
        <Typography level="h3" sx={{ fontWeight: 900, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ color: "#10b981" }}>●</Box> LAYEMART
        </Typography>

        {loading ? (
          <Stack alignItems="center" spacing={2} className="animate-in fade-in">
            <Loader2 size={48} className="animate-spin text-slate-400" />
            <Typography level="h4">Verifying your email...</Typography>
            <Typography level="body-sm">This will only take a moment.</Typography>
          </Stack>
        ) : success ? (
          <Stack alignItems="center" spacing={2} className="animate-in zoom-in duration-500">
            <Box sx={{ color: "#10b981", mb: 1 }}>
              <CheckCircle2 size={64} />
            </Box>
            <Typography level="h4" sx={{ fontWeight: 700 }}>Verification Successful!</Typography>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              Your store email has been verified. You can now continue managing your store.
            </Typography>
            <Button 
              size="lg"
              endDecorator={<ArrowRight size={18} />}
              onClick={() => navigate("/dashboard/settings")}
              sx={{ bgcolor: "#0f172a", borderRadius: "lg", width: "100%", mt: 2 }}
            >
              Go to Dashboard
            </Button>
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={2} className="animate-in slide-in-from-bottom-4">
            <Box sx={{ color: "danger.500", mb: 1 }}>
              <XCircle size={64} />
            </Box>
            <Typography level="h4" sx={{ fontWeight: 700 }}>Verification Failed</Typography>
            <Typography level="body-sm">
              {error || "The verification link is invalid or has expired."}
            </Typography>
            <Button 
              variant="outlined" 
              color="neutral" 
              component={Link} 
              to="/dashboard/settings"
              sx={{ width: "100%", mt: 2 }}
            >
              Back to Settings
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}