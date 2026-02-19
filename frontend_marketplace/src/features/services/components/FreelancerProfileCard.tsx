import { RiChat1Line, RiStarFill } from "@remixicon/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FreelancerProfileCardProps {
  name: string
  initials: string
  title: string
  rating: number
  reviews: number
  isOnline?: boolean
  isTopRated?: boolean
  completedJobs: number
  responseRate: string
  responseTime: string
}

export function FreelancerProfileCard({
  name,
  initials,
  title,
  rating,
  reviews,
  isOnline = false,
  isTopRated = false,
  completedJobs,
  responseRate,
  responseTime,
}: FreelancerProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{name}</h3>
              {isTopRated && (
                <Badge variant="secondary" className="text-xs">
                  Top Rated
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="mt-1 flex items-center gap-1">
              <RiStarFill className="size-3.5 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({reviews} reseñas)
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{completedJobs}</p>
            <p className="text-xs text-muted-foreground">Trabajos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{responseRate}</p>
            <p className="text-xs text-muted-foreground">Respuesta</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{responseTime}</p>
            <p className="text-xs text-muted-foreground">Tiempo resp.</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action */}
        <Button variant="outline" className="w-full">
          <RiChat1Line className="size-4" />
          Enviar Mensaje
        </Button>
      </CardContent>
    </Card>
  )
}
