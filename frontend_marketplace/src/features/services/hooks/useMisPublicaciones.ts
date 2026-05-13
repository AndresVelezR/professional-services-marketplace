"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import type { MisPublicacionesItem } from "../models";
import { getMisPublicaciones } from "../services/publicacionService";

export function useMisPublicaciones() {
  const authFetch = useAuthFetch();
  const [results, setResults] = useState<MisPublicacionesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    getMisPublicaciones(authFetch)
      .then((res) => setResults(res.results))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [authFetch]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { results, isLoading, error, reload };
}
