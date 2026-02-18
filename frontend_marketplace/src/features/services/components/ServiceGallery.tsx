import { useState } from "react"

interface ServiceGalleryProps {
  category: string
  images?: string[]
}

export function ServiceGallery({ category, images }: ServiceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const thumbnailCount = 4

  return (
    <div className="space-y-3">
      {/* Hero image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        {images?.[selectedIndex] ? (
          <img
            src={images[selectedIndex]}
            alt={`${category} - imagen ${selectedIndex + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/20">
            <span className="text-7xl font-bold">{category[0]}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: thumbnailCount }).map((_, i) => (
          <button
            key={`thumb-${category}-${i}`}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`aspect-[4/3] overflow-hidden rounded-md bg-muted transition-all ${
              selectedIndex === i
                ? "ring-2 ring-primary ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            {images?.[i] ? (
              <img
                src={images[i]}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/15">
                <span className="text-lg font-bold">{category[0]}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
