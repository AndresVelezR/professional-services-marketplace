import { RiLoader4Line } from "@remixicon/react"

import type { Conversacion } from "../models"
import { ConversacionItem } from "./ConversacionItem"

interface ConversacionListProps {
  conversaciones: Conversacion[]
  isLoading: boolean
  activeId: string | null
  onSelect: (c: Conversacion) => void
}

export function ConversacionList({
  conversaciones,
  isLoading,
  activeId,
  onSelect,
}: ConversacionListProps) {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-bold text-foreground">Mensajes</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex justify-center py-8">
            <RiLoader4Line className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && conversaciones.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes conversaciones aún. Se crean al abrir un contrato activo.
          </p>
        )}

        {conversaciones.map((c) => (
          <ConversacionItem
            key={c.id}
            conversacion={c}
            isActive={c.id === activeId}
            onClick={() => onSelect(c)}
          />
        ))}
      </div>
    </div>
  )
}
