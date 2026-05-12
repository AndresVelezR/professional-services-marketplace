"use client";

import { RiNotification3Line, RiSettings4Line } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/infrastructure/auth/AuthContext";

export function TopBar() {
  const t = useTranslations("nav");
  const { perfil } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-8 py-3">
      <h1 className="text-lg font-bold text-foreground">
        {t("greeting", { name: perfil?.first_name ?? "" })}
      </h1>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <RiNotification3Line className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-blue-600" />
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          {t("settings")}
          <RiSettings4Line className="size-5" />
        </Button>
      </div>
    </header>
  );
}
