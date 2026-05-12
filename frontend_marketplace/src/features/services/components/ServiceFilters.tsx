"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RiMoneyDollarCircleLine } from "@remixicon/react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ServiceFiltersProps {
  onFilterChange?: (filters: { precio_min?: number; precio_max?: number }) => void
}

const PRICE_RANGES = [
  { id: "price-0-50", label: "$0 - $50", min: 0, max: 50 },
  { id: "price-50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "price-100", label: "$100+", min: 100, max: undefined },
  { id: "price-custom", label: "Personalizado", min: undefined, max: undefined },
] as const

type RangeId = (typeof PRICE_RANGES)[number]["id"]

export function ServiceFilters({ onFilterChange }: ServiceFiltersProps) {
  const t = useTranslations("services.filters")
  const [selectedPrice, setSelectedPrice] = useState<RangeId | null>(null)
  const [customMin, setCustomMin] = useState("")
  const [customMax, setCustomMax] = useState("")

  function handlePriceChange(rangeId: RangeId, checked: boolean) {
    const next = checked ? rangeId : null
    setSelectedPrice(next)

    if (!onFilterChange) return

    if (!next || next === "price-custom") {
      onFilterChange({ precio_min: undefined, precio_max: undefined })
      return
    }

    const range = PRICE_RANGES.find((r) => r.id === next)
    if (range && range.id !== "price-custom") {
      onFilterChange({ precio_min: range.min, precio_max: range.max })
    }
  }

  function handleCustomChange(min: string, max: string) {
    if (!onFilterChange) return
    onFilterChange({
      precio_min: min !== "" ? Number(min) : undefined,
      precio_max: max !== "" ? Number(max) : undefined,
    })
  }

  return (
    <div className="sticky top-24 space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <RiMoneyDollarCircleLine className="size-4" />
          {t("price")}
        </h3>
        <div className="space-y-3">
          {PRICE_RANGES.map((range) => (
            <div key={range.id} className="group flex items-center gap-3">
              <Checkbox
                id={range.id}
                checked={selectedPrice === range.id}
                onCheckedChange={(checked) => handlePriceChange(range.id, !!checked)}
              />
              <Label
                htmlFor={range.id}
                className="cursor-pointer text-sm font-normal text-muted-foreground transition-colors group-hover:text-primary"
              >
                {range.label}
              </Label>
            </div>
          ))}

          {selectedPrice === "price-custom" && (
            <div className="mt-3 flex items-center gap-2 pl-7">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={customMin}
                onChange={(e) => {
                  setCustomMin(e.target.value)
                  handleCustomChange(e.target.value, customMax)
                }}
                className="h-8 w-full text-sm"
              />
              <span className="shrink-0 text-xs text-muted-foreground">—</span>
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={customMax}
                onChange={(e) => {
                  setCustomMax(e.target.value)
                  handleCustomChange(customMin, e.target.value)
                }}
                className="h-8 w-full text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
