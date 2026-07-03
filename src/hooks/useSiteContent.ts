import { useEffect, useState } from "react";

export function useSiteContent<T>(key: string, fallback?: T) {
  const [data, setData] = useState<T | undefined>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/content?key=${key}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((row) => {
        if (row?.value !== undefined) setData(row.value as T);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [key]);

  return { data, loading };
}

export function usePublicData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/${endpoint}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setData(d as T[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading };
}
