"use client";

import { RiStarFill } from "@remixicon/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FreelancerProfileCardProps {
  name: string;
  initials: string;
  title: string;
  bio?: string;
  rating?: number;
  reviews?: number;
}

export function FreelancerProfileCard({
  name,
  initials,
  title,
  bio,
  rating,
  reviews,
}: FreelancerProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{name}</h3>
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
