"use client";

import { RiStarFill } from "@remixicon/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

interface FreelancerProfileCardProps {
  name: string;
  initials: string;
  title: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  creatorId?: string;
}

export function FreelancerProfileCard({
  name,
  initials,
  title,
  bio,
  rating,
  reviews,
  creatorId,
}: FreelancerProfileCardProps) {
  const avatar = (
    <Avatar className="size-14">
      <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  const nameEl = creatorId ? (
    <Link
      href={`/profiles/${creatorId}`}
      className="font-semibold text-foreground hover:text-primary hover:underline"
    >
      {name}
    </Link>
  ) : (
    <span className="font-semibold text-foreground">{name}</span>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {creatorId ? (
            <Link href={`/profiles/${creatorId}`} tabIndex={-1} aria-hidden>
              {avatar}
            </Link>
          ) : (
            avatar
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {nameEl}
              <Badge variant="secondary" className="text-xs">
                {title}
              </Badge>
            </div>
            {typeof rating === "number" && rating > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <RiStarFill className="size-3.5 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {rating.toFixed(1)}
                </span>
                {typeof reviews === "number" && reviews > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({reviews})
                  </span>
                )}
              </div>
            )}
            {bio && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
