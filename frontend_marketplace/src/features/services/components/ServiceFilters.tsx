"use client"

import { RiMoneyDollarCircleLine, RiStarFill, RiTimeLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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
}: {
  id: string
  label: string
  suffix?: React.ReactNode
}) {
  return (
    <div className="group flex items-center gap-3">
      <Checkbox id={id} />
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

export function ServiceFilters() {
  return (
    <div className="sticky top-24 space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <FilterSection icon={RiMoneyDollarCircleLine} title="Rango de Precio">
        <FilterCheckbox id="price-0-50" label="$0 - $50" />
        <FilterCheckbox id="price-50-100" label="$50 - $100" />
        <FilterCheckbox id="price-100" label="$100+" />
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
