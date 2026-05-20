import type { ServiceCardProps } from "./components/ServiceCard";
import type { PublicacionDetail, PublicacionListItem } from "./models";

const CATEGORIA_LABELS: Record<string, string> = {
  diseno: "Diseño Gráfico",
  desarrollo: "Desarrollo Web",
  marketing: "Marketing Digital",
  redaccion: "Redacción",
  video: "Video y Animación",
  otro: "Otro",
};

export function categoriaLabel(key: string): string {
  return CATEGORIA_LABELS[key] ?? key;
}

export function serviceImageFallback(id: string): string {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(id)}&backgroundColor=f1f5f9`;
}

export function toServiceCardProps(
  item: PublicacionListItem,
): ServiceCardProps {
  return {
    id: item.id,
    title: item.titulo,
    category: item.categoria,
    price: parseFloat(item.precio),
    rating: item.rating_promedio ?? 0,
    reviews: item.rating_total,
    freelancer: {
      name: item.creador.nombre_completo,
      initials: item.creador.iniciales,
      id: item.creador.id,
    },
    imageUrl: item.imagenes?.[0]?.url || serviceImageFallback(item.id),
  };
}

export function toServiceDetailProps(detail: PublicacionDetail) {
  const realImages = detail.imagenes.map((img) => img.url).filter(Boolean);
  return {
    title: detail.titulo,
    category: detail.categoria,
    price: parseFloat(detail.precio),
    deliveryTime: detail.tiempo_entrega,
    includes: detail.incluye,
    description: detail.descripcion,
    images:
      realImages.length > 0 ? realImages : [serviceImageFallback(detail.id)],
    rating: detail.rating_promedio ?? 0,
    reviews: detail.rating_total,
    creatorId: detail.creador.id,
    freelancer: {
      name: detail.creador.nombre_completo,
      initials: detail.creador.iniciales,
      title:
        detail.creador.tipo_usuario === "freelancer"
          ? "Freelancer"
          : "Profesional",
      bio: detail.creador.bio,
    },
  };
}
