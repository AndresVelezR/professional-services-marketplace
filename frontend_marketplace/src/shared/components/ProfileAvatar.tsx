"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string | null;
  initials?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
}

export function ProfileAvatar({
  src,
  initials,
  alt,
  className,
  fallbackClassName,
  imageClassName,
}: ProfileAvatarProps) {
  const fallback = initials?.trim() || "?";

  return (
    <Avatar className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt} className={imageClassName} />
      ) : null}
      <AvatarFallback className={cn("font-semibold", fallbackClassName)}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
