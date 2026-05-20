import { RiExternalLinkLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PartnerService } from "../models";

type PartnerServiceCardProps = {
  service: PartnerService;
  labels: {
    source: string;
    price: string;
    open: string;
  };
};

export function PartnerServiceCard({
  service,
  labels,
}: PartnerServiceCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="space-y-2">
          <h2 className="line-clamp-2 text-base font-semibold text-foreground">
            {service.title}
          </h2>
          {service.description && (
            <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <dl className="grid gap-2 text-sm">
            {service.priceLabel && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{labels.price}</dt>
                <dd className="font-medium text-foreground">
                  {service.priceLabel}
                </dd>
              </div>
            )}
            {service.sourceName && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{labels.source}</dt>
                <dd className="font-medium text-foreground">
                  {service.sourceName}
                </dd>
              </div>
            )}
          </dl>

          {service.externalUrl && (
            <Button asChild variant="outline" size="sm" className="w-full">
              <a
                href={service.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {labels.open}
                <RiExternalLinkLine className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
