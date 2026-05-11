"use client"

import { useEffect, useState } from "react"
import { RiLoader4Line, RiMessage3Line } from "@remixicon/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/infrastructure/auth/AuthContext"
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch"
import { obtenerOCrearConversacion } from "@/features/chat/services/chatService"
import { getContrato, updateContratoEstado } from "./services/contractService"
import type { Contrato } from "./models"

const ESTADO_STYLES: Record<Contrato["estado"], string> = {
  activo: "bg-blue-100 text-blue-700",
  completado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

const ESTADO_LABEL: Record<Contrato["estado"], string> = {
  activo: "Activo",
  completado: "Completado",
  cancelado: "Cancelado",
}

interface ContractDetailProps {
  id: string
}

export function ContractDetail({ id }: ContractDetailProps) {
  const { token, perfil } = useAuth()
  const authFetch = useAuthFetch()
  const router = useRouter()
  const [contrato, setContrato] = useState<Contrato | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  async function handleAbrirChat() {
    if (!token) return
    await obtenerOCrearConversacion(id, authFetch)
    router.push("/messages")
  }

  useEffect(() => {
    if (!token) return
    setIsLoading(true)
    getContrato(id, authFetch)
      .then(setContrato)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar contrato"),
      )
      .finally(() => setIsLoading(false))
  }, [id, token])

  async function handleEstado(estado: "completado" | "cancelado") {
    if (!token) return
    setActionLoading(true)
    try {
      const updated = await updateContratoEstado(id, estado, authFetch)
      setContrato(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar contrato")
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !contrato) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">
          {error ?? "Contrato no encontrado"}
        </p>
        <Link href="/contracts">
          <Button variant="outline" size="sm">Volver a contratos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/contracts"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Volver
        </Link>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${ESTADO_STYLES[contrato.estado]}`}
        >
          {ESTADO_LABEL[contrato.estado]}
        </span>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Precio acordado</p>
          <p className="text-3xl font-bold text-foreground">${contrato.precio}</p>
        </div>

        {contrato.publicacion_titulo && (
          <div>
            <p className="text-xs text-muted-foreground">Servicio</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.publicacion_titulo}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.cliente.nombre_completo}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Freelancer</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.freelancer.nombre_completo}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha inicio</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(contrato.fecha_inicio).toLocaleDateString("es-CO")}
            </p>
          </div>
          {contrato.fecha_fin && (
            <div>
              <p className="text-xs text-muted-foreground">Fecha fin</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(contrato.fecha_fin).toLocaleDateString("es-CO")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      <Button variant="outline" className="w-full" onClick={handleAbrirChat}>
        <RiMessage3Line className="size-4" />
        Abrir chat
      </Button>

      {/* Actions */}
      {contrato.estado === "activo" && (
        <div className="flex gap-3">
          {perfil?.email === contrato.freelancer.email && (
            <Button
              className="flex-1"
              onClick={() => handleEstado("completado")}
              disabled={actionLoading}
            >
              Marcar como completado
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => handleEstado("cancelado")}
            disabled={actionLoading}
          >
            Cancelar contrato
          </Button>
        </div>
      )}
    </div>
  )
}
