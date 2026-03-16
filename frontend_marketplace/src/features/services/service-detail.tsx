"use client"

import { RiArrowLeftLine, RiLoader4Line } from "@remixicon/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toServiceDetailProps } from "./adapters"
import { FreelancerProfileCard } from "./components/FreelancerProfileCard"
import { ServiceDescription } from "./components/ServiceDescription"
import { ServiceGallery } from "./components/ServiceGallery"
import { ServicePricingCard } from "./components/ServicePricingCard"
import { usePublicacion } from "./hooks/usePublicacion"

interface ServiceDetailProps {
  id: string
}

export function ServiceDetail({ id }: ServiceDetailProps) {
  const { data, isLoading, error } = usePublicacion(id)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">Error al cargar el servicio: {error}</p>
        <Link href="/services">
          <Button variant="outline" size="sm">Volver a servicios</Button>
        </Link>
      </div>
    )
  }

  if (!data) return null

  const s = toServiceDetailProps(data)

  return (
    <div>
      {/* Back button */}
      <Link href="/services">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2">
          <RiArrowLeftLine className="size-4" />
          Volver a servicios
        </Button>
      </Link>

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-[3] space-y-8">
          <ServiceGallery category={s.category} />

          <FreelancerProfileCard
            name={s.freelancer.name}
            initials={s.freelancer.initials}
            title={s.freelancer.title}
            rating={s.rating}
            reviews={s.reviews}
            isOnline={s.freelancer.isOnline}
            isTopRated={s.freelancer.isTopRated}
            completedJobs={s.freelancer.completedJobs}
            responseRate={s.freelancer.responseRate}
            responseTime={s.freelancer.responseTime}
          />

          {s.description && (
            <ServiceDescription
              about={[s.description]}
              process={[]}
              experience={s.freelancer.bio}
            />
          )}

          <Separator />
        </div>

        {/* Right column - sticky pricing */}
        <div className="flex-[2] lg:sticky lg:top-0 lg:self-start">
          <ServicePricingCard
            title={data.titulo}
            author={s.freelancer.name}
            rating={s.rating}
            reviews={s.reviews}
            price={s.price}
            includes={s.includes}
            deliveryTime={s.deliveryTime}
          />

          {/* Info tip */}
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs leading-relaxed text-blue-700">
              <span className="font-semibold">Consejo:</span> Revisa el perfil
              del freelancer y sus reseñas antes de contratar. Comunica
              claramente tus necesidades para obtener el mejor resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
