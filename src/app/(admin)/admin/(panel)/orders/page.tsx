import type { ReactNode } from "react";

import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/services/operational/orders";
import { getProductImagesBySlug } from "@/services/operational/products";

export default async function AdminOrdersPage(): Promise<ReactNode> {
  const [orders, images] = await Promise.all([
    getOrders(),
    getProductImagesBySlug(),
  ]);
  return <OrdersTable orders={orders} productImages={images} />;
}
