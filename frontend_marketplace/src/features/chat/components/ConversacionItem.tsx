"use client";

import { useAuth } from "@/infrastructure/auth/AuthContext";
import type { Conversacion } from "../models";

interface ConversacionItemProps {
  conversacion: Conversacion;
  isActive: boolean;
  onClick: () => void;
}

export function ConversacionItem({
  conversacion,
  isActive,
  onClick,
}: ConversacionItemProps) {
  const { perfil } = useAuth();
  const isCliente = perfil?.email === conversacion.cliente.nombre_completo;
  const otherParty = isCliente ? conversacion.freelancer : conversacion.cliente;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg p-4 text-left transition-colors ${
        isActive ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-muted/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {otherParty.iniciales}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {otherParty.nombre_completo}
            </p>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {conversacion.publicacion_titulo}
          </p>
          {conversacion.ultimo_mensaje && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {conversacion.ultimo_mensaje.contenido}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
