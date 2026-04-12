"use client"

import { useRef, useState } from "react"
import {
  RiAddLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiImageAddLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CreatePublicacionPayload } from "../models"

const CATEGORIAS = [
  { value: "diseno", label: "Diseño Gráfico" },
  { value: "desarrollo", label: "Desarrollo Web" },
  { value: "marketing", label: "Marketing Digital" },
  { value: "redaccion", label: "Redacción" },
  { value: "video", label: "Video y Animación" },
  { value: "otro", label: "Otro" },
] as const

interface CreateServiceFormProps {
  isSubmitting: boolean
  error: string | null
  onSubmit: (payload: CreatePublicacionPayload) => void
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {step}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function CreateServiceForm({
  isSubmitting,
  error,
  onSubmit,
}: CreateServiceFormProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [categoria, setCategoria] = useState("")
  const [precio, setPrecio] = useState("")
  const [tiempoEntrega, setTiempoEntrega] = useState("")
  const [imagenes, setImagenes] = useState<File[]>([])
  const [incluye, setIncluye] = useState<string[]>([])
  const [nuevoIncluye, setNuevoIncluye] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isValid = titulo && descripcion && categoria && precio && tiempoEntrega

  function addIncluye() {
    const trimmed = nuevoIncluye.trim()
    if (trimmed && !incluye.includes(trimmed)) {
      setIncluye([...incluye, trimmed])
      setNuevoIncluye("")
    }
  }

  function removeIncluye(index: number) {
    setIncluye(incluye.filter((_, i) => i !== index))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = 3 - imagenes.length
    setImagenes((prev) => [...prev, ...files.slice(0, remaining)])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeImagen(index: number) {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      titulo,
      descripcion,
      categoria,
      precio: parseFloat(precio),
      tiempo_entrega: tiempoEntrega,
      incluye,
      imagenes: imagenes.length > 0 ? imagenes : undefined,
      estado: "publicado",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <RiAlertLine className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-destructive">
              No se pudo publicar el servicio
            </p>
            <p className="mt-0.5 text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Section 1: Información básica */}
      <section className="space-y-5">
        <SectionHeader
          step={1}
          title="Información básica"
          description="El título y la descripción son lo primero que verán los clientes"
        />

        <div className="space-y-4 pl-10">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-medium">
              Título del servicio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: Diseño de logo profesional para startups"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="h-11"
            />
            <p className="text-[11px] text-muted-foreground">
              Sé específico — los títulos claros reciben más clicks
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe tu servicio, tu experiencia y proceso de trabajo..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="min-h-36 resize-y"
            />
            <p className="text-[11px] text-muted-foreground">
              Incluye tu experiencia, proceso y qué te diferencia
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Section 2: Categoría y precio */}
      <section className="space-y-5">
        <SectionHeader
          step={2}
          title="Categoría y precio"
          description="Ayuda a los clientes a encontrar tu servicio"
        />

        <div className="space-y-4 pl-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio" className="text-sm font-medium">
                Precio (USD) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <RiMoneyDollarCircleLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="precio"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="85.00"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  className="h-11 pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:max-w-[calc(50%-0.5rem)]">
            <Label htmlFor="tiempo_entrega" className="text-sm font-medium">
              Tiempo de entrega <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <RiTimeLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tiempo_entrega"
                placeholder="Ej: 3-5 días"
                value={tiempoEntrega}
                onChange={(e) => setTiempoEntrega(e.target.value)}
                required
                className="h-11 pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Section 3: Detalles adicionales */}
      <section className="space-y-5">
        <SectionHeader
          step={3}
          title="Detalles adicionales"
          description="Estos campos son opcionales pero mejoran tu publicación"
        />

        <div className="space-y-5 pl-10">
          {/* Imágenes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Imágenes del servicio
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (opcional, máx. 3)
              </span>
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {imagenes.map((file, i) => (
                <div
                  key={i}
                  className="group/img relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/img:opacity-100"
                  >
                    <RiCloseLine className="size-3.5" />
                  </button>
                </div>
              ))}

              {imagenes.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <RiImageAddLine className="size-6" />
                  <span className="text-[11px] font-medium">Agregar</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />

            <p className="text-[11px] text-muted-foreground">
              JPG, PNG o WebP. Se mostrarán como galería del servicio.
            </p>
          </div>

          {/* Incluye */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              ¿Qué incluye?
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>

            <div className="flex gap-2">
              <Input
                placeholder="Ej: Revisiones ilimitadas"
                value={nuevoIncluye}
                onChange={(e) => setNuevoIncluye(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addIncluye()
                  }
                }}
                className="h-11"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addIncluye}
                className="h-11 shrink-0 gap-1.5 px-4 text-xs font-semibold"
              >
                <RiAddLine className="size-4" />
                Agregar
              </Button>
            </div>

            {incluye.length > 0 && (
              <ul className="space-y-2">
                {incluye.map((item, i) => (
                  <li
                    key={i}
                    className="group/item flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <RiCheckLine className="size-3.5 shrink-0 text-green-500" />
                    <span className="flex-1 text-sm text-foreground">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncluye(i)}
                      className="rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover/item:opacity-100"
                    >
                      <RiCloseLine className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {incluye.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                Presiona Enter o haz click en Agregar para añadir items
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Al publicar, aceptas los términos de servicio de FreelanceHub.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-11 min-w-[200px] bg-action text-action-foreground hover:bg-action/90 font-bold shadow-md transition-all disabled:opacity-40"
        >
          {isSubmitting ? (
            <>
              <RiLoader4Line className="size-4 animate-spin" />
              Publicando...
            </>
          ) : (
            "Publicar servicio"
          )}
        </Button>
      </div>
    </form>
  )
}
