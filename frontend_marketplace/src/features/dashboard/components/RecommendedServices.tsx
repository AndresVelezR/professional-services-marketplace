"use client";

import { RiLoader4Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicacionListItem } from "@/features/services/models";
import { getPublicaciones } from "@/features/services/services/publicacionService";
import { Link } from "@/i18n/navigation";

const CATEGORIA_COLORS: Record<string, string> = {
  diseno: "bg-blue-600",
  marketing: "bg-green-600",
  desarrollo: "bg-red-500",
  negocios: "bg-orange-500",
  escritura: "bg-purple-600",
  video: "bg-pink-600",
};

function categoryColor(categoria: string) {
  return CATEGORIA_COLORS[categoria.toLowerCase()] ?? "bg-gray-500";
}

export function RecommendedServices() {
  const t = useTranslations("dashboard.recommendedServices");
  const tCat = useTranslations("services.form.categorias");
  const [services, setServices] = useState<PublicacionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicaciones({ page: 1 })
      .then((res) => setServices(res.results.slice(0, 4)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <Link
          href="/services"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <RiLoader4Line className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && services.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      )}

      {!isLoading && services.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 bg-muted">
                {s.imagenes[0] ? (
                  <img
                    src={s.imagenes[0].url}
                    alt={s.titulo}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <Badge
                  className={`absolute left-3 top-3 ${categoryColor(s.categoria)} border-0 text-[11px] font-bold uppercase tracking-wide text-white`}
                >
                  {tCat(s.categoria)}
                </Badge>
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                      {s.creador.iniciales}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {s.creador.nombre_completo}
                  </span>
                </div>

                <h3 className="mb-3 text-sm font-semibold leading-tight text-foreground line-clamp-2">
                  {s.titulo}
                </h3>

                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("from", { price: s.precio })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.tiempo_entrega}
                  </span>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/services/${s.id}`}>{t("viewService")}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
