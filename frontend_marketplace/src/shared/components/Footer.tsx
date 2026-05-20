"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border px-8 py-4 text-xs text-muted-foreground">
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span>{t("name")}</span>
        <span>{t("credits")}</span>
      </div>
    </footer>
  );
}
