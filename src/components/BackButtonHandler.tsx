"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useRouter, usePathname } from "next/navigation";

/**
 * BackButtonHandler
 * * Manages native hardware back button behavior for Android/Capacitor devices.
 * - Exits the application if the user is on the root path ('/').
 * - Navigates backward in the history stack for all other routes.
 */
export default function BackButtonHandler(): null {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isSubscribed = true;

    const initializeBackButtonListener = async () => {
      const listener = await App.addListener("backButton", (event) => {
        if (!isSubscribed) return;

        if (pathname === "/") {
          App.exitApp();
        } else {
          router.back();
        }
      });

      // Return the listener for specific cleanup if needed
      return listener;
    };

    const listenerPromise = initializeBackButtonListener();

    return () => {
      isSubscribed = false;
      // Clean up the specific listener rather than removing all app-wide listeners
      listenerPromise.then((handle) => handle.remove());
    };
  }, [pathname, router]);

  return null;
}