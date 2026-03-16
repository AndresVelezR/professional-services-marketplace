import type { ServiceCardProps } from "./components/ServiceCard"
import type { PublicacionDetail, PublicacionListItem } from "./models"

const CATEGORIA_LABELS: Record<string, string> = {
  diseno: "Diseño Gráfico",
  desarrollo: "Desarrollo Web",
  marketing: "Marketing Digital",
  redaccion: "Redacción",
  video: "Video y Animación",
  otro: "Otro",
}

export function categoriaLabel(key: string): string {
  return CATEGORIA_LABELS[key] ?? key
}

export function toServiceCardProps(
  item: PublicacionListItem,
): ServiceCardProps {
  return {
    id: item.id,
    title: item.titulo,
    category: categoriaLabel(item.categoria),
    price: parseFloat(item.precio),
    rating: 0,
    reviews: 0,
    freelancer: {
      name: item.creador.nombre_completo,
      initials: item.creador.iniciales,
    },
    imageUrl: item.imagenes?.[0]?.url || item.imagen_url || undefined,
  }
}

export function toServiceDetailProps(detail: PublicacionDetail) {
  return {
    title: detail.titulo,
    category: categoriaLabel(detail.categoria),
    price: parseFloat(detail.precio),
    rating: 0,
    reviews: 0,
    deliveryTime: detail.tiempo_entrega,
    includes: detail.incluye,
    description: detail.descripcion,
    freelancer: {
      name: detail.creador.nombre_completo,
      initials: detail.creador.iniciales,
      title: detail.creador.tipo_usuario === "freelancer" ? "Freelancer" : "Profesional",
      bio: detail.creador.bio,
      isOnline: false,
      isTopRated: false,
      completedJobs: 0,
      responseRate: "N/A",
      responseTime: "N/A",
    },
  }
}
