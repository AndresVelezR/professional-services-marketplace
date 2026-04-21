"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import type { Mensaje } from "../models"

const MAX_CHARS = 300

interface MessageBubbleProps {
  mensaje: Mensaje
  isOwn: boolean
}

export function MessageBubble({ mensaje, isOwn }: MessageBubbleProps) {
  const t = useTranslations("chat")
  const [expanded, setExpanded] = useState(false)

  const time = new Date(mensaje.created_at).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const isLong = mensaje.contenido.length > MAX_CHARS
  const displayText =
    isLong && !expanded
      ? mensaje.contenido.slice(0, MAX_CHARS) + "..."
      : mensaje.contenido

  const linkClass = isOwn
    ? "text-blue-200 hover:text-white"
    : "text-blue-600 hover:text-blue-800"

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isOwn && (
          <span className="text-[11px] font-medium text-muted-foreground">
            {mensaje.emisor.nombre_completo}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 text-sm ${
            isOwn
              ? "rounded-tr-sm bg-blue-600 text-white"
              : "rounded-tl-sm bg-muted text-foreground"
          }`}
        >
          {displayText}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={`ml-1 text-xs font-medium underline-offset-2 hover:underline ${linkClass}`}
            >
              {expanded ? t("seeLess") : t("seeMore")}
            </button>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
    </div>
  )
}
