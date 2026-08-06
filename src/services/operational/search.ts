import { supabaseAdmin } from "@/lib/supabase/admin";

export interface KeywordCount {
  keyword: string;
  count: number;
  weekCount: number;
  lastSearched: string | null;
}

interface KeywordRow {
  keyword: string;
  count: number | string;
  week_count: number | string;
  last_searched: string | null;
}

/** Most-searched keywords from `search_logs`, most popular first. */
export async function getPopularKeywords(limit = 10): Promise<KeywordCount[]> {
  try {
    const { data, error } = await supabaseAdmin().rpc("popular_keywords", {
      p_limit: limit,
    });
    if (error) throw error;
    const rows = (data ?? []) as KeywordRow[];
    return rows.map((r) => ({
      keyword: r.keyword,
      count: Number(r.count),
      weekCount: Number(r.week_count ?? 0),
      lastSearched: r.last_searched ?? null,
    }));
  } catch (error) {
    console.error("getPopularKeywords failed:", error);
    return [];
  }
}

/** Total number of searches recorded in `search_logs`. */
export async function getTotalSearches(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin()
      .from("search_logs")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch (error) {
    console.error("getTotalSearches failed:", error);
    return 0;
  }
}
