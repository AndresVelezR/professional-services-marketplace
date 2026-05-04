"use client";

import { useTranslations } from "next-intl";

export function ContractHeader() {
  const t = useTranslations("contracts");
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        {t("postJob")}
      </button>
    </div>
  );
}
