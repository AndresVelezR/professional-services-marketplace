"use client";

import {
  RiAddCircleLine,
  RiCloseLine,
  RiEditLine,
  RiLoader4Line,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import { useMisPublicaciones } from "./hooks/useMisPublicaciones";
import { closePublicacion } from "./services/publicacionService";

const ESTADO_STYLES: Record<string, string> = {
  publicado: "bg-green-100 text-green-700",
  borrador: "bg-yellow-100 text-yellow-700",
  cerrado: "bg-gray-100 text-gray-500",
};

export function MyServices() {
  const t = useTranslations("services.my");
  const authFetch = useAuthFetch();
  const router = useRouter();
  const { results, isLoading, error, reload } = useMisPublicaciones();
  const [closingId, setClosingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [closeError, setCloseError] = useState<string | null>(null);

  async function handleClose(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setClosingId(id);
    setCloseError(null);
    try {
      await closePublicacion(id, authFetch);
      setConfirmId(null);
      reload();
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : t("closeError"));
    } finally {
      setClosingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link href="/services/new">
          <Button className="gap-2">
            <RiAddCircleLine className="size-4" />
            {t("new")}
          </Button>
        </Link>
      </div>

      {closeError && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {closeError}
        </p>
      )}

      {isLoading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
          <p className="text-sm text-destructive">{t("loadError", { error })}</p>
          <Button variant="outline" size="sm" onClick={reload}>
            {t("retry")}
          </Button>
        </div>
      )}

      {!isLoading && !error && results.length === 0 && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Link href="/services/new">
            <Button variant="outline" size="sm">
              {t("emptyAction")}
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="divide-y divide-border rounded-xl border border-border bg-white">
          {results.map((pub) => (
            <div key={pub.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{pub.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(pub.created_at).toLocaleDateString("es-CO")} ·{" "}
                  <span className="font-medium">${pub.precio}</span>
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${ESTADO_STYLES[pub.estado] ?? "bg-gray-100 text-gray-500"}`}
              >
                {t(`estado.${pub.estado}`)}
              </span>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/services/${pub.id}`)}
                >
                  {t("view")}
                </Button>

                {pub.estado !== "cerrado" && (
                  <>
                    <Link href={`/services/${pub.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <RiEditLine className="size-3.5" />
                        {t("edit")}
                      </Button>
                    </Link>

                    {confirmId === pub.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => handleClose(pub.id)}
                          disabled={closingId === pub.id}
                        >
                          {closingId === pub.id ? t("closing") : t("confirmClose")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmId(null)}
                        >
                          <RiCloseLine className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClose(pub.id)}
                      >
                        {t("close")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
