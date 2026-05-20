"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import type { Propuesta } from "../models";
import { getMisPropuestasEnviadas } from "../services/contractService";

export function usePropuestasEnviadas() {
  const { token } = useAuth();
  const authFetch = useAuthFetch();
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropuestas = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMisPropuestasEnviadas(authFetch);
      setPropuestas(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar propuestas",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch]);

  useEffect(() => {
    fetchPropuestas();
  }, [fetchPropuestas]);

  return { propuestas, isLoading, error };
}
