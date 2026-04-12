"use client"

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiEqualizerLine,
  RiLoader4Line,
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
import { toServiceCardProps } from "./adapters"
import { ServiceCard } from "./components/ServiceCard"
import { ServiceFilters } from "./components/ServiceFilters"
import { usePublicaciones } from "./hooks/usePublicaciones"

const ORDERING_MAP: Record<string, string> = {
  relevancia: "",
  "precio-bajo": "precio",
  "mejor-calificados": "-created_at",
  nuevos: "-created_at",
}

export function ServicesExplorer() {
  const {
    results,
    count,
    isLoading,
    error,
    totalPages,
    currentPage,
    updateFilter,
    setPage,
  } = usePublicaciones()

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    updateFilter("q", e.target.value)
  }

  function handleOrdering(value: string) {
    updateFilter("ordering", ORDERING_MAP[value] || "")
  }

  function handlePriceFilter(filters: { precio_min?: number; precio_max?: number }) {
    if (filters.precio_min != null) updateFilter("precio_min", filters.precio_min)
    else updateFilter("precio_min", undefined)
    if (filters.precio_max != null) updateFilter("precio_max", filters.precio_max)
    else updateFilter("precio_max", undefined)
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar Filters */}
      <aside className="hidden w-64 shrink-0 xl:block">
        <ServiceFilters onFilterChange={handlePriceFilter} />
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
              <InputGroupInput
                placeholder="Buscar servicios..."
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="xl:hidden">
              <RiEqualizerLine className="size-4" />
              Filtros
            </Button>
            <Select defaultValue="relevancia" onValueChange={handleOrdering}>
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
          <h2 className="text-lg font-semibold text-foreground">Servicios</h2>
          <p className="text-sm text-muted-foreground">
            {count} servicio{count !== 1 ? "s" : ""} disponible{count !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <RiLoader4Line className="size-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-destructive">Error al cargar servicios: {error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && results.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              No se encontraron servicios
            </p>
            <p className="text-xs text-muted-foreground">
              Intenta con otros filtros o términos de búsqueda
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {results.map((item) => {
              const props = toServiceCardProps(item)
              return <ServiceCard key={item.id} {...props} />
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-10"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <RiArrowLeftSLine className="size-5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="icon"
                  className="size-10"
                  onClick={() => setPage(page)}
                >
                  {page}
                </Button>
              ),
            )}
            {totalPages > 5 && (
              <span className="flex size-10 items-center justify-center text-muted-foreground">
                ...
              </span>
            )}
            <Button
              variant="outline"
              size="icon"
              className="size-10"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <RiArrowRightSLine className="size-5" />
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
