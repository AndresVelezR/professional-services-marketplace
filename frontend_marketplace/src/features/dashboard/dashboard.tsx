"use client";

import { RiEqualizerLine, RiSearchLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ActiveContracts } from "./components/ActiveContracts";
import { PropuestasRecibidas } from "./components/PropuestasRecibidas";
import { RecommendedServices } from "./components/RecommendedServices";

export function Dashboard() {
  const t = useTranslations("dashboard");
  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="max-w-xl flex-1">
          <InputGroup>
            <InputGroupAddon>
              <RiSearchLine className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput placeholder={t("searchPlaceholder")} />
          </InputGroup>
        </div>
        <Button variant="outline">
          <RiEqualizerLine className="size-4" />
          {t("filters")}
        </Button>
      </div>

      <PropuestasRecibidas />
      <ActiveContracts />
      <RecommendedServices />
    </div>
  );
}
