"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RiCloseLine, RiLoader4Line } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { CreateExperienciaPayload, Experiencia } from "../models"

interface ExperienciaFormProps {
  initial?: Experiencia | null
  isLoading: boolean
  onSubmit: (payload: CreateExperienciaPayload) => Promise<void>
  onCancel: () => void
}

export function ExperienciaForm({
  initial,
  isLoading,
  onSubmit,
  onCancel,
}: ExperienciaFormProps) {
  const t = useTranslations("profile.experience")
  const [empresa, setEmpresa] = useState(initial?.empresa ?? "")
  const [cargo, setCargo] = useState(initial?.cargo ?? "")
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "")
  const [fechaInicio, setFechaInicio] = useState(initial?.fecha_inicio ?? "")
  const [fechaFin, setFechaFin] = useState(initial?.fecha_fin ?? "")
  const [ubicacion, setUbicacion] = useState(initial?.ubicacion ?? "")

  const isValid = empresa && cargo && fechaInicio

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      empresa,
      cargo,
      descripcion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || null,
      ubicacion,
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {initial ? t("edit") : t("add")}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RiCloseLine className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="empresa">
              {t("company")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder={t("companyPlaceholder")}
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo">
              {t("role")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder={t("rolePlaceholder")}
              className="h-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion_exp">{t("description")}</Label>
          <Textarea
            id="descripcion_exp"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            className="min-h-20 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="fecha_inicio">
              {t("startDate")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fecha_inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha_fin">{t("endDate")}</Label>
            <Input
              id="fecha_fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="h-10"
            />
            <p className="text-[11px] text-muted-foreground">
              {t("endDateHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">{t("location")}</Label>
            <Input
              id="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder={t("locationPlaceholder")}
              className="h-10"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="h-9 gap-2 bg-action text-action-foreground hover:bg-action/90 font-semibold text-sm"
          >
            {isLoading && <RiLoader4Line className="size-3.5 animate-spin" />}
            {initial ? t("submitEdit") : t("submitAdd")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9 text-sm"
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  )
}
