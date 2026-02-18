import { RiCheckLine } from "@remixicon/react"

import { Separator } from "@/components/ui/separator"

interface ProcessStep {
  title: string
  description: string
}

interface ServiceDescriptionProps {
  about: string[]
  process: ProcessStep[]
  experience: string
}

export function ServiceDescription({
  about,
  process,
  experience,
}: ServiceDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* About */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Acerca de este servicio
        </h3>
        <div className="space-y-3">
          {about.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <Separator />

      {/* Process */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Mi proceso
        </h3>
        <div className="space-y-4">
          {process.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <RiCheckLine className="size-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Experience */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Mi experiencia
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {experience}
        </p>
      </div>
    </div>
  )
}
