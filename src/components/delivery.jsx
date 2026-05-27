import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Stack,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Option,
} from "@mui/joy";
import { Plus, Trash2, Pencil, Check, X, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import {
  getDeliveryProfile,
  saveDeliveryProfile,
  listDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
} from "../../services/deliveryService";

const METHODS = [
  { value: "local_delivery", label: "Local Delivery" },
  { value: "pickup", label: "Store Pickup" },
  { value: "customer_arranged_rider", label: "Customer Arranges Rider" },
  { value: "in_house_dispatch", label: "In-House Dispatch" },
  { value: "nationwide_courier", label: "Nationwide Courier" },
];

const emptyZone = {
  name: "",
  state: "",
  city: "",
  fee: "",
  method: "local_delivery",
  estimatedTime: "",
};

export default function DeliverySettingsSection({ isDark }) {
  const [profile, setProfile] = useState({
    deliveryEnabled: true,
    pickupEnabled: false,
    freeDeliveryThreshold: "",
    deliveryNotes: "",
    nationwideEnabled: false,
  });
  const [zones, setZones] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [zoneForm, setZoneForm] = useState(emptyZone);
  const [editingId, setEditingId] = useState(null);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [savingZone, setSavingZone] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── Load on mount ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, zonesRes] = await Promise.all([
          getDeliveryProfile(),
          listDeliveryZones(),
        ]);
        if (profileRes.profile) {
          const p = profileRes.profile;
          setProfile({
            deliveryEnabled: p.deliveryEnabled ?? true,
            pickupEnabled: p.pickupEnabled ?? false,
            freeDeliveryThreshold: p.freeDeliveryThreshold ?? "",
            deliveryNotes: p.deliveryNotes ?? "",
            nationwideEnabled: Array.isArray(p.supportedMethods)
              ? p.supportedMethods.includes("nationwide_courier")
              : false,
          });
        }
        if (zonesRes.zones) setZones(zonesRes.zones);
      } catch (err) {
        toast.error("Failed to load delivery settings");
      }
    };
    load();
  }, []);

  // ── Save Profile ───────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await saveDeliveryProfile(profile);
      toast.success("Delivery settings saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Zone CRUD ──────────────────────────────────────────────
  const handleSaveZone = async () => {
    const hasFee =
      zoneForm.fee !== "" &&
      zoneForm.fee !== null &&
      zoneForm.fee !== undefined;

    if (!zoneForm.name?.trim() || !hasFee || !zoneForm.method) {
      return toast.error("Zone name, fee and method are required");
    }
    setSavingZone(true);
    try {
      if (editingId) {
        const res = await updateDeliveryZone(editingId, zoneForm);
        setZones((prev) =>
          prev.map((z) => (z._id === editingId ? res.zone : z)),
        );
        toast.success("Zone updated");
      } else {
        const res = await createDeliveryZone(zoneForm);
        setZones((prev) => [res.zone, ...prev]);
        toast.success("Zone added");
      }
      setZoneForm(emptyZone);
      setEditingId(null);
      setShowZoneForm(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingZone(false);
    }
  };

  const handleEditZone = (zone) => {
    setZoneForm({
      name: zone.zoneName,
      state: zone.states?.[0] || "",
      city: zone.cities?.[0] || "",
      fee: zone.fee,
      method: zone.method,
      estimatedTime: zone.estimatedDeliveryTime || "",
    });
    setEditingId(zone._id);
    setShowZoneForm(true);
  };

  const handleDeleteZone = async (id) => {
    setDeletingId(id);
    try {
      await deleteDeliveryZone(id);
      setZones((prev) => prev.filter((z) => z._id !== id));
      toast.success("Zone deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const inputSx = {
    bgcolor: isDark ? "#0f172a" : "white",
    borderColor: isDark ? "#90a1b9" : "neutral.200",
    color: isDark ? "#f1f5f9" : "inherit",
  };

  return (
    <Stack gap={3}>
      {/* Header */}
      <Box>
        <Typography
          className={isDark ? "text-slate-200!" : ""}
          level="h4"
          sx={{ fontWeight: 700 }}
        >
          Delivery Settings
        </Typography>
        <Typography className={isDark ? "text-slate-400!" : ""} level="body-sm">
          Configure how your store handles deliveries and pickups.
        </Typography>
      </Box>

      <Divider />

      {/* ── Toggles ── */}
      <Stack gap={2}>
        {[
          {
            key: "deliveryEnabled",
            label: "Home Delivery",
            desc: "Offer delivery to customers' addresses",
          },
          {
            key: "pickupEnabled",
            label: "Store Pickup",
            desc: "Allow customers to pick up from your location",
          },
          {
            key: "nationwideEnabled",
            label: "Nationwide Shipping",
            desc: "Ship orders across Nigeria",
          },
        ].map(({ key, label, desc }) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                className={isDark ? "text-slate-200!" : ""}
                sx={{ fontWeight: 600 }}
              >
                {label}
              </Typography>
              <Typography
                level="body-xs"
                className={isDark ? "text-slate-400!" : ""}
              >
                {desc}
              </Typography>
            </Box>
            <Switch
              checked={profile[key]}
              onChange={(e) =>
                setProfile({ ...profile, [key]: e.target.checked })
              }
              color={profile[key] ? "success" : "neutral"}
              size="lg"
            />
          </Box>
        ))}
      </Stack>

      <Divider />

      {/* ── Pickup Address / Notes ── */}
      <FormControl>
        <FormLabel className={isDark ? "text-slate-400!" : ""}>
          {profile.pickupEnabled
            ? "Pickup Address & Instructions"
            : "Delivery Notes"}
        </FormLabel>
        <Input
          placeholder={
            profile.pickupEnabled
              ? "e.g. 12 Adeola Street, Lekki Phase 1"
              : "e.g. We deliver every weekday"
          }
          value={profile.deliveryNotes}
          onChange={(e) =>
            setProfile({ ...profile, deliveryNotes: e.target.value })
          }
          sx={inputSx}
        />
      </FormControl>

      {/* ── Free Delivery Threshold ── */}
      <FormControl>
        <FormLabel className={isDark ? "text-slate-400!" : ""}>
          Free Delivery Above (₦) - leave empty to disable
        </FormLabel>
        <Input
          type="number"
          placeholder="e.g. 20000"
          value={profile.freeDeliveryThreshold}
          onChange={(e) =>
            setProfile({ ...profile, freeDeliveryThreshold: e.target.value })
          }
          startDecorator="₦"
          sx={inputSx}
        />
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          loading={savingProfile}
          onClick={handleSaveProfile}
          sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
        >
          Save Settings
        </Button>
      </Box>

      <Divider />

      {/* ── Delivery Zones ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          className={isDark ? "text-slate-200!" : ""}
          level="title-md"
          sx={{ fontWeight: 700 }}
        >
          Delivery Zones
        </Typography>
        <Button
          size="sm"
          startDecorator={<Plus size={16} />}
          onClick={() => {
            setZoneForm(emptyZone);
            setEditingId(null);
            setShowZoneForm(true);
          }}
          sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
        >
          Add Zone
        </Button>
      </Box>

      {/* Zone Form */}
      {showZoneForm && (
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            bgcolor: isDark ? "#0f172a" : "#f8fafc",
          }}
        >
          <Typography
            level="title-sm"
            sx={{ mb: 2, fontWeight: 700 }}
            className={isDark ? "text-slate-200!" : ""}
          >
            {editingId ? "Edit Zone" : "New Zone"}
          </Typography>
          <Stack gap={2}>
            <Box
              className="grid-cols-1  md:grid-cols-2"
              sx={{ display: "grid", gap: 2, alignItems: "self-end" }}
            >
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  Address / Zone Name *
                </FormLabel>
                <Input
                  placeholder="e.g. Lagos Island"
                  value={zoneForm.name}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, name: e.target.value })
                  }
                  sx={inputSx}
                />
              </FormControl>
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  Fee (₦) *
                </FormLabel>
                <Input
                  type="number"
                  placeholder="1500"
                  disabled={zoneForm.method === "customer_arranged_rider"}
                  value={zoneForm.fee}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, fee: e.target.value })
                  }
                  startDecorator="₦"
                  sx={inputSx}
                />
              </FormControl>
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  State
                </FormLabel>
                <Input
                  placeholder="e.g. Lagos"
                  value={zoneForm.state}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, state: e.target.value })
                  }
                  sx={inputSx}
                />
              </FormControl>
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  City (optional)
                </FormLabel>
                <Input
                  placeholder="e.g. Lekki"
                  value={zoneForm.city}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, city: e.target.value })
                  }
                  sx={inputSx}
                />
                <Typography
                  level="body-xs"
                  sx={{ mt: 0.5, color: "neutral.400" }}
                >
                  Leave blank to match all cities in the state above.
                </Typography>
              </FormControl>
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  Method *
                </FormLabel>
                <Select
                  value={zoneForm.method}
                  onChange={(_, v) => {
                    setZoneForm((prev) => ({
                      ...prev,
                      method: v,
                      fee: v === "customer_arranged_rider" ? 0 : prev.fee,
                    }));
                  }}
                  sx={{ ...inputSx, borderRadius: "lg" }}
                >
                  {METHODS.map((m) => (
                    <Option key={m.value} value={m.value}>
                      {m.label}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel className={isDark ? "text-slate-400!" : ""}>
                  Estimated Time
                </FormLabel>
                <Input
                  placeholder="e.g. Same Day"
                  value={zoneForm.estimatedTime}
                  onChange={(e) =>
                    setZoneForm({ ...zoneForm, estimatedTime: e.target.value })
                  }
                  sx={inputSx}
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => {
                  setShowZoneForm(false);
                  setEditingId(null);
                  setZoneForm(emptyZone);
                }}
                className={isDark ? "text-slate-300!" : ""}
              >
                Cancel
              </Button>
              <Button
                loading={savingZone}
                onClick={handleSaveZone}
                sx={{ bgcolor: "#0f172a", borderRadius: "lg" }}
              >
                {editingId ? "Update Zone" : "Add Zone"}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Zones Table */}
      {zones.length === 0 ? (
        <Box
          className="flex items-center justify-center flex-col text-center"
          sx={{
            py: 4,
            textAlign: "center",
            border: "1px dashed",
            borderColor: isDark ? "#314158" : "neutral.300",
            borderRadius: "md",
          }}
        >
          <MapPin size={24} style={{ opacity: 0.5 }} />
          <Typography
            className={`${isDark ? "text-slate-200!" : "text-slate-600"}`}
            level="title-sm"
            sx={{ mt: 1 }}
          >
            No delivery zones yet
          </Typography>
          <Typography
            className={`${isDark ? "text-slate-400!" : "text-slate-500"}`}
            level="body-xs"
          >
            Add zones so checkout can calculate delivery fees.
          </Typography>
        </Box>
      ) : (
        <Stack gap={1}>
          {zones.map((zone) => (
            <Box
              key={zone._id}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                bgcolor: isDark ? "#0f172a" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  level="title-sm"
                  className={isDark ? "text-slate-200!" : ""}
                  sx={{ fontWeight: 700 }}
                >
                  {zone.zoneName}
                </Typography>
                <Typography
                  level="body-xs"
                  className={isDark ? "text-slate-400!" : "text-slate-500"}
                >
                  {[zone.states?.join(", "), zone.cities?.join(", ")]
                    .filter(Boolean)
                    .join(" · ")}
                  {" · "}
                  {METHODS.find((m) => m.value === zone.method)?.label}
                  {zone.estimatedDeliveryTime &&
                    ` · ${zone.estimatedDeliveryTime}`}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  level="title-sm"
                  sx={{ fontWeight: 800, color: "#2D2A70" }}
                >
                  ₦{zone.fee?.toLocaleString()}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleEditZone(zone)}
                    sx={{ minWidth: 0, p: 0.5 }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    size="sm"
                    variant="plain"
                    color="danger"
                    loading={deletingId === zone._id}
                    onClick={() => handleDeleteZone(zone._id)}
                    sx={{ minWidth: 0, p: 0.5 }}
                  >
                    <Trash2 size={15} />
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
