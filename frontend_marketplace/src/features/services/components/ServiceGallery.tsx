"use client";

import { RiImageLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface ServiceGalleryProps {
  category: string;
  images?: string[];
  fallbackSrc?: string;
}

export function ServiceGallery({ category, images, fallbackSrc }: ServiceGalleryProps) {
  const t = useTranslations("services.gallery");
  const tCat = useTranslations("services.form.categorias");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIndex(0);
    setFailedSrcs(new Set());
  }, [images]);

  function handleImgError(src: string) {
    setFailedSrcs((prev) => new Set([...prev, src]));
  }

  const hasImages = images && images.length > 0;
  const currentSrc = hasImages ? images[selectedIndex] : undefined;
  const currentFailed = currentSrc ? failedSrcs.has(currentSrc) : false;

  return (
    <div className="space-y-3">
      {/* Hero image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        {hasImages && currentSrc && !currentFailed ? (
          <img
            src={currentSrc}
            alt={t("imageAlt", { category, index: selectedIndex + 1 })}
            className="h-full w-full object-cover"
            onError={() => handleImgError(currentSrc)}
          />
        ) : fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={tCat(category)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-primary/5 text-primary/30">
            <RiImageLine className="size-12" />
            <span className="text-sm font-medium">{tCat(category)}</span>
          </div>
        )}
      </div>

      {/* Thumbnails - only show if multiple images */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`aspect-[4/3] w-20 overflow-hidden rounded-md bg-muted transition-all ${
                selectedIndex === i
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {failedSrcs.has(img) ? (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
                  <RiImageLine className="size-5" />
                </div>
              ) : (
                <img
                  src={img}
                  alt={t("thumbAlt", { index: i + 1 })}
                  className="h-full w-full object-cover"
                  onError={() => handleImgError(img)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
