"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { getMisPropuestasEnviadas } from "../services/contractService"
import type { Propuesta } from "../models"

export function usePropuestasEnviadas() {
  const { token } = useAuth()
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPropuestas = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMisPropuestasEnviadas(token)
      setPropuestas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar propuestas")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchPropuestas()
  }, [fetchPropuestas])

  return { propuestas, isLoading, error }
}
