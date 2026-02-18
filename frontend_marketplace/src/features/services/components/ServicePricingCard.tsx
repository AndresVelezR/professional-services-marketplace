import {
  RiCheckLine,
  RiHeartLine,
  RiShieldCheckLine,
  RiStarFill,
  RiTimeLine,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ServicePricingCardProps {
  title: string
  author: string
  rating: number
  reviews: number
  price: number
  includes: string[]
  deliveryTime: string
}

export function ServicePricingCard({
  title,
  author,
  rating,
  reviews,
  price,
  includes,
  deliveryTime,
}: ServicePricingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">por {author}</p>
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

        <Separator className="my-4" />

        {/* Price */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-foreground">${price}</p>
        </div>

        {/* Includes */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-foreground">
            ¿Qué incluye?
          </p>
          <ul className="space-y-2">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <RiCheckLine className="mt-0.5 size-4 shrink-0 text-green-500" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery time */}
        <div className="mb-4 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
          <RiTimeLine className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Entrega en{" "}
            <span className="font-semibold text-foreground">
              {deliveryTime}
            </span>
          </span>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <Button className="w-full font-semibold">Contratar Ahora</Button>
          <Button variant="outline" className="w-full">
            <RiHeartLine className="size-4" />
            Agregar a Favoritos
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Guarantee */}
        <div className="flex items-start gap-2 text-center">
          <RiShieldCheckLine className="mt-0.5 size-4 shrink-0 text-green-500" />
          <p className="text-xs text-muted-foreground">
            Garantía de satisfacción. Si no estás conforme, te devolvemos tu
            dinero.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
