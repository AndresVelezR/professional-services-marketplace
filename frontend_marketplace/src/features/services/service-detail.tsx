"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RiLoader4Line } from "@remixicon/react"
import { Link } from "@/i18n/navigation"

import { Button } from "@/components/ui/button"
import { PropuestaModal } from "@/features/contracts/components/PropuestaModal"
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
  const t = useTranslations("services.detail")
  const { data, isLoading, error } = usePublicacion(id)
  const [modalOpen, setModalOpen] = useState(false)

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
        <p className="text-sm text-destructive">{t("loadError", { error })}</p>
        <Link href="/services">
          <Button variant="outline" size="sm">{t("back")}</Button>
        </Link>
      </div>
    )
  }

  if (!data) return null

  const s = toServiceDetailProps(data)

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-[3] space-y-8">
          <ServiceGallery category={s.category} images={s.images} />

          <ServiceDescription
            description={s.description}
            includes={s.includes}
          />

          <FreelancerProfileCard
            name={s.freelancer.name}
            initials={s.freelancer.initials}
            title={s.freelancer.title}
            bio={s.freelancer.bio}
          />
        </div>

        {/* Right column - sticky pricing */}
        <div className="flex-[2] lg:sticky lg:top-0 lg:self-start">
          <ServicePricingCard
            title={data.titulo}
            author={s.freelancer.name}
            price={s.price}
            includes={s.includes}
            deliveryTime={s.deliveryTime}
            onContratar={() => setModalOpen(true)}
          />
        </div>
      </div>

      <PropuestaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        publicacionId={id}
        precioBase={s.price}
      />
    </div>
  )
}
