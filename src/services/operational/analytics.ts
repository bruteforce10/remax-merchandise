import {
  ANALYTICS_COUNTRIES,
  ANALYTICS_DAILY,
  ANALYTICS_DEVICES,
  ANALYTICS_KEYWORDS,
  ANALYTICS_METRICS,
} from "@/lib/data/admin";
import { getAdminProducts } from "@/services/operational/products";
import type { Analytics } from "@/types/admin";

export async function getAnalytics(): Promise<Analytics> {
  const products = await getAdminProducts();
  const topProducts = [...products]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((p) => ({ name: p.name, views: p.views }));

  return {
    metrics: ANALYTICS_METRICS,
    daily: ANALYTICS_DAILY,
    devices: ANALYTICS_DEVICES,
    keywords: ANALYTICS_KEYWORDS,
    countries: ANALYTICS_COUNTRIES,
    topProducts,
  };
}
