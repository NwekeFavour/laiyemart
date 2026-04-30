import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  Chip,
  Sheet,
  Stack,
  Divider,
} from "@mui/joy";
import { Plus, Trash2, Palette, Shuffle } from "lucide-react";

// ─── quick-generate presets ────────────────────────────────────────────────────
// Each preset defines the axes to generate combinations from.
// The store owner fills in prices/stock after generation.
const PRESETS = [
  {
    label: "Fashion",
    icon: "👕",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    label: "Perfume",
    icon: "🧴",
    sizes: ["50ml", "100ml", "200ml"],
    colors: ["Blue", "Gold", "Black"],
  },
  {
    label: "Beauty",
    icon: "💄",
    sizes: ["30ml", "50ml", "100ml"],
    colors: ["Light", "Medium", "Dark"],
  },
  {
    label: "Tech",
    icon: "💻",
    sizes: ["128GB", "256GB", "512GB"],
    colors: ["Space Gray", "Silver", "Gold"],
  },
  {
    label: "Shoes",
    icon: "👟",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Black", "White", "Brown"],
  },
  {
    label: "Size only",
    icon: "📐",
    sizes: ["Small", "Medium", "Large", "XL"],
    colors: [],
  },
  {
    label: "Color only",
    icon: "🎨",
    sizes: [],
    colors: ["Black", "White", "Red", "Blue", "Green"],
  },
];

const COLOR_MAP = {
  black: "#000000", white: "#FFFFFF", red: "#E24B4A", navy: "#042C53",
  green: "#3B6D11", blue: "#185FA5", yellow: "#EF9F27", pink: "#D4537E",
  purple: "#534AB7", gray: "#888780", silver: "#C0C0C0", gold: "#D4AF37",
  orange: "#E07033", brown: "#7B4F2E", beige: "#D9C9A8",
  "space gray": "#7D7E80", midnight: "#1A1A2E", light: "#F5DEB3",
  medium: "#C8A882", dark: "#5C3A1E", deep: "#2C1A0E",
  oak: "#C19A6B", walnut: "#5C4033", "matte black": "#1C1C1C",
};

const toHex = (name = "") =>
  COLOR_MAP[name.toLowerCase()] ||
  COLOR_MAP[name.toLowerCase().split(" ")[0]] ||
  "#E2E8F0";

