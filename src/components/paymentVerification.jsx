import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Divider,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/joy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/* ---------------------------------------------------------------------- */
/*  Style helpers — computed once per theme instead of re-typed per field */
/* ---------------------------------------------------------------------- */

const inputSx = (isDark) => ({
  borderRadius: "lg",
  bgcolor: isDark ? "#0f172b" : "neutral.50",
  borderColor: isDark ? "#90a1b9" : "neutral.200",
  color: isDark ? "#90a1b9" : "neutral.600",
  "&.Mui-disabled": {
    bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "neutral.50",
    color: isDark ? "#62748e" : "neutral.500",
    borderColor: isDark ? "#90a1b9" : "neutral.200",
    cursor: "not-allowed",
    "& input": { WebkitTextFillColor: "#64748b" },
  },
});

const autocompleteSx = (isDark) => ({
  flex: 1,
  borderRadius: "lg",
  bgcolor: isDark ? "#0f172b" : "neutral.50",
  borderColor: isDark ? "#90a1b9" : "neutral.200",
  "& .MuiAutocomplete-input": { color: isDark ? "#f8fafc" : "neutral.900" },
  "&.Mui-disabled": {
    bgcolor: isDark ? "rgba(15, 23, 42, 0.5)" : "neutral.50",
    "& .MuiAutocomplete-input": {
      WebkitTextFillColor: isDark ? "#475569" : "#94a3b8",
    },
  },
});

const autocompleteListboxSx = (isDark) => ({
  maxHeight: "240px",
  bgcolor: isDark ? "#0f172b" : "common.white",
  borderColor: isDark ? "#90a1b9" : "neutral.200",
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
});

const labelSx = (isDark) => ({ color: isDark ? "neutral.300" : "neutral.700" });

const dashedPanelSx = (isDark) => ({
  p: 4,
  textAlign: "center",
  borderRadius: "md",
  border: "1px dashed",
  borderColor: isDark ? "neutral.700" : "neutral.300",
  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "neutral.50",
});

/* ---------------------------------------------------------------------- */
/*  Small reusable field components                                       */
/* ---------------------------------------------------------------------- */

function LockedInputField({ label, value, isDark }) {
  return (
    <FormControl>
      <FormLabel sx={labelSx(isDark)}>{label}</FormLabel>
      <Input
        disabled
        value={value}
        variant={isDark ? "soft" : "outlined"}
        sx={inputSx(isDark)}
      />
    </FormControl>
  );
}

function LockedBankField({ label, value, banks, isDark }) {
  return (
    <FormControl>
      <FormLabel sx={labelSx(isDark)}>{label}</FormLabel>
      <Autocomplete
        disabled
        options={banks}
        getOptionLabel={(option) => option.name}
        value={value}
        variant={isDark ? "soft" : "outlined"}
        sx={autocompleteSx(isDark)}
      />
    </FormControl>
  );
}

/* ---------------------------------------------------------------------- */
/*  Account name resolution — pulled out into its own hook so the form    */
/*  component stays focused on layout                                     */
/* ---------------------------------------------------------------------- */

function useResolvedAccountName(bankCode, accountNumber) {
  const [resolvedName, setResolvedName] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setIsConfirmed(false);
    setResolvedName("");
    setError("");

    const isCompleteAccountNumber = accountNumber?.length === 10;
    if (!bankCode || !isCompleteAccountNumber) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsResolving(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/paystack/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok || !data?.success || !data?.account_name) {
            throw new Error(data?.message || "We couldn't verify that account number. Double-check the details and try again.");
        }
        setResolvedName(data.account_name);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to verify account number");
        }
      } finally {
        setIsResolving(false);
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [bankCode, accountNumber]);

  return {
    resolvedName,
    isResolving,
    error,
    isConfirmed,
    confirm: () => setIsConfirmed(true),
    reset: () => {
      setResolvedName("");
      setError("");
      setIsConfirmed(false);
    },
  };
}

