"use client";

import { useEffect, useState } from "react";

import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import type { PerfilPublico } from "../models";
import { getPerfilPublico } from "../services/publicProfileService";

export function usePerfilPublico(userId: string) {
  const authFetch = useAuthFetch();
  const [data, setData] = useState<PerfilPublico | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getPerfilPublico(authFetch, userId)
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
  }, [userId, authFetch]);

  return { data, isLoading, error };
}
