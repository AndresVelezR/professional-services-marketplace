"use client"

import { useCallback, useEffect, useState } from "react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch"
import { getMisConversaciones } from "../services/chatService"
import type { Conversacion } from "../models"

export function useConversaciones() {
  const { token } = useAuth()
  const authFetch = useAuthFetch()
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMisConversaciones(authFetch)
      setConversaciones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar conversaciones")
    } finally {
      setIsLoading(false)
    }
  }, [token, authFetch])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { conversaciones, isLoading, error }
}
