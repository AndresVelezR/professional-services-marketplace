"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import type { PublicacionDetail } from "../models";
import { getPublicacion } from "../services/publicacionService";

export function usePublicacion(id: string) {
  const { token } = useAuth();
  const authFetch = useAuthFetch();
  const [data, setData] = useState<PublicacionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetcher = token ? authFetch : fetch;

    getPublicacion(id, fetcher)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token, authFetch]);

  return { data, isLoading, error };
}
