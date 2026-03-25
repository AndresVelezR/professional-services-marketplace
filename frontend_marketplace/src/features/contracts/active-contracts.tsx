"use client"

import { useState } from "react"
import { RiLoader4Line } from "@remixicon/react"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { ContractHeader } from "./components/ContractHeader"
import { ContractFilters } from "./components/ContractFilters"
import { ContractList } from "./components/ContractList"
import { PropuestasEnviadas } from "./components/PropuestasEnviadas"
import { useContratos } from "./hooks/useContratos"
import type { Contrato } from "./models"

type Tab = "contratos" | "propuestas"
type EstadoFiltro = "todos" | Contrato["estado"]

export function ActiveContracts() {
  const { contratos, isLoading, error } = useContratos()
  const { perfil } = useAuth()
  const [tab, setTab] = useState<Tab>("contratos")
  const [search, setSearch] = useState("")
  const [estado, setEstado] = useState<EstadoFiltro>("todos")

  const filtered = contratos.filter((c) => {
    if (estado !== "todos" && c.estado !== estado) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const otherParty = perfil?.email === c.cliente.email ? c.freelancer : c.cliente
      return (
        c.publicacion_titulo.toLowerCase().includes(q) ||
        otherParty.nombre_completo.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <ContractHeader />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("contratos")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "contratos"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Contratos
        </button>
        <button
          type="button"
          onClick={() => setTab("propuestas")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "propuestas"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Propuestas enviadas
        </button>
      </div>

      {tab === "contratos" && (
        <>
          <ContractFilters
            search={search}
            estado={estado}
            onSearchChange={setSearch}
            onEstadoChange={setEstado}
          />

          {isLoading && (
            <div className="flex justify-center py-12">
              <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {!isLoading && !error && <ContractList contracts={filtered} />}
        </>
      )}

      {tab === "propuestas" && <PropuestasEnviadas />}
    </div>
  )
}
