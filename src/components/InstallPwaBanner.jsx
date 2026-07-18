import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    const ios = /iPad|iPhone|iPod/.test(window.navigator.userAgent);

    setIsStandalone(standalone);
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstall(false);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (ios && !standalone) {
      setShowInstall(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isStandalone || !showInstall) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
      return;
    }

    if (isIOS) {
      window.alert(
        "On iPhone or iPad, open this page in Safari, tap Share, and then choose Add to Home Screen."
      );
      return;
    }

    window.alert(
      "Install is supported in Chrome or Edge. Open this site in one of those browsers and refresh to try again."
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1400,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <Button
        variant="contained"
        onClick={handleInstall}
        sx={{
          backgroundColor: "#0f172a",
          color: "#fff",
          borderRadius: 999,
          px: 2,
          py: 1,
          textTransform: "none",
          boxShadow: 3,
          "&:hover": { backgroundColor: "#111827" },
        }}
      >
        {isIOS ? "Add to Home Screen" : "Install LayeMart"}
      </Button>
      {isIOS && (
        <Typography
          sx={{
            maxWidth: 260,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            fontSize: 12,
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            color: "#fff",
          }}
        >
          Open Safari, tap Share, then Add to Home Screen.
        </Typography>
      )}
    </Box>
  );
}
