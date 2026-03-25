"use client"

import { RiCheckLine, RiCloseLine, RiLoader4Line } from "@remixicon/react"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { usePropuestasRecibidas } from "@/features/contracts/hooks/usePropuestasRecibidas"

export function PropuestasRecibidas() {
  const { propuestas, isLoading, error, responder } = usePropuestasRecibidas()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleResponder(id: string, estado: "aceptada" | "rechazada") {
    setLoadingId(id)
    try {
      await responder(id, estado)
    } finally {
      setLoadingId(null)
    }
  }

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">Propuestas Recibidas</h2>
        <div className="flex justify-center py-8">
          <RiLoader4Line className="size-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (propuestas.length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Propuestas Recibidas
          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {propuestas.length}
          </span>
        </h2>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="space-y-3">
        {propuestas.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: info */}
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs text-muted-foreground">
                  Para: <span className="font-medium text-foreground">{p.publicacion_titulo}</span>
                </p>

                <div className="mb-3 flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                      {p.cliente.iniciales}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">
                    {p.cliente.nombre_completo}
                  </span>
                </div>

                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{p.mensaje}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Precio propuesto</span>
                    <p className="font-semibold text-foreground">${p.precio_propuesto}</p>
                  </div>
                  {p.fecha_limite && (
                    <div>
                      <span className="text-xs text-muted-foreground">Fecha límite</span>
                      <p className="font-medium text-foreground">
                        {new Date(p.fecha_limite).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex shrink-0 flex-col gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={loadingId === p.id}
                  onClick={() => handleResponder(p.id, "aceptada")}
                >
                  <RiCheckLine className="size-4" />
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={loadingId === p.id}
                  onClick={() => handleResponder(p.id, "rechazada")}
                >
                  <RiCloseLine className="size-4" />
                  Rechazar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