const uid = () => `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Generate every size × color combination from two arrays
const generateCombinations = (sizes, colors) => {
  const variants = [];

  if (sizes.length > 0 && colors.length > 0) {
    for (const size of sizes) {
      for (const color of colors) {
        variants.push({ id: uid(), size, color, hex: toHex(color), price: "", stock: "" });
      }
    }
  } else if (sizes.length > 0) {
    for (const size of sizes) {
      variants.push({ id: uid(), size, color: "", hex: "", price: "", stock: "" });
    }
  } else if (colors.length > 0) {
    for (const color of colors) {
      variants.push({ id: uid(), size: "", color, hex: toHex(color), price: "", stock: "" });
    }
  }

  return variants;
};

// ─── single variant row ────────────────────────────────────────────────────────
function VariantRow({ variant, onChange, onRemove, isDark }) {
  const inputSx = {
    borderRadius: "md",
    fontSize: "13px",
    bgcolor: isDark ? "transparent" : "neutral.softBg",
    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    "&::before": { display: "none" },
    color: isDark ? "#f1f5f9" : "inherit",
  };

  return (
    <Box
      sx={{
        display: "grid",
        // swatch | color name | size | price | stock | delete
        gridTemplateColumns: "24px 1fr 1fr 110px 80px 28px",
        gap: 1,
        alignItems: "center",
        py: 0.5,
      }}
    >
      {/* Color swatch / picker */}
      <Box
        sx={{
          position: "relative",
          width: 24, height: 24, flexShrink: 0,
          borderRadius: "50%",
          bgcolor: variant.hex || "#E2E8F0",
          border: "2px solid",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          overflow: "hidden",
          cursor: variant.color ? "pointer" : "default",
        }}
      >
        {variant.color && (
          <input
            type="color"
            value={variant.hex || "#E2E8F0"}
            onChange={(e) => onChange({ ...variant, hex: e.target.value })}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              opacity: 0, cursor: "pointer",
              border: "none", padding: 0,
            }}
          />
        )}
      </Box>

      {/* Color name */}
      <Input
        size="sm"
        placeholder="Color (optional)"
        value={variant.color || ""}
        onChange={(e) => onChange({
          ...variant,
          color: e.target.value,
          hex: variant.hex || toHex(e.target.value),
        })}
        variant="soft"
        sx={inputSx}
      />

      {/* Size */}
      <Input
        size="sm"
        placeholder="Size (optional)"
        value={variant.size || ""}
        onChange={(e) => onChange({ ...variant, size: e.target.value })}
        variant="soft"
        sx={inputSx}
      />

      {/* Price */}
      <Input
        size="sm"
        type="number"
        placeholder="Price"
        value={variant.price ?? ""}
        onChange={(e) =>
          onChange({ ...variant, price: e.target.value === "" ? "" : Number(e.target.value) })
        }
        startDecorator={
          <Typography sx={{ fontSize: "11px", color: "neutral.500", flexShrink: 0 }}>₦</Typography>
        }
        variant="soft"
        sx={inputSx}
      />

      {/* Stock */}
      <Input
        size="sm"
        type="number"
        placeholder="Stock"
        value={variant.stock ?? ""}
        onChange={(e) =>
          onChange({ ...variant, stock: e.target.value === "" ? "" : Number(e.target.value) })
        }
        variant="soft"
        sx={inputSx}
      />

      <IconButton
        size="sm" variant="plain" color="danger"
        onClick={onRemove}
        sx={{ minWidth: 28, minHeight: 28, p: 0 }}
      >
        <Trash2 size={13} />
      </IconButton>
    </Box>
  );
}

// ─── main export ───────────────────────────────────────────────────────────────
export default function VariantsSection({ variants = [], setVariants, isDark }) {
  const [showPresets, setShowPresets] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator local state
  const [genSizes, setGenSizes] = useState("");
  const [genColors, setGenColors] = useState("");

  const addBlankRow = () => {
    setVariants((prev) => [
      ...prev,
      { id: uid(), size: "", color: "", hex: "", price: "", stock: "" },
    ]);
  };

  const applyPreset = (preset) => {
    const generated = generateCombinations(preset.sizes, preset.colors);
    setVariants(generated);
    setShowPresets(false);
    setShowGenerator(false);
  };

  const runGenerator = () => {
    const sizes = genSizes.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = genColors.split(",").map((c) => c.trim()).filter(Boolean);
    if (sizes.length === 0 && colors.length === 0) return;
    const generated = generateCombinations(sizes, colors);
    setVariants(generated);
    setShowGenerator(false);
    setGenSizes("");
    setGenColors("");
  };

  const updateVariant = (key, updated) => {
    setVariants((prev) =>
      prev.map((v) => (v._id?.toString() || v.id) === key ? { ...updated, _id: v._id, id: v.id } : v)
    );
  };

  const removeVariant = (key) => {
    setVariants((prev) => prev.filter((v) => (v._id?.toString() || v.id) !== key));
  };

  return (
    <FormControl>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <FormLabel
          className={isDark ? "text-slate-400!" : ""}
          sx={{ fontWeight: 600, mb: 0 }}
        >
          Variants
          {variants.length > 0 && (
            <Chip size="sm" variant="soft" color="neutral" sx={{ ml: 1, fontSize: "11px" }}>
              {variants.length}
            </Chip>
          )}
        </FormLabel>

        <Stack direction="row" spacing={1}>
          <Typography
            level="body-xs"
            onClick={() => { setShowGenerator((v) => !v); setShowPresets(false); }}
            sx={{ cursor: "pointer", fontWeight: 600, color: isDark ? "primary.400" : "#475569" }}
          >
            {showGenerator ? "Close" : "⚡ Generate"}
          </Typography>
          <Typography level="body-xs" sx={{ color: "neutral.400" }}>·</Typography>
          <Typography
            level="body-xs"
            onClick={() => { setShowPresets((v) => !v); setShowGenerator(false); }}
            sx={{ cursor: "pointer", fontWeight: 600, color: isDark ? "primary.400" : "#475569" }}
          >
            {showPresets ? "Hide presets" : "✦ Presets"}
          </Typography>
        </Stack>
      </Box>

      {/* ── Custom Generator ── */}
      {showGenerator && (
        <Sheet
          variant="outlined"
          sx={{
            p: 2, mb: 2, borderRadius: "lg",
            border: isDark ? "1px dashed #334155" : "1px dashed #cbd5e1",
            bgcolor: isDark ? "rgba(15,23,42,0.4)" : "#f8fafc",
          }}
        >
          <Typography level="body-sm" sx={{ fontWeight: 600, mb: 1.5, color: isDark ? "#94a3b8" : "#475569" }}>
            Enter your options (comma-separated), then click Generate
          </Typography>
          <Stack spacing={1.5}>
            <Input
              size="sm"
              placeholder="Sizes: S, M, L, XL  OR  50ml, 100ml, 200ml"
              value={genSizes}
              onChange={(e) => setGenSizes(e.target.value)}
              variant="soft"
              sx={{ borderRadius: "md", border: isDark ? "1px solid #334155" : "1px solid #e2e8f0", "&::before": { display: "none" } }}
            />
            <Input
              size="sm"
              placeholder="Colors: Black, White, Navy  (leave blank if no colors)"
              value={genColors}
              onChange={(e) => setGenColors(e.target.value)}
              variant="soft"
              sx={{ borderRadius: "md", border: isDark ? "1px solid #334155" : "1px solid #e2e8f0", "&::before": { display: "none" } }}
            />
            <Button
              size="sm"
              startDecorator={<Shuffle size={14} />}
              onClick={runGenerator}
              sx={{ bgcolor: isDark ? "#1e293b" : "#0f172a", color: "white", borderRadius: "md", alignSelf: "flex-start" }}
            >
              Generate combinations
            </Button>
          </Stack>
          <Typography level="body-xs" sx={{ mt: 1, color: "neutral.500" }}>
            Creates every size × color pair. You then just fill in the price for each.
          </Typography>
        </Sheet>
      )}

      {/* ── Presets ── */}
      {showPresets && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {PRESETS.map((p) => (
            <Chip
              key={p.label}
              size="sm"
              variant="soft"
              color="neutral"
              onClick={() => applyPreset(p)}
              sx={{
                cursor: "pointer", fontSize: "12px",
                bgcolor: isDark ? "#1e293b" : "#f1f5f9",
                color: isDark ? "#cbd5e1" : "#475569",
                border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                "&:hover": { bgcolor: isDark ? "#334155" : "#e2e8f0" },
              }}
            >
              {p.icon} {p.label}
            </Chip>
          ))}
        </Box>
      )}

      {/* ── Column headers ── */}
      {variants.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "24px 1fr 1fr 110px 80px 28px",
            gap: 1, mb: 0.5, px: 0.5,
          }}
        >
          <Box />
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>Color</Typography>
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>Size / Volume</Typography>
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>Price (₦)</Typography>
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>Stock</Typography>
          <Box />
        </Box>
      )}

      {/* ── Variant rows ── */}
      <Stack spacing={0.5}>
        {variants.map((v) => {
          const key = v._id?.toString() || v.id;
          return (
            <VariantRow
              key={key}
              variant={v}
              onChange={(updated) => updateVariant(key, updated)}
              onRemove={() => removeVariant(key)}
              isDark={isDark}
            />
          );
        })}
      </Stack>

      {/* ── Add row button ── */}
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        startDecorator={<Plus size={14} />}
        onClick={addBlankRow}
        sx={{
          mt: variants.length > 0 ? 1.5 : 0,
          borderRadius: "lg", fontSize: "13px",
          borderStyle: "dashed",
          color: isDark ? "#94a3b8" : "#64748b",
          borderColor: isDark ? "#334155" : "#cbd5e1",
          bgcolor: "transparent",
        }}
      >
        Add variant row
      </Button>

      {variants.length > 0 && (
        <Typography level="body-xs" sx={{ mt: 1, color: "neutral.500" }}>
          Leave Color or Size blank if a variant only differs by one attribute.
          Price falls back to the product base price if left blank.
        </Typography>
      )}
    </FormControl>
  );
}