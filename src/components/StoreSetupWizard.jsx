import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Input, Option, Select, Sheet, Stack, Typography } from "@mui/joy";
import { ArrowRight, Home, MapPin, Phone } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { useStoreProfileStore } from "../store/useStoreProfile";

const nigeriaStates = [
  "Abuja",
  "Lagos",
  "Oyo",
  "Rivers",
  "Kano",
  "Kaduna",
  "Delta",
  "Enugu",
  "Anambra",
  "Imo",
  "Cross River",
  "Akwa Ibom",
  "Ondo",
  "Osun",
  "Edo",
  "Plateau",
  "Katsina",
  "Borno",
  "Adamawa",
  "Niger",
  "Benue",
  "Kebbi",
  "Sokoto",
  "Jigawa",
  "Bauchi",
  "Gombe",
  "Taraba",
  "Yobe",
  "Bayelsa",
  "Ebonyi",
  "Ekiti",
  "Other",
];

export default function StoreSetupWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { token, user, store, setStore } = useAuthStore();
  const { updateStoreProfile, loading } = useStoreProfileStore();

  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
  });
  const [showCustomStateInput, setShowCustomStateInput] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      navigate("/auth/sign-in", { replace: true });
      return;
    }

    if (store?.address?.street && store?.address?.city && store?.address?.state) {
      navigate(redirectTo || "/", { replace: true });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumber: store?.phoneNumber || user?.phoneNumber || "",
      address: {
        street: store?.address?.street || "",
        city: store?.address?.city || "",
        state: store?.address?.state || "",
        country: store?.address?.country || "Nigeria",
      },
    }));
  }, [token, user, store, navigate, redirectTo]);

  const handleChange = (field, value) => {
    if (field === "phoneNumber") {
      setFormData((prev) => ({ ...prev, phoneNumber: value }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleStateSelection = (value) => {
    if (value === "Other") {
      setShowCustomStateInput(true);
      handleChange("state", "");
      return;
    }

    setShowCustomStateInput(false);
    handleChange("state", value || "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.address.street.trim()) {
      setError("Please enter your store street address.");
      return;
    }

    if (!formData.address.city.trim()) {
      setError("Please enter your store city.");
      return;
    }

    if (!formData.address.state.trim()) {
      setError("Please enter your store state.");
      return;
    }

    try {
      const result = await updateStoreProfile({
        email: user?.email,
        phoneNumber: formData.phoneNumber.trim(),
        address: {
          ...formData.address,
          country: "Nigeria",
        },
        token,
      });

      if (!result?.store) {
        throw new Error("We could not save your store details yet.");
      }

      setStore(result.store);
      toast.success("Store setup complete. You can now continue to your dashboard.");
      navigate(redirectTo || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to save your store information.");
      toast.error(err.message || "Unable to save your store information.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f3f4ff",
        px: 2,
        py: 4,
      }}
    >
      <Sheet
        variant="soft"
        sx={{
          width: "100%",
          maxWidth: 620,
          borderRadius: "24px",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.10)",
          bgcolor: "white",
        }}
      >
        <Stack spacing={2}>
          <Box className="flex-wrap space-y-3" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ bgcolor: "#eff6ff", borderRadius: "50%", p: 1.2 }}>
              <Home size={20} color="#2563eb" />
            </Box>
            <Box>
              <Typography level="h3" sx={{ fontWeight: 800 }}>
                Finish setting up your store
              </Typography>
              <Typography level="body-sm" sx={{ color: "neutral.600" }}>
                Add your store address so your profile is ready and your dashboard can open smoothly.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#f8fafc", borderRadius: "16px", p: 2.2, border: "1px solid #e2e8f0" }}>
            <Typography level="title-sm" sx={{ fontWeight: 700, mb: 1 }}>
              What you need to complete
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.700" }}>
              Enter your store street address, city, and state. You can also add a phone number to help customers reach you faster.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={1.8}>
              {error ? (
                <Box sx={{ bgcolor: "#fef2f2", color: "#b91c1c", px: 2, py: 1.2, borderRadius: "12px", border: "1px solid #fecaca" }}>
                  {error}
                </Box>
              ) : null}

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.6, fontWeight: 600 }}>
                  Street address
                </Typography>
                <Input
                  value={formData.address.street}
                  onChange={(event) => handleChange("street", event.target.value)}
                  placeholder="e.g. 12, Allen Avenue"
                  startDecorator={<MapPin size={16} />}
                />
              </Box>

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.6, fontWeight: 600 }}>
                  City
                </Typography>
                <Input
                  value={formData.address.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                  placeholder="e.g. Ikeja"
                />
              </Box>

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.6, fontWeight: 600 }}>
                  State
                </Typography>
                <Autocomplete
                  freeSolo
                  options={nigeriaStates}
                  value={formData.address.state || null}
                  inputValue={formData.address.state || ""}
                  onChange={(_, newValue) => {
                    if (typeof newValue === "string") {
                      handleStateSelection(newValue);
                      return;
                    }

                    handleStateSelection(newValue || "");
                  }}
                  onInputChange={(_, newInputValue) => {
                    if (newInputValue === "") {
                      handleChange("state", "");
                      setShowCustomStateInput(false);
                      return;
                    }

                    if (showCustomStateInput) {
                      handleChange("state", newInputValue);
                      return;
                    }

                    handleChange("state", newInputValue);
                  }}
                  renderInput={(params) => (
                    <Input
                      {...params}
                      placeholder="Select or type your state"
                    />
                  )}
                />

                {showCustomStateInput && (
                  <Input
                    value={formData.address.state}
                    onChange={(event) => handleChange("state", event.target.value)}
                    placeholder="Type your state manually"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.6, fontWeight: 600 }}>
                  Phone number
                </Typography>
                <Input
                  value={formData.phoneNumber}
                  onChange={(event) => handleChange("phoneNumber", event.target.value)}
                  placeholder="e.g. +234 801 234 5678"
                  startDecorator={<Phone size={16} />}
                />
              </Box>

              <Box className="grid md:grid-cols-[1fr_1fr] grid-cols-[200px_60px]" sx={{  gap: 1.5, mt: 1 }}>
                <Button
                  type="submit"
                  loading={loading}
                  endDecorator={<ArrowRight size={16} />}
                  sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#111827" } }}
                >
                  Save and continue
                </Button>
                <Button
                    classNAme="text-[15px] md:text-[17px]"
                  type="button"
                  variant="plain"
                  color="neutral"
                  onClick={() => navigate(redirectTo || "/", { replace: true })}
                >
                  Skip  <span className="hidden font-semibold! pl-[4.2px] md:block"> for now</span>
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Sheet>
    </Box>
  );
}
