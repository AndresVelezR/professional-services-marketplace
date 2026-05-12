"use client";

import { RiChat1Line } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FreelancerProfileCardProps {
  name: string;
  initials: string;
  title: string;
  bio?: string;
}

export function FreelancerProfileCard({
  name,
  initials,
  title,
  bio,
}: FreelancerProfileCardProps) {
  const t = useTranslations("services.freelancer");
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
            {bio && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {bio}
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" className="mt-4 w-full">
          <RiChat1Line className="size-4" />
          {t("sendMessage")}
        </Button>
      </CardContent>
    </Card>
  );
}
