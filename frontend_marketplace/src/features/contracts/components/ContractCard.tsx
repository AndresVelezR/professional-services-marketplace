"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import type { Contrato } from "../models"

interface ContractCardProps {
  contract: Contrato
}

const ESTADO_STYLES: Record<Contrato["estado"], string> = {
  activo: "bg-blue-100 text-blue-700",
  completado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
}

export function ContractCard({ contract }: ContractCardProps) {
  const t = useTranslations("contracts")
  const { perfil } = useAuth()

  const isCliente = perfil?.email === contract.cliente.email
  const otherParty = isCliente ? contract.freelancer : contract.cliente
  const otherLabel = isCliente ? t("card.freelancer") : t("card.cliente")

  return (
    <div className="rounded-xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
      {/* Top row: status + price */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${ESTADO_STYLES[contract.estado]}`}
        >
          {t(`estado.${contract.estado}`)}
        </span>
        <span className="text-sm font-semibold text-foreground">
          ${contract.precio}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold text-foreground">
        {contract.publicacion_titulo}
      </h3>

      {/* Dates */}
      <p className="mb-4 text-xs text-muted-foreground">
        {t("card.inicio")}: {new Date(contract.fecha_inicio).toLocaleDateString("es-CO")}
        {contract.fecha_fin &&
          ` · ${t("card.fin")}: ${new Date(contract.fecha_fin).toLocaleDateString("es-CO")}`}
      </p>

      {/* Bottom row: other party + button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {otherParty.iniciales}
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">{otherLabel}</p>
            <p className="text-sm font-medium text-foreground">
              {otherParty.nombre_completo}
            </p>
          </div>
        </div>

        <Link
          href={`/contracts/${contract.id}`}
          className="rounded-lg border border-border bg-action px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t("card.viewDetails")}
        </Link>
      </div>
    </div>
  )
}
