"use client"

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEqualizerLine,
  RiSearchLine,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ServiceCard } from "./components/ServiceCard"
import { ServiceFilters } from "./components/ServiceFilters"

const MOCK_SERVICES = [
  {
    title: "Diseño de logo profesional para startups tecnológicas",
    category: "Diseño",
    price: 85,
    rating: 4.9,
    reviews: 128,
    freelancer: { name: "Marcos G.", initials: "MG" },
  },
  {
    title: "Branding completo y manual de marca moderno",
    category: "Identidad",
    price: 150,
    rating: 5.0,
    reviews: 45,
    freelancer: { name: "Elena R.", initials: "ER" },
  },
  {
    title: "Ilustración vectorial personalizada para sitios web",
    category: "Ilustración",
    price: 45,
    rating: 4.7,
    reviews: 89,
    freelancer: { name: "David P.", initials: "DP" },
  },
  {
    title: "Prototipo UI/UX para aplicación móvil iOS/Android",
    category: "UI/UX",
    price: 120,
    rating: 4.9,
    reviews: 210,
    freelancer: { name: "Sofia L.", initials: "SL" },
  },
  {
    title: "Pack de 15 posts creativos para Instagram y Facebook",
    category: "Social Media",
    price: 60,
    rating: 4.8,
    reviews: 67,
    freelancer: { name: "Andres M.", initials: "AM" },
  },
  {
    title: "Diseño de packaging premium y sostenible",
    category: "Packaging",
    price: 110,
    rating: 4.9,
    reviews: 34,
    freelancer: { name: "Lucía T.", initials: "LT" },
  },
] as const

export function ServicesExplorer() {
  return (
    <div className="flex gap-8">
      {/* Sidebar Filters */}
      <aside className="hidden w-64 shrink-0 xl:block">
        <ServiceFilters />
      </aside>

      {/* Main Content */}
      <section className="flex-1">
        {/* Search + Sort */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md flex-1">
            <InputGroup>
              <InputGroupAddon>
                <RiSearchLine className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Buscar servicios..." />
            </InputGroup>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="xl:hidden">
              <RiEqualizerLine className="size-4" />
              Filtros
            </Button>
            <Select defaultValue="relevancia">
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} align="end">
                <SelectGroup>
                  <SelectItem value="relevancia">Relevancia</SelectItem>
                  <SelectItem value="precio-bajo">Precio más bajo</SelectItem>
                  <SelectItem value="mejor-calificados">Mejor calificados</SelectItem>
                  <SelectItem value="nuevos">Nuevos servicios</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Diseño Gráfico</h2>
          <p className="text-sm text-muted-foreground">156 servicios disponibles</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
          {MOCK_SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <Button variant="outline" size="icon" className="size-10">
            <RiArrowLeftSLine className="size-5" />
          </Button>
          <Button size="icon" className="size-10 font-bold">
            1
          </Button>
          <Button variant="outline" size="icon" className="size-10">
            2
          </Button>
          <Button variant="outline" size="icon" className="size-10">
            3
          </Button>
          <span className="flex size-10 items-center justify-center text-muted-foreground">
            ...
          </span>
          <Button variant="outline" size="icon" className="size-10">
            <RiArrowRightSLine className="size-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
