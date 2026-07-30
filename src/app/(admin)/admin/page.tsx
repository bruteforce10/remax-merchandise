import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Masuk · REMAX Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage(): ReactNode {
  return <AdminLogin />;
}
