"use client";

import { Download, Eye, Package } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LeadFunnelRow } from "@/types/lead";

const TH = "px-4 py-3.5 text-left text-[12px] font-bold tracking-[0.04em] text-gray-400 uppercase";
const TH_NUM = cn(TH, "text-right");
const TD_NUM = "px-4 py-3.5 text-right font-mono text-[13.5px] text-gray-700";

function pct(conversion: number): string {
  return `${(conversion * 100).toFixed(1)}%`;
}

export function LeadsTable({
  funnel,
}: {
  funnel: LeadFunnelRow[];
}): React.JSX.Element {
  function exportCsv(): void {
    const header = ["Produk", "Slug", "Klik Lihat", "Keranjang", "Checkout", "Konversi"];
    const rows = funnel.map((r) =>
      [r.name, r.slug, r.views, r.cartCount, r.checkoutCount, pct(r.conversion)]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "funnel-produk-remax.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${funnel.length} produk diekspor ke CSV`);
  }

  return (
    <div className="animate-[rmx-fade_.3s_ease]">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Leads &amp; Funnel Produk
          </h1>
          <p className="mt-0.5 text-[14.5px] text-gray-500">
            Klik lihat, keranjang &amp; checkout per produk
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={funnel.length === 0}
          className="inline-flex h-11 items-center gap-2 rounded-btn border border-admin-border bg-white px-[18px] text-[14.5px] font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-[18px] w-[18px] text-gray-500" />
          Export CSV
        </button>
      </div>

      {/* Funnel table */}
      <div className="overflow-hidden rounded-card border border-admin-border bg-white">
        {funnel.length === 0 ? (
          <EmptyFunnel />
        ) : (
          <div className="rmx-scrollbar overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[#FAFBFC]">
                  <th className={TH}>Produk</th>
                  <th className={TH_NUM}>Klik Lihat</th>
                  <th className={TH_NUM}>Keranjang</th>
                  <th className={TH_NUM}>Checkout</th>
                  <th className={TH_NUM}>Konversi</th>
                </tr>
              </thead>
              <tbody>
                {funnel.map((r) => (
                  <tr key={r.slug} className="border-b border-gray-50 hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-9 w-9 flex-none overflow-hidden rounded-btn bg-gray-100">
                          {r.imageUrl ? (
                            <Image
                              src={r.imageUrl}
                              alt={r.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f1f2f4] to-[#e6e7ea] text-gray-400">
                              <Package className="h-[17px] w-[17px]" />
                            </span>
                          )}
                        </div>
                        <span className="text-[13.5px] font-semibold text-ink">{r.name}</span>
                      </div>
                    </td>
                    <td className={TD_NUM}>{formatNumber(r.views)}</td>
                    <td className={TD_NUM}>{formatNumber(r.cartCount)}</td>
                    <td className={TD_NUM}>{formatNumber(r.checkoutCount)}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-[13px] font-semibold text-success">
                      {pct(r.conversion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyFunnel(): React.JSX.Element {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-gray-50 text-gray-300">
        <Eye className="h-7 w-7" />
      </div>
      <div className="mb-1 text-[16px] font-semibold text-ink">Belum ada data engagement</div>
      <p className="mx-auto max-w-[360px] text-[13.5px] text-gray-500">
        Data muncul saat pengunjung melihat produk, menambah ke keranjang, atau checkout.
      </p>
    </div>
  );
}
