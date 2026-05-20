"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarImageFallback } from "@/features/services/adapters";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string | null;
  seed?: string;
  initials?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
}

export function ProfileAvatar({
  src,
  seed,
  initials,
  alt,
  className,
  fallbackClassName,
  imageClassName,
}: ProfileAvatarProps) {
  const effectiveSrc = src || (seed ? avatarImageFallback(seed) : null);
  const fallback = initials?.trim() || "?";

  return (
    <Avatar className={className}>
      {effectiveSrc ? (
        <AvatarImage src={effectiveSrc} alt={alt} className={imageClassName} />
      ) : null}
      <AvatarFallback className={cn("font-semibold", fallbackClassName)}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
