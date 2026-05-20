"use client";

import { RiLoader4Line, RiMessage3Line, RiStarLine } from "@remixicon/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import { obtenerOCrearConversacion } from "@/features/chat/services/chatService";
import { ReviewModal } from "./components/ReviewModal";
import { getContrato, updateContratoEstado } from "./services/contractService";
import type { Contrato } from "./models";

const ESTADO_STYLES: Record<Contrato["estado"], string> = {
  activo: "bg-blue-100 text-blue-700",
  completado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

interface ContractDetailProps {
  id: string;
}

export function ContractDetail({ id }: ContractDetailProps) {
  const t = useTranslations("contracts");
  const locale = useLocale();
  const { token, perfil } = useAuth();
  const authFetch = useAuthFetch();
  const router = useRouter();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  async function handleAbrirChat() {
    if (!token) return;
    await obtenerOCrearConversacion(id, authFetch);
    router.push("/messages");
  }

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    getContrato(id, authFetch)
      .then(setContrato)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : t("detail.loadError"),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [id, token, authFetch, t]);

  async function handleEstado(estado: "completado" | "cancelado") {
    if (!token) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await updateContratoEstado(id, estado, authFetch);
      setContrato(updated);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : t("detail.updateError"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contrato) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">
          {error ?? t("detail.notFound")}
        </p>
        <Link href="/contracts">
          <Button variant="outline" size="sm">
            {t("detail.backToList")}
          </Button>
        </Link>
      </div>
    );
  }

  const isClient = contrato.is_client === true;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/contracts"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t("detail.back")}
        </Link>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${ESTADO_STYLES[contrato.estado]}`}
        >
          {t(`estado.${contrato.estado}`)}
        </span>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t("detail.precioAcordado")}</p>
          <p className="text-3xl font-bold text-foreground">
            ${contrato.precio}
          </p>
        </div>

        {contrato.publicacion_titulo && (
          <div>
            <p className="text-xs text-muted-foreground">{t("detail.servicio")}</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.publicacion_titulo}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t("detail.cliente")}</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.cliente.nombre_completo}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("detail.freelancer")}</p>
            <p className="text-sm font-medium text-foreground">
              {contrato.freelancer.nombre_completo}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("detail.fechaInicio")}</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(contrato.fecha_inicio).toLocaleDateString(locale)}
            </p>
          </div>
          {contrato.fecha_fin && (
            <div>
              <p className="text-xs text-muted-foreground">{t("detail.fechaFin")}</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(contrato.fecha_fin).toLocaleDateString(locale)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      <Button variant="outline" className="w-full" onClick={handleAbrirChat}>
        <RiMessage3Line className="size-4" />
        {t("detail.abrirChat")}
      </Button>

      {/* Actions — visible only to the client */}
      {contrato.estado === "activo" && isClient && (
        <div className="space-y-3">
          {actionError && (
            <p className="text-sm text-destructive">{actionError}</p>
          )}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => handleEstado("completado")}
              disabled={actionLoading}
            >
              {t("detail.markCompleted")}
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => handleEstado("cancelado")}
              disabled={actionLoading}
            >
              {t("detail.cancel")}
            </Button>
          </div>
        </div>
      )}

      {contrato.estado === "completado" && !contrato.ya_calificado && (
        <Button className="w-full" onClick={() => setReviewOpen(true)}>
          <RiStarLine className="size-4" />
          {t("detail.calificar")}
        </Button>
      )}

      <ReviewModal
        open={reviewOpen}
        contractId={contrato.id}
        reviewedName={
          perfil?.email === contrato.cliente.email
            ? contrato.freelancer.nombre_completo
            : contrato.cliente.nombre_completo
        }
        onClose={() => setReviewOpen(false)}
        onSubmitted={() => {
          setContrato({ ...contrato, ya_calificado: true });
          setReviewOpen(false);
        }}
      />
    </div>
  );
}
