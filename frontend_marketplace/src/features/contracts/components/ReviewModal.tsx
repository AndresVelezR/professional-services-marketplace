"use client";

import { RiLoader4Line, RiStarFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { createReview } from "../services/contractService";

interface ReviewModalProps {
  open: boolean;
  contractId: string;
  reviewedName: string;
  onClose: () => void;
  onSubmitted: () => Promise<void> | void;
}

interface Ratings {
  calidad: number;
  comunicacion: number;
  puntualidad: number;
}

function StarRating({
  label,
  value,
  unselectedLabel,
  onChange,
}: {
  label: string;
  value: number;
  unselectedLabel: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const v = i + 1;
          return (
            <button
              key={v}
              type="button"
              className="rounded-md p-1 transition-colors hover:bg-muted"
              onClick={() => onChange(v)}
              aria-label={`${label} ${v}`}
            >
              <RiStarFill
                className={`size-6 ${
                  v <= value ? "text-yellow-400" : "text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : unselectedLabel}
        </span>
      </div>
    </div>
  );
}

export function ReviewModal({
  open,
  contractId,
  reviewedName,
  onClose,
  onSubmitted,
}: ReviewModalProps) {
  const t = useTranslations("contracts.review");
  const { token } = useAuth();
  const [ratings, setRatings] = useState<Ratings>({
    calidad: 0,
    comunicacion: 0,
    puntualidad: 0,
  });
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criterios: { key: keyof Ratings; label: string }[] = [
    { key: "calidad", label: t("calidad") },
    { key: "comunicacion", label: t("comunicacion") },
    { key: "puntualidad", label: t("puntualidad") },
  ];

  const canSubmit = useMemo(
    () => Object.values(ratings).every((v) => v >= 1),
    [ratings],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !canSubmit) return;

    setIsSaving(true);
    setError(null);

    try {
      await createReview(
        {
          contrato: contractId,
          calidad: ratings.calidad,
          comunicacion: ratings.comunicacion,
          puntualidad: ratings.puntualidad,
          comentario: comment.trim(),
        },
        token,
      );
      await onSubmitted();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    setRatings({ calidad: 0, comunicacion: 0, puntualidad: 0 });
    setComment("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { name: reviewedName })}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {criterios.map(({ key, label }) => (
            <StarRating
              key={key}
              label={label}
              value={ratings[key]}
              unselectedLabel={t("unselected")}
              onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
            />
          ))}

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="review-comment"
            >
              {t("commentLabel")}
            </label>
            <Textarea
              id="review-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isSaving}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!canSubmit || isSaving}
            >
              {isSaving ? (
                <>
                  <RiLoader4Line className="size-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
