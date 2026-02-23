"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Supabase fetch error:", error);
      else setNews(data);

      setLoading(false);
    };

    fetchNews();
  }, []);

  return { news, loading };
}