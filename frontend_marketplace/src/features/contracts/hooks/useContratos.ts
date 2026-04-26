"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch"
import { getMisContratos } from "../services/contractService"
import type { Contrato } from "../models"

export function useContratos() {
  const { token } = useAuth()
  const authFetch = useAuthFetch()
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContratos = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMisContratos(authFetch)
      setContratos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar contratos")
    } finally {
      setIsLoading(false)
    }
  }, [token, authFetch])

  useEffect(() => {
    fetchContratos()
  }, [fetchContratos])

  return { contratos, isLoading, error, refetch: fetchContratos }
}
