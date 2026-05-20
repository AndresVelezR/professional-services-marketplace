"use client";

import {
  RiAddLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import { usePublicacion } from "./hooks/usePublicacion";
import { updatePublicacion } from "./services/publicacionService";

const CATEGORIA_VALUES = [
  "diseno",
  "desarrollo",
  "marketing",
  "redaccion",
  "video",
  "otro",
] as const;

interface EditServiceProps {
  id: string;
}

export function EditService({ id }: EditServiceProps) {
  const t = useTranslations("services.form");
  const tEdit = useTranslations("services.edit");
  const authFetch = useAuthFetch();
  const router = useRouter();

  const { data, isLoading, error: loadError } = usePublicacion(id);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [tiempoEntrega, setTiempoEntrega] = useState("");
  const [incluye, setIncluye] = useState<string[]>([]);
  const [nuevoIncluye, setNuevoIncluye] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setTitulo(data.titulo);
    setDescripcion(data.descripcion);
    setCategoria(data.categoria);
    setPrecio(String(data.precio));
    setTiempoEntrega(data.tiempo_entrega);
    setIncluye(data.incluye ?? []);
  }, [data]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updatePublicacion(
        id,
        {
          titulo,
          descripcion,
          categoria,
          precio: parseFloat(precio),
          tiempo_entrega: tiempoEntrega,
          incluye,
        },
        authFetch,
      );
      router.push(`/services/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : tEdit("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">
          {loadError ?? tEdit("notFound")}
        </p>
        <Link href="/services/my">
          <Button variant="outline" size="sm">
            {tEdit("back")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!data.is_owner) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{tEdit("forbidden")}</p>
        <Link href="/services/my">
          <Button variant="outline" size="sm">
            {tEdit("back")}
          </Button>
        </Link>
      </div>
    );
  }

  const isValid = titulo && descripcion && categoria && precio && tiempoEntrega;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/services/my" className="text-sm text-muted-foreground hover:text-foreground">
          ← {tEdit("back")}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{tEdit("title")}</h1>
        <p className="text-sm text-muted-foreground">{tEdit("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-white p-6">
        {submitError && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <RiAlertLine className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="titulo" className="text-sm font-medium">
            {t("titulo")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="titulo"
            placeholder={t("tituloPlaceholder")}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion" className="text-sm font-medium">
            {t("descripcion")} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="descripcion"
            placeholder={t("descripcionPlaceholder")}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="min-h-36 resize-y"
          />
        </div>

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
                  className="group/item flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5"
                >
                  <RiCheckLine className="size-3.5 shrink-0 text-green-500" />
                  <span className="flex-1 text-sm text-foreground">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeIncluye(i)}
                    className="rounded-md p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <RiCloseLine className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {tEdit("imagesNote")}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Link href="/services/my">
            <Button type="button" variant="ghost">
              {tEdit("cancel")}
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <RiLoader4Line className="size-4 animate-spin" />
                {tEdit("saving")}
              </>
            ) : (
              tEdit("save")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
