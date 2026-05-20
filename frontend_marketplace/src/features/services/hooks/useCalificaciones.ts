"use client";

import { useEffect, useState } from "react";
import type { CalificacionesResponse } from "../models";
import { getCalificacionesUsuario } from "../services/publicacionService";

export function useCalificaciones(usuarioId: string | undefined) {
  const [data, setData] = useState<CalificacionesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getCalificacionesUsuario(usuarioId)
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
  }, [usuarioId]);

  return { data, isLoading, error };
}
