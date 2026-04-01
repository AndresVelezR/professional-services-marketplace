"use client"

import { useState } from "react"
import { RiMessage3Line } from "@remixicon/react"

import { ConversacionList } from "./components/ConversacionList"
import { ChatWindow } from "./components/ChatWindow"
import { useConversaciones } from "./hooks/useConversaciones"
import type { Conversacion } from "./models"

export function Chat() {
  const { conversaciones, isLoading } = useConversaciones()
  const [active, setActive] = useState<Conversacion | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-white">
      {/* Panel izquierdo */}
      <div className="w-80 shrink-0">
        <ConversacionList
          conversaciones={conversaciones}
          isLoading={isLoading}
          activeId={active?.id ?? null}
          onSelect={setActive}
        />
      </div>

      {/* Panel derecho */}
      <div className="flex flex-1 flex-col">
        {active ? (
          <ChatWindow conversacion={active} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <RiMessage3Line className="size-10 opacity-30" />
            <p className="text-sm">Selecciona una conversación</p>
          </div>
        )}
      </div>
    </div>
  )
}
