import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import * as React from "react";

import type { Order } from "@/types/order";

/**
 * "FORMULIR PEMESANAN MERCHANDISE" — mirrors public/order-form-merchandise.pdf.
 * Rendered server-side (via renderToBuffer in the admin download route). Exported
 * as a plain factory returning the <Document> element so the .ts route can call
 * it without JSX.
 */

interface OrderFormPdfProps {
  order: Order;
  /** REMAX logo as a data URI (data:image/png;base64,...). */
  logoSrc?: string;
}

const BRAND = "#E11D2E";
const BORDER = "#333333";
const MIN_ROWS = 5;

const COLS = { no: "8%", name: "40%", qty: "10%", note: "27%", size: "15%" };

const TERMS: (string | string[])[] = [
  "DATA YANG TERCANTUM DIANGGAP FINAL & AKURAT.",
  [
    "Merchandise akan diproduksi setelah informasi lengkap & pembayaran telah diterima. Pembayaran harap ditransfer ke rekening:",
    "Nama : PT Solusi Properti Indonesia",
    "Bank : BCA KCU Gajah Mada",
    "No. Rek : 012.302.9922",
    "Dan bukti transfer dikirimkan ke support@remax.co.id. Pemesanan akan diproses setelah pembayaran diterima.",
  ],
  "Proses akan memakan waktu paling lama 7 hari kerja.",
  "Biaya pengiriman mengikuti pilihan kurir dan tercantum pada ringkasan pesanan.",
  "Harga Produksi dapat berubah sewaktu-waktu mengikuti perubahan harga vendor.",
  "Kirim Order Form dalam bentuk .PDF ke email support@remax.co.id",
];

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 34,
    paddingVertical: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: { width: 140 },
  logoFallback: { fontSize: 22, fontWeight: "bold", color: BRAND },
  refBox: { alignItems: "flex-end" },
  refLabel: { fontSize: 8, color: "#555555", marginBottom: 3 },
  refValue: {
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    minWidth: 120,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textDecoration: "underline",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 10,
  },
  table: { borderTopWidth: 1, borderLeftWidth: 1, borderColor: BORDER },
  row: { flexDirection: "row" },
  headRow: { backgroundColor: "#ECECEC" },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  headCell: { fontFamily: "Helvetica-Bold", textAlign: "center", fontSize: 9 },
  bodyRow: { minHeight: 22 },
  center: { textAlign: "center" },
  noteWrap: { marginTop: 12 },
  noteLabel: { fontFamily: "Helvetica-Bold", marginBottom: 4 },
  shipBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 6,
    marginTop: 8,
    fontSize: 8.5,
    lineHeight: 1.25,
  },
  shipTitle: { fontFamily: "Helvetica-Bold", marginBottom: 3 },
  totalBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 6,
    marginTop: 8,
    width: "46%",
    marginLeft: "auto",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  totalLabel: { color: "#555555" },
  totalValue: { fontFamily: "Helvetica-Bold" },
  grandTotal: { fontFamily: "Helvetica-Bold", color: BRAND, fontSize: 10 },
  noteBox: {
    borderWidth: 1,
    borderColor: BORDER,
    minHeight: 34,
    padding: 5,
    fontSize: 9,
  },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  termsCol: { width: "66%" },
  termsTitle: { fontFamily: "Helvetica-Bold", marginBottom: 4 },
  termRow: { flexDirection: "row", marginBottom: 2 },
  termNo: { width: 14 },
  termText: { flex: 1 },
  termSub: { marginLeft: 8, marginBottom: 1 },
  signCol: { width: "30%", alignItems: "center", justifyContent: "flex-end" },
  signLabel: { fontFamily: "Helvetica-Bold", marginBottom: 42 },
  signLine: { borderTopWidth: 1, borderColor: BORDER, width: "100%", paddingTop: 3 },
});

