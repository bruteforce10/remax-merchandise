import { ADMIN_PRODUCTS, DASHBOARD_VIEWS_CHART, LEADS } from "@/lib/data/admin";
import { CATEGORIES } from "@/lib/data/catalog";
import type { AdminProduct, DashboardStats } from "@/types/admin";
import type { Lead } from "@/types/lead";

export async function getDashboardStats(): Promise<DashboardStats> {
  const published = ADMIN_PRODUCTS.filter((p) => p.status === "published").length;
  return {
    totalProducts: ADMIN_PRODUCTS.length,
    totalCategories: CATEGORIES.length,
    published,
    draft: ADMIN_PRODUCTS.length - published,
    totalLeads: 248,
    waClicksToday: 42,
    searches: 1284,
    viewsToday: 1640,
  };
}

export async function getRecentProducts(limit = 4): Promise<AdminProduct[]> {
  return ADMIN_PRODUCTS.slice(0, limit);
}

export async function getPopularProducts(limit = 5): Promise<AdminProduct[]> {
  return [...ADMIN_PRODUCTS].sort((a, b) => b.views - a.views).slice(0, limit);
}

export async function getRecentLeads(limit = 4): Promise<Lead[]> {
  return LEADS.slice(0, limit);
}

export async function getViewsChart(): Promise<number[]> {
  return DASHBOARD_VIEWS_CHART;
}
