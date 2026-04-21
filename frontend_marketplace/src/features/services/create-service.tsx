"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"

import { useAuth } from "@/infrastructure/auth/AuthContext"
import { CreateServiceForm } from "./components/CreateServiceForm"
import type { CreatePublicacionPayload } from "./models"
import { createPublicacion } from "./services/publicacionService"

export function CreateService() {
  const router = useRouter()
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(payload: CreatePublicacionPayload) {
    if (!token) {
      setError("Debes iniciar sesión para publicar un servicio")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createPublicacion(payload, token)
      router.push("/services")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el servicio")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-2">
      <div className="mx-auto min-w-[420px] max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Publica tu servicio
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Describe tu oferta para que clientes potenciales puedan encontrarte y contratarte.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <h2 className="text-sm font-semibold text-foreground">Detalles del servicio</h2>
            <p className="text-xs text-muted-foreground">
              Los campos marcados son obligatorios
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <CreateServiceForm
              isSubmitting={isSubmitting}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
