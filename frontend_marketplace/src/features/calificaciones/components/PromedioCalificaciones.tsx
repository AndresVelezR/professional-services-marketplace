"use client";

import { RiStarFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  getCalificacionesUsuario,
  type PromedioCalificaciones,
} from "../services/calificacionService";

interface PromedioCalificacionesCardProps {
  usuarioId: string;
}

export function PromedioCalificacionesCard({
  usuarioId,
}: PromedioCalificacionesCardProps) {
  const t = useTranslations("profile.calificaciones");
  const [data, setData] = useState<PromedioCalificaciones | null>(null);

  useEffect(() => {
    getCalificacionesUsuario(usuarioId)
      .then(setData)
      .catch(() => null);
  }, [usuarioId]);

  if (!data || data.total === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("empty")}</p>
    );
  }

  const criterios = [
    { label: t("calidad"), value: data.promedios.calidad },
    { label: t("comunicacion"), value: data.promedios.comunicacion },
    { label: t("puntualidad"), value: data.promedios.puntualidad },
  ];

  return (
    <div className="space-y-4">
      {/* Promedio general */}
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-foreground">
          {data.promedios.general}
        </span>
        <div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <RiStarFill
                key={`general-star-${star}`}
                className={`size-5 ${
                  star <= Math.round(data.promedios.general)
                    ? "text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("reviews", { total: data.total })}
          </p>
        </div>
      </div>

      {/* Criterios */}
      <div className="space-y-2">
        {criterios.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24">{label}</span>
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div
                className="bg-yellow-400 h-1.5 rounded-full transition-all"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-6">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
