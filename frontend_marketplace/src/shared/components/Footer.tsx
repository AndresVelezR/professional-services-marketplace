"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-border px-8 py-6 text-xs text-muted-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="max-w-sm space-y-1.5">
          <p className="font-semibold text-foreground">{t("name")}</p>
          <p className="font-medium">{t("aboutTitle")}</p>
          <p className="leading-relaxed">{t("aboutText")}</p>
          <p className="italic">{t("tagline")}</p>
        </div>
        <div className="shrink-0 space-y-1.5">
          <p className="font-medium">{t("navTitle")}</p>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              {tNav("dashboard")}
            </Link>
            <Link
              href="/services"
              className="transition-colors hover:text-foreground"
            >
              {tNav("search")}
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground"
            >
              {tNav("profile")}
            </Link>
          </nav>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground/60">{t("credits")}</p>
    </footer>
  );
}
