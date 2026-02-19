"use client"

import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FreelancerProfileCard } from "./components/FreelancerProfileCard"
import { ReviewCard } from "./components/ReviewCard"
import { ReviewsSummary } from "./components/ReviewsSummary"
import { ServiceDescription } from "./components/ServiceDescription"
import { ServiceGallery } from "./components/ServiceGallery"
import { ServicePricingCard } from "./components/ServicePricingCard"

const MOCK_SERVICE = {
  title: "Diseño de logo profesional para startups tecnológicas",
  category: "Diseño",
  price: 85,
  rating: 4.9,
  reviews: 128,
  deliveryTime: "3-5 días",
  includes: [
    "3 conceptos iniciales de logo",
    "Revisiones ilimitadas",
    "Archivos en formato vectorial (AI, SVG, EPS)",
    "Versión en alta resolución (PNG, JPG)",
    "Manual básico de uso del logo",
  ],
  freelancer: {
    name: "Marcos García",
    initials: "MG",
    title: "Diseñador Gráfico Senior",
    isOnline: true,
    isTopRated: true,
    completedJobs: 234,
    responseRate: "98%",
    responseTime: "1 hora",
  },
  description: {
    about: [
      "Creo logos profesionales que capturan la esencia de tu marca. Con más de 8 años de experiencia en diseño de identidad visual, me especializo en crear logos modernos, memorables y versátiles para startups tecnológicas.",
      "Mi enfoque combina investigación de mercado, tendencias actuales de diseño y una comprensión profunda de la psicología del color para crear una identidad visual que conecte con tu audiencia objetivo.",
    ],
    process: [
      {
        title: "Briefing y Investigación",
        description:
          "Analizo tu marca, competencia y público objetivo para entender la dirección creativa.",
      },
      {
        title: "Conceptualización",
        description:
          "Desarrollo 3 conceptos únicos basados en la investigación y tus preferencias.",
      },
      {
        title: "Refinamiento",
        description:
          "Trabajo contigo en revisiones hasta lograr el diseño perfecto.",
      },
      {
        title: "Entrega Final",
        description:
          "Entrego todos los archivos en múltiples formatos listos para usar.",
      },
    ],
    experience:
      "Llevo más de 8 años trabajando como diseñador gráfico freelance, colaborando con startups y empresas tecnológicas en Latinoamérica y Europa. He diseñado más de 200 logos y he trabajado con marcas reconocidas en el sector tech. Mi trabajo ha sido destacado en plataformas como Behance y Dribbble.",
  },
  reviewsSummary: {
    breakdown: [
      { stars: 5, percentage: 85 },
      { stars: 4, percentage: 10 },
      { stars: 3, percentage: 3 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 1 },
    ],
  },
  reviewsList: [
    {
      name: "Carolina M.",
      initials: "CM",
      date: "Hace 2 semanas",
      rating: 5,
      comment:
        "Marcos hizo un trabajo increíble con nuestro logo. Entendió perfectamente la visión de nuestra startup y entregó antes de tiempo. Las revisiones fueron rápidas y profesionales. Altamente recomendado.",
    },
    {
      name: "Andrés P.",
      initials: "AP",
      date: "Hace 1 mes",
      rating: 5,
      comment:
        "Excelente calidad de diseño. El proceso fue muy organizado y siempre estuvo disponible para resolver dudas. El resultado final superó nuestras expectativas.",
    },
    {
      name: "María L.",
      initials: "ML",
      date: "Hace 2 meses",
      rating: 4,
      comment:
        "Muy buen trabajo en general. El logo quedó profesional y moderno. Solo le doy 4 estrellas porque las primeras propuestas no fueron exactamente lo que buscaba, pero después de las revisiones quedó perfecto.",
    },
  ],
} as const

export function ServiceDetail() {
  const s = MOCK_SERVICE

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

          <ServiceDescription
            about={[...s.description.about]}
            process={[...s.description.process]}
            experience={s.description.experience}
          />

          <Separator />

          {/* Reviews */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Reseñas ({s.reviews})
            </h3>
            <ReviewsSummary
              averageRating={s.rating}
              totalReviews={s.reviews}
              breakdown={[...s.reviewsSummary.breakdown]}
            />
            <div className="space-y-4">
              {s.reviewsList.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </div>
            <Button variant="outline" className="w-full">
              Ver todas las reseñas
            </Button>
          </div>
        </div>

        {/* Right column - sticky pricing */}
        <div className="flex-[2] lg:sticky lg:top-0 lg:self-start">
          <ServicePricingCard
            title={s.title}
            author={s.freelancer.name}
            rating={s.rating}
            reviews={s.reviews}
            price={s.price}
            includes={[...s.includes]}
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
