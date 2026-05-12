"use client";

import { useTranslations } from "next-intl";

import { useAuth } from "@/infrastructure/auth/AuthContext";

export function TopBar() {
  const t = useTranslations("nav");
  const { perfil } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-3">
      <h1 className="text-lg font-bold text-foreground">
        {t("greeting", { name: perfil?.first_name ?? "" })}
      </h1>
    </header>
  );
}
