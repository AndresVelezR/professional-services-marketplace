interface ServiceDescriptionProps {
  description: string
  includes: string[]
}

export function ServiceDescription({
  description,
  includes,
}: ServiceDescriptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Acerca de este servicio
        </h3>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {includes.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-foreground">
            ¿Qué incluye?
          </h3>
          <ul className="space-y-2">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
