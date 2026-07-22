import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Pengaturan" };

export default function AdminSettingsPage(): ReactNode {
  return <SettingsForm />;
}
