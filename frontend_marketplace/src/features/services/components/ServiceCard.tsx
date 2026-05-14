"use client";

import { RiStarFill } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  freelancer: {
    name: string;
    initials: string;
    id?: string;
  };
  imageUrl?: string;
}

export function ServiceCard({
  id,
  title,
  category,
  price,
  rating,
  reviews,
  freelancer,
  imageUrl,
}: ServiceCardProps) {
  const t = useTranslations("services.card");
  const tCat = useTranslations("services.form.categorias");
  const [imgError, setImgError] = useState(false);

  const freelancerLabel = (
    <div className="mb-3 flex items-center gap-2">
      <Avatar className="size-6">
        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
          {freelancer.initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-muted-foreground">
        {freelancer.name}
      </span>
    </div>
  );

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
            <span className="text-4xl font-bold">{category[0]?.toUpperCase()}</span>
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 bg-white/90 text-primary shadow-sm backdrop-blur"
        >
          {tCat(category)}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {freelancer.id ? (
          <Link
            href={`/profiles/${freelancer.id}`}
            className="mb-3 flex w-fit items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                {freelancer.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline">
              {freelancer.name}
            </span>
          </Link>
        ) : (
          freelancerLabel
        )}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <div className="mt-auto flex items-center gap-1">
          <RiStarFill className="size-3.5 text-yellow-400" />
          <span className="text-xs font-bold text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
            {t("from")}
          </p>
          <p className="text-lg font-bold leading-none text-foreground">
            ${price}
          </p>
        </div>
        <Button asChild size="sm" className="text-xs font-bold">
          <Link href={`/services/${id}`}>{t("viewMore")}</Link>
        </Button>
      </div>
    </div>
  );
}
