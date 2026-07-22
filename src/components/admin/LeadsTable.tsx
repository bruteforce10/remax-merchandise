"use client";

import {
  Download,
  Eye,
  MessageCircle,
  Monitor,
  Package,
  Smartphone,
  Tablet,
  X,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Modal } from "@/components/admin/Modal";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import type { DeviceType, Lead, LeadStatus } from "@/types/lead";

const DEVICE_ICON: Record<DeviceType, LucideIcon> = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
};

const STATUS_FILTERS: { value: "all" | LeadStatus; label: string; dot: string }[] = [
  { value: "all", label: "Semua", dot: "bg-gray-400" },
  { value: "new", label: "Baru", dot: "bg-brand" },
  { value: "contacted", label: "Dihubungi", dot: "bg-warning" },
  { value: "completed", label: "Selesai", dot: "bg-success" },
];

const TH = "px-4 py-3.5 text-left text-[12px] font-bold tracking-[0.04em] text-gray-400 uppercase";

export function LeadsTable({ leads }: { leads: Lead[] }): React.JSX.Element {
  const [statusFilter, setStatusFilter] = React.useState<"all" | LeadStatus>("all");
  const [detail, setDetail] = React.useState<Lead | null>(null);

  const filtered =
    statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

  function exportCsv(): void {
    const header = ["Tanggal", "Produk", "Qty", "Sesi", "Negara", "Perangkat", "Status"];
    const rows = filtered.map((l) =>
      [l.date, l.product, `${l.qty} pcs`, l.session, l.country, l.device, l.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-remax.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} leads diekspor ke CSV`);
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Leads Penawaran</h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">
            Klik WhatsApp &amp; permintaan quotation
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex h-11 items-center gap-2 rounded-btn border border-admin-border bg-white px-[18px] text-[14.5px] font-semibold hover:bg-gray-50"
        >
          <Download className="h-[18px] w-[18px] text-gray-500" />
          Export CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "inline-flex h-[38px] items-center gap-2 rounded-[10px] border px-3.5 text-[13px] font-semibold",
                active
                  ? "border-brand bg-brand-subtle text-brand"
                  : "border-admin-border bg-white text-gray-600 hover:bg-gray-50",
              )}
            >
              <span className={cn("h-[7px] w-[7px] rounded-full", f.dot)} />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-card border border-admin-border bg-white">
        <div className="rmx-scrollbar overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFBFC]">
                <th className={TH}>Tanggal</th>
                <th className={TH}>Produk</th>
                <th className={TH}>Qty</th>
                <th className={TH}>Klik WA</th>
                <th className={TH}>Sesi</th>
                <th className={TH}>Negara</th>
                <th className={TH}>Perangkat</th>
                <th className={TH}>Status</th>
                <th className={cn(TH, "text-right")}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const DeviceIcon = DEVICE_ICON[l.device];
                return (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3.5 text-[13px] whitespace-nowrap text-gray-600">{l.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400">
                          <Package className="h-[17px] w-[17px]" />
                        </span>
                        <span className="text-[13.5px] font-semibold text-ink">{l.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[13.5px]">{l.qty} pcs</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-success">
                        <MessageCircle className="h-[15px] w-[15px]" />
                        Diklik
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[12.5px] text-gray-400">{l.session}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-600">{l.country}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">
                        <DeviceIcon className="h-[15px] w-[15px] text-gray-400" />
                        {l.device}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setDetail(l)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-admin-border bg-white px-3 text-[12.5px] font-semibold hover:bg-gray-50 hover:text-brand"
                      >
                        <Eye className="h-[14px] w-[14px]" />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} ariaLabel="Detail lead">
        {detail && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-ink">Detail Lead</h3>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setDetail(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-admin-border bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-0">
              <DetailRow label="Produk" value={detail.product} />
              <DetailRow label="Quantity" value={`${detail.qty} pcs`} />
              <DetailRow label="Tanggal" value={detail.date} />
              <DetailRow label="Sesi" value={detail.session} mono />
              <DetailRow label="Negara" value={detail.country} />
              <DetailRow label="Perangkat" value={detail.device} />
              <div className="flex items-center justify-between py-3">
                <span className="text-[13.5px] text-gray-500">Status</span>
                <StatusBadge status={detail.status} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-[13.5px] text-gray-500">{label}</span>
      <span className={cn("text-[13.5px] font-semibold text-ink", mono && "font-mono")}>
        {value}
      </span>
    </div>
  );
}
