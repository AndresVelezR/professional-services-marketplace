import { RiSearchLine } from "@remixicon/react"

import type { Contrato } from "../models"

type EstadoFiltro = "todos" | Contrato["estado"]

interface ContractFiltersProps {
  search: string
  estado: EstadoFiltro
  onSearchChange: (v: string) => void
  onEstadoChange: (v: EstadoFiltro) => void
}

const ESTADOS: { value: EstadoFiltro; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activo" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
]

export function ContractFilters({
  search,
  estado,
  onSearchChange,
  onEstadoChange,
}: ContractFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <RiSearchLine className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por servicio o persona..."
          className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex gap-2">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => onEstadoChange(e.value)}
            className={`h-10 rounded-lg border px-4 text-sm transition-colors ${
              estado === e.value
                ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                : "border-border bg-white text-foreground hover:bg-muted"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  )
}
