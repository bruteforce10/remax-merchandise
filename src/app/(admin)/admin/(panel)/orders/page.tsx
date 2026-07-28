import type { ReactNode } from "react";

import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/services/operational/orders";

export default async function AdminOrdersPage(): Promise<ReactNode> {
  const orders = await getOrders();
  return <OrdersTable orders={orders} />;
}
