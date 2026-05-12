import { RiLoader4Line } from "@remixicon/react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { PartnerServicesList } from "./components/PartnerServicesList";
import { getPartnerServices } from "./services/partnerService";

function PartnerServicesState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function PartnerServicesLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card">
      <RiLoader4Line className="size-7 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

async function PartnerServicesContent() {
  const t = await getTranslations("partners");
  const result = await getPartnerServices();

  if (result.status === "missing-config") {
    return (
      <PartnerServicesState
        title={t("missingConfigTitle")}
        description={t("missingConfigDescription")}
      />
    );
  }

  if (result.status === "error") {
    return (
      <PartnerServicesState
        title={t("errorTitle")}
        description={t("errorDescription", { message: result.message })}
      />
    );
  }

  if (result.status === "empty") {
    return (
      <PartnerServicesState
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <PartnerServicesList
      services={result.services}
      labels={{
        source: t("card.source"),
        price: t("card.price"),
        open: t("card.open"),
      }}
    />
  );
}

export async function PartnerServicesPage() {
  const t = await getTranslations("partners");

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-normal text-foreground">
              {t("title")}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </header>

        <Suspense fallback={<PartnerServicesLoading label={t("loading")} />}>
          <PartnerServicesContent />
        </Suspense>
      </div>
    </main>
  );
}
