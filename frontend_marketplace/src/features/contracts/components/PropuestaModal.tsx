"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/infrastructure/auth/AuthContext"
import { createPropuesta } from "../services/contractService"

interface PropuestaModalProps {
  open: boolean
  onClose: () => void
  publicacionId: string
  precioBase: number
}

export function PropuestaModal({
  open,
  onClose,
  publicacionId,
  precioBase,
}: PropuestaModalProps) {
  const { token } = useAuth()
  const [mensaje, setMensaje] = useState("")
  const [precio, setPrecio] = useState(String(precioBase))
  const [fechaLimite, setFechaLimite] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      await createPropuesta(
        publicacionId,
        {
          mensaje,
          precio_propuesto: Number(precio),
          ...(fechaLimite ? { fecha_limite: fechaLimite } : {}),
        },
        token,
      )
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar propuesta")
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setMensaje("")
    setPrecio(String(precioBase))
    setFechaLimite("")
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar propuesta</DialogTitle>
          <DialogDescription>
            El freelancer revisará tu propuesta y la aceptará o rechazará.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">
              ¡Propuesta enviada con éxito! El freelancer te responderá pronto.
            </p>
            <Button className="w-full" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Mensaje <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Describe tu proyecto y qué necesitas..."
                rows={4}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Precio propuesto (USD) <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Fecha límite (opcional)
              </label>
              <input
                type="date"
                value={fechaLimite}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar propuesta"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
