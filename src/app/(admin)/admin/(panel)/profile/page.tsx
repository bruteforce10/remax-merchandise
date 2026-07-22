import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProfilePanel } from "@/components/admin/ProfilePanel";

export const metadata: Metadata = { title: "Profil" };

export default function AdminProfilePage(): ReactNode {
  return <ProfilePanel />;
}
