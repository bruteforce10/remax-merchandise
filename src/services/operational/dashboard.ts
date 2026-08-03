import { DASHBOARD_VIEWS_CHART } from "@/lib/data/admin";
import { CATEGORIES } from "@/lib/data/catalog";
import { getAdminProducts } from "@/services/operational/products";
import type { AdminProduct, DashboardStats } from "@/types/admin";

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getAdminProducts();
  const published = products.filter((p) => p.status === "published").length;
  return {
    totalProducts: products.length,
    totalCategories: CATEGORIES.length,
    published,
    draft: products.length - published,
    totalLeads: 248,
    waClicksToday: 42,
    searches: 1284,
    viewsToday: 1640,
  };
}

export async function getRecentProducts(limit = 4): Promise<AdminProduct[]> {
  const products = await getAdminProducts();
  return products.slice(0, limit);
}

export async function getPopularProducts(limit = 5): Promise<AdminProduct[]> {
  const products = await getAdminProducts();
  return [...products].sort((a, b) => b.views - a.views).slice(0, limit);
}

export async function getViewsChart(): Promise<number[]> {
  return DASHBOARD_VIEWS_CHART;
}
