"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { getConversacion } from "../services/chatService"
import type { Mensaje } from "../models"

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") ?? "ws://localhost:8000"

export function useChat(conversacionId: string | null) {
  const { token } = useAuth()
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [connected, setConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  const cargarHistorial = useCallback(async () => {
    if (!conversacionId || !token) return
    setIsLoading(true)
    try {
      const data = await getConversacion(conversacionId, token)
      setMensajes(data.mensajes)
    } catch {
      // silencioso, el WS seguirá funcionando
    } finally {
      setIsLoading(false)
    }
  }, [conversacionId, token])

  useEffect(() => {
    if (!conversacionId || !token) return

    // Limpiar conexión anterior
    wsRef.current?.close()
    setConnected(false)
    setMensajes([])

    cargarHistorial()

    const ws = new WebSocket(`${WS_URL}/ws/chat/${conversacionId}/?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    ws.onmessage = (event) => {
      try {
        const mensaje: Mensaje = JSON.parse(event.data)
        setMensajes((prev) => [...prev, mensaje])
      } catch {
        // ignorar mensajes mal formados
      }
    }

    return () => {
      ws.close()
    }
  }, [conversacionId, token, cargarHistorial])

  const sendMessage = useCallback((contenido: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ contenido }))
    }
  }, [])

  return { mensajes, connected, isLoading, sendMessage }
}