function AccountNameStatus({
  isDark,
  isResolving,
  error,
  resolvedName,
  isConfirmed,
  onConfirm,
  onReject,
}) {
  if (isResolving) {
    return (
      <Typography
        level="body-sm"
        sx={{ color: isDark ? "neutral.400" : "neutral.600" }}
      >
        Resolving account name...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography level="body-sm" sx={{ color: "danger.500" }}>
        {error}
      </Typography>
    );
  }

  if (!resolvedName) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1.5,
        borderRadius: "md",
        border: "1px solid",
        bgcolor: isConfirmed
          ? isDark
            ? "rgba(30, 70, 50, 0.3)"
            : "success.softBg"
          : isDark
            ? "rgba(100, 80, 20, 0.3)"
            : "warning.softBg",
        borderColor: isConfirmed
          ? isDark
            ? "success.800"
            : "success.softBorder"
          : isDark
            ? "warning.800"
            : "warning.softBorder",
      }}
    >
      <Stack>
        <Typography
          level="body-xs"
          sx={{ color: isDark ? "neutral.400" : "neutral.600" }}
        >
          Account name
        </Typography>
        <Typography
          level="body-md"
          fontWeight="lg"
          sx={{ color: isDark ? "neutral.100" : "neutral.900" }}
        >
          {resolvedName}
        </Typography>
      </Stack>

      {!isConfirmed && (
        <Stack direction="row" spacing={1}>
          <Button size="sm" variant="soft" color="success" onClick={onConfirm}>
            This is me
          </Button>
          <Button size="sm" variant="soft" color="neutral" onClick={onReject}>
            Not me, cancel
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

/* ---------------------------------------------------------------------- */
/*  Step 1 — bank, account number, BVN                                    */
/* ---------------------------------------------------------------------- */

function BankDetailsStep({
  isDark,
  banks,
  bankForm,
  setBankForm,
  validationStep,
  isUpdating,
  showBVN,
  setShowBVN,
  store,
  openIdentityConfirmation,
}) {
  const disabled = validationStep === 2;
  const account = useResolvedAccountName(
    bankForm.bankCode,
    bankForm.accountNumber,
  );

  const handleRejectName = () => {
    setBankForm({ ...bankForm, accountNumber: "", bankCode: "" });
    account.reset();
  };

  const canVerify = store?.paystack?.verified || account.isConfirmed;

  return (
    <Stack gap={2} sx={{ opacity: disabled ? 0.5 : 1 }}>
      <FormControl>
        <FormLabel sx={labelSx(isDark)}>Bank</FormLabel>
        <Autocomplete
          placeholder="Search for your bank"
          options={banks}
          getOptionLabel={(option) => option.name}
          value={banks.find((b) => b.code === bankForm.bankCode) || null}
          onChange={(_, newValue) =>
            setBankForm({ ...bankForm, bankCode: newValue?.code || "" })
          }
          disabled={disabled}
          variant={isDark ? "soft" : "outlined"}
          slotProps={{
            input: { className: "hide-scrollbar" },
            listbox: { sx: autocompleteListboxSx(isDark) },
          }}
          sx={autocompleteSx(isDark)}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={labelSx(isDark)}>Account Number</FormLabel>
        <Input
          variant={isDark ? "soft" : "outlined"}
          disabled={disabled}
          value={bankForm.accountNumber}
          onChange={(e) =>
            setBankForm({
              ...bankForm,
              accountNumber: e.target.value.replace(/\D/g, ""),
            })
          }
          slotProps={{ input: { maxLength: 10 } }}
          sx={inputSx(isDark)}
        />
      </FormControl>

      {/* Account name resolves automatically once bank + account number are complete */}
      {!store?.paystack?.verified && (
        <AccountNameStatus
          isDark={isDark}
          isResolving={account.isResolving}
          error={account.error}
          resolvedName={account.resolvedName}
          isConfirmed={account.isConfirmed}
          onConfirm={account.confirm}
          onReject={handleRejectName}
        />
      )}

      <FormControl>
        <FormLabel sx={labelSx(isDark)}>BVN</FormLabel>
        {store?.paystack?.verified ? (
          <Stack
            direction="row"
            alignItems="center"
            className={`${isDark ? "text-slate-200!" : ""} w-fit`}
            spacing={1.5}
            sx={{
              p: 1.5,
              bgcolor: isDark ? "rgba(30, 70, 50, 0.3)" : "success.softBg",
              borderRadius: "md",
              border: "1px solid",
              borderColor: isDark ? "success.800" : "success.softBorder",
            }}
          >
            <CheckCircleIcon
              sx={{
                color: isDark ? "success.400" : "success.solidBg",
                fontSize: "xl",
              }}
            />
          </Stack>
        ) : (
          <Input
            variant={isDark ? "soft" : "outlined"}
            type={showBVN ? "text" : "password"}
            placeholder="Enter 11-digit BVN"
            disabled={disabled}
            value={bankForm.bvn}
            onChange={(e) =>
              setBankForm({
                ...bankForm,
                bvn: e.target.value.replace(/\D/g, ""),
              })
            }
            slotProps={{ input: { maxLength: 11 } }}
            sx={inputSx(isDark)}
            endDecorator={
              <IconButton
                onClick={() => setShowBVN(!showBVN)}
                sx={{ color: isDark ? "neutral.400" : "neutral.600" }}
              >
                {showBVN ? (
                  <VisibilityOff
                    className={
                      isDark ? "text-[#cad5e2]!" : "text-slate-800/90!"
                    }
                  />
                ) : (
                  <Visibility
                    className={
                      isDark ? "text-[#cad5e2]!" : "text-slate-800/90!"
                    }
                  />
                )}
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
            "&:hover": { bgcolor: isDark ? "neutral.300" : "neutral.800" },
          }}
          loading={isUpdating}
          disabled={!canVerify}
          onClick={openIdentityConfirmation}
        >
          {store?.paystack?.verified
            ? "Update Bank Details"
            : "Verify My Identity"}
        </Button>
      )}
    </Stack>
  );
}

/* ---------------------------------------------------------------------- */
/*  Step 2 — business / store name + slug suggestions                     */
/* ---------------------------------------------------------------------- */

function slugify(str) {
  return str
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSlugSuggestions(words) {
  if (!words.length) return [];

  const joined = words.join("");
  const hyphenated = words.join("-");
  const initials = words.map((w) => w[0]).join("");
  const initialsWithLast = initials.slice(0, -1) + words[words.length - 1];
  const firstAndLast =
    words.length > 1 ? words[0] + words[words.length - 1] : null;
  const abbreviated = words
    .map((w) => (w.length > 4 ? w.slice(0, 4) : w))
    .join("");

  return [
    hyphenated,
    joined,
    initialsWithLast,
    firstAndLast,
    initials + words[words.length - 1],
    abbreviated,
  ]
    .filter(Boolean)
    .map(slugify)
    .filter((s) => s.length > 1)
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .slice(0, 5);
}

function BusinessInfoStep({
  isDark,
  store,
  bankForm,
  setBankForm,
  isUpdating,
  handleSaveBankDetails,
}) {
  const raw = bankForm.businessName?.trim() || "";
  const words = useMemo(
    () => raw.toLowerCase().split(/\s+/).filter(Boolean),
    [raw],
  );
  const suggestions = useMemo(() => generateSlugSuggestions(words), [words]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    const nextWords = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    setBankForm({
      ...bankForm,
      businessName: value,
      selectedSlug: slugify(nextWords.join("-")),
    });
  };

  const previewUrl = bankForm.selectedSlug
    ? store?.plan === "starter"
      ? `https://layemart.com/${bankForm.selectedSlug}`
      : `https://${bankForm.selectedSlug}.layemart.com`
    : null;

  return (
    <Stack
      gap={2}
      sx={{
        p: 2,
        bgcolor: isDark ? "rgba(30, 70, 50, 0.2)" : "success.softBg",
        borderRadius: "md",
        border: "1px dashed",
        borderColor: isDark ? "success.800" : "success.main",
      }}
    >
      <FormControl>
        <FormLabel sx={labelSx(isDark)}>Registered Store Name</FormLabel>
        <Input
          variant={isDark ? "soft" : "outlined"}
          placeholder="This name appears on customer receipts"
          value={bankForm.businessName}
          onChange={handleNameChange}
          className={
            isDark ? "placeholder:text-slate-100! text-slate-100!" : ""
          }
          sx={{ bgcolor: isDark ? "neutral.800" : "common.white" }}
        />
      </FormControl>

      {raw && (
        <Box>
          <Typography
            level="body-xs"
            sx={{
              color: isDark ? "neutral.400" : "neutral.500",
              mb: 1,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Suggested {store?.plan === "starter" ? "store URLs" : "subdomains"}{" "}
            — pick one:
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {suggestions.map((slug) => {
              const isSelected = bankForm.selectedSlug === slug;
              const url =
                store?.plan === "starter"
                  ? `layemart.com/${slug}`
                  : `${slug}.layemart.com`;

              return (
                <Box
                  key={slug}
                  onClick={() =>
                    setBankForm({ ...bankForm, selectedSlug: slug })
                  }
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "8px",
                    border: "1px solid",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    borderColor: isSelected
                      ? "success.500"
                      : isDark
                        ? "neutral.600"
                        : "neutral.300",
                    bgcolor: isSelected
                      ? isDark
                        ? "rgba(34,197,94,0.15)"
                        : "success.softBg"
                      : isDark
                        ? "neutral.800"
                        : "white",
                    "&:hover": {
                      borderColor: "success.400",
                      bgcolor: isDark
                        ? "rgba(34,197,94,0.08)"
                        : "success.softBg",
                    },
                  }}
                >
                  <Typography
                    level="body-xs"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected
                        ? isDark
                          ? "success.300"
                          : "success.700"
                        : isDark
                          ? "neutral.300"
                          : "neutral.700",
                    }}
                  >
                    {url}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {previewUrl && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: isDark ? "neutral.900" : "neutral.50",
                border: "1px solid",
                borderColor: isDark ? "neutral.700" : "neutral.200",
              }}
            >
              <Typography
                level="body-xs"
                sx={{ color: isDark ? "neutral.400" : "neutral.500" }}
              >
                Your store link will be:
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: isDark ? "success.300" : "success.700",
                  mt: 0.3,
                }}
              >
                {previewUrl}
              </Typography>
              {store?.plan === "starter" && (
                <Typography
                  level="body-xs"
                  sx={{
                    color: isDark ? "neutral.500" : "neutral.400",
                    mt: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  Upgrade to Professional to get a custom subdomain like{" "}
                  {bankForm.selectedSlug}.layemart.com
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      <Typography
        level="body-xs"
        sx={{
          color: isDark ? "neutral.400" : "neutral.600",
          fontStyle: "italic",
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          lineHeight: 1.5,
        }}
      >
        <span>ℹ️</span>
        <span>
          The name provided above will define your store identity and public
          URL. <strong>Any spaces will be replaced with hyphens</strong> (e.g.,
          "My Shop" → "my-shop").
        </span>
      </Typography>

      <Button
        color="success"
        variant="solid"
        loading={isUpdating}
        disabled={
          !bankForm.businessName?.trim() ||
          (store?.plan !== "starter" && !bankForm.selectedSlug)
        }
        onClick={handleSaveBankDetails}
      >
        Activate Payouts
      </Button>
    </Stack>
  );
}

/* ---------------------------------------------------------------------- */
/*  Locked view — shown once identity + bank details are verified         */
/* ---------------------------------------------------------------------- */

function IdentityLockedPanel({
  isDark,
  banks,
  lockedBank,
  lockedAccountNumber,
  lockedVerifiedName,
  lockedBusinessName,
  lockedStoreUrl,
}) {
  return (
    <Stack gap={3}>
      <Box sx={dashedPanelSx(isDark)}>
        <Typography fontSize={40}>🔒</Typography>
        <Typography level="title-md" sx={{ mt: 1 }}>
          Identity Locked
        </Typography>
        <Typography level="body-sm" sx={{ mt: 1, maxWidth: 360, mx: "auto" }}>
          Your financial and identity details have been verified and locked. To
          make changes, contact support:
        </Typography>
        <Typography level="title-sm" sx={{ mt: 2, color: "primary.500" }}>
          info@layemart.com
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: "md",
          border: "1px solid",
          borderColor: isDark ? "neutral.700" : "neutral.200",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "white",
        }}
      >
        <Typography
          level="title-sm"
          sx={{ mb: 2, color: isDark ? "neutral.100" : "neutral.900" }}
        >
          Submitted Bank Details
        </Typography>

        <Stack gap={2}>
          <LockedBankField
            label="Bank"
            value={lockedBank}
            banks={banks}
            isDark={isDark}
          />
          <LockedInputField
            label="Account Number"
            value={lockedAccountNumber}
            isDark={isDark}
          />
          <LockedInputField
            label="Account Name"
            value={lockedVerifiedName}
            isDark={isDark}
          />
          <LockedInputField
            label="Registered Store Name"
            value={lockedBusinessName}
            isDark={isDark}
          />
          {lockedStoreUrl && (
            <LockedInputField
              label="Store Link"
              value={lockedStoreUrl}
              isDark={isDark}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

/* ---------------------------------------------------------------------- */
/*  2FA gate                                                               */
/* ---------------------------------------------------------------------- */

function TwoFactorGate({ isDark, setActiveSection }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        ...dashedPanelSx(isDark),
      }}
    >
      <Typography fontSize={40}>🔒</Typography>
      <Typography
        level="title-md"
        sx={{ color: isDark ? "neutral.200" : "neutral.800" }}
      >
        Two-Factor Authentication Required
      </Typography>
      <Typography
        level="body-sm"
        sx={{ color: isDark ? "neutral.400" : "neutral.600", maxWidth: 320 }}
      >
        You must enable 2FA in your Security settings before you can access
        financial details.
      </Typography>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setActiveSection("security")}
        sx={{ borderColor: isDark ? "neutral.600" : "neutral.400" }}
      >
        Go to Security Settings
      </Button>
    </Box>
  );
}

/* ---------------------------------------------------------------------- */
/*  Top-level section                                                     */
/* ---------------------------------------------------------------------- */

export default function PayoutVerificationSection({
  activeSection,
  isLocked,
  isDark,
  banks,
  store,
  bankForm,
  setBankForm,
  validationStep,
  isUpdating,
  showBVN,
  setShowBVN,
  is2FAEnabled,
  setActiveSection,
  openIdentityConfirmation,
  handleSaveBankDetails,
  lockedBank,
  lockedAccountNumber,
  lockedVerifiedName,
  lockedBusinessName,
  lockedStoreUrl,
}) {
  if (activeSection !== "st") return null;

  if (isLocked) {
    return (
      <IdentityLockedPanel
        isDark={isDark}
        banks={banks}
        lockedBank={lockedBank}
        lockedAccountNumber={lockedAccountNumber}
        lockedVerifiedName={lockedVerifiedName}
        lockedBusinessName={lockedBusinessName}
        lockedStoreUrl={lockedStoreUrl}
      />
    );
  }

  return (
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

      {is2FAEnabled ? (
        <TwoFactorGate isDark={isDark} setActiveSection={setActiveSection} />
      ) : (
        <>
          {validationStep === 1 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: isDark ? "rgba(10, 100, 255, 0.1)" : "info.softBg",
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
                records tied to your <strong>BVN</strong>.
              </Typography>
            </Box>
          )}

          <Divider
            sx={{ borderColor: isDark ? "neutral.800" : "neutral.200" }}
          />

          <BankDetailsStep
            isDark={isDark}
            banks={banks}
            bankForm={bankForm}
            setBankForm={setBankForm}
            validationStep={validationStep}
            isUpdating={isUpdating}
            showBVN={showBVN}
            setShowBVN={setShowBVN}
            store={store}
            openIdentityConfirmation={openIdentityConfirmation}
          />

          {validationStep === 2 && (
            <BusinessInfoStep
              isDark={isDark}
              store={store}
              bankForm={bankForm}
              setBankForm={setBankForm}
              isUpdating={isUpdating}
              handleSaveBankDetails={handleSaveBankDetails}
            />
          )}
        </>
      )}
    </Stack>
  );
}
