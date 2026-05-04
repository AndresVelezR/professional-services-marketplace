"use client"

import { useMemo, useState } from "react"
import { RiLoader4Line, RiStarFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/infrastructure/auth/AuthContext"
import { createReview } from "../services/contractService"

interface ReviewModalProps {
  open: boolean
  contractId: string
  reviewedName: string
  onClose: () => void
  onSubmitted: () => Promise<void> | void
}

interface Ratings {
  calidad: number
  comunicacion: number
  puntualidad: number
}

const CRITERIOS: { key: keyof Ratings; label: string }[] = [
  { key: "calidad", label: "Calidad del trabajo" },
  { key: "comunicacion", label: "Comunicación" },
  { key: "puntualidad", label: "Puntualidad" },
]

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const v = i + 1
          return (
            <button
              key={v}
              type="button"
              className="rounded-md p-1 transition-colors hover:bg-muted"
              onClick={() => onChange(v)}
              aria-label={`${label} ${v} estrellas`}
            >
              <RiStarFill
                className={`size-6 ${
                  v <= value ? "text-yellow-400" : "text-muted-foreground/40"
                }`}
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : "Sin seleccionar"}
        </span>
      </div>
    </div>
  )
}

export function ReviewModal({
  open,
  contractId,
  reviewedName,
  onClose,
  onSubmitted,
}: ReviewModalProps) {
  const { token } = useAuth()
  const [ratings, setRatings] = useState<Ratings>({
    calidad: 0,
    comunicacion: 0,
    puntualidad: 0,
  })
  const [comment, setComment] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(
    () => Object.values(ratings).every((v) => v >= 1),
    [ratings],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !canSubmit) return

    setIsSaving(true)
    setError(null)

    try {
      await createReview(
        {
          contrato: contractId,
          calidad: ratings.calidad,
          comunicacion: ratings.comunicacion,
          puntualidad: ratings.puntualidad,
          comentario: comment.trim(),
        },
        token,
      )
      await onSubmitted()
      handleClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar calificacion",
      )
    } finally {
      setIsSaving(false)
    }
  }

  function handleClose() {
    setRatings({ calidad: 0, comunicacion: 0, puntualidad: 0 })
    setComment("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Calificar contrato</DialogTitle>
          <DialogDescription>
            Evalúa tu experiencia con {reviewedName}. Esta calificación será
            visible en su perfil.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {CRITERIOS.map(({ key, label }) => (
            <StarRating
              key={key}
              label={label}
              value={ratings[key]}
              onChange={(v) =>
                setRatings((prev) => ({ ...prev, [key]: v }))
              }
            />
          ))}

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="review-comment"
            >
              Comentario (opcional)
            </label>
            <Textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte cómo fue trabajar con esta persona"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!canSubmit || isSaving}
            >
              {isSaving ? (
                <>
                  <RiLoader4Line className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar calificación"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}