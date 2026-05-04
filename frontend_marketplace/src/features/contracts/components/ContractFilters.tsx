"use client";

import { RiSearchLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import type { Contrato } from "../models";

type EstadoFiltro = "todos" | Contrato["estado"];

interface ContractFiltersProps {
  search: string;
  estado: EstadoFiltro;
  onSearchChange: (v: string) => void;
  onEstadoChange: (v: EstadoFiltro) => void;
}

const ESTADO_VALUES: EstadoFiltro[] = [
  "todos",
  "activo",
  "completado",
  "cancelado",
];

export function ContractFilters({
  search,
  estado,
  onSearchChange,
  onEstadoChange,
}: ContractFiltersProps) {
  const t = useTranslations("contracts");

  function labelFor(value: EstadoFiltro) {
    return value === "todos" ? t("filters.todos") : t(`estado.${value}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <RiSearchLine className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("filters.searchPlaceholder")}
          className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex gap-2">
        {ESTADO_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onEstadoChange(value)}
            className={`h-10 rounded-lg border px-4 text-sm transition-colors ${
              estado === value
                ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                : "border-border bg-white text-foreground hover:bg-muted"
            }`}
          >
            {labelFor(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
