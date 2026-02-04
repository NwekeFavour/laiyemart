import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Sheet,
  Divider,
  FormControl,
  FormLabel,
  Avatar,
  Stack,
  Switch,
  Select,
  Option,
  Textarea,
  Autocomplete,
} from "@mui/joy";
import {
  User,
  Store,
  Bell,
  Shield,
  Save,
  Globe,
  Mail,
  Banknote,
  HelpCircle,
  Badge,
  BellRing,
  Package,
  RefreshCcw,
  Info,
  CircleDashed,
  CheckCircle2,
  CheckCircle,
  ShieldAlert,
  CheckCircleIcon,
} from "lucide-react";
import StoreOwnerLayout from "./layout";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import { useStoreProfileStore } from "../../store/useStoreProfile";
import { fetchMe } from "../../../services/authService";
import { useLocation } from "react-router-dom";
import { Alert, CircularProgress, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SettingsPage({ isDark, toggleDarkMode }) {
  const { updateStoreProfile, loading, resendStoreVerification } =
    useStoreProfileStore();
  const [activeSection, setActiveSection] = useState("profile");
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState(null);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { store, user, token, setUser, setStore } = useAuthStore();
  const [banks, setBanks] = useState([]);
  const [storeDits, setStoreDits] = useState(store);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formEmail, setFormEmail] = useState(store?.email);
  const [formDescription, setFormDescription] = useState(store?.description);
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loadingp, setLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [formStoreType, setFormStoreType] = useState(store?.storeType);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showBVN, setShowBVN] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profilePicture?.url || "",
  );
  const [validationStep, setValidationStep] = useState(1); // 1 = Identity, 2 = Business Info
  const [verifiedInfo, setVerifiedInfo] = useState({ name: "", code: "" });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score += 1; // Length
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[0-9]/.test(password)) score += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Symbols
    return score;
  };

  const [bankForm, setBankForm] = useState({
    businessName: store?.paystack?.businessName || "",
    bankCode: store?.paystack?.bankCode || "",
    accountNumber: store?.paystack?.accountNumber || "",
    // Add these two to fix the "uncontrolled to controlled" warning
    bvn: "",
  });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/paystack/banks`,
        ); // your backend should proxy to Paystack
        const data = await res.json();
        if (data.status) setBanks(data.data); // data.data is the list of banks
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };

    fetchBanks();
  }, []);

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (window.location.hash === "#bank-details") {
      const element = document.getElementById("bank-details");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Optional: Add a brief highlight effect to the section
      }
    }
  }, []);

  const handleIdentitySubmit = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paystack/validate-vendor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...bankForm, email: user.email }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Success! Lock Step 1 and open Step 2
      setVerifiedInfo({ name: data.accountName, code: data.customerCode });
      setValidationStep(2);
      toast.success("Identity details matched!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#15803d",
  ];
  const strengthScore = getPasswordStrength(passwords.newPassword);
  useEffect(() => {
    if (store?.logo?.url) {
      setPreviewUrl(store?.logo.url);
      setLogoFile(null); // Clear the pending file since it's now saved
    }
  }, [store]);
  const [previewUrl, setPreviewUrl] = useState(store?.logo?.url || "");
  const location = useLocation();
  // console.log(store)
  const menuItems = [
    { id: "profile", label: "Store Profile", icon: <Store size={18} /> },
    { id: "account", label: "Account Info", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    {
      id: "st",
      label: "Bank Details",
      icon: (
        <Box sx={{ position: "relative" }}>
          <Banknote size={20} />
          {/* Show red dot if store exists but has no bank details */}
          {store && !store?.bankAccountNumber && (
            <Box
              sx={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                bgcolor: "#ef4444", // Red dot
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          )}
        </Box>
      ),
    },
  ];

  const handleSave = async () => {
    // 1. Validation
    if (!formEmail) {
      toast.error("Support email is required");
      return;
    }

    try {
      // 2. Execute Update
      const result = await updateStoreProfile({
        email: formEmail,
        storeType: formStoreType,
        description: formDescription,
        heroFile: heroFile, // Key name matches Zustand expectations
        logo: logoFile,
        token,
      });

      // 3. Success Handling
      // result usually contains { message: "...", store: {...} }
      if (result && result.store) {
        // Synchronize your local display state immediately
        setStoreDits(result.store);
       
          toast.success(formEmail !== store?.email ? "Changes saved! Check your inbox to verify." : "Store profile updated successfully", {
            icon:  formEmail !== store?.email && "📩",
            duration: 6000,
          });        

        setLogoFile(null);
        setHeroFile(null);
        // Note: previewUrls stay visible because they now point to store.heroImage.url
      }
    } catch (err) {
      // 5. Advanced Error Parsing
      console.error("Save Error:", err);
      toast.error(err.message);
      // Check for Multer/Busboy specific errors
      if (err.message?.includes("Unexpected end of form")) {
        toast.error(
          "Upload interrupted. Please try a smaller image or check your connection.",
        );
      } else if (err.message?.includes("too large")) {
        toast.error("File size is too large. Max limit is 2MB.");
      } else {
        toast.error(err.message || "Failed to update store profile");
      }
    }
  };

  useEffect(() => {
    if (store) {
      setStoreDits(store);
    }
  }, [store]);

  // console.log(storeDits)

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
          headers: { Authorization: `Bearer ${token}` },
        },
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
    if (!fullName || fullName.trim() === "")
      return toast.error("Full name cannot be empty");
    setLoading(true);
    const token = useAuthStore.getState().token;
    if (!token) return toast.error("Session expired. Please login again");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fullName }),
        },
      );

      const data = await res.json();
      setLoading(false);
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
        },
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

  const handleSaveBankDetails = async () => {
    setIsUpdating(true);
    if (!bankForm.businessName) {
      return toast.error("Please enter your business name.");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paystack/subaccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: bankForm.businessName,
            bankCode: bankForm.bankCode,
            accountNumber: bankForm.accountNumber,
            verifiedName: verifiedInfo.name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      const nameToSet = data.verifiedName || data.store?.paystack?.accountName;
      const currentUser = useAuthStore.getState().user;
      useAuthStore.getState().setUser({
        ...currentUser,
        fullName: nameToSet,
      });
      // Update the local store state to reflect the "Active" status
      setStore(data.store);
      toast.success(
        "Congratulations! Your store is now active and ready for payouts.",
      );

      // Optional: Reset form or redirect
      setValidationStep(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const RequirementBadge = ({ label, isDone }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 0.5,
        }}
      >
        {isDone ? (
          <CheckCircle2 size={16} color="#15803d" /> // Green check
        ) : (
          <CircleDashed
            size={16}
            color="#64748b"
            className="animate-spin-slow"
          /> // Spinning gray circle
        )}
        <Typography
          level="body-xs"
          sx={{
            color: isDone ? "text.primary" : "text.tertiary",
            fontWeight: isDone ? 500 : 400,
            textDecoration: isDone ? "line-through" : "none", // Optional: strikes through finished tasks
            opacity: isDone ? 0.7 : 1,
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  };

  // console.log(store)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");

    if (section === "bank-details") {
      setActiveSection("st"); // Set this to 'st' since that is your bank section key

      // Optional: Smooth scroll to the anchor
      setTimeout(() => {
        document.getElementById("bank-details-anchor")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [location]);

  return (
    <StoreOwnerLayout isDark={isDark} toggleDarkMode={toggleDarkMode}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: { md: 2, lg: 4 },
        }}
      >
        {/* Header */}
        <Box>
          <Typography
            className={`${isDark ? "text-slate-200!" : ""}`}
            level="h2"
            sx={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}
          >
            Settings
          </Typography>
          <Typography
            className={`${isDark ? "text-slate-400!" : ""}`}
            level="body-sm"
            sx={{ color: "#64748b" }}
          >
            Manage your store preferences and account settings
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Settings Sidebar Navigation */}
          <Sheet
            className={`${isDark ? "bg-[#020618]! border-[#314158]!" : ""}`}
            variant="outlined"
            sx={{
              width: { xs: "100%", md: 240 },
              borderRadius: "xl",
              p: 1,
              bgcolor: "white",
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "soft" : "plain"}
                color={activeSection === item.id ? "primary" : "neutral"}
                onClick={() => setActiveSection(item.id)}
                startDecorator={item.icon}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  mb: 0.5,
                  fontWeight: 600,
                  borderRadius: "lg",
                  ...(activeSection === item.id
                    ? { bgcolor: "#f1f5f9", color: "#0f172a" }
                    : { color: "#64748b" }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Sheet>

          {/* Settings Content Area */}
          <Sheet
            className={`${isDark ? "bg-[#020618]! text-slate-200! border-[#314158]!" : ""}`}
            variant="outlined"
            sx={{
              flex: 1,
              width: "100%",
              borderRadius: "xl",
              p: { xs: 2, md: 4 },
              bgcolor: "white",
            }}
          >
            {activeSection === "profile" && (
              <Stack gap={3}>
                <Box>
                  <Typography
                    className={`${isDark ? "text-slate-200!" : ""}`}
                    level="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    Store Profile
                  </Typography>
                  <Typography
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    level="body-sm"
                  >
                    This information will be displayed publicly to your
                    customers.
                  </Typography>
                </Box>

                <Divider />

                {/* LOGO SECTION */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Store Logo
                  </FormLabel>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={previewUrl}
                      sx={{
                        "--Avatar-size": "64px",
                        bgcolor: "#0f172a",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Button
                      className={`${isDark ? "text-slate-200!" : ""}`}
                      component="label"
                      variant="outlined"
                      color="neutral"
                      size="sm"
                      disabled={loading}
                    >
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

                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Hero Background
                  </FormLabel>
                  <Stack spacing={1.5} sx={{ flex: 1, maxWidth: 400 }}>
                    <Box
                      sx={{
                        height: 120,
                        width: "100%",
                        borderRadius: "md",
                        bgcolor: "neutral.100",
                        backgroundImage: `url(${heroPreviewUrl || store?.heroImage?.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {!heroPreviewUrl && !store?.heroImage?.url && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            level="body-xs"
                            sx={{ color: "#fff", fontWeight: 700 }}
                          >
                            GENERAL STORE DEFAULT
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        className={`${isDark ? "text-slate-200!" : ""}`}
                        component="label"
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        disabled={loading}
                      >
                        Change Banner
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setHeroFile(file);
                              setHeroPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </Button>
                      {(heroPreviewUrl || store?.heroImage?.publicId) && (
                        <Button
                          variant="plain"
                          color="danger"
                          size="sm"
                          onClick={() => {
                            setHeroFile(null);
                            setHeroPreviewUrl("");
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>

                    {/* --- NEW DISCLAIMER SECTION --- */}
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        bgcolor: "info.softBg",
                        borderRadius: "sm",
                        borderLeft: "4px solid",
                        borderColor: "info.main",
                      }}
                    >
                      <Typography
                        className={`${isDark ? "text-slate-200!" : ""}`}
                        level="body-xs"
                        sx={{ fontWeight: 700, color: "info.main", mb: 0.5 }}
                      >
                        💡 Pro Tip for a Better Storefront:
                      </Typography>
                      <Typography
                        className={`${isDark ? "text-slate-400!" : ""}`}
                        level="body-xs"
                        sx={{ color: "text.secondary", lineHeight: 1.4 }}
                      >
                        For best results, use <b>landscape images</b> with{" "}
                        <b>minimal details in the center</b>. High-quality
                        photos of store interiors or neutral textures work best
                        to keep your store name readable and bold.
                      </Typography>
                    </Box>

                    <Typography
                      className={`${isDark ? "text-slate-200!" : ""}`}
                      level="body-xs"
                      sx={{ color: "text.tertiary" }}
                    >
                      Recommended: 1920x1080px • Max 2MB • JPG, PNG, WebP
                    </Typography>
                  </Stack>
                </FormControl>
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Store Name
                  </FormLabel>

                  <Input
                    className="placeholder:capitalize!"
                    value={store?.name}
                    disabled
                    placeholder="Layemart Store"
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Handle colors based on isDark
                      bgcolor: isDark ? "slate.900" : "neutral.50",
                      borderColor: isDark ? "slate.800" : "neutral.200",
                      color: isDark ? "slate.400" : "neutral.600",

                      // ✅ Specific override for the "Disabled" state
                      "&.Mui-disabled": {
                        bgcolor: isDark
                          ? "rgba(15, 23, 42, 0.5)"
                          : "neutral.50",
                        color: isDark ? "slate.500" : "neutral.500",
                        borderColor: isDark ? "slate.800" : "neutral.200",
                        textShadow: isDark ? "none" : "none",
                        cursor: "not-allowed",
                        // Target the internal input element
                        "& input": {
                          WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                        },
                      },
                    }}
                  />
                </FormControl>
                {/* STORE DESCRIPTION SECTION */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Store Description
                  </FormLabel>
                  <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <Textarea
                      minRows={2}
                      placeholder="e.g. Premium clothing made for everyday style. Ethical and sustainable fashion."
                      value={formDescription}
                      onChange={(e) => {
                        if (e.target.value.length <= 85) {
                          setFormDescription(e.target.value);
                        }
                      }}
                      endDecorator={
                        <Typography
                          level="body-xs"
                          sx={{
                            ml: "auto",
                            fontWeight: 700,
                            // ✅ Dynamic character count color: turns brighter or subtle based on length
                            color: isDark
                              ? formDescription?.length >= 80
                                ? "warning.400"
                                : "slate.500"
                              : "neutral.500",
                          }}
                        >
                          {formDescription?.length || 0} / 85 characters
                        </Typography>
                      }
                      sx={{
                        borderRadius: "md",
                        // ✅ Main surface colors
                        bgcolor: isDark ? "#0f172a" : "white", // slate-900
                        color: isDark ? "#f1f5f9" : "inherit", // slate-100
                        borderColor: isDark ? "#1e293b" : "neutral.300", // slate-800

                        // ✅ Internal footer (endDecorator) styling
                        "& .MuiTextarea-endDecorator": {
                          bgcolor: isDark
                            ? "rgba(30, 41, 59, 0.5)"
                            : "neutral.50",
                          borderTop: "1px solid",
                          borderColor: isDark ? "#1e293b" : "neutral.200",
                        },

                        "&:focus-within": {
                          // ✅ Focus state adjusted for dark visibility
                          borderColor: isDark ? "primary.500" : "#0f172a",
                          boxShadow: isDark
                            ? "0 0 0 3px rgba(14, 165, 233, 0.15)"
                            : "none",
                        },

                        // ✅ Placeholder visibility
                        "& textarea::placeholder": {
                          color: isDark ? "#64748b" : "neutral.400", // slate-500
                        },
                      }}
                    />
                    <Typography
                      level="body-xs"
                      sx={{ mt: 1, color: "text.tertiary" }}
                    >
                      Keep it short and sweet for your storefront bio.
                    </Typography>
                  </Box>
                </FormControl>

                {/* STORE TYPE SECTION */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Store Category
                  </FormLabel>
                  <Select
                    className="capitalize! placeholder:capitalize!"
                    value={formStoreType?.toLowerCase()}
                    onChange={(e, newValue) => setFormStoreType(newValue)}
                    variant={isDark ? "soft" : "outlined"}
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Use specific Slate-900 for the button background
                      bgcolor: isDark ? "#0f172a" : "white",
                      color: isDark ? "#f1f5f9" : "inherit",
                      borderColor: isDark ? "#1e293b" : "neutral.300",
                      "&:hover": {
                        bgcolor: isDark ? "#1e293b" : "neutral.50", // Slate-800
                        borderColor: isDark ? "#334155" : "neutral.400",
                      },
                      "&:focus-within": {
                        borderColor: "primary.500",
                        outline: isDark
                          ? "2px solid rgba(14, 165, 233, 0.2)"
                          : "none",
                      },
                      "& .MuiSelect-indicator": {
                        color: isDark ? "#64748b" : "inherit", // Slate-500
                      },
                    }}
                    slotProps={{
                      listbox: {
                        sx: {
                          // ✅ Match the deep Slate-950/900 palette for the menu
                          bgcolor: isDark ? "#020617" : "background.surface",
                          borderColor: isDark ? "#1e293b" : "divider",
                          boxShadow: isDark
                            ? "0 20px 25px -5px rgba(0, 0, 0, 0.6)"
                            : "md",
                          color: isDark ? "#e2e8f0" : "inherit",
                          p: 1,
                          gap: 0.5,
                          "& .MuiOption-root": {
                            borderRadius: "md",
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: isDark ? "#1e293b" : "neutral.100",
                              color: isDark ? "#fff" : "inherit",
                            },
                            '&[aria-selected="true"]': {
                              // High-contrast selection for dark mode
                              bgcolor: isDark
                                ? "rgba(14, 165, 233, 0.15)"
                                : "primary.100",
                              color: isDark ? "#38bdf8" : "primary.700", // Slate-400 blue
                              fontWeight: 600,
                            },
                          },
                        },
                      },
                    }}
                  >
                    <Option
                      className={`${isDark ? "bg-slate-900! text-slate-200!" : ""}`}
                      value="general store"
                    >
                      General Store
                    </Option>
                    <Option
                      className={`${isDark ? "bg-slate-900! text-slate-200!" : ""}`}
                      value="fashion"
                    >
                      Fashion
                    </Option>
                    <Option
                      className={`${isDark ? "bg-slate-900! text-slate-200!" : ""}`}
                      value="electronics"
                    >
                      electronics
                    </Option>
                    <Option
                      className={`${isDark ? "bg-slate-900! text-slate-200!" : ""}`}
                      value="Beauty & Health"
                    >
                      Beauty & Health
                    </Option>
                    <Option
                      className={`${isDark ? "bg-slate-900! text-slate-200!" : ""}`}
                      value="Digital Products"
                    >
                      Digital Products
                    </Option>
                  </Select>
                </FormControl>
                {/* SUPPORT EMAIL SECTION */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Support Email
                  </FormLabel>
                  <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <Input
                      value={formEmail || ""}
                      onChange={(e) => setFormEmail(e.target.value)}
                      startDecorator={
                        <Mail
                          size={16}
                          color={isDark ? "#94a3b8" : "#64748b"}
                        />
                      }
                      endDecorator={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {formEmail === store?.email &&
                          store?.isEmailVerified ? (
                            <Typography
                              level="body-xs"
                              // ✅ Success color looks great in both modes
                              color="success"
                              sx={{
                                fontWeight: "bold",
                                pr: 0.5,
                                letterSpacing: "0.05em",
                              }}
                            >
                              VERIFIED
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {resendTimer > 0 ? (
                                <Typography
                                  level="body-xs"
                                  sx={{
                                    fontWeight: 700,
                                    color: isDark ? "slate.500" : "neutral.400",
                                  }}
                                >
                                  {resendTimer}s
                                </Typography>
                              ) : (
                                <Button
                                  variant="plain"
                                  size="sm"
                                  loading={loading}
                                  onClick={async () => {
                                    try {
                                      setLoading(true);
                                      const res =
                                        await resendStoreVerification(
                                          formEmail,
                                        );
                                      if (res.isAutoVerified || res.store) {
                                        toast.success(
                                          "Email verified automatically!",
                                        );
                                        setFormEmail(res.store.email);
                                      } else {
                                        toast.success(
                                          res.message ||
                                            "Verification email sent!",
                                        );
                                        setResendTimer(60);
                                      }
                                    } catch (err) {
                                      const errorMessage =
                                        err.response?.data?.message ||
                                        "Failed to resend email.";
                                      toast.error(errorMessage);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  sx={{
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    minHeight: 0,
                                    py: 0.5,
                                    px: 1,
                                    // ✅ Brighter blue for dark mode visibility
                                    color: isDark ? "#38bdf8" : "#2563eb",
                                    "&:hover": {
                                      bgcolor: "transparent",
                                      textDecoration: "underline",
                                      color: isDark ? "#7dd3fc" : "#1d4ed8",
                                    },
                                  }}
                                >
                                  VERIFY
                                </Button>
                              )}
                              <Typography
                                level="body-xs"
                                sx={{
                                  fontWeight: "bold",
                                  // ✅ Red-400 for dark mode, Red-600 for light mode
                                  color: isDark
                                    ? "#fb7185 !important"
                                    : "#dc2626 !important",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                UNVERIFIED
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      sx={{
                        "--Input-decoratorChildHeight": "28px",
                        borderRadius: "lg",
                        // ✅ Main surface colors
                        bgcolor: isDark ? "#0f172a" : "white",
                        color: isDark ? "#f1f5f9" : "inherit",
                        borderColor: isDark ? "#1e293b" : "#e2e8f0",
                        "&:focus-within": {
                          borderColor: isDark ? "#38bdf8" : "#0f172a",
                          boxShadow: isDark
                            ? "0 0 0 2px rgba(56, 189, 248, 0.15)"
                            : "none",
                        },
                        // Fix for the input text color in dark mode
                        "& input": {
                          color: isDark ? "#f8fafc" : "inherit",
                        },
                      }}
                    />
                  </Box>
                </FormControl>
                <Box
                  sx={{ display: "flex", justifyContent: "start", gap: 2 }}
                >
                  <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => setFormEmail(store?.email)}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={loading}
                    onClick={handleSave}
                    startDecorator={<Save size={18} />}
                    sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Stack>
            )}

            {activeSection === "notifications" && (
              <Stack gap={3}>
                <Box>
                  <Typography
                    className={`${isDark ? "text-slate-200!" : ""}`}
                    level="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    Notification Preferences
                  </Typography>
                  <Typography
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    level="body-sm"
                  >
                    Control how you receive updates about your store.
                  </Typography>
                </Box>
                <Divider />

                {[
                  {
                    title: "Email Notifications",
                    desc: "Receive daily summaries of your sales.",
                  },
                  {
                    title: "New Order Alerts",
                    desc: "Get notified immediately when a customer places an order.",
                  },
                  {
                    title: "Inventory Alerts",
                    desc: "Receive alerts when products go out of stock.",
                  },
                ].map((notif, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        className={`${isDark ? "text-slate-400!" : ""}`}
                        sx={{ fontWeight: 600 }}
                      >
                        {notif.title}
                      </Typography>
                      <Typography level="body-xs">{notif.desc}</Typography>
                    </Box>
                    <Switch defaultChecked color="success" size="lg" />
                  </Box>
                ))}
              </Stack>
            )}

            {activeSection === "account" && (
              <Stack gap={3}>
                <Box>
                  <Typography
                    className={`${isDark ? "text-slate-200!" : ""}`}
                    level="h4"
                    sx={{ fontWeight: 700 }}
                  >
                    Account Information
                  </Typography>
                  <Typography
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    level="body-sm"
                  >
                    Manage your personal account details and security.
                  </Typography>
                </Box>

                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Profile Picture
                  </FormLabel>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: "divider",
                        bgcolor: "neutral.100",
                        backgroundImage: `url(${avatarPreview || user?.profilePicture?.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <Stack spacing={1}>
                      <Button
                        className={`${isDark ? "text-slate-900! bg-slate-200!" : ""}`}
                        component="label"
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        loading={isUploadingAvatar}
                      >
                        Change Photo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            // 1. Client-side validation
                            if (file.size > 2 * 1024 * 1024) {
                              return toast.error("File is too large. Max 2MB.");
                            }

                            // 2. Instant Preview
                            const previewUrl = URL.createObjectURL(file);
                            setAvatarPreview(previewUrl);

                            // 3. Upload via Fetch
                            const formData = new FormData();
                            formData.append("profilePicture", file);

                            setIsUploadingAvatar(true);
                            try {
                              const response = await fetch(
                                `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile-picture`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: formData,
                                },
                              );

                              const data = await response.json();

                              if (!response.ok)
                                throw new Error(
                                  data.message || "Upload failed",
                                );

                              // 4. Update Global State (assuming you have a setUser method)
                              setUser({
                                ...user,
                                profilePicture: data.profilePicture,
                              });
                              toast.success("Profile Picture updated!");
                            } catch (err) {
                              toast.error(err.message || "Failed to upload");
                              // Revert preview on failure
                              setAvatarPreview(user?.profilePicture?.url);
                            } finally {
                              setIsUploadingAvatar(false);
                            }
                          }}
                        />
                      </Button>
                      <Typography
                        className={`${isDark ? "text-slate-400!" : ""}`}
                        level="body-xs"
                      >
                        JPG, GIF or PNG. Max size 2MB
                      </Typography>
                    </Stack>
                  </Stack>
                </FormControl>

                <Divider />

                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Full Name
                  </FormLabel>
                  <Input
                    value={fullName || ""}
                    onChange={(e) => setFullName(e.target.value)}
                    startDecorator={<Mail size={16} />}
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Handle colors based on isDark
                      bgcolor: isDark ? "#0f172b" : "neutral.50",
                      borderColor: isDark ? "#1d293d" : "neutral.200",
                      color: isDark ? "#90a1b9" : "neutral.600",

                      // ✅ Specific override for the "Disabled" state
                      "&.Mui-disabled": {
                        bgcolor: isDark
                          ? "rgba(15, 23, 42, 0.5)"
                          : "neutral.50",
                        color: isDark ? "#62748e" : "neutral.500",
                        borderColor: isDark ? "#90a1b9" : "neutral.200",
                        textShadow: isDark ? "none" : "none",
                        cursor: "not-allowed",
                        // Target the internal input element
                        "& input": {
                          WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                        },
                      },
                    }}
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  <Button
                    onClick={handleFullNameUpdate}
                    sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
                    className="hover:bg-slate-800/90!"
                  >
                    {loadingp ? "Saving " : "Save Full Name"}
                  </Button>
                </Box>
                {/* Email */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Email Address
                  </FormLabel>
                  <Input
                    value={user?.email || ""}
                    disabled
                    startDecorator={<Mail size={16} />}
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Handle colors based on isDark
                      bgcolor: isDark ? "#0f172b" : "neutral.50",
                      borderColor: isDark ? "#1d293d" : "neutral.200",
                      color: isDark ? "#90a1b9" : "neutral.600",

                      // ✅ Specific override for the "Disabled" state
                      "&.Mui-disabled": {
                        bgcolor: isDark
                          ? "rgba(15, 23, 42, 0.5)"
                          : "neutral.50",
                        color: isDark ? "#62748e" : "neutral.500",
                        borderColor: isDark ? "#90a1b9" : "neutral.200",
                        textShadow: isDark ? "none" : "none",
                        cursor: "not-allowed",
                        // Target the internal input element
                        "& input": {
                          WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                        },
                      },
                    }}
                  />
                </FormControl>

                {/* Role */}
                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Account Role
                  </FormLabel>
                  <Input
                    value={user?.role === "OWNER" ? "Store Owner" : user?.role}
                    disabled
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Handle colors based on isDark
                      bgcolor: isDark ? "#0f172b" : "neutral.50",
                      borderColor: isDark ? "#1d293d" : "neutral.200",
                      color: isDark ? "#90a1b9" : "neutral.600",

                      // ✅ Specific override for the "Disabled" state
                      "&.Mui-disabled": {
                        bgcolor: isDark
                          ? "rgba(15, 23, 42, 0.5)"
                          : "neutral.50",
                        color: isDark ? "#62748e" : "neutral.500",
                        borderColor: isDark ? "#90a1b9" : "neutral.200",
                        textShadow: isDark ? "none" : "none",
                        cursor: "not-allowed",
                        // Target the internal input element
                        "& input": {
                          WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                        },
                      },
                    }}
                  />
                </FormControl>

                <Divider />

                {/* Password */}
                <Box>
                  <Typography
                    className={`${isDark ? "text-slate-200!" : ""}`}
                    level="title-md"
                    sx={{ fontWeight: 700 }}
                  >
                    Password
                  </Typography>
                  <Typography
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    level="body-xs"
                  >
                    When you Change your account password. A verification code
                    will be sent to your email.
                  </Typography>
                </Box>

                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    New Password
                  </FormLabel>
                  <Input
                    className="border! border-slate-300!"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    sx={{
                      flex: 1,
                      maxWidth: 400,
                      borderRadius: "lg",
                      // ✅ Handle colors based on isDark
                      bgcolor: isDark ? "#0f172b" : "neutral.50",
                      borderColor: isDark ? "#1d293d" : "neutral.200",
                      color: isDark ? "#90a1b9" : "neutral.600",

                      // ✅ Specific override for the "Disabled" state
                      "&.Mui-disabled": {
                        bgcolor: isDark
                          ? "rgba(15, 23, 42, 0.5)"
                          : "neutral.50",
                        color: isDark ? "#62748e" : "neutral.500",
                        borderColor: isDark ? "#90a1b9" : "neutral.200",
                        textShadow: isDark ? "none" : "none",
                        cursor: "not-allowed",
                        // Target the internal input element
                        "& input": {
                          WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                        },
                      },
                    }}
                  />
                </FormControl>

                <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                  <FormLabel
                    className={`${isDark ? "text-slate-400!" : ""}`}
                    sx={{ minWidth: 140 }}
                  >
                    Confirm Password
                  </FormLabel>
                  <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <Input
                      className="border! border-slate-300!"
                      type="password"
                      placeholder="••••••••"
                      value={passwords.confirmPassword}
                      sx={{
                        flex: 1,
                        maxWidth: 400,
                        borderRadius: "lg",
                        // ✅ Handle colors based on isDark
                        bgcolor: isDark ? "#0f172b" : "neutral.50",
                        borderColor: isDark ? "#1d293d" : "neutral.200",
                        color: isDark ? "#90a1b9" : "neutral.600",

                        // ✅ Specific override for the "Disabled" state
                        "&.Mui-disabled": {
                          bgcolor: isDark
                            ? "rgba(15, 23, 42, 0.5)"
                            : "neutral.50",
                          color: isDark ? "#62748e" : "neutral.500",
                          borderColor: isDark ? "#90a1b9" : "neutral.200",
                          textShadow: isDark ? "none" : "none",
                          cursor: "not-allowed",
                          // Target the internal input element
                          "& input": {
                            WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                          },
                        },
                      }}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                    {/* Password Strength Indicator */}
                    {passwords.newPassword && (
                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
                          {[...Array(4)].map((_, i) => (
                            <Box
                              key={i}
                              sx={{
                                height: 4,
                                flex: 1,
                                borderRadius: "2px",
                                bgcolor:
                                  i < strengthScore
                                    ? strengthColors[strengthScore]
                                    : "#e2e8f0",
                                transition: "background-color 0.3s",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography
                          className={`${isDark ? "text-slate-400!" : ""}`}
                          level="body-xs"
                          sx={{
                            color: strengthColors[strengthScore],
                            fontWeight: 600,
                          }}
                        >
                          Strength: {strengthLabels[strengthScore]}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </FormControl>

                {/* OTP INPUT (Appears After Sending OTP) */}
                {isOtpSent && (
                  <FormControl sx={{ display: { sm: "flex-row" }, gap: 2 }}>
                    <FormLabel
                      className={`${isDark ? "text-slate-400!" : ""}`}
                      sx={{ minWidth: 140 }}
                    >
                      Verification Code
                    </FormLabel>
                    <Input
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ flex: 1, maxWidth: 200 }}
                    />
                  </FormControl>
                )}

                <Box
                  sx={{ display: "flex", justifyContent: "start", gap: 2 }}
                >
                  <Button
                    className={`${isDark ? "text-slate-200!" : ""}`}
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
                      Change Password
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

            {activeSection === "st" && (
              <Stack gap={3}>
                <Box>
                  <Typography
                    level="h4"
                    sx={{ color: isDark ? "neutral.100" : "neutral.900" }}
                  >
                    Financial & Identity Verification
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{ color: isDark ? "neutral.400" : "neutral.600" }}
                  >
                    {validationStep === 1
                      ? "Step 1: Confirm your legal identity."
                      : "Step 2: Enter your business name to complete setup."}
                  </Typography>
                </Box>

                {/* NEW: Pre-flight Disclaimer */}
                {validationStep === 1 && (
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: isDark
                        ? "rgba(10, 100, 255, 0.1)"
                        : "info.softBg",
                      borderRadius: "sm",
                      border: "1px solid",
                      borderColor: isDark
                        ? "rgba(10, 100, 255, 0.2)"
                        : "info.outlinedBorder",
                    }}
                  >
                    <Typography
                      level="body-xs"
                      sx={{ color: isDark ? "info.300" : "primary.700" }}
                    >
                      <strong>Note:</strong> Please ensure your names match the
                      records tied to your <strong>BVN</strong>. If you have
                      verified your identity on another Paystack-powered
                      platform, our system will automatically sync your records.
                    </Typography>
                  </Box>
                )}

                <Divider
                  sx={{ borderColor: isDark ? "neutral.800" : "neutral.200" }}
                />

                {/* STEP 1 FIELDS */}
                <Stack gap={2} sx={{ opacity: validationStep === 2 ? 0.5 : 1 }}>
                  <FormControl>
                    <FormLabel
                      sx={{ color: isDark ? "neutral.300" : "neutral.700" }}
                    >
                      Bank
                    </FormLabel>
                    <Autocomplete
                      placeholder="Search for your bank"
                      // Data props
                      options={banks}
                      getOptionLabel={(option) => option.name}
                      // This correctly finds the bank object even if you only have the code stored
                      value={
                        banks.find((b) => b.code === bankForm.bankCode) || null
                      }
                      onChange={(_, newValue) => {
                        setBankForm({
                          ...bankForm,
                          bankCode: newValue?.code || "",
                        });
                      }}
                      disabled={validationStep === 2}
                      // Theme props
                      variant={isDark ? "soft" : "outlined"}
                      slotProps={{
                        input: {
                          className: "hide-scrollbar",
                        },
                        listbox: {
                          sx: {
                            maxHeight: "240px",
                            bgcolor: isDark ? "#0f172b" : "common.white",
                            borderColor: isDark ? "#1d293d" : "neutral.200",
                            boxShadow: "lg",
                            "& .MuiAutocomplete-option": {
                              color: isDark ? "#94a3b8" : "neutral.800",
                              '&[aria-selected="true"]': {
                                bgcolor: isDark ? "#334155" : "primary.softBg",
                                color: isDark ? "#fff" : "primary.solidColor",
                              },
                              "&:hover": {
                                bgcolor: isDark ? "#1e293b" : "neutral.100",
                                color: isDark ? "#f8fafc" : "neutral.900",
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        flex: 1,
                        borderRadius: "lg",
                        bgcolor: isDark ? "#0f172b" : "neutral.50",
                        borderColor: isDark ? "#1d293d" : "neutral.200",
                        // Fixes the text color for what the user is actually typing
                        "& .MuiAutocomplete-input": {
                          color: isDark ? "#f8fafc" : "neutral.900",
                        },
                        "&.Mui-disabled": {
                          bgcolor: isDark
                            ? "rgba(15, 23, 42, 0.5)"
                            : "neutral.50",
                          "& .MuiAutocomplete-input": {
                            WebkitTextFillColor: isDark ? "#475569" : "#94a3b8",
                          },
                        },
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      sx={{ color: isDark ? "neutral.300" : "neutral.700" }}
                    >
                      Account Number
                    </FormLabel>
                    <Input
                      variant={isDark ? "soft" : "outlined"}
                      disabled={validationStep === 2}
                      value={bankForm.accountNumber}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountNumber: e.target.value,
                        })
                      }
                      sx={{
                        flex: 1,
                        borderRadius: "lg",
                        // ✅ Handle colors based on isDark
                        bgcolor: isDark ? "#0f172b" : "neutral.50",
                        borderColor: isDark ? "#1d293d" : "neutral.200",
                        color: isDark ? "#90a1b9" : "neutral.600",

                        // ✅ Specific override for the "Disabled" state
                        "&.Mui-disabled": {
                          bgcolor: isDark
                            ? "rgba(15, 23, 42, 0.5)"
                            : "neutral.50",
                          color: isDark ? "#62748e" : "neutral.500",
                          borderColor: isDark ? "#90a1b9" : "neutral.200",
                          textShadow: isDark ? "none" : "none",
                          cursor: "not-allowed",
                          // Target the internal input element
                          "& input": {
                            WebkitTextFillColor: isDark ? "#64748b" : "#64748b", // Ensures color isn't forced to grey by browser
                          },
                        },
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      sx={{ color: isDark ? "neutral.300" : "neutral.700" }}
                    >
                      Identity Status
                    </FormLabel>
                    {store?.paystack?.verified ? (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                          p: 1.5,
                          bgcolor: isDark
                            ? "rgba(30, 70, 50, 0.3)"
                            : "success.softBg",
                          borderRadius: "md",
                          border: "1px solid",
                          borderColor: isDark
                            ? "success.800"
                            : "success.softBorder",
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            color: isDark ? "success.400" : "success.solidBg",
                            fontSize: "xl",
                          }}
                        />
                        <Box>
                          <Typography
                            level="title-sm"
                            sx={{
                              color: isDark ? "success.300" : "success.700",
                            }}
                          >
                            BVN Verified
                          </Typography>
                          <Typography
                            level="body-xs"
                            sx={{
                              color: isDark ? "neutral.400" : "neutral.600",
                            }}
                          >
                            Linked to: {user?.fullName}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <Input
                        variant={isDark ? "soft" : "outlined"}
                        type={showBVN ? "text" : "password"}
                        placeholder="Enter 11-digit BVN"
                        value={bankForm.bvn}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            bvn: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        slotProps={{ input: { maxLength: 11 } }}
                        sx={{
                          bgcolor: isDark ? "neutral.800" : "common.white",
                        }}
                        endDecorator={
                          <IconButton
                            onClick={() => setShowBVN(!showBVN)}
                            sx={{
                              color: isDark ? "neutral.400" : "neutral.600",
                            }}
                          >
                            {showBVN ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        }
                      />
                    )}
                  </FormControl>

                  {validationStep === 1 && (
                    <Button
                      sx={{
                        bgcolor: isDark ? "neutral.100" : "neutral.900",
                        color: isDark ? "neutral.900" : "common.white",
                        "&:hover": {
                          bgcolor: isDark ? "neutral.300" : "neutral.800",
                        },
                      }}
                      loading={isUpdating}
                      onClick={handleIdentitySubmit}
                    >
                      {store?.paystack?.verified
                        ? "Update Bank Details"
                        : "Verify My Identity"}
                    </Button>
                  )}
                </Stack>

                {/* STEP 2: BUSINESS INFO */}
                {validationStep === 2 && (
                  <Stack
                    gap={2}
                    sx={{
                      p: 2,
                      bgcolor: isDark
                        ? "rgba(30, 70, 50, 0.2)"
                        : "success.softBg",
                      borderRadius: "md",
                      border: "1px dashed",
                      borderColor: isDark ? "success.800" : "success.main",
                    }}
                  >
                    <Typography
                      level="title-md"
                      sx={{ color: isDark ? "success.300" : "success.700" }}
                    >
                      Verified: {verifiedInfo.name}
                    </Typography>

                    <FormControl>
                      <FormLabel
                        sx={{ color: isDark ? "neutral.300" : "neutral.700" }}
                      >
                        Registered Store Name
                      </FormLabel>
                      <Input
                        variant={isDark ? "soft" : "outlined"}
                        placeholder="This name appears on customer receipts"
                        value={bankForm.businessName}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            businessName: e.target.value,
                          })
                        }
                        sx={{
                          bgcolor: isDark ? "neutral.800" : "common.white",
                        }}
                      />
                    </FormControl>
                    <Typography
                      level="body-xs"
                      sx={{
                        color: isDark ? "neutral.400" : "neutral.600",
                        mt: 1.5,
                        fontStyle: "italic",
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                        lineHeight: 1.5,
                      }}
                    >
                      <span>ℹ️</span>
                      <span>
                        The name provided above will define your store identity
                        and public URL.
                        <strong>
                          {" "}
                          Any spaces in your name will be replaced with hyphens
                        </strong>{" "}
                        (e.g., "My Shop" becomes "my-shop").
                      </span>
                    </Typography>
                    <Button
                      color="success"
                      variant={isDark ? "solid" : "solid"}
                      loading={isUpdating}
                      onClick={handleSaveBankDetails}
                    >
                      Activate Payouts
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}
          </Sheet>
        </Box>
      </Box>
    </StoreOwnerLayout>
  );
}
