"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { PerfilCompleto } from "../models";
import { PhotoUpload } from "./PhotoUpload";

interface ProfileHeaderProps {
  perfil: PerfilCompleto;
  onPhotoSelect: (file: File) => void;
}

export function ProfileHeader({ perfil, onPhotoSelect }: ProfileHeaderProps) {
  const t = useTranslations("profile.header");
  const initials =
    (perfil.first_name?.[0] ?? "") + (perfil.last_name?.[0] ?? "");

  const tipo = perfil.tipo_usuario;
  const tipoLabel =
    tipo === "freelancer" || tipo === "cliente" || tipo === "ambos"
      ? t(`tipo.${tipo}`)
      : tipo;

  return (
    <div className="flex items-center gap-6">
      <PhotoUpload
        currentUrl={perfil.foto_perfil_url}
        initials={initials.toUpperCase()}
        onSelect={onPhotoSelect}
      />
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-foreground">
          {perfil.nombre_completo || t("noName")}
        </h1>
        <p className="text-sm text-muted-foreground">{perfil.email}</p>
        <Badge variant="secondary" className="mt-2">
          {tipoLabel}
        </Badge>
      </div>
    </div>
  );
}
