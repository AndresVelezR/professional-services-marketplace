"use client";

import { RiLoader4Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import type { PublicacionListItem } from "@/features/services/models";
import { getPublicaciones } from "@/features/services/services/publicacionService";
import { toServiceCardProps } from "@/features/services/adapters";
import { Link } from "@/i18n/navigation";

export function RecommendedServices() {
  const t = useTranslations("dashboard.recommendedServices");
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
            <ServiceCard key={s.id} {...toServiceCardProps(s)} from="dashboard" />
          ))}
        </div>
      )}
    </section>
  );
}
