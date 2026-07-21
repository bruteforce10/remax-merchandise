"use client";

import type { ReactElement } from "react";
import { Toaster as SonnerToaster } from "sonner";

/** App-wide toast host, styled to match the dark prototype toast. */
export function Toaster(): ReactElement {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={96}
      toastOptions={{
        style: {
          background: "#14161B",
          color: "#ffffff",
          border: "none",
          borderRadius: "14px",
          fontWeight: 600,
        },
      }}
    />
  );
}
