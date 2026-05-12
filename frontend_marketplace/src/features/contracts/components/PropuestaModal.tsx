"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import { createPropuesta } from "../services/contractService";

interface PropuestaModalProps {
  open: boolean;
  onClose: () => void;
  publicacionId: string;
  precioBase: number;
}

export function PropuestaModal({
  open,
  onClose,
  publicacionId,
  precioBase,
}: PropuestaModalProps) {
  const t = useTranslations("contracts.propuestaModal");
  const { token } = useAuth();
  const authFetch = useAuthFetch();
  const [mensaje, setMensaje] = useState("");
  const [precio, setPrecio] = useState(String(precioBase));
  const [fechaLimite, setFechaLimite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await createPropuesta(
        publicacionId,
        {
          mensaje,
          precio_propuesto: Number(precio),
          ...(fechaLimite ? { fecha_limite: fechaLimite } : {}),
        },
        authFetch,
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorDefault"));
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setMensaje("");
    setPrecio(String(precioBase));
    setFechaLimite("");
    setError(null);
    setSuccess(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">{t("success")}</p>
            <Button className="w-full" onClick={handleClose}>
              {t("close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="propuesta-mensaje"
              >
                {t("mensajeLabel")} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="propuesta-mensaje"
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={t("mensajePlaceholder")}
                rows={4}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="propuesta-precio"
              >
                {t("precioLabel")} <span className="text-destructive">*</span>
              </label>
              <input
                id="propuesta-precio"
                required
                type="number"
                min="1"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="propuesta-fecha-limite"
              >
                {t("fechaLimiteLabel")}
              </label>
              <input
                id="propuesta-fecha-limite"
                type="date"
                value={fechaLimite}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
