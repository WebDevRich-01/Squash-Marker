import { useState, useEffect } from "react";

/**
 * Custom hook to manage PWA installation
 * Handles the beforeinstallprompt event and provides install functionality
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      // Check if running in PWA mode on iOS
      const isIOSInstalled = window.navigator.standalone === true;

      setIsInstalled(isStandalone || isIOSInstalled);
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("PWA was installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        setIsInstalled(true);
      } else {
        console.log("User dismissed the install prompt");
      }

      // Clear the deferredPrompt for next time
      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === "accepted";
    } catch (error) {
      console.error("Error during app installation:", error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
};
