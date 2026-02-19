import { RiHeartLine, RiStarFill } from "@remixicon/react"
import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface ServiceCardProps {
  title: string
  category: string
  price: number
  rating: number
  reviews: number
  freelancer: {
    name: string
    initials: string
  }
  imageUrl?: string
}

export function ServiceCard({
  title,
  category,
  price,
  rating,
  reviews,
  freelancer,
  imageUrl,
}: ServiceCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/30">
            <span className="text-4xl font-bold">{category[0]}</span>
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 bg-white/90 text-primary shadow-sm backdrop-blur"
        >
          {category}
        </Badge>
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-3 top-3 bg-white/90 text-muted-foreground shadow-sm backdrop-blur hover:text-destructive"
        >
          <RiHeartLine className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
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
            Desde
          </p>
          <p className="text-lg font-bold leading-none text-foreground">
            ${price}
          </p>
        </div>
        <Button asChild size="sm" className="text-xs font-bold">
          <Link href="/services/1">Ver más</Link>
        </Button>
      </div>
    </div>
  )
}
