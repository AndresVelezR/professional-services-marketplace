"use client";

import {
  RiCheckLine,
  RiHeartLine,
  RiShieldCheckLine,
  RiTimeLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ServicePricingCardProps {
  title: string;
  author: string;
  price: number;
  includes: string[];
  deliveryTime: string;
  onContratar?: () => void;
}

export function ServicePricingCard({
  title,
  author,
  price,
  includes,
  deliveryTime,
  onContratar,
}: ServicePricingCardProps) {
  const t = useTranslations("services.pricing");
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{t("by", { author })}</p>
        </div>

        <Separator className="my-4" />

        {/* Price */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-foreground">${price}</p>
        </div>

        {/* Includes */}
        {includes.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-foreground">
              {t("includesTitle")}
            </p>
            <ul className="space-y-2">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <RiCheckLine className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery time */}
        <div className="mb-4 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
          <RiTimeLine className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {t.rich("deliveryIn", {
              deliveryTime,
              b: (chunks) => (
                <span className="font-semibold text-foreground">{chunks}</span>
              ),
            })}
          </span>
        </div>

        {/* CTAs */}
        {onContratar && (
          <div className="space-y-2">
            <Button className="w-full font-semibold" onClick={onContratar}>
              {t("hire")}
            </Button>
            <Button variant="outline" className="w-full">
              <RiHeartLine className="size-4" />
              {t("favorite")}
            </Button>
          </div>
        )}

        <Separator className="my-4" />

        {/* Guarantee */}
        <div className="flex items-start gap-2 text-center">
          <RiShieldCheckLine className="mt-0.5 size-4 shrink-0 text-green-500" />
          <p className="text-xs text-muted-foreground">{t("guarantee")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
