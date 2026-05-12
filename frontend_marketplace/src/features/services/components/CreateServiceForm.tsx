"use client";

import {
  RiAddLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiFlashlightLine,
  RiImageAddLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "@remixicon/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import type { CreatePublicacionPayload } from "../models";
import {
  type AssistantSummaryResult,
  summarizeService,
} from "../services/assistantService";

const CATEGORIA_VALUES = [
  "diseno",
  "desarrollo",
  "marketing",
  "redaccion",
  "video",
  "otro",
] as const;

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 3000;

interface CreateServiceFormProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: CreatePublicacionPayload) => void;
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {step}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function CreateServiceForm({
  isSubmitting,
  error,
  onSubmit,
}: CreateServiceFormProps) {
  const t = useTranslations("services.form");
  const authFetch = useAuthFetch();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [tiempoEntrega, setTiempoEntrega] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [incluye, setIncluye] = useState<string[]>([]);
  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [assistantResult, setAssistantResult] =
    useState<AssistantSummaryResult | null>(null);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const summarizeRequestRef = useRef(0);

  const isValid = titulo && descripcion && categoria && precio && tiempoEntrega;
  const trimmedTitle = titulo.trim();
  const trimmedDescription = descripcion.trim();
  const assistantLimitMessage =
    !trimmedTitle || !trimmedDescription
      ? t("assistant.emptyHint")
      : trimmedTitle.length > TITLE_MAX_LENGTH
        ? t("assistant.titleTooLong")
        : trimmedDescription.length > DESCRIPTION_MAX_LENGTH
          ? t("assistant.descriptionTooLong")
          : null;
  const isAssistantDisabled = isSummarizing || Boolean(assistantLimitMessage);

  function addIncluye() {
    const trimmed = nuevoIncluye.trim();
    if (trimmed && !incluye.includes(trimmed)) {
      setIncluye([...incluye, trimmed]);
      setNuevoIncluye("");
    }
  }

  function removeIncluye(index: number) {
    setIncluye(incluye.filter((_, i) => i !== index));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = 3 - imagenes.length;
    setImagenes((prev) => [...prev, ...files.slice(0, remaining)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImagen(index: number) {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      titulo,
      descripcion,
      categoria,
      precio: parseFloat(precio),
      tiempo_entrega: tiempoEntrega,
      incluye,
      imagenes: imagenes.length > 0 ? imagenes : undefined,
      estado: "publicado",
    });
  }

  function resetAssistantState() {
    setAssistantResult(null);
    setAssistantError(null);
  }

  async function handleSummarize() {
    if (assistantLimitMessage) return;

    const requestId = summarizeRequestRef.current + 1;
    summarizeRequestRef.current = requestId;
    setIsSummarizing(true);
    setAssistantError(null);
    setAssistantResult(null);
    try {
      const result = await summarizeService(authFetch, {
        title: trimmedTitle,
        description: trimmedDescription,
      });
      if (summarizeRequestRef.current !== requestId) return;
      setAssistantResult(result);
    } catch (err) {
      if (summarizeRequestRef.current !== requestId) return;
      setAssistantError(
        err instanceof Error ? err.message : t("assistant.error"),
      );
    } finally {
      if (summarizeRequestRef.current === requestId) {
        setIsSummarizing(false);
      }
    }
  }

  function providerLabel(provider: string) {
    const normalized = provider.toLowerCase();
    if (normalized === "gemini") return t("assistant.providerGemini");
    if (normalized === "local") return t("assistant.providerLocal");
    return t("assistant.providerOther", { provider });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <RiAlertLine className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-destructive">
              {t("errorTitle")}
            </p>
            <p className="mt-0.5 text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Section 1: Información básica */}
      <section className="space-y-5">
        <SectionHeader
          step={1}
          title={t("section1Title")}
          description={t("section1Description")}
        />

        <div className="space-y-4 pl-10">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-medium">
              {t("titulo")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder={t("tituloPlaceholder")}
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                resetAssistantState();
              }}
              required
              className="h-11"
            />
            <p className="text-[11px] text-muted-foreground">
              {t("tituloHint")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium">
              {t("descripcion")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder={t("descripcionPlaceholder")}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                resetAssistantState();
              }}
              required
              className="min-h-36 resize-y"
            />
            <p className="text-[11px] text-muted-foreground">
              {t("descripcionHint")}
            </p>

            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {t("assistant.title")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("assistant.description")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSummarize}
                  disabled={isAssistantDisabled}
                  className="h-9 shrink-0 gap-1.5 text-xs font-semibold"
                >
                  {isSummarizing ? (
                    <>
                      <RiLoader4Line className="size-4 animate-spin" />
                      {t("assistant.loading")}
                    </>
                  ) : (
                    <>
                      <RiFlashlightLine className="size-4" />
                      {t("assistant.button")}
                    </>
                  )}
                </Button>
              </div>

              {assistantLimitMessage && (
                <p className="text-xs text-muted-foreground">
                  {assistantLimitMessage}
                </p>
              )}

              {assistantError && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  <RiAlertLine className="mt-0.5 size-3.5 shrink-0" />
                  <span>{assistantError || t("assistant.error")}</span>
                </div>
              )}

              {assistantResult && (
                <div className="space-y-3 rounded-md border border-border bg-background p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {t("assistant.resultTitle")}
                    </p>
                    <Badge variant="secondary">
                      {providerLabel(assistantResult.provider)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {t("assistant.summaryLabel")}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {assistantResult.summary || t("assistant.emptySummary")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {t("assistant.suggestionsLabel")}
                    </p>
                    {assistantResult.suggestions.length > 0 ? (
                      <ul className="space-y-1">
                        {assistantResult.suggestions.map((suggestion) => (
                          <li
                            key={suggestion}
                            className="flex gap-2 text-sm text-foreground"
                          >
                            <RiCheckLine className="mt-0.5 size-3.5 shrink-0 text-green-600" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("assistant.emptySuggestions")}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t("assistant.disclaimer")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Section 2: Categoría y precio */}
      <section className="space-y-5">
        <SectionHeader
          step={2}
          title={t("section2Title")}
          description={t("section2Description")}
        />

        <div className="space-y-4 pl-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("categoria")} <span className="text-destructive">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria} required>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder={t("categoriaPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIA_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`categorias.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio" className="text-sm font-medium">
                {t("precio")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <RiMoneyDollarCircleLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="precio"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="85.00"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  className="h-11 pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:max-w-[calc(50%-0.5rem)]">
            <Label htmlFor="tiempo_entrega" className="text-sm font-medium">
              {t("tiempoEntrega")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <RiTimeLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tiempo_entrega"
                placeholder={t("tiempoEntregaPlaceholder")}
                value={tiempoEntrega}
                onChange={(e) => setTiempoEntrega(e.target.value)}
                required
                className="h-11 pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Section 3: Detalles adicionales */}
      <section className="space-y-5">
        <SectionHeader
          step={3}
          title={t("section3Title")}
          description={t("section3Description")}
        />

        <div className="space-y-5 pl-10">
          {/* Imágenes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("imagenes")}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {t("imagenesOpcional")}
              </span>
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {imagenes.map((file, i) => (
                <div
                  key={`${file.name}-${file.lastModified}-${file.size}`}
                  className="group/img relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={t("imagenAlt", { index: i + 1 })}
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/img:opacity-100"
                  >
                    <RiCloseLine className="size-3.5" />
                  </button>
                </div>
              ))}

              {imagenes.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <RiImageAddLine className="size-6" />
                  <span className="text-[11px] font-medium">
                    {t("imagenesAgregar")}
                  </span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />

            <p className="text-[11px] text-muted-foreground">
              {t("imagenesHint")}
            </p>
          </div>

          {/* Incluye */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("incluye")}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {t("incluyeOpcional")}
              </span>
            </Label>

            <div className="flex gap-2">
              <Input
                placeholder={t("incluyePlaceholder")}
                value={nuevoIncluye}
                onChange={(e) => setNuevoIncluye(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIncluye();
                  }
                }}
                className="h-11"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addIncluye}
                className="h-11 shrink-0 gap-1.5 px-4 text-xs font-semibold"
              >
                <RiAddLine className="size-4" />
                {t("incluyeAgregar")}
              </Button>
            </div>

            {incluye.length > 0 && (
              <ul className="space-y-2">
                {incluye.map((item, i) => (
                  <li
                    key={item}
                    className="group/item flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <RiCheckLine className="size-3.5 shrink-0 text-green-500" />
                    <span className="flex-1 text-sm text-foreground">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeIncluye(i)}
                      className="rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover/item:opacity-100"
                    >
                      <RiCloseLine className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {incluye.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                {t("incluyeHint")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{t("submitNote")}</p>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-11 min-w-[200px] bg-action text-action-foreground hover:bg-action/90 font-bold shadow-md transition-all disabled:opacity-40"
        >
          {isSubmitting ? (
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
  );
}
