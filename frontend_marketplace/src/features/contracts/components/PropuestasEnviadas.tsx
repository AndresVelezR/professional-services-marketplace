"use client";

import { RiLoader4Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { usePropuestasEnviadas } from "../hooks/usePropuestasEnviadas";

const ESTADO_STYLES = {
  pendiente: "bg-orange-100 text-orange-700",
  aceptada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
};

export function PropuestasEnviadas() {
  const t = useTranslations("contracts.propuestasEnviadas");
  const { propuestas, isLoading, error } = usePropuestasEnviadas();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (propuestas.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {propuestas.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-border bg-white p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${ESTADO_STYLES[p.estado]}`}
            >
              {t(`estado.${p.estado}`)}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ${p.precio_propuesto}
            </span>
          </div>

          <Link
            href={`/services/${p.publicacion_id}`}
            className="mb-3 block text-base font-semibold text-foreground hover:underline"
          >
            {p.publicacion_titulo}
          </Link>

          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {p.mensaje}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {p.fecha_limite && (
                <span>
                  {t("limite", {
                    date: new Date(p.fecha_limite).toLocaleDateString("es-CO"),
                  })}
                </span>
              )}
              <span>
                {t("enviada", {
                  date: new Date(p.created_at).toLocaleDateString("es-CO"),
                })}
              </span>
            </div>

            {p.estado === "aceptada" && (
              <span className="text-xs font-medium text-green-600">
                {t("contratoCreado")}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
