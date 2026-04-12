"use client"

import { useState } from "react"
import { RiMoneyDollarCircleLine, RiStarFill, RiTimeLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ServiceFiltersProps {
  onFilterChange?: (filters: { precio_min?: number; precio_max?: number }) => void
}

function FilterSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
        <Icon className="size-4" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  id,
  label,
  suffix,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  suffix?: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div className="group flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label
        htmlFor={id}
        className="cursor-pointer text-sm font-normal text-muted-foreground transition-colors group-hover:text-primary"
      >
        {label}
      </Label>
      {suffix}
    </div>
  )
}

const PRICE_RANGES = [
  { id: "price-0-50", label: "$0 - $50", min: 0, max: 50 },
  { id: "price-50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "price-100", label: "$100+", min: 100, max: undefined },
] as const

export function ServiceFilters({ onFilterChange }: ServiceFiltersProps) {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)

  function handlePriceChange(rangeId: string, checked: boolean) {
    const next = checked ? rangeId : null
    setSelectedPrice(next)

    if (!onFilterChange) return

    if (!next) {
      onFilterChange({ precio_min: undefined, precio_max: undefined })
      return
    }

    const range = PRICE_RANGES.find((r) => r.id === next)
    if (range) {
      onFilterChange({ precio_min: range.min, precio_max: range.max })
    }
  }

  return (
    <div className="sticky top-24 space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <FilterSection icon={RiMoneyDollarCircleLine} title="Rango de Precio">
        {PRICE_RANGES.map((range) => (
          <FilterCheckbox
            key={range.id}
            id={range.id}
            label={range.label}
            checked={selectedPrice === range.id}
            onCheckedChange={(checked) => handlePriceChange(range.id, checked)}
          />
        ))}
      </FilterSection>

      <div className="border-t border-border pt-6">
        <FilterSection icon={RiTimeLine} title="Tiempo de Entrega">
          <FilterCheckbox id="time-1-3" label="1-3 días" />
          <FilterCheckbox id="time-3-7" label="3-7 días" />
        </FilterSection>
      </div>

      <div className="border-t border-border pt-6">
        <FilterSection icon={RiStarFill} title="Calificación">
          <FilterCheckbox
            id="rating-4"
            label="4+ estrellas"
            suffix={<RiStarFill className="size-3 text-yellow-400" />}
          />
          <FilterCheckbox
            id="rating-4-5"
            label="4.5+ estrellas"
            suffix={<RiStarFill className="size-3 text-yellow-400" />}
          />
        </FilterSection>
      </div>

      <Button className="w-full h-11 bg-action text-action-foreground hover:bg-action/90 font-bold shadow-md">
        Aplicar Filtros
      </Button>
    </div>
  )
}
