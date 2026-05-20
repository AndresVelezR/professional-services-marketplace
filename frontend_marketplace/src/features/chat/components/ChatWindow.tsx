"use client";

import { RiSendPlaneLine, RiWifiLine, RiWifiOffLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useChat } from "../hooks/useChat";
import type { Conversacion } from "../models";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  conversacion: Conversacion;
}

export function ChatWindow({ conversacion }: ChatWindowProps) {
  const t = useTranslations("chat");
  const { perfil } = useAuth();
  const { mensajes, connected, isLoading, sendMessage } = useChat(
    conversacion.id,
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCount = mensajes.length;

  useEffect(() => {
    if (messageCount >= 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageCount]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !connected) return;
    sendMessage(text);
    setInput("");
  }

  const otherParty =
    perfil?.email === conversacion.cliente.nombre_completo
      ? conversacion.freelancer
      : conversacion.cliente;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="font-semibold text-foreground">
            {conversacion.publicacion_titulo}
          </p>
          <p className="text-xs text-muted-foreground">
            {otherParty.nombre_completo}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          {connected ? (
            <>
              <RiWifiLine className="size-4 text-green-500" />
              <span className="text-green-600">{t("connected")}</span>
            </>
          ) : (
            <>
              <RiWifiOffLine className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("disconnected")}</span>
            </>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {isLoading && (
          <p className="text-center text-xs text-muted-foreground">
            {t("loading")}
          </p>
        )}
        {!isLoading && mensajes.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {t("emptyMessages")}
          </p>
        )}
        {mensajes.map((m) => (
          <MessageBubble
            key={m.id}
            mensaje={m}
            isOwn={m.emisor.nombre_completo === perfil?.nombre_completo}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-border px-5 py-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            connected ? t("inputPlaceholder") : t("waitingConnection")
          }
          disabled={!connected}
          className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-muted disabled:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground"
        >
          <RiSendPlaneLine className="size-4" />
        </button>
      </form>
    </div>
  );
}
