"use client";

import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiExternalLinkLine,
  RiLoader4Line,
  RiStackLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewCard } from "@/features/services/components/ReviewCard";
import { ReviewsSummary } from "@/features/services/components/ReviewsSummary";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { useCalificaciones } from "@/features/services/hooks/useCalificaciones";
import { Link } from "@/i18n/navigation";

import { usePerfilPublico } from "./hooks/usePerfilPublico";

interface PublicProfileProps {
  userId: string;
}

function serviceImageFallback(id: string): string {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(id)}&backgroundColor=f1f5f9`;
}

export function PublicProfile({ userId }: PublicProfileProps) {
  const t = useTranslations("profile.public");
  const tExp = useTranslations("profile.experience");
  const tReviews = useTranslations("services.reviews");
  const { data, isLoading, error } = usePerfilPublico(userId);
  const { data: calificaciones } = useCalificaciones(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{t("loadError", { error })}</p>
        <Link href="/services">
          <Button variant="outline" size="sm">
            {t("backToServices")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">{t("notFound")}</p>
        <Link href="/services">
          <Button variant="outline" size="sm">
            {t("backToServices")}
          </Button>
        </Link>
      </div>
    );
  }

  const initials = data.nombre_completo
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tipoLabel =
    data.tipo_usuario === "freelancer" ||
    data.tipo_usuario === "cliente" ||
    data.tipo_usuario === "ambos"
      ? t(`tipo.${data.tipo_usuario}`)
      : data.tipo_usuario;

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <Link href="/services">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RiArrowLeftLine className="size-4" />
          {t("backToServices")}
        </Button>
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="size-16">
              {data.foto_perfil_url && (
                <AvatarImage
                  src={data.foto_perfil_url}
                  alt={data.nombre_completo}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-foreground">
                {data.nombre_completo}
              </h1>
              <Badge variant="secondary" className="mt-1.5">
                {tipoLabel}
              </Badge>
              {data.bio ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {data.bio}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground/60 italic">
                  {t("noBio")}
                </p>
              )}
            </div>
          </div>

          {data.url_portafolio && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("portfolio")}
              </p>
              <a
                href={data.url_portafolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {data.url_portafolio}
                <RiExternalLinkLine className="size-3.5" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <RiStackLine className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">{t("skills")}</h2>
        </div>
        {data.habilidades.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.habilidades.map((h) => (
              <Badge key={h.id} variant="secondary">
                {h.nombre}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noSkills")}</p>
        )}
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <RiBriefcaseLine className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            {t("experience")}
          </h2>
        </div>
        {data.experiencias.length > 0 ? (
          <div className="space-y-3">
            {data.experiencias.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="p-4">
                  <p className="font-semibold text-foreground">{exp.cargo}</p>
                  <p className="text-sm text-muted-foreground">{exp.empresa}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {exp.fecha_inicio} —{" "}
                    {exp.fecha_fin ? exp.fecha_fin : tExp("present")}
                    {exp.ubicacion ? ` · ${exp.ubicacion}` : ""}
                  </p>
                  {exp.descripcion && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {exp.descripcion}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noExperience")}</p>
        )}
      </section>

      {/* Active services */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          {t("activeServices")}
        </h2>
        {data.publicaciones.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.publicaciones.map((pub) => (
              <ServiceCard
                key={pub.id}
                id={pub.id}
                title={pub.titulo}
                category={pub.categoria}
                price={parseFloat(pub.precio)}
                rating={0}
                reviews={0}
                freelancer={{
                  name: data.nombre_completo,
                  initials,
                }}
                imageUrl={
                  pub.imagenes?.[0]?.url || serviceImageFallback(pub.id)
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noServices")}</p>
        )}
      </section>

      {/* Reviews */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-foreground">{t("reviews")}</h2>
        {calificaciones && calificaciones.total > 0 ? (
          <>
            <ReviewsSummary
              averageRating={calificaciones.promedios.general}
              totalReviews={calificaciones.total}
              breakdown={[5, 4, 3, 2, 1].map((stars) => {
                const count = calificaciones.calificaciones.filter(
                  (c) => Math.round(c.promedio) === stars,
                ).length;
                return {
                  stars,
                  percentage:
                    calificaciones.total > 0
                      ? Math.round((count / calificaciones.total) * 100)
                      : 0,
                };
              })}
            />
            <div className="space-y-4">
              {calificaciones.calificaciones.map((c) => (
                <ReviewCard
                  key={c.id}
                  name={c.calificador_nombre}
                  initials={c.calificador_nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                  date={new Date(c.created_at).toLocaleDateString()}
                  rating={Math.round(c.promedio)}
                  comment={c.comentario || tReviews("noComment")}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{tReviews("empty")}</p>
        )}
      </section>
    </div>
  );
}
