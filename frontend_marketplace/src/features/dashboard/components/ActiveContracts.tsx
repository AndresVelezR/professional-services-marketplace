"use client";

import { RiLoader4Line } from "@remixicon/react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useContratos } from "@/features/contracts/hooks/useContratos";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/infrastructure/auth/AuthContext";

const ESTADO_STYLES = {
  activo: "bg-blue-100 text-blue-700",
  completado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

export function ActiveContracts() {
  const t = useTranslations("dashboard.activeContracts");
  const tEstado = useTranslations("contracts.estado");
  const locale = useLocale();
  const { perfil } = useAuth();
  const { contratos, isLoading } = useContratos();

  const activos = contratos.filter((c) => c.estado === "activo");

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <Link
          href="/contracts"
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

      {!isLoading && activos.length === 0 && (
        <div className="rounded-xl border border-border bg-card px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      )}

      {!isLoading && activos.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("headerServicio")}
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {perfil?.tipo_usuario === "freelancer"
                    ? t("headerCliente")
                    : t("headerFreelancer")}
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("headerEstado")}
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("headerPrecio")}
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("headerAcciones")}
                </th>
              </tr>
            </thead>
            <tbody>
              {activos.map((c) => {
                const isCliente = perfil?.email === c.cliente.email;
                const otherParty = isCliente ? c.freelancer : c.cliente;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">
                        {c.publicacion_titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("from", {
                          date: new Date(c.fecha_inicio).toLocaleDateString(locale),
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {otherParty.iniciales}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">
                          {otherParty.nombre_completo}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${ESTADO_STYLES[c.estado]}`}
                      >
                        {tEstado(c.estado)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      ${c.precio}
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Link href={`/contracts/${c.id}`}>
                          {t("viewDetails")}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