function splitOptions(options: Record<string, string>): {
  size: string;
  note: string;
} {
  let size = "";
  const rest: string[] = [];
  for (const [key, value] of Object.entries(options)) {
    if (/ukuran|size/i.test(key)) size = value;
    else rest.push(value);
  }
  return { size, note: rest.join(", ") };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function rupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function destinationLine(order: Order): string {
  const d = order.destination;
  return [d.addressDetail, d.villageName, d.districtName, d.regencyName, d.provinceName]
    .filter(Boolean)
    .join(", ");
}

export function OrderFormPdf({
  order,
  logoSrc,
}: OrderFormPdfProps): React.JSX.Element {
  const rowCount = Math.max(order.items.length, MIN_ROWS);
  const rows = Array.from({ length: rowCount }, (_, i) => order.items[i]);

  return (
    <Document title={`Formulir Pemesanan ${order.ref}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoSrc ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
            <Image src={logoSrc} style={styles.logo} />
          ) : (
            <Text style={styles.logoFallback}>RE/MAX</Text>
          )}
          <View style={styles.refBox}>
            <Text style={styles.refLabel}>No. Pemesanan</Text>
            <Text style={styles.refValue}>{order.ref}</Text>
          </View>
        </View>

        <Text style={styles.title}>FORMULIR PEMESANAN MERCHANDISE</Text>

        <View style={styles.infoRow}>
          <Text>RE/MAX OFFICE : {order.customerEmail || "-"}</Text>
          <Text>Tanggal Pemesanan : {formatDate(order.createdAt)}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headRow]}>
            <View style={[styles.cell, { width: COLS.no }]}>
              <Text style={styles.headCell}>NO</Text>
            </View>
            <View style={[styles.cell, { width: COLS.name }]}>
              <Text style={styles.headCell}>NAMA BARANG</Text>
            </View>
            <View style={[styles.cell, { width: COLS.qty }]}>
              <Text style={styles.headCell}>QTY</Text>
            </View>
            <View style={[styles.cell, { width: COLS.note }]}>
              <Text style={styles.headCell}>KETERANGAN</Text>
            </View>
            <View style={[styles.cell, { width: COLS.size }]}>
              <Text style={styles.headCell}>SIZE</Text>
            </View>
          </View>

          {rows.map((item, i) => {
            const opt = item ? splitOptions(item.options) : { size: "", note: "" };
            return (
              <View key={i} style={[styles.row, styles.bodyRow]}>
                <View style={[styles.cell, { width: COLS.no }]}>
                  <Text style={styles.center}>{i + 1}</Text>
                </View>
                <View style={[styles.cell, { width: COLS.name }]}>
                  <Text>{item?.name ?? ""}</Text>
                </View>
                <View style={[styles.cell, { width: COLS.qty }]}>
                  <Text style={styles.center}>{item ? item.qty : ""}</Text>
                </View>
                <View style={[styles.cell, { width: COLS.note }]}>
                  <Text>{opt.note}</Text>
                </View>
                <View style={[styles.cell, { width: COLS.size }]}>
                  <Text style={styles.center}>{opt.size}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.shipBox}>
          <Text style={styles.shipTitle}>DATA PENGIRIMAN</Text>
          <Text>Penerima : {order.destination.recipientName || "-"}</Text>
          <Text>No. HP : {order.destination.recipientPhone || "-"}</Text>
          <Text>Alamat : {destinationLine(order) || "-"}</Text>
          <Text>Kurir : {order.courierService || order.courierCode || "-"}</Text>
        </View>

        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{rupiah(order.estimatedTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Ongkir</Text>
            <Text style={styles.totalValue}>{rupiah(order.shippingCost)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.grandTotal}>{rupiah(order.grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.noteWrap}>
          <Text style={styles.noteLabel}>Note:</Text>
          <View style={styles.noteBox} />
        </View>

        <View style={styles.footer}>
          <View style={styles.termsCol}>
            <Text style={styles.termsTitle}>KETERANGAN :</Text>
            {TERMS.map((term, i) => (
              <View key={i} style={styles.termRow}>
                <Text style={styles.termNo}>{i + 1}.</Text>
                {Array.isArray(term) ? (
                  <View style={styles.termText}>
                    {term.map((line, j) => (
                      <Text key={j} style={j === 0 ? undefined : styles.termSub}>
                        {line}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.termText}>{term}</Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.signCol}>
            <Text style={styles.signLabel}>Pesanan diterima oleh</Text>
            <Text style={styles.signLine}> </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
