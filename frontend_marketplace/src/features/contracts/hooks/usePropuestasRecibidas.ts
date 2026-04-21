"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { getMisPropuestasRecibidas, responderPropuesta } from "../services/contractService"
import type { Propuesta } from "../models"

export function usePropuestasRecibidas() {
  const { token } = useAuth()
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPropuestas = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMisPropuestasRecibidas(token)
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

  const responder = useCallback(
    async (id: string, estado: "aceptada" | "rechazada") => {
      if (!token) return
      await responderPropuesta(id, estado, token)
      await fetchPropuestas()
    },
    [token, fetchPropuestas],
  )

  return { propuestas, isLoading, error, responder }
}
